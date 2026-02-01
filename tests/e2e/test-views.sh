#!/usr/bin/env bash
# E2E test for switching between views
# Run from the tui-agent directory: ./jira-tui/tests/e2e/test-views.sh

set -e

# Get absolute path to jira-tui
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JIRA_TUI_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TUI_AGENT_DIR="$(cd "$JIRA_TUI_DIR/.." && pwd)"

cd "$TUI_AGENT_DIR"

echo "Starting view switching E2E test..."

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

# Verify starting in My Tasks view
OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "My Tasks"; then
    echo "PASS: Starting in My Tasks view"
else
    echo "FAIL: Not in My Tasks view initially"
    ./iterm-tui.sh close
    exit 1
fi

# Test switching to Everyone view
./iterm-tui.sh key 2
sleep 2

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "Everyone"; then
    echo "PASS: Switched to Everyone view"
else
    echo "FAIL: Could not switch to Everyone view"
    ./iterm-tui.sh close
    exit 1
fi

# Test switching back to My Tasks view
./iterm-tui.sh key 1
sleep 2

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "My Tasks"; then
    echo "PASS: Switched back to My Tasks view"
else
    echo "FAIL: Could not switch back to My Tasks view"
    ./iterm-tui.sh close
    exit 1
fi

# Quit app
./iterm-tui.sh key q
sleep 0.5
./iterm-tui.sh close

echo ""
echo "PASS: All view switching tests passed!"
