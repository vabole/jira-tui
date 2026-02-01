import React from 'react';
import { Box, Text } from 'ink';
import type { JiraTask } from '../api/types.js';

interface TaskCardProps {
  task: JiraTask;
  isSelected: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  Bug: 'B',
  Story: 'S',
  Task: 'T',
  'Sub-task': '-',
};

const PRIORITY_COLORS: Record<string, string> = {
  Highest: 'red',
  High: 'yellow',
  Medium: 'white',
  Low: 'blue',
  Lowest: 'gray',
};

export function TaskCard({ task, isSelected }: TaskCardProps) {
  const borderColor = isSelected ? 'cyan' : 'gray';
  const bgColor = isSelected ? 'blue' : undefined;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
      marginBottom={0}
    >
      <Box>
        <Text color="yellow" bold>{task.key}</Text>
        <Text dimColor> [{TYPE_ICONS[task.type] || 'T'}]</Text>
      </Box>
      <Text wrap="truncate-end">
        {task.summary.length > 25 ? task.summary.slice(0, 22) + '...' : task.summary}
      </Text>
      {task.assignee && (
        <Text dimColor italic>@{task.assignee.split(' ')[0]}</Text>
      )}
    </Box>
  );
}
