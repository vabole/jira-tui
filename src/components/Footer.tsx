import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { COLORS, horizontalLine } from '../utils/theme.js';

interface FooterProps {
  hints?: string[];
}

const DEFAULT_HINTS = [
  '←/→ columns',
  '↑/↓ tasks',
  'Tab teammate',
  'Enter open',
  '? help',
  'q quit',
];

export function Footer({ hints = DEFAULT_HINTS }: FooterProps) {
  const { stdout } = useStdout();
  const width = stdout?.columns ?? 80;

  return (
    <Box flexDirection="column">
      <Text color={COLORS.border}>{horizontalLine(width)}</Text>
      <Text color={COLORS.textDim}>{hints.join('    ')}</Text>
    </Box>
  );
}
