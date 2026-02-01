#!/usr/bin/env bash
# E2E test for opening and closing task detail
# Run from the tui-agent directory

set -e

cd "$(dirname "$0")/../../.."

echo "Starting task detail E2E test..."

# Open the app
./iterm-tui.sh open "cd jira-tui && bun run src/cli.tsx"
sleep 3

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
sleep 0.2

# Open task detail with Enter
./iterm-tui.sh key return
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -qi "detail\|description\|task\|issue\|modal"; then
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
if echo "$OUTPUT" | grep -qi "board\|column\|todo\|progress\|done"; then
    echo "PASS: Task detail closed with Escape"
else
    echo "FAIL: Could not close task detail with Escape"
    ./iterm-tui.sh close
    exit 1
fi

# Quit app
./iterm-tui.sh key q
sleep 0.3
./iterm-tui.sh close

echo ""
echo "PASS: All task detail tests passed!"
