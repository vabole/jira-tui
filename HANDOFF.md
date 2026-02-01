# Handoff Document

> **This is a living document.** Update it as you work, not just at session end.
> If your session is interrupted, the next orchestrator picks up from here.

## Current State

**App is complete and working.** All features implemented:

| Feature | Keys | Description |
|---------|------|-------------|
| Kanban board | — | 5 columns: TO DO, IN PROGRESS, BLOCKED, IN REVIEW, DONE |
| Navigation | ←/→/↑/↓ | Move between columns and tasks |
| Task detail | Enter/Esc | View task info, close with Esc |
| Status changes | t/i/b/v/d | Quick status transitions |
| View switching | 1/2 | My Tasks / Everyone |
| Teammate filter | Tab/Shift+Tab | Cycle through teammates, filter board |
| Full screen | — | Alternate screen buffer (like htop) |
| Help | ? | Keyboard shortcuts overlay |
| Debug mode | `JIRA_TUI_DEBUG=1` | Verbose logging to stderr |

## Next Feature: TBD

No next feature is currently planned. Potential ideas:
- Search/filter by task title
- Quick comment on task
- Create new task
- Sprint view
- Time tracking display

---

## Testing

Run E2E tests from the `tui-agent` directory:

```bash
./jira-tui/tests/e2e/navigate-board.sh
./jira-tui/tests/e2e/test-views.sh
./jira-tui/tests/e2e/test-task-detail.sh
./jira-tui/tests/e2e/test-teammate-filter.sh
```

Or test manually:
```bash
cd /Users/vabole/repos/tui-agent
./iterm-tui.sh open "bun run jira-tui/src/cli.tsx"
./iterm-tui.sh focus tui
./iterm-tui.sh read
./iterm-tui.sh key tab   # Cycle teammates
./iterm-tui.sh key q     # Quit
./iterm-tui.sh close
```

---

## Orchestration Approach

### Two Patterns

**1. Multi-Agent**: Orchestrator spawns workers with separate context windows. Good for parallel independent tasks.

**2. Handoff-Driven**: Single orchestrator chain. Each updates this document as they go. If interrupted, next picks up. Good for sequential work.

### Handoff Rules

- **Update as you go** — Don't wait until session end
- **Keep it lean** — Only current state and immediate next steps
- **No scope creep** — Stay focused on the current feature
- **Mark progress** — Update status table as phases complete

---

## Session Log

| Date | What Happened |
|------|---------------|
| 2026-02-01 | Initial implementation complete. All 6 phases. App working. |
| 2026-02-01 | Added teammate filtering (Tab), full screen mode, E2E tests fixed. |
