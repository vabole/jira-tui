import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  title: string;
  view?: 'my-tasks' | 'everyone';
}

export function Header({ title, view = 'my-tasks' }: HeaderProps) {
  return (
    <Box
      borderStyle="single"
      borderColor="cyan"
      paddingX={1}
      justifyContent="space-between"
    >
      <Text bold color="cyan">{title}</Text>
      <Text dimColor>
        [{view === 'my-tasks' ? '1' : '2'}] {view === 'my-tasks' ? 'My Tasks' : 'Everyone'}
      </Text>
    </Box>
  );
}
