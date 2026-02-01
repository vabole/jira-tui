#!/usr/bin/env bash
# E2E test for opening and closing task detail
# Run from the tui-agent directory: ./jira-tui/tests/e2e/test-task-detail.sh

set -e

# Get absolute path to jira-tui
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JIRA_TUI_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TUI_AGENT_DIR="$(cd "$JIRA_TUI_DIR/.." && pwd)"

cd "$TUI_AGENT_DIR"

echo "Starting task detail E2E test..."

# Open the app
./iterm-tui.sh open "bun run $JIRA_TUI_DIR/src/cli.tsx"
sleep 4

# Verify app started
OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "Jira TUI"; then
    echo "PASS: App started - header visible"
else
    echo "FAIL: App failed to start"
    ./iterm-tui.sh close
    exit 1
fi

# Focus the TUI window
./iterm-tui.sh focus tui
sleep 0.3

# Navigate to a column with tasks (IN REVIEW usually has tasks)
./iterm-tui.sh key right
./iterm-tui.sh key right
./iterm-tui.sh key right
sleep 0.5

# Open task detail with Enter
./iterm-tui.sh key return
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -qi "Status:\|Assignee:\|Description"; then
    echo "PASS: Task detail opened with Enter"
else
    echo "FAIL: Could not open task detail with Enter"
    ./iterm-tui.sh close
    exit 1
fi

# Close task detail with Escape
./iterm-tui.sh key escape
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "TO DO\|IN PROGRES\|BLOCKED\|IN REVIEW\|DONE"; then
    echo "PASS: Task detail closed with Escape"
else
    echo "FAIL: Could not close task detail with Escape"
    ./iterm-tui.sh close
    exit 1
fi

# Quit app
./iterm-tui.sh key q
sleep 0.5
./iterm-tui.sh close

echo ""
echo "PASS: All task detail tests passed!"
