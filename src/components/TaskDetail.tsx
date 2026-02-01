import React from 'react';
import { Box, Text } from 'ink';
import type { JiraTask } from '../api/types.js';

interface TaskDetailProps {
  task: JiraTask;
}

const STATUS_COLORS: Record<string, string> = {
  'TO DO': 'gray',
  'IN PROGRESS': 'blue',
  'BLOCKED': 'red',
  'IN REVIEW': 'yellow',
  'DONE': 'green',
};

const PRIORITY_COLORS: Record<string, string> = {
  Highest: 'red',
  High: 'yellow',
  Medium: 'white',
  Low: 'blue',
  Lowest: 'gray',
};

export function TaskDetail({ task }: TaskDetailProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      padding={1}
      width="100%"
    >
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="yellow">{task.key}</Text>
        <Text> - </Text>
        <Text bold>{task.summary}</Text>
      </Box>

      {/* Metadata row */}
      <Box marginBottom={1} gap={2}>
        <Box>
          <Text dimColor>Status: </Text>
          <Text color={STATUS_COLORS[task.status] || 'white'} bold>
            {task.status}
          </Text>
        </Box>
        <Box>
          <Text dimColor>Type: </Text>
          <Text>{task.type}</Text>
        </Box>
        <Box>
          <Text dimColor>Priority: </Text>
          <Text color={PRIORITY_COLORS[task.priority] || 'white'}>
            {task.priority}
          </Text>
        </Box>
      </Box>

      {/* Assignee */}
      <Box marginBottom={1}>
        <Text dimColor>Assignee: </Text>
        <Text>{task.assignee || 'Unassigned'}</Text>
      </Box>

      {/* Description */}
      <Box flexDirection="column" marginTop={1}>
        <Text dimColor underline>Description</Text>
        <Box marginTop={1}>
          <Text wrap="wrap">{task.description || 'No description'}</Text>
        </Box>
      </Box>

      {/* Actions hint */}
      <Box marginTop={2} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          Press: t=TO DO  i=IN PROGRESS  b=BLOCKED  v=IN REVIEW  d=DONE  |  Esc=Back
        </Text>
      </Box>
    </Box>
  );
}
