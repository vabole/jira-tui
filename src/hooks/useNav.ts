import { useState, useCallback } from 'react';
import { COLUMNS, type StatusCategory, type JiraTask } from '../api/types.js';
import { logger } from '../utils/logger.js';

interface NavState {
  columnIndex: number;
  taskIndices: Record<StatusCategory, number>;
}

export function useNav(tasksByColumn: Record<StatusCategory, JiraTask[]>) {
  const [state, setState] = useState<NavState>({
    columnIndex: 0,
    taskIndices: {
      'TO DO': 0,
      'IN PROGRESS': 0,
      'BLOCKED': 0,
      'IN REVIEW': 0,
      'DONE': 0,
    },
  });

  const currentColumn = COLUMNS[state.columnIndex];
  const currentTaskIndex = state.taskIndices[currentColumn];
  const currentTask = tasksByColumn[currentColumn]?.[currentTaskIndex] ?? null;

  const moveColumn = useCallback((direction: 'left' | 'right') => {
    setState((prev) => {
      const newIndex = direction === 'left'
        ? Math.max(0, prev.columnIndex - 1)
        : Math.min(COLUMNS.length - 1, prev.columnIndex + 1);

      if (newIndex !== prev.columnIndex) {
        const newColumn = COLUMNS[newIndex];
        logger.nav(`moved ${direction}`, { column: newIndex, columnName: newColumn });
      }

      return { ...prev, columnIndex: newIndex };
    });
  }, []);

  const moveTask = useCallback((direction: 'up' | 'down') => {
    setState((prev) => {
      const column = COLUMNS[prev.columnIndex];
      const tasks = tasksByColumn[column] || [];
      const currentIndex = prev.taskIndices[column];

      const newIndex = direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(Math.max(0, tasks.length - 1), currentIndex + 1);

      if (newIndex !== currentIndex) {
        const task = tasks[newIndex];
        logger.nav(`moved ${direction}`, { task: newIndex, taskKey: task?.key || 'none' });
      }

      return {
        ...prev,
        taskIndices: {
          ...prev.taskIndices,
          [column]: newIndex,
        },
      };
    });
  }, [tasksByColumn]);

  const logState = useCallback(() => {
    logger.state({
      column: state.columnIndex,
      columnName: currentColumn,
      task: currentTaskIndex,
      taskKey: currentTask?.key || 'none',
    });
  }, [state.columnIndex, currentColumn, currentTaskIndex, currentTask]);

  return {
    columnIndex: state.columnIndex,
    taskIndices: state.taskIndices,
    currentColumn,
    currentTaskIndex,
    currentTask,
    moveColumn,
    moveTask,
    logState,
  };
}
