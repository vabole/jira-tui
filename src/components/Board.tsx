import React from 'react';
import { Box } from 'ink';
import { Column } from './Column.js';
import { COLUMNS, type JiraTask, type StatusCategory } from '../api/types.js';

/** Props for the Board component */
interface BoardProps {
  /** All tasks to display on the board */
  tasks: JiraTask[];
  /** Index of the currently focused column (0-4) */
  columnIndex: number;
  /** Selected task index within each column */
  taskIndices: Record<StatusCategory, number>;
}

/**
 * Renders a Kanban board with columns for each status category.
 * Groups tasks by status and highlights the active column/task.
 */
export function Board({ tasks, columnIndex, taskIndices }: BoardProps) {
  // Group tasks by status
  const tasksByColumn: Record<StatusCategory, JiraTask[]> = {
    'TO DO': [],
    'IN PROGRESS': [],
    'BLOCKED': [],
    'IN REVIEW': [],
    'DONE': [],
  };

  for (const task of tasks) {
    if (tasksByColumn[task.status]) {
      tasksByColumn[task.status].push(task);
    }
  }

  return (
    <Box flexDirection="row" justifyContent="flex-start" flexGrow={1}>
      {COLUMNS.map((status, index) => (
        <Column
          key={status}
          title={status}
          tasks={tasksByColumn[status]}
          isActive={index === columnIndex}
          selectedTaskIndex={taskIndices[status]}
        />
      ))}
    </Box>
  );
}
