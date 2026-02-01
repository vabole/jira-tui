import React from 'react';
import { Box, Text } from 'ink';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Box justifyContent="center" alignItems="center" flexGrow={1}>
      <Text color="cyan">{message}</Text>
    </Box>
  );
}

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Box flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1}>
      <Text color="red" bold>Error</Text>
      <Text color="red">{message}</Text>
      <Text dimColor>Press 'r' to retry</Text>
    </Box>
  );
}
