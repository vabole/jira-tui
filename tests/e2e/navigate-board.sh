#!/usr/bin/env bash
# E2E test for board navigation
# Run from the tui-agent directory: ./jira-tui/tests/e2e/navigate-board.sh

set -e

# Get absolute path to jira-tui
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JIRA_TUI_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TUI_AGENT_DIR="$(cd "$JIRA_TUI_DIR/.." && pwd)"

cd "$TUI_AGENT_DIR"

echo "Starting Jira TUI E2E test..."

# Open the app using absolute path
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

# Test navigation right
./iterm-tui.sh key right
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "IN PROGRES"; then
    echo "PASS: Navigation right working (IN PROGRESS column visible)"
else
    echo "FAIL: Navigation right failed"
    ./iterm-tui.sh close
    exit 1
fi

# Test help screen
./iterm-tui.sh key "?"
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "toggle help"; then
    echo "PASS: Help screen opened"
else
    echo "FAIL: Help screen failed"
    ./iterm-tui.sh close
    exit 1
fi

# Close help
./iterm-tui.sh key escape
sleep 0.3

# Quit app
./iterm-tui.sh key q
sleep 0.5
./iterm-tui.sh close

echo ""
echo "PASS: All navigation tests passed!"
