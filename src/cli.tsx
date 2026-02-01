#!/usr/bin/env bun
import React from 'react';
import { render } from 'ink';
import { App } from './app.js';

// Enter alternate screen buffer (like vim/htop)
process.stdout.write('\x1B[?1049h'); // Enter alternate screen
process.stdout.write('\x1B[?25l');   // Hide cursor

const cleanup = () => {
  process.stdout.write('\x1B[?25h');   // Show cursor
  process.stdout.write('\x1B[?1049l'); // Exit alternate screen
};

// Handle cleanup on exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

const { waitUntilExit } = render(<App />, { exitOnCtrlC: true });

waitUntilExit().then(() => {
  cleanup();
  process.exit(0);
});
