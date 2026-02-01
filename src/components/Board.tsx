import React from 'react';
import { Box } from 'ink';
import { Column } from './Column.js';
import { COLUMNS, type JiraTask, type StatusCategory } from '../api/types.js';

interface BoardProps {
  tasks: JiraTask[];
  columnIndex: number;
  taskIndices: Record<StatusCategory, number>;
}

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
