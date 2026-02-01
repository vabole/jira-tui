import React from 'react';
import { Box, Text } from 'ink';
import type { JiraTask, StatusCategory } from '../api/types.js';
import { TaskCard } from './TaskCard.js';

interface ColumnProps {
  title: StatusCategory;
  tasks: JiraTask[];
  isActive: boolean;
  selectedTaskIndex: number;
}

const STATUS_COLORS: Record<StatusCategory, string> = {
  'TO DO': 'gray',
  'IN PROGRESS': 'blue',
  'BLOCKED': 'red',
  'IN REVIEW': 'yellow',
  'DONE': 'green',
};

export function Column({ title, tasks, isActive, selectedTaskIndex }: ColumnProps) {
  const headerColor = STATUS_COLORS[title] || 'white';

  return (
    <Box
      flexDirection="column"
      width={28}
      borderStyle={isActive ? 'double' : 'single'}
      borderColor={isActive ? 'cyan' : 'gray'}
      minHeight={15}
    >
      <Box paddingX={1} justifyContent="space-between">
        <Text bold color={headerColor}>{title}</Text>
        <Text dimColor>({tasks.length})</Text>
      </Box>
      <Box flexDirection="column" paddingX={0} flexGrow={1}>
        {tasks.length === 0 ? (
          <Box paddingX={1}>
            <Text dimColor italic>No tasks</Text>
          </Box>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.key}
              task={task}
              isSelected={isActive && index === selectedTaskIndex}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
