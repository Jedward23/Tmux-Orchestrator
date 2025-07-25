#!/bin/bash

# Send message to Claude agent in tmux window
# Usage: send-claude-message.sh <session:window> <message>
#
# Examples:
#   send-claude-message.sh agentic-seek:3 "Hello Claude!"
#   send-claude-message.sh tmux-orc:0.1 "Status update please"

set -euo pipefail

# Source configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$SCRIPT_DIR/config.sh" ]]; then
    echo "[ERROR] Configuration file not found: $SCRIPT_DIR/config.sh" >&2
    echo "Please run setup.sh first or ensure config.sh exists." >&2
    exit 1
fi

# Load config in setup mode to avoid validation issues
export ORCHESTRATOR_SETUP_MODE=true
source "$SCRIPT_DIR/config.sh"
unset ORCHESTRATOR_SETUP_MODE

# =============================================================================
# INPUT VALIDATION
# =============================================================================

show_usage() {
    cat << EOF
Usage: $0 <target> <message>

Arguments:
  target  : Tmux target (session:window or session:window.pane)
  message : Message to send to Claude

Examples:
  $0 agentic-seek:3 "Hello Claude!"
  $0 tmux-orc:0.1 "Status update please"
  $0 my-project:0 "Please check the database connection"

Note: Message will be sent followed by Enter key after 0.5s delay
EOF
}

# Check arguments
if [[ $# -lt 2 ]]; then
    echo "[ERROR] Insufficient arguments" >&2
    show_usage
    exit 1
fi

TARGET="$1"
shift  # Remove first argument, rest becomes the message
MESSAGE="$*"

# Validate target format
if ! validate_tmux_target "$TARGET"; then
    exit 1
fi

# Validate message is not empty
if [[ -z "$MESSAGE" ]]; then
    log_error "Message cannot be empty"
    exit 1
fi

# Check message length (reasonable limit)
if [[ ${#MESSAGE} -gt 2000 ]]; then
    log_warn "Message is very long (${#MESSAGE} characters). Consider breaking it up."
fi

# =============================================================================
# TMUX VALIDATION
# =============================================================================

# Check if tmux is available
if ! command -v tmux >/dev/null 2>&1; then
    log_error "tmux is not installed or not in PATH"
    exit 1
fi

# Check if tmux server is running
if ! tmux info >/dev/null 2>&1; then
    log_error "tmux server is not running. Start tmux first."
    exit 1
fi

# Extract session from target
SESSION="${TARGET%:*}"

# Check if target session exists
if ! tmux_session_exists "$SESSION"; then
    log_error "Tmux session '$SESSION' does not exist"
    echo "Available sessions:" >&2
    tmux list-sessions -F "  #{session_name}" 2>/dev/null || echo "  (no sessions)" >&2
    exit 1
fi

# Check if target window/pane exists
if ! tmux_window_exists "${TARGET%.*}"; then
    log_error "Tmux window '${TARGET%.*}' does not exist"
    echo "Available windows in session '$SESSION':" >&2
    tmux list-windows -t "$SESSION" -F "  #{session_name}:#{window_index} (#{window_name})" 2>/dev/null
    exit 1
fi

# =============================================================================
# SEND MESSAGE
# =============================================================================

log_info "Sending message to $TARGET"
log_info "Message: $MESSAGE"

# Send the message
if ! tmux send-keys -t "$TARGET" "$MESSAGE"; then
    log_error "Failed to send message to $TARGET"
    exit 1
fi

# Wait for UI to register the message
sleep 0.5

# Send Enter to submit
if ! tmux send-keys -t "$TARGET" Enter; then
    log_error "Failed to send Enter key to $TARGET"
    exit 1
fi

# =============================================================================
# SUCCESS REPORTING AND LOGGING
# =============================================================================

echo "✓ Message sent successfully to $TARGET"

# Log the message (truncate if too long for log)
LOG_MESSAGE="$MESSAGE"
if [[ ${#LOG_MESSAGE} -gt 200 ]]; then
    LOG_MESSAGE="${MESSAGE:0:200}... [truncated]"
fi

{
    echo "$(date): Message sent to $TARGET"
    echo "  User: $(whoami)"
    echo "  Message: $LOG_MESSAGE"
    echo ""
} >> "$LOGS_DIR/messages.log"

log_info "Message delivery completed successfully"