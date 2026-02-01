import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, useApp, useInput } from 'ink';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Board } from './components/Board.js';
import { TaskDetail } from './components/TaskDetail.js';
import { Help } from './components/Help.js';
import { Loading, ErrorDisplay } from './components/Loading.js';
import { COLUMNS, STATUS_SHORT_KEYS, type StatusCategory, type JiraTask } from './api/types.js';
import { fetchBoardIssues, fetchMyIssues, findTransitionToStatus, transitionIssue } from './api/client.js';
import { loadConfig } from './utils/config.js';
import { logger } from './utils/logger.js';

type Screen = 'board' | 'detail' | 'help';
type View = 'my-tasks' | 'everyone';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function App() {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>('board');
  const [view, setView] = useState<View>('my-tasks');
  const [tasks, setTasks] = useState<JiraTask[]>([]);
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const config = loadConfig();

  // Navigation state
  const [columnIndex, setColumnIndex] = useState(0);
  const [taskIndices, setTaskIndices] = useState<Record<StatusCategory, number>>({
    'TO DO': 0,
    'IN PROGRESS': 0,
    'BLOCKED': 0,
    'IN REVIEW': 0,
    'DONE': 0,
  });

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const grouped: Record<StatusCategory, JiraTask[]> = {
      'TO DO': [],
      'IN PROGRESS': [],
      'BLOCKED': [],
      'IN REVIEW': [],
      'DONE': [],
    };
    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }
    return grouped;
  }, [tasks]);

  const currentColumn = COLUMNS[columnIndex];
  const currentTaskIndex = taskIndices[currentColumn];
  const currentTask = tasksByColumn[currentColumn]?.[currentTaskIndex] ?? null;

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading('loading');
    setError(null);
    logger.action(`fetching ${view} issues`);

    try {
      const issues = view === 'my-tasks'
        ? await fetchMyIssues(config.projectKey)
        : await fetchBoardIssues(config.boardId, config.projectKey);

      setTasks(issues);
      setLoading('success');
      logger.info(`loaded ${issues.length} issues`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setLoading('error');
      logger.error(`fetch failed: ${message}`);
    }
  }, [view, config.boardId, config.projectKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle status transitions
  const handleStatusChange = useCallback(async (targetStatus: StatusCategory) => {
    if (!currentTask || transitioning) return;
    if (currentTask.status === targetStatus) return;

    logger.action(`transitioning ${currentTask.key} to ${targetStatus}`);
    setTransitioning(true);

    try {
      const transitionId = await findTransitionToStatus(currentTask.key, targetStatus);
      if (transitionId) {
        await transitionIssue(currentTask.key, transitionId);

        // Optimistic UI update
        setTasks((prev) =>
          prev.map((task) =>
            task.key === currentTask.key
              ? { ...task, status: targetStatus }
              : task
          )
        );
        logger.info(`${currentTask.key} moved to ${targetStatus}`);
      } else {
        logger.error(`no valid transition to ${targetStatus}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transition failed';
      logger.error(message);
    } finally {
      setTransitioning(false);
    }
  }, [currentTask, transitioning]);

  useInput((input, key) => {
    if (input === 'q') {
      logger.action('quitting app');
      exit();
      return;
    }

    // Help toggle
    if (input === '?') {
      if (screen === 'help') {
        setScreen('board');
      } else {
        setScreen('help');
      }
      return;
    }

    // Escape closes help/detail
    if (key.escape) {
      if (screen !== 'board') {
        logger.action(`closing ${screen} view`);
        setScreen('board');
      }
      return;
    }

    if (screen === 'board') {
      // Arrow key navigation
      if (key.leftArrow) {
        const newIndex = Math.max(0, columnIndex - 1);
        if (newIndex !== columnIndex) {
          setColumnIndex(newIndex);
          logger.nav('moved left', { column: newIndex, columnName: COLUMNS[newIndex] });
        }
      } else if (key.rightArrow) {
        const newIndex = Math.min(COLUMNS.length - 1, columnIndex + 1);
        if (newIndex !== columnIndex) {
          setColumnIndex(newIndex);
          logger.nav('moved right', { column: newIndex, columnName: COLUMNS[newIndex] });
        }
      } else if (key.upArrow) {
        const tasksInColumn = tasksByColumn[currentColumn];
        const newIndex = Math.max(0, currentTaskIndex - 1);
        if (newIndex !== currentTaskIndex && tasksInColumn.length > 0) {
          setTaskIndices((prev) => ({ ...prev, [currentColumn]: newIndex }));
          logger.nav('moved up', { task: newIndex, taskKey: tasksInColumn[newIndex]?.key || 'none' });
        }
      } else if (key.downArrow) {
        const tasksInColumn = tasksByColumn[currentColumn];
        const maxIndex = Math.max(0, tasksInColumn.length - 1);
        const newIndex = Math.min(maxIndex, currentTaskIndex + 1);
        if (newIndex !== currentTaskIndex) {
          setTaskIndices((prev) => ({ ...prev, [currentColumn]: newIndex }));
          logger.nav('moved down', { task: newIndex, taskKey: tasksInColumn[newIndex]?.key || 'none' });
        }
      } else if (key.return && currentTask) {
        logger.action(`opening task ${currentTask.key}`);
        setScreen('detail');
      }

      // View switching
      if (input === '1' && view !== 'my-tasks') {
        setView('my-tasks');
        logger.nav('switched view', { view: 'my-tasks' });
      } else if (input === '2' && view !== 'everyone') {
        setView('everyone');
        logger.nav('switched view', { view: 'everyone' });
      }

      // Refresh
      if (input === 'r') {
        fetchData();
      }

      // Status transitions (t/i/b/v/d)
      const targetStatus = STATUS_SHORT_KEYS[input];
      if (targetStatus && currentTask && !transitioning) {
        handleStatusChange(targetStatus);
      }
    } else if (screen === 'detail') {
      // Status transitions work in detail view too
      const targetStatus = STATUS_SHORT_KEYS[input];
      if (targetStatus && currentTask && !transitioning) {
        handleStatusChange(targetStatus);
      }
    }
  });

  // Log initial state
  useEffect(() => {
    logger.state({ screen, view, column: columnIndex, task: currentTaskIndex });
    logger.info('app started');
  }, []);

  // Render content based on loading state
  const renderContent = () => {
    if (screen === 'help') {
      return <Help />;
    }

    if (loading === 'loading') {
      return <Loading message="Fetching Jira issues..." />;
    }

    if (transitioning) {
      return <Loading message={`Moving ${currentTask?.key}...`} />;
    }

    if (loading === 'error' && error) {
      return <ErrorDisplay message={error} />;
    }

    if (screen === 'detail' && currentTask) {
      return <TaskDetail task={currentTask} />;
    }

    return <Board tasks={tasks} columnIndex={columnIndex} taskIndices={taskIndices} />;
  };

  return (
    <Box flexDirection="column" width="100%">
      <Header title="Jira TUI" view={view} />
      {renderContent()}
      <Footer />
    </Box>
  );
}
