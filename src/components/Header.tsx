import React from 'react';
import { Box, Text } from 'ink';
import { COLORS, horizontalLine } from '../utils/theme.js';

interface HeaderProps {
  title: string;
  view?: 'my-tasks' | 'everyone';
  selectedTeammate?: string | null;
  width?: number;
}

export function Header({ title, view = 'my-tasks', selectedTeammate, width = 80 }: HeaderProps) {
  const viewLabel = view === 'my-tasks' ? '[1] My Tasks' : '[2] Everyone';
  const teammateLabel = selectedTeammate ? ` → @${selectedTeammate}` : '';

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between" paddingX={1}>
        <Text bold color={COLORS.text}>{title}</Text>
        <Text color={COLORS.textDim}>
          {viewLabel}
          {selectedTeammate && <Text color="yellow">{teammateLabel}</Text>}
          {!selectedTeammate && <Text color={COLORS.textDim}>  (Tab: teammates)</Text>}
        </Text>
      </Box>
      <Text color={COLORS.border}>{horizontalLine(width)}</Text>
    </Box>
  );
}
