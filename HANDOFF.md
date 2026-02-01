# Handoff Document

> **This is a living document.** Update it as you work, not just at session end.
> If your session is interrupted, the next orchestrator picks up from here.

## Current State

**App is complete and working.** All 6 phases done:
- Kanban board with 5 columns
- Arrow key navigation
- Task detail view (Enter/Esc)
- Status transitions (t/i/b/v/d)
- Two views: My Tasks (1) / Everyone (2)
- Help overlay (?)
- Clean output (logs only with `JIRA_TUI_DEBUG=1`)

## Next Feature: Enhanced View Switching

**Goal**: Filter board by individual teammates, not just "My Tasks" vs "Everyone"

### Implementation Phases

| Phase | Task | Status |
|-------|------|--------|
| 1 | Extract unique assignees from fetched issues | Not started |
| 2 | Create TeamSelector component (modal with list) | Not started |
| 3 | Add `selectedAssignee` state to app.tsx | Not started |
| 4 | Update Header to show selected teammate name | Not started |

### Phase 1 Details

**File**: `src/app.tsx` or `src/api/client.ts`

Extract unique assignees from already-fetched issues:
```typescript
const teammates = useMemo(() => {
  const seen = new Map<string, { name: string; count: number }>();
  for (const task of tasks) {
    if (task.assignee) {
      const existing = seen.get(task.assignee) || { name: task.assignee, count: 0 };
      seen.set(task.assignee, { ...existing, count: existing.count + 1 });
    }
  }
  return Array.from(seen.values());
}, [tasks]);
```

### Phase 2 Details

**File**: `src/components/TeamSelector.tsx`

Modal showing teammate list with task counts:
- Up/down to navigate
- Enter to select
- Esc to cancel

### UX Flow

1. Press `3` → TeamSelector opens
2. Navigate with ↑/↓
3. Press Enter → Board filters to that teammate's tasks
4. Header shows `[3] @Name`

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
