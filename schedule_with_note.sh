#!/bin/bash
# Dynamic scheduler with note for next check
# Usage: ./schedule_with_note.sh <minutes> "<note>" [target_window]

MINUTES=${1:-3}
NOTE=${2:-"Standard check-in"}
TARGET=${3:-"tmux-orc:0"}

# Create a note file for the next check
echo "=== Next Check Note ($(date)) ===" > /Users/jasonedward/Coding/Tmux\ orchestrator/next_check_note.txt
echo "Scheduled for: $MINUTES minutes" >> /Users/jasonedward/Coding/Tmux\ orchestrator/next_check_note.txt
echo "" >> /Users/jasonedward/Coding/Tmux\ orchestrator/next_check_note.txt
echo "$NOTE" >> /Users/jasonedward/Coding/Tmux\ orchestrator/next_check_note.txt

echo "Scheduling check in $MINUTES minutes with note: $NOTE"

# Calculate the exact time when the check will run
CURRENT_TIME=$(date +"%H:%M:%S")
RUN_TIME=$(date -v +${MINUTES}M +"%H:%M:%S" 2>/dev/null || date -d "+${MINUTES} minutes" +"%H:%M:%S" 2>/dev/null)

# Use nohup to completely detach the sleep process
# Use bc for floating point calculation
SECONDS=$(echo "$MINUTES * 60" | bc)
nohup bash -c "sleep $SECONDS && tmux send-keys -t $TARGET 'Time for orchestrator check! cat /Users/jasonedward/Coding/Tmux\ orchestrator/next_check_note.txt && python3 claude_control.py status detailed' && sleep 1 && tmux send-keys -t $TARGET Enter" > /dev/null 2>&1 &

# Get the PID of the background process
SCHEDULE_PID=$!

echo "Scheduled successfully - process detached (PID: $SCHEDULE_PID)"
echo "SCHEDULED TO RUN AT: $RUN_TIME (in $MINUTES minutes from $CURRENT_TIME)"