import React from 'react';
import { Box, Text } from 'ink';
import { COLORS, horizontalLine } from '../utils/theme.js';

interface ShortcutProps {
  keyName: string;
  description: string;
  width?: number;
}

function Shortcut({ keyName, description, width = 22 }: ShortcutProps) {
  return (
    <Box width={width}>
      <Text color={COLORS.textDim}>{keyName}</Text>
      <Text> {description}</Text>
    </Box>
  );
}

export function Help() {
  return (
    <Box flexDirection="column" width="100%">
      <Text color={COLORS.border}>{horizontalLine(80)}</Text>
      <Box flexDirection="row" marginTop={0}>
        {/* Column 1: Navigation */}
        <Box flexDirection="column">
          <Shortcut keyName="←/→" description="columns" />
          <Shortcut keyName="↑/↓" description="tasks" />
          <Shortcut keyName="Enter" description="open" />
          <Shortcut keyName="Esc" description="close" />
          <Shortcut keyName="Tab" description="teammate" />
        </Box>

        {/* Column 2: Status changes */}
        <Box flexDirection="column">
          <Shortcut keyName="t" description="TO DO" />
          <Shortcut keyName="i" description="IN PROGRESS" />
          <Shortcut keyName="b" description="BLOCKED" />
          <Shortcut keyName="v" description="IN REVIEW" />
          <Shortcut keyName="d" description="DONE" />
        </Box>

        {/* Column 3: Views & Other */}
        <Box flexDirection="column">
          <Shortcut keyName="1" description="My Tasks" />
          <Shortcut keyName="2" description="Everyone" />
          <Shortcut keyName="r" description="refresh" />
          <Shortcut keyName="q" description="quit" />
          <Shortcut keyName="?" description="toggle help" />
        </Box>
      </Box>
    </Box>
  );
}
