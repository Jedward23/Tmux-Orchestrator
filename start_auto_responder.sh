#!/bin/bash
#
# Claude Auto-Responder Launcher
# Starts the auto-responder in a dedicated tmux window
#

# Check if session name is provided
if [ $# -lt 1 ]; then
    echo "Usage: $0 <session_name> [check_interval]"
    echo "Example: $0 my-session 2.0"
    echo ""
    echo "Available tmux sessions:"
    tmux list-sessions 2>/dev/null || echo "  No tmux sessions found"
    exit 1
fi

SESSION_NAME="$1"
CHECK_INTERVAL=${2:-2.0}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Verify the session exists
if ! tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "❌ Error: Session '$SESSION_NAME' does not exist"
    echo ""
    echo "Available tmux sessions:"
    tmux list-sessions 2>/dev/null || echo "  No tmux sessions found"
    echo ""
    echo "To create a new session: tmux new-session -s $SESSION_NAME"
    exit 1
fi

echo "🚀 Starting Claude Auto-Responder for session: $SESSION_NAME"

# Create dedicated window for the watcher
tmux new-window -t "$SESSION_NAME" -n "Auto-Responder" -d

# Execute the watcher in that window
tmux send-keys -t "$SESSION_NAME:Auto-Responder" "cd $SCRIPT_DIR" Enter
tmux send-keys -t "$SESSION_NAME:Auto-Responder" "python3 claude_auto_responder.py $SESSION_NAME $CHECK_INTERVAL" Enter

echo "✅ Auto-responder started in window 'Auto-Responder'"
echo "🔍 Monitoring all windows in session '$SESSION_NAME'"
echo "🛑 To stop: tmux kill-window -t $SESSION_NAME:Auto-Responder"