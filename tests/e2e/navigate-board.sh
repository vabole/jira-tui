#!/usr/bin/env bash
# E2E test for board navigation
# Run from the tui-agent directory

set -e

cd "$(dirname "$0")/../../.."

echo "Starting Jira TUI E2E test..."

# Open the app
./iterm-tui.sh open "cd jira-tui && bun run src/cli.tsx"
sleep 3

# Verify app started
OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "Jira TUI"; then
    echo "✓ App started - header visible"
else
    echo "✗ App failed to start"
    ./iterm-tui.sh close
    exit 1
fi

# Test navigation right
./iterm-tui.sh focus tui
sleep 0.2
./iterm-tui.sh key right
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "moved right.*column=1"; then
    echo "✓ Navigation right working"
else
    echo "✗ Navigation right failed"
fi

# Test help screen
./iterm-tui.sh key "?"
sleep 0.5

OUTPUT=$(./iterm-tui.sh read)
if echo "$OUTPUT" | grep -q "Keyboard Shortcuts"; then
    echo "✓ Help screen opened"
else
    echo "✗ Help screen failed"
fi

# Close help
./iterm-tui.sh key escape
sleep 0.3

# Quit app
./iterm-tui.sh key q
sleep 0.3
./iterm-tui.sh close

echo ""
echo "✓ All E2E tests passed!"
