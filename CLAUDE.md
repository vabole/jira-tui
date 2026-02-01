# Claude Instructions for jira-tui

## Orchestration Principles

Based on [Anthropic's harness research](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents):

### Core Problem: Context Exhaustion
When an agent works across sessions, it loses track. Memory doesn't persist.

### Solution: File-Based Continuity
All state lives in files, not memory:
- `HANDOFF.md` — Current state, next steps, implementation plan
- `sessions/` — Session notes with context git commits don't capture
- Git history — The checkpoint system

**Any Claude session can continue work** by reading these files.

### Key Principles

1. **Fresh context per session** — Use files and git, not memory
2. **Begin with validation** — Never start in a broken state (run E2E tests first)
3. **Single feature per session** — Incremental, verifiable progress
4. **Git as checkpoint** — Commit after each completed task
5. **State in files** — Not in conversation memory
6. **Agents run scripts, don't figure things out** — Use iterm-tui.sh, E2E tests

### Complete Units of Work

A task is complete only when it includes:
- Implementation
- Tests (or manual verification with iterm-tui.sh)
- Documentation updates (HANDOFF.md)
- Verification it works end-to-end

**Right-sizing examples:**

| Too Broad | Right-Sized |
|-----------|-------------|
| "Add team views" | "Extract unique assignees from fetched issues" |
| "Build selector" | "Create TeamSelector component with up/down navigation" |
| "Polish UI" | "Update Header to show selected teammate name" |

---

## Session Start Protocol

**This is a FRESH context window - you have no memory of previous sessions.**

### Step 1: Orient Yourself (MANDATORY)

```bash
# 1. Understand project structure
ls -la src/

# 2. Read progress from previous sessions
cat HANDOFF.md

# 3. Check recent git history
git log --oneline -10

# 4. Run E2E tests to verify nothing is broken
cd /Users/vabole/repos/tui-agent
./jira-tui/tests/e2e/navigate-board.sh
```

### Step 2: Verify Before New Work (CRITICAL)

**MANDATORY:** Before implementing anything new, verify existing features:

1. Start the app: `./iterm-tui.sh open "cd jira-tui && bun run src/cli.tsx"`
2. Test navigation: arrows, Enter for detail, Esc to close
3. Test views: `1` for My Tasks, `2` for Everyone
4. Quit cleanly: `q`

**If ANY issues found:** Fix them BEFORE adding new features.

### Step 3: Choose ONE Feature

Read `HANDOFF.md` for the next planned feature. Focus on ONE complete unit.

### Step 4: Implement and Test

1. Write the code
2. Test with iterm-tui.sh
3. Fix any issues
4. Verify end-to-end

### Step 5: Update Progress

Before session ends:
1. Commit all work with descriptive messages
2. Update `HANDOFF.md` with what you accomplished
3. Write session notes to `sessions/YYYY-MM-DD-description.md`
4. Leave app in working state

---

## Testing with iterm-tui.sh

**Always test from the tui-agent parent directory:**

```bash
cd /Users/vabole/repos/tui-agent

# Start app
./iterm-tui.sh open "cd jira-tui && bun run src/cli.tsx"

# Wait for load
sleep 3

# Read current screen
./iterm-tui.sh read

# IMPORTANT: Focus before sending keys
./iterm-tui.sh focus tui

# Send keys
./iterm-tui.sh key right      # Arrow keys
./iterm-tui.sh key enter      # Enter key
./iterm-tui.sh key escape     # Escape
./iterm-tui.sh key q          # Quit

# Close pane
./iterm-tui.sh close
```

**For debug logging:** `JIRA_TUI_DEBUG=1 bun run src/cli.tsx`

---

## Project Overview

Terminal-based Jira Kanban board. Bun + Ink (React for CLI) + TypeScript.

## File Structure

```
src/
├── cli.tsx              # Entry point
├── app.tsx              # Main component - ALL state and input handling
├── api/
│   ├── client.ts        # Jira API (fetch, transitions)
│   └── types.ts         # StatusCategory, JiraTask, COLUMNS
├── components/          # UI components (8 files)
└── utils/
    ├── logger.ts        # Debug logging (off by default)
    └── config.ts        # Config file loader (cached)
```

## Key Patterns

1. **State lives in app.tsx** — Navigation, view, tasks all there
2. **Logging via logger.ts** — Only shows with `JIRA_TUI_DEBUG=1`
3. **Config from ~/.jira-tui/config.json** — Cached after first load
4. **Credentials from ~/.env** — JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN

## Jira API Notes

- Uses `/rest/api/3/search/jql` (POST) — old `/search` returns 410
- Status mappings in `src/api/client.ts` STATUS_MAP

## Current Features

- Kanban board with 5 columns
- Arrow key navigation
- Task detail view (Enter/Esc)
- Status transitions (t/i/b/v/d)
- Two views: My Tasks (1) / Everyone (2)
- Help overlay (?)

## Common Pitfalls

1. **Key handling** — MUST `focus tui` before sending keys
2. **Status mapping** — Workflow-specific, check STATUS_MAP
3. **Empty columns** — Status shortcuts need a selected task

## E2E Tests

```bash
cd /Users/vabole/repos/tui-agent
./jira-tui/tests/e2e/navigate-board.sh
./jira-tui/tests/e2e/test-views.sh
./jira-tui/tests/e2e/test-task-detail.sh
```

## Commits

```bash
git commit -m "$(cat <<'EOF'
Short description

Details.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

## Quality Bar

- All keyboard shortcuts work
- Clean output (no log noise)
- E2E tests pass
- Leave codebase working before ending session
