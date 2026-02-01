import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  hints?: string[];
}

const DEFAULT_HINTS = [
  '←/→ columns',
  '↑/↓ tasks',
  'Tab teammate',
  'Enter open',
  't/i/b/v/d status',
  '1/2 view',
  'r refresh',
  '? help',
  'q quit',
];

export function Footer({ hints = DEFAULT_HINTS }: FooterProps) {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1}>
      <Text dimColor>{hints.join('  |  ')}</Text>
    </Box>
  );
}
