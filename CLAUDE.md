# Jira TUI

Terminal Jira board for standups. Bun + Ink (React for CLI) + TypeScript.

> **Note for future sessions:**
> - This file is a system prompt for agents, not setup docs. Keep it lean.
> - Setup/installation goes in README.md.
> - Delete or update outdated docs - conflicting info confuses agents.

## Learnings

- **One source of truth** — Don't duplicate info across files. If it's in README, don't repeat it here.
- **Delete outdated content** — Stale docs cause more confusion than missing docs.
- **Leave code merge-ready** — No TODOs, no commented code, no broken tests.

## Your Role

**Orchestrator**: Read `HANDOFF.md`, break work into tasks, spawn workers, verify, update progress.

**Worker**: Complete assigned task fully (code + test + commit), report back.

## Principles

- **State in files** — `HANDOFF.md`, `sessions/`, git history. Don't rely on memory.
- **Validate first** — Run E2E tests before new work. Fix broken things first.
- **Git checkpoint** — Commit after each completed task.
- **Single feature focus** — One complete unit per session.

## Testing

```bash
cd /Users/vabole/repos/tui-agent

# Start app
./iterm-tui.sh open "bun run jira-tui/src/cli.tsx"

# IMPORTANT: Focus before keys
./iterm-tui.sh focus tui

# Interact
./iterm-tui.sh read
./iterm-tui.sh key right
./iterm-tui.sh key tab
./iterm-tui.sh key q

# Cleanup
./iterm-tui.sh close
```

**Debug logging:** `JIRA_TUI_DEBUG=1 bun run src/cli.tsx`

## E2E Tests

```bash
./jira-tui/tests/e2e/navigate-board.sh
./jira-tui/tests/e2e/test-views.sh
./jira-tui/tests/e2e/test-task-detail.sh
./jira-tui/tests/e2e/test-teammate-filter.sh
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app.tsx` | Main component, ALL state lives here |
| `src/cli.tsx` | Entry point, full screen setup |
| `src/api/client.ts` | Jira API, STATUS_MAP for workflow mapping |
| `HANDOFF.md` | Current state, next steps |
| `sessions/` | Session notes |

## Pitfalls

1. **Focus first** — `./iterm-tui.sh focus tui` before sending keys
2. **Status mapping** — Jira uses "Progress" not "In Progress", check STATUS_MAP
3. **API endpoint** — Use `/search/jql` (POST), old `/search` returns 410
4. **Shift+Arrow unreliable** — Use Tab for teammate cycling instead

## Session End

1. Commit work
2. Update `HANDOFF.md`
3. Write to `sessions/YYYY-MM-DD-description.md`
