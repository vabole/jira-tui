# Jira TUI

A terminal-based Jira board for standups. View tasks, navigate columns, change status—without leaving the terminal.

![Jira TUI Board](https://via.placeholder.com/800x400?text=Jira+TUI+Kanban+Board)

## Features

- **Kanban Board** - 5 columns: TO DO, IN PROGRESS, BLOCKED, IN REVIEW, DONE
- **Keyboard Navigation** - Arrow keys to move between columns and tasks
- **Task Detail** - View full task info with Enter
- **Quick Status Changes** - Press `t/i/b/v/d` to move tasks between statuses
- **Views** - Switch between "My Tasks" and "Everyone's Board"
- **Agent-Friendly** - Logs all state changes for automation

## Installation

```bash
# Clone the repo
git clone https://github.com/vabole/jira-tui.git
cd jira-tui

# Install dependencies
bun install
```

## Configuration

### 1. Jira Credentials

Add to `~/.env`:

```env
JIRA_URL=https://your-instance.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your-api-token
```

Get your API token from: https://id.atlassian.com/manage-profile/security/api-tokens

### 2. Project Settings

Create `~/.jira-tui/config.json`:

```json
{
  "boardId": "12345",
  "projectKey": "PROJ"
}
```

## Usage

```bash
bun run src/cli.tsx
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←/→` | Move between columns |
| `↑/↓` | Move between tasks |
| `Enter` | Open task detail |
| `Esc` | Close detail/help |
| `t` | Move to TO DO |
| `i` | Move to IN PROGRESS |
| `b` | Move to BLOCKED |
| `v` | Move to IN REVIEW |
| `d` | Move to DONE |
| `1` | My Tasks view |
| `2` | Everyone view |
| `r` | Refresh board |
| `?` | Help |
| `q` | Quit |

## Agent Automation

The app logs all state changes to stderr for automation:

```
[JIRA-TUI] STATE: screen=board view=my-tasks column=0 task=0
[JIRA-TUI] NAV: moved right column=1 columnName=IN PROGRESS
[JIRA-TUI] ACTION: transitioning PROJ-123 to DONE
```

Use with [iterm-tui.sh](https://github.com/vabole/tui-agent) for programmatic control:

```bash
./iterm-tui.sh open "bun run src/cli.tsx"
./iterm-tui.sh read  # Read screen content
./iterm-tui.sh key right  # Navigate
./iterm-tui.sh key d  # Move task to DONE
./iterm-tui.sh key q  # Quit
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **UI**: [Ink](https://github.com/vadimdemedes/ink) (React for CLI)
- **Language**: TypeScript
- **API**: Jira REST API v3

## Project Structure

```
jira-tui/
├── src/
│   ├── cli.tsx              # Entry point
│   ├── app.tsx              # Main app with routing
│   ├── api/
│   │   ├── client.ts        # Jira API client
│   │   └── types.ts         # Type definitions
│   ├── components/
│   │   ├── Board.tsx        # Kanban board
│   │   ├── Column.tsx       # Status column
│   │   ├── TaskCard.tsx     # Task card
│   │   ├── TaskDetail.tsx   # Detail view
│   │   ├── Header.tsx       # App header
│   │   ├── Footer.tsx       # Keyboard hints
│   │   ├── Help.tsx         # Help overlay
│   │   └── Loading.tsx      # Loading states
│   ├── hooks/
│   │   └── useJira.ts       # Data fetching
│   └── utils/
│       ├── logger.ts        # Agent logging
│       └── config.ts        # Config loader
├── tests/e2e/
│   └── navigate-board.sh    # E2E test
├── package.json
└── tsconfig.json
```

## License

MIT
