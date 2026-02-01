import React from 'react';
import { Box, Text } from 'ink';
import type { JiraTask, StatusCategory } from '../api/types.js';
import { TaskCard } from './TaskCard.js';
import { COLORS } from '../utils/theme.js';

interface ColumnProps {
  title: StatusCategory;
  tasks: JiraTask[];
  isActive: boolean;
  selectedTaskIndex: number;
}

const STATUS_COLORS: Record<StatusCategory, string> = {
  'TO DO': COLORS.status.todo,
  'IN PROGRESS': COLORS.status.inProgress,
  'BLOCKED': COLORS.status.blocked,
  'IN REVIEW': COLORS.status.inReview,
  'DONE': COLORS.status.done,
};

export function Column({ title, tasks, isActive, selectedTaskIndex }: ColumnProps) {
  const headerColor = isActive ? COLORS.accent : (STATUS_COLORS[title] || 'white');

  return (
    <Box
      flexDirection="column"
      width={28}
      marginRight={2}
      minHeight={15}
    >
      <Box paddingX={1} marginBottom={1}>
        <Text bold color={headerColor}>{title}</Text>
        <Text dimColor> ({tasks.length})</Text>
      </Box>
      <Box flexDirection="column" flexGrow={1}>
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
