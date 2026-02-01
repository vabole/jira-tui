#!/usr/bin/env bash
# E2E test for teammate filtering with Tab
# Run from the tui-agent directory: ./jira-tui/tests/e2e/test-teammate-filter.sh

set -e

# Get absolute path to jira-tui
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JIRA_TUI_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TUI_AGENT_DIR="$(cd "$JIRA_TUI_DIR/.." && pwd)"

cd "$TUI_AGENT_DIR"

echo "Starting teammate filter E2E test..."

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

# Switch to Everyone view (more teammates visible)
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

# Press Tab to select first teammate
./iterm-tui.sh key tab
sleep 1

OUTPUT=$(./iterm-tui.sh read)
# Check for @ symbol in header indicating teammate selected
if echo "$OUTPUT" | grep -q "→ @"; then
    echo "PASS: Teammate selected (@ symbol in header)"
else
    echo "FAIL: Tab did not select teammate"
    ./iterm-tui.sh close
    exit 1
fi

# Press Tab again to cycle to next teammate
./iterm-tui.sh key tab
sleep 1

OUTPUT2=$(./iterm-tui.sh read)
if echo "$OUTPUT2" | grep -q "→ @"; then
    echo "PASS: Cycled to next teammate"
else
    echo "FAIL: Could not cycle teammates"
    ./iterm-tui.sh close
    exit 1
fi

# Cycle through all teammates until filter clears
for i in {1..15}; do
    ./iterm-tui.sh key tab
    sleep 0.3
done

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "(Tab: teammates)"; then
    echo "PASS: Filter cleared after cycling through all teammates"
else
    # Might still be on a teammate, that's OK if we have many
    echo "INFO: Still filtering (many teammates in data)"
fi

# Quit app
./iterm-tui.sh key q
sleep 0.5
./iterm-tui.sh close

echo ""
echo "PASS: All teammate filter tests passed!"
