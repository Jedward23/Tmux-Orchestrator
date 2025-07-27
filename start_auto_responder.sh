#!/bin/bash
#
# Claude Auto-Responder Launcher
# Starts the auto-responder in a dedicated tmux window
#

SESSION_NAME=${1:-"antko-corporate"}
CHECK_INTERVAL=${2:-2.0}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Claude Auto-Responder for session: $SESSION_NAME"

# Create dedicated window for the watcher
tmux new-window -t "$SESSION_NAME" -n "Auto-Responder" -d

# Execute the watcher in that window
tmux send-keys -t "$SESSION_NAME:Auto-Responder" "cd $SCRIPT_DIR" Enter
tmux send-keys -t "$SESSION_NAME:Auto-Responder" "python3 claude_auto_responder.py $SESSION_NAME $CHECK_INTERVAL" Enter

echo "✅ Auto-responder started in window 'Auto-Responder'"
echo "🔍 Monitoring all windows in session '$SESSION_NAME'"
echo "🛑 To stop: tmux kill-window -t $SESSION_NAME:Auto-Responder"