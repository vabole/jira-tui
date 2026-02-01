import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  title: string;
  view?: 'my-tasks' | 'everyone';
  selectedTeammate?: string | null;
}

export function Header({ title, view = 'my-tasks', selectedTeammate }: HeaderProps) {
  const viewLabel = view === 'my-tasks' ? '[1] My Tasks' : '[2] Everyone';
  const teammateLabel = selectedTeammate ? ` → @${selectedTeammate}` : '';

  return (
    <Box
      borderStyle="single"
      borderColor="cyan"
      paddingX={1}
      justifyContent="space-between"
    >
      <Text bold color="cyan">{title}</Text>
      <Text dimColor>
        {viewLabel}
        {selectedTeammate && <Text color="yellow">{teammateLabel}</Text>}
        {!selectedTeammate && <Text dimColor>  (Tab: teammates)</Text>}
      </Text>
    </Box>
  );
}
