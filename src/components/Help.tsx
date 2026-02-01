import React from 'react';
import { Box, Text } from 'ink';

export function Help() {
  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      padding={1}
      width="100%"
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text bold color="cyan">Keyboard Shortcuts</Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        <Box>
          <Box width={20}><Text bold>Navigation</Text></Box>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>←/→</Text></Box>
          <Text>Move between columns</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>↑/↓</Text></Box>
          <Text>Move between tasks</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>Enter</Text></Box>
          <Text>Open task detail</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>Esc</Text></Box>
          <Text>Close detail / help</Text>
        </Box>

        <Box marginTop={1}>
          <Box width={20}><Text bold>Status Changes</Text></Box>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>t</Text></Box>
          <Text>Move to TO DO</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>i</Text></Box>
          <Text>Move to IN PROGRESS</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>b</Text></Box>
          <Text>Move to BLOCKED</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>v</Text></Box>
          <Text>Move to IN REVIEW</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>d</Text></Box>
          <Text>Move to DONE</Text>
        </Box>

        <Box marginTop={1}>
          <Box width={20}><Text bold>Views</Text></Box>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>1</Text></Box>
          <Text>My Tasks (current user)</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>2</Text></Box>
          <Text>Everyone (full sprint)</Text>
        </Box>

        <Box marginTop={1}>
          <Box width={20}><Text bold>Other</Text></Box>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>r</Text></Box>
          <Text>Refresh board</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>?</Text></Box>
          <Text>Toggle this help</Text>
        </Box>
        <Box>
          <Box width={20}><Text dimColor>q</Text></Box>
          <Text>Quit</Text>
        </Box>
      </Box>

      <Box marginTop={1} justifyContent="center">
        <Text dimColor>Press Esc or ? to close</Text>
      </Box>
    </Box>
  );
}
