import React from 'react';
import { Box, Text } from 'ink';
import type { JiraTask } from '../api/types.js';
import { COLORS, SYMBOLS } from '../utils/theme.js';

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

export function TaskCard({ task, isSelected }: TaskCardProps) {
  const prefix = isSelected ? `${SYMBOLS.selector} ` : '  ';
  const keyColor = isSelected ? COLORS.accent : 'yellow';

  return (
    <Box flexDirection="column" paddingLeft={1} marginBottom={1}>
      <Box>
        <Text color={keyColor} bold>{prefix}{task.key}</Text>
        <Text dimColor> [{TYPE_ICONS[task.type] || 'T'}]</Text>
      </Box>
      <Text wrap="truncate-end">
        {'  '}{task.summary.length > 22 ? task.summary.slice(0, 19) + '...' : task.summary}
      </Text>
      {task.assignee && (
        <Text dimColor>{'  '}@{task.assignee.split(' ')[0]}</Text>
      )}
    </Box>
  );
}
