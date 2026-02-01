# Jira TUI - Handoff Document

## Current State

The Jira TUI application is fully functional with:

- Kanban board with 5 columns
- Arrow key navigation
- Task detail view
- Real Jira API integration
- Status transitions (t/i/b/v/d)
- Two views: My Tasks (1) / Everyone (2)
- Help overlay (?)
- Clean output (no log noise in normal use)
- Debug mode with `JIRA_TUI_DEBUG=1`

## Next Feature: Enhanced View Switching

### Goal
Expand the view system to allow filtering by individual teammates, not just "My Tasks" vs "Everyone".

### Proposed Views

| Key | View | Description |
|-----|------|-------------|
| `1` | My Tasks | Current user's tasks only (existing) |
| `2` | All Tasks | Full sprint board (existing, rename from "Everyone") |
| `3` | Team Menu | Opens teammate selector |

### Team Menu UX

When pressing `3`, show a modal/overlay listing teammates:

```
┌─────────────────────────────────┐
│ Select Teammate                 │
│                                 │
│ [↑/↓] Navigate  [Enter] Select  │
│ [Esc] Cancel                    │
│                                 │
│ > John Doe (5 tasks)           │
│   Jane Smith (3 tasks)          │
│   Alex Johnson (2 tasks)        │
│   Unassigned (4 tasks)          │
│                                 │
└─────────────────────────────────┘
```

After selecting a teammate, filter the board to show only their tasks.

### Implementation Plan

#### Phase 1: Fetch Team Members
1. Get unique assignees from sprint issues
2. Count tasks per assignee
3. Store in state

**File**: `src/api/client.ts`
```typescript
export async function fetchTeamMembers(projectKey: string): Promise<TeamMember[]> {
  // Fetch all sprint issues
  // Extract unique assignees
  // Return with task counts
}
```

#### Phase 2: Team Selector Component
1. Create `TeamSelector.tsx` component
2. Show list of teammates with task counts
3. Handle up/down navigation and Enter to select

**File**: `src/components/TeamSelector.tsx`

#### Phase 3: Update App State
1. Add `selectedAssignee: string | null` state
2. Add `screen: 'team-selector'` option
3. Handle `3` key to open selector
4. Filter tasks by assignee when selected

**File**: `src/app.tsx`

#### Phase 4: Update Header
1. Show selected teammate name in header
2. Example: `[3] @JohnDoe` or `[3] Team: John Doe`

**File**: `src/components/Header.tsx`

### API Considerations

The current `fetchBoardIssues` already fetches all sprint issues. We can:
1. Reuse the same data and filter client-side
2. Or add JQL filter: `assignee = "account-id"`

Client-side filtering is simpler since we already have the data.

### Key Files to Modify

| File | Changes |
|------|---------|
| `src/app.tsx` | Add team selector state, handle key `3`, filter logic |
| `src/components/TeamSelector.tsx` | New component for teammate list |
| `src/components/Header.tsx` | Show selected teammate |
| `src/api/types.ts` | Add `TeamMember` type |

### Type Definitions

```typescript
// src/api/types.ts
export interface TeamMember {
  accountId: string;
  displayName: string;
  taskCount: number;
}
```

### State Shape

```typescript
// In App component
const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
// null = show all (view 2)
// 'currentUser' = my tasks (view 1)
// 'john.doe@...' = specific teammate (view 3)
```

### Testing

1. Press `3` → Team selector opens
2. Navigate with ↑/↓ → Highlights change
3. Press Enter → Board filters to that teammate
4. Header shows teammate name
5. Press `1` → Back to My Tasks
6. Press `2` → Back to All Tasks

## Files Reference

```
src/
├── app.tsx              # Main app - add team selector screen
├── api/
│   ├── client.ts        # Add fetchTeamMembers if needed
│   └── types.ts         # Add TeamMember type
├── components/
│   ├── TeamSelector.tsx # NEW - teammate list modal
│   ├── Header.tsx       # Update to show teammate name
│   └── ...
```

## Questions for Human

1. Should we include "Unassigned" as an option in the team selector?
2. Should pressing `3` again (when already filtered) reopen the selector or go back to All Tasks?
3. Any specific sorting preference for teammates? (alphabetical, by task count, etc.)
