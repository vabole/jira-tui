// Agent-readable logging utility
// All logs go to stderr so they're visible in `iterm-tui.sh read`

const PREFIX = '[JIRA-TUI]';

export const logger = {
  state: (data: Record<string, string | number>) => {
    const parts = Object.entries(data).map(([k, v]) => `${k}=${v}`).join(' ');
    console.error(`${PREFIX} STATE: ${parts}`);
  },

  nav: (action: string, data?: Record<string, string | number>) => {
    const extra = data ? ' ' + Object.entries(data).map(([k, v]) => `${k}=${v}`).join(' ') : '';
    console.error(`${PREFIX} NAV: ${action}${extra}`);
  },

  action: (message: string) => {
    console.error(`${PREFIX} ACTION: ${message}`);
  },

  error: (message: string) => {
    console.error(`${PREFIX} ERROR: ${message}`);
  },

  info: (message: string) => {
    console.error(`${PREFIX} INFO: ${message}`);
  },
};
