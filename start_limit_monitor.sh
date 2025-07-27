#!/bin/bash
#
# Claude Limit Monitor Launcher
# Starts the limit monitor in a dedicated tmux window
#

CHECK_INTERVAL=${1:-30}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚨 Starting Claude Limit Monitor"
echo "⏱️  Check interval: $CHECK_INTERVAL seconds"

# Create a dedicated session for the monitor if it doesn't exist
if ! tmux has-session -t claude-monitor 2>/dev/null; then
    tmux new-session -d -s claude-monitor -n "Limit-Monitor"
    echo "📱 Created new session: claude-monitor"
else
    # Create a new window in existing session
    tmux new-window -t claude-monitor -n "Limit-Monitor"
    echo "📱 Added window to existing session: claude-monitor"
fi

# Execute the monitor in that window
tmux send-keys -t "claude-monitor:Limit-Monitor" "cd $SCRIPT_DIR" Enter
tmux send-keys -t "claude-monitor:Limit-Monitor" "python3 claude_limit_monitor.py $CHECK_INTERVAL" Enter

echo "✅ Claude Limit Monitor started in session 'claude-monitor'"
echo "🔍 Monitoring all tmux sessions for usage limits"
echo "🛑 To stop: tmux kill-window -t claude-monitor:Limit-Monitor"
echo "👀 To view: tmux attach-session -t claude-monitor"
