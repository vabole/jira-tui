# Claude Instructions for jira-tui

## Project Overview

Terminal-based Jira Kanban board built with Bun + Ink (React for CLI) + TypeScript. Designed for standups - view tasks, navigate, change status without leaving the terminal.

## Way of Working

### Testing Changes

**Always test with iterm-tui.sh** (from parent tui-agent directory):
```bash
cd /Users/vabole/repos/tui-agent
./iterm-tui.sh open "cd jira-tui && bun run src/cli.tsx"
./iterm-tui.sh read                    # See current output
./iterm-tui.sh focus tui               # Focus before sending keys
./iterm-tui.sh key right               # Send arrow keys
./iterm-tui.sh key q                   # Quit
./iterm-tui.sh close                   # Close pane
```

**For debug logging**: `JIRA_TUI_DEBUG=1 bun run src/cli.tsx`

### Key Patterns

1. **State lives in app.tsx** - Navigation state, view state, tasks all managed there
2. **Logging via logger.ts** - Use `logger.nav()`, `logger.action()`, etc. Only shows with DEBUG=1
3. **Config from ~/.jira-tui/config.json** - Cached after first load
4. **Credentials from ~/.env** - JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN

### Jira API Notes

- Uses `/rest/api/3/search/jql` (POST) - the old `/search` endpoint is deprecated
- Status names vary by workflow. Current mappings in `src/api/client.ts`:
  - "Progress" → IN PROGRESS
  - "Reviewing" → IN REVIEW
  - Standard: "To Do", "Done", "Blocked"

### File Structure

```
src/
├── cli.tsx              # Entry point (just renders App)
├── app.tsx              # Main component - ALL state and input handling
├── api/
│   ├── client.ts        # Jira API (fetch, transitions)
│   └── types.ts         # StatusCategory, JiraTask, COLUMNS
├── components/
│   ├── Board.tsx        # Kanban layout
│   ├── Column.tsx       # Single status column
│   ├── TaskCard.tsx     # Task card in column
│   ├── TaskDetail.tsx   # Full task view
│   ├── Header.tsx       # Title + view indicator
│   ├── Footer.tsx       # Keyboard hints
│   ├── Help.tsx         # Help overlay
│   └── Loading.tsx      # Loading/error states
└── utils/
    ├── logger.ts        # Debug logging (off by default)
    └── config.ts        # Config file loader (cached)
```

## Current State

### What Works
- Kanban board with 5 columns
- Arrow key navigation between columns and tasks
- Task detail view (Enter/Esc)
- Status transitions (t/i/b/v/d keys)
- Two views: My Tasks (1) / Everyone (2)
- Help overlay (?)
- Real Jira API integration

### Next Feature: Enhanced View Switching

See `HANDOFF.md` for full plan. Summary:

**Goal**: Add ability to filter by individual teammates, not just "My Tasks" vs "Everyone"

**Proposed**:
- Key `3` opens teammate selector modal
- Select teammate → board filters to their tasks
- Header shows selected teammate name

**Implementation phases**:
1. Extract unique assignees from fetched issues
2. Create TeamSelector component (modal with list)
3. Add `selectedAssignee` state to app.tsx
4. Filter displayed tasks by assignee

## Common Pitfalls

1. **Config loading** - Don't call `loadConfig()` in render path, it's cached but still reads state
2. **Key handling** - Use iterm-tui.sh `focus tui` before sending keys, otherwise keys go to wrong pane
3. **Status mapping** - Jira statuses are workflow-specific, check `STATUS_MAP` in client.ts
4. **API errors** - Jira returns 410 for deprecated endpoints, use `/search/jql` with POST

## E2E Tests

Run from tui-agent parent directory:
```bash
./jira-tui/tests/e2e/navigate-board.sh
./jira-tui/tests/e2e/test-views.sh
./jira-tui/tests/e2e/test-task-detail.sh
```

## Commits

When committing, use this format:
```bash
git commit -m "$(cat <<'EOF'
Short description

Longer explanation if needed.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```
