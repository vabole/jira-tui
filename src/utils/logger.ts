// Agent-readable logging utility
// All logs go to stderr so they're visible in `iterm-tui.sh read`
// Set JIRA_TUI_DEBUG=1 to enable verbose logging

const PREFIX = '[JIRA-TUI]';
const DEBUG = process.env.JIRA_TUI_DEBUG === '1' || process.env.JIRA_TUI_DEBUG === 'true';

export const logger = {
  state: (data: Record<string, string | number>) => {
    if (!DEBUG) return;
    const parts = Object.entries(data).map(([k, v]) => `${k}=${v}`).join(' ');
    console.error(`${PREFIX} STATE: ${parts}`);
  },

  nav: (action: string, data?: Record<string, string | number>) => {
    if (!DEBUG) return;
    const extra = data ? ' ' + Object.entries(data).map(([k, v]) => `${k}=${v}`).join(' ') : '';
    console.error(`${PREFIX} NAV: ${action}${extra}`);
  },

  action: (message: string) => {
    if (!DEBUG) return;
    console.error(`${PREFIX} ACTION: ${message}`);
  },

  error: (message: string) => {
    // Errors always log
    console.error(`${PREFIX} ERROR: ${message}`);
  },

  info: (message: string) => {
    if (!DEBUG) return;
    console.error(`${PREFIX} INFO: ${message}`);
  },
};
