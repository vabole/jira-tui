import { useState, useEffect, useCallback } from 'react';
import type { JiraTask } from '../api/types.js';
import { fetchBoardIssues, fetchMyIssues } from '../api/client.js';
import { loadConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface UseJiraResult {
  tasks: JiraTask[];
  loading: LoadingState;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useJira(view: 'my-tasks' | 'everyone'): UseJiraResult {
  const [tasks, setTasks] = useState<JiraTask[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const config = loadConfig();

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

  return {
    tasks,
    loading,
    error,
    refresh: fetchData,
  };
}
