#!/usr/bin/env bash
# E2E test for switching between views
# Run from the tui-agent directory

set -e

cd "$(dirname "$0")/../../.."

echo "Starting view switching E2E test..."

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

# Test switching to view 2
./iterm-tui.sh key 2
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -qi "view.*2\|list\|detail"; then
    echo "PASS: Switched to view 2"
else
    echo "FAIL: Could not switch to view 2"
    ./iterm-tui.sh close
    exit 1
fi

# Test switching back to view 1
./iterm-tui.sh key 1
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -qi "view.*1\|board\|column"; then
    echo "PASS: Switched to view 1"
else
    echo "FAIL: Could not switch to view 1"
    ./iterm-tui.sh close
    exit 1
fi

# Quit app
./iterm-tui.sh key q
sleep 0.3
./iterm-tui.sh close

echo ""
echo "PASS: All view switching tests passed!"
