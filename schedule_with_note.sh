#!/bin/bash

# Dynamic scheduler with note for next check
# Usage: ./schedule_with_note.sh <minutes> "<note>" [target_window]
# 
# Examples:
#   ./schedule_with_note.sh 5 "Check backend status"
#   ./schedule_with_note.sh 10 "Review deployment" "my-project:2"

set -euo pipefail

# Source configuration and utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if config file exists
if [[ ! -f "$SCRIPT_DIR/config.sh" ]]; then
    echo "[ERROR] Configuration file not found: $SCRIPT_DIR/config.sh" >&2
    echo "Please run setup.sh first or ensure config.sh exists." >&2
    exit 1
fi

# Disable validation for config loading (since we're in a script context)
export ORCHESTRATOR_SETUP_MODE=true
source "$SCRIPT_DIR/config.sh"
unset ORCHESTRATOR_SETUP_MODE

# =============================================================================
# INPUT VALIDATION AND PARSING
# =============================================================================

show_usage() {
    cat << EOF
Usage: $0 <minutes> "<note>" [target_window]

Arguments:
  minutes       : Number of minutes to wait (1-1440)
  note         : Note describing what to check
  target_window: Tmux target (default: $DEFAULT_TARGET_WINDOW)

Examples:
  $0 5 "Check backend status"
  $0 10 "Review deployment" "my-project:2"
  $0 30 "Daily standup reminder" "team-session:0"

Note: Target format should be session:window or session:window.pane
EOF
}

# Validate arguments
if [[ $# -lt 2 || $# -gt 3 ]]; then
    echo "[ERROR] Invalid number of arguments" >&2
    show_usage
    exit 1
fi

MINUTES="$1"
NOTE="$2"
TARGET="${3:-$DEFAULT_TARGET_WINDOW}"

# Validate minutes is a number and within reasonable range
if ! [[ "$MINUTES" =~ ^[0-9]+$ ]] || [[ "$MINUTES" -lt 1 || "$MINUTES" -gt 1440 ]]; then
    log_error "Minutes must be a number between 1 and 1440 (24 hours)"
    exit 1
fi

# Validate note is not empty
if [[ -z "$NOTE" || "${#NOTE}" -lt 3 ]]; then
    log_error "Note must be at least 3 characters long"
    exit 1
fi

# Validate tmux target format
if ! validate_tmux_target "$TARGET"; then
    exit 1
fi

# =============================================================================
# TMUX VALIDATION
# =============================================================================

# Check if tmux is running
if ! command -v tmux >/dev/null 2>&1; then
    log_error "tmux is not installed or not in PATH"
    exit 1
fi

# Check if tmux server is running
if ! tmux info >/dev/null 2>&1; then
    log_error "tmux server is not running. Start tmux first."
    exit 1
fi

# Extract session and window from target
SESSION="${TARGET%:*}"
WINDOW="${TARGET#*:}"

# Check if target session exists
if ! tmux_session_exists "$SESSION"; then
    log_error "Tmux session '$SESSION' does not exist"
    echo "Available sessions:" >&2
    tmux list-sessions -F "  #{session_name}" 2>/dev/null || echo "  (no sessions)" >&2
    exit 1
fi

# Check if target window exists
if ! tmux_window_exists "$TARGET"; then
    log_error "Tmux window '$TARGET' does not exist"
    echo "Available windows in session '$SESSION':" >&2
    tmux list-windows -t "$SESSION" -F "  #{session_name}:#{window_index} (#{window_name})" 2>/dev/null || echo "  (no windows)" >&2
    exit 1
fi

# =============================================================================
# CREATE NOTE FILE
# =============================================================================

# Ensure the note file directory exists
NOTE_DIR="$(dirname "$NEXT_CHECK_NOTE")"
if [[ ! -d "$NOTE_DIR" ]]; then
    if ! mkdir -p "$NOTE_DIR"; then
        log_error "Failed to create directory for note file: $NOTE_DIR"
        exit 1
    fi
fi

# Create the note file
{
    echo "=== Next Check Note ($(date)) ==="
    echo "Target: $TARGET"
    echo "Scheduled for: $MINUTES minutes from now"
    echo ""
    echo "$NOTE"
    echo ""
    echo "--- Orchestrator Info ---"
    echo "Script: $0"
    echo "PID: $$"
    echo "User: $(whoami)"
    echo "Host: $(hostname)"
} > "$NEXT_CHECK_NOTE"

if [[ ! -f "$NEXT_CHECK_NOTE" ]]; then
    log_error "Failed to create note file: $NEXT_CHECK_NOTE"
    exit 1
fi

log_info "Note file created: $NEXT_CHECK_NOTE"

# =============================================================================
# CALCULATE TIMING
# =============================================================================

# Calculate the exact time when the check will run
CURRENT_TIME=$(date +"%H:%M:%S")

# Use different date command syntax based on OS
if date -v +1M >/dev/null 2>&1; then
    # macOS/BSD date
    RUN_TIME=$(date -v +${MINUTES}M +"%H:%M:%S")
    RUN_DATE=$(date -v +${MINUTES}M +"%Y-%m-%d %H:%M:%S")
else
    # GNU date (Linux)
    RUN_TIME=$(date -d "+${MINUTES} minutes" +"%H:%M:%S")
    RUN_DATE=$(date -d "+${MINUTES} minutes" +"%Y-%m-%d %H:%M:%S")
fi

# Calculate seconds to sleep
SLEEP_SECONDS=$((MINUTES * 60))

log_info "Scheduling check in $MINUTES minutes"
log_info "Current time: $CURRENT_TIME"
log_info "Will run at: $RUN_TIME"

# =============================================================================
# SCHEDULE THE CHECK
# =============================================================================

# Create the command to run after delay
CHECK_COMMAND="Time for orchestrator check! cat \"$NEXT_CHECK_NOTE\" && python3 claude_control.py status detailed"

# Use nohup to completely detach the sleep process
# The command structure ensures proper escaping and error handling
nohup bash -c "
    sleep $SLEEP_SECONDS
    if tmux list-sessions -F '#{session_name}' 2>/dev/null | grep -q '^$SESSION\$'; then
        if tmux list-windows -t '$SESSION' -F '#{session_name}:#{window_index}' 2>/dev/null | grep -q '^$TARGET\$'; then
            tmux send-keys -t '$TARGET' '$CHECK_COMMAND'
            sleep 1
            tmux send-keys -t '$TARGET' Enter
        else
            echo '[ERROR] Target window $TARGET no longer exists' | logger -t orchestrator
        fi
    else
        echo '[ERROR] Target session $SESSION no longer exists' | logger -t orchestrator
    fi
" > /dev/null 2>&1 &

# Get the PID of the background process
SCHEDULE_PID=$!

# =============================================================================
# SUCCESS REPORTING
# =============================================================================

echo "✓ Scheduled successfully!"
echo "  Process ID: $SCHEDULE_PID"
echo "  Target: $TARGET"
echo "  Will run at: $RUN_DATE"
echo "  Note: \"$NOTE\""

# Log the scheduling event
{
    echo "$(date): Scheduled check for $TARGET in $MINUTES minutes (PID: $SCHEDULE_PID)"
    echo "  Note: $NOTE"
} >> "$LOGS_DIR/scheduler.log"

log_info "Check has been scheduled successfully"