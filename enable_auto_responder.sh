#!/bin/bash
#
# Enable Auto-Responder for Current Tmux Session
# 
# This script automatically sets up the Claude auto-responder for the current
# tmux session using predefined permission presets.
#
# Usage: ./enable_auto_responder.sh [preset_name]
# Example: ./enable_auto_responder.sh pm_orchestrator
#

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRESET_NAME=${1:-"pm_orchestrator"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Claude Auto-Responder Setup${NC}"
echo "=================================="

# Get current tmux session info
if [ -z "$TMUX" ]; then
    echo -e "${RED}❌ Error: Not running inside a tmux session${NC}"
    echo "Please run this script from within a tmux session"
    exit 1
fi

CURRENT_SESSION=$(tmux display-message -p "#{session_name}")
CURRENT_WINDOW=$(tmux display-message -p "#{window_index}")
CURRENT_PANE=$(tmux display-message -p "#{pane_index}")

echo -e "${GREEN}📍 Current Location:${NC}"
echo "   Session: $CURRENT_SESSION"
echo "   Window: $CURRENT_WINDOW"
echo "   Pane: $CURRENT_PANE"
echo

# Check if preset exists
echo -e "${BLUE}🎯 Setting up preset: $PRESET_NAME${NC}"

if ! python3 "$SCRIPT_DIR/permission_presets.py" "$PRESET_NAME" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Unknown preset '$PRESET_NAME'${NC}"
    echo
    echo -e "${YELLOW}Available presets:${NC}"
    python3 "$SCRIPT_DIR/permission_presets.py"
    exit 1
fi

# Generate session-specific configuration file
CONFIG_FILE="$SCRIPT_DIR/auto_responder_config_${CURRENT_SESSION}.json"
echo -e "${BLUE}📝 Generating session-specific configuration...${NC}"
echo "   Config file: $CONFIG_FILE"

python3 "$SCRIPT_DIR/permission_presets.py" "$PRESET_NAME" > "$CONFIG_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration saved to: $CONFIG_FILE${NC}"
else
    echo -e "${RED}❌ Error generating configuration${NC}"
    exit 1
fi

# Show what will be enabled
echo
echo -e "${YELLOW}🎛️  Preset Configuration:${NC}"
case "$PRESET_NAME" in
    "safe_development")
        echo "   ✅ File operations (safe for coding)"
        echo "   ✅ General confirmations"
        echo "   ✅ Continue operations"
        echo "   ❌ Command execution (manual control)"
        echo "   ❌ Git operations (manual control)"
        echo "   ❌ Package management (manual control)"
        echo "   🛡️  Risk Level: LOW"
        ;;
    "autonomous_agent")
        echo "   ✅ File operations"
        echo "   ✅ Command execution"
        echo "   ✅ General confirmations"
        echo "   ✅ Persistent choices (don't ask again)"
        echo "   ✅ Continue operations"
        echo "   ✅ Package management"
        echo "   ❌ Git operations (manual for safety)"
        echo "   ⚠️  Risk Level: MEDIUM"
        ;;
    "conservative")
        echo "   ✅ General confirmations only"
        echo "   ❌ Everything else disabled"
        echo "   🔒 Risk Level: VERY LOW"
        ;;
    "pm_orchestrator")
        echo "   ✅ File operations (documentation)"
        echo "   ✅ General confirmations"
        echo "   ✅ Continue operations"
        echo "   ❌ Command execution (PMs don't code)"
        echo "   ❌ Git operations (oversight only)"
        echo "   ❌ Package management (developers handle)"
        echo "   🛡️  Risk Level: LOW-MEDIUM"
        ;;
esac

echo
echo -e "${YELLOW}🛡️  Safety Features Always Active:${NC}"
echo "   • Blocks dangerous operations (delete, rm -rf, etc.)"
echo "   • Requires manual approval for production operations"
echo "   • Complete audit trail of all responses"
echo "   • Can be stopped anytime with Ctrl+C"

# Auto-proceed without confirmation for automation
echo
echo -e "${GREEN}🚀 Proceeding with automatic setup...${NC}"

# Create auto-responder window
echo -e "${BLUE}🔧 Setting up auto-responder window...${NC}"

RESPONDER_WINDOW="Auto-Responder-${PRESET_NAME}"

# Check if auto-responder window already exists and kill it automatically
if tmux list-windows -t "$CURRENT_SESSION" -F "#{window_name}" | grep -q "^$RESPONDER_WINDOW$"; then
    echo -e "${YELLOW}⚠️  Auto-responder window already exists - killing and recreating${NC}"
    tmux kill-window -t "$CURRENT_SESSION:$RESPONDER_WINDOW" 2>/dev/null || true
    sleep 1
fi

# Create new auto-responder window
tmux new-window -t "$CURRENT_SESSION" -n "$RESPONDER_WINDOW" -d

# Start the auto-responder in the new window
echo -e "${BLUE}🚀 Starting auto-responder...${NC}"

# Check if integrated_auto_responder.py exists
if [ ! -f "$SCRIPT_DIR/integrated_auto_responder.py" ]; then
    echo -e "${RED}❌ Error: integrated_auto_responder.py not found${NC}"
    echo "Expected location: $SCRIPT_DIR/integrated_auto_responder.py"
    exit 1
fi

tmux send-keys -t "$CURRENT_SESSION:$RESPONDER_WINDOW" "cd '$SCRIPT_DIR'" Enter
tmux send-keys -t "$CURRENT_SESSION:$RESPONDER_WINDOW" "python3 integrated_auto_responder.py start '$CURRENT_SESSION' '$PRESET_NAME'" Enter

# Wait for startup and check multiple times
echo -e "${BLUE}⏳ Waiting for auto-responder to start...${NC}"
sleep 3

# Check if it's running (try multiple patterns)
RESPONDER_OUTPUT=$(tmux capture-pane -t "$CURRENT_SESSION:$RESPONDER_WINDOW" -p)

if echo "$RESPONDER_OUTPUT" | grep -q -E "(Auto-responder started|🚀.*started|Monitoring.*session)"; then
    echo -e "${GREEN}✅ Auto-responder successfully started!${NC}"
elif echo "$RESPONDER_OUTPUT" | grep -q -E "(Error|❌|Traceback|Exception)"; then
    echo -e "${RED}❌ Error detected in auto-responder:${NC}"
    echo "$RESPONDER_OUTPUT"
    echo -e "${YELLOW}💡 Try running manually: tmux select-window -t $CURRENT_SESSION:$RESPONDER_WINDOW${NC}"
else
    echo -e "${YELLOW}⚠️  Auto-responder status unclear. Check the window manually.${NC}"
    echo -e "${BLUE}Output:${NC}"
    echo "$RESPONDER_OUTPUT"
fi

echo
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================================="
echo -e "${GREEN}✅ Auto-responder is now monitoring session: $CURRENT_SESSION${NC}"
echo -e "${GREEN}✅ Using preset: $PRESET_NAME${NC}"
echo -e "${GREEN}✅ Configuration: $CONFIG_FILE${NC}"
echo
echo -e "${BLUE}📋 Management Commands:${NC}"
echo "   View status:     tmux select-window -t $CURRENT_SESSION:$RESPONDER_WINDOW"
echo "   Stop responder:  tmux kill-window -t $CURRENT_SESSION:$RESPONDER_WINDOW"
echo "   View logs:       python3 integrated_auto_responder.py status"
echo
echo -e "${BLUE}🔧 Customization:${NC}"
echo "   Edit config:     nano $CONFIG_FILE"
echo "   Change preset:   ./enable_auto_responder.sh <preset_name>"
echo "   Available presets: safe_development, autonomous_agent, conservative, pm_orchestrator"
echo
echo -e "${YELLOW}💡 Pro Tip for PMs:${NC}"
echo "   Add this to your PM startup routine:"
echo "   ${GREEN}./enable_auto_responder.sh pm_orchestrator${NC}"
echo
echo -e "${BLUE}🛡️  Remember: This is MUCH safer than --dangerously-skip-permissions${NC}"
echo "   • Maintains Claude's permission system"
echo "   • Granular control over what gets approved"
echo "   • Safety controls prevent dangerous operations"
echo "   • Complete audit trail"

# Return to original window
tmux select-window -t "$CURRENT_SESSION:$CURRENT_WINDOW"

echo
echo -e "${GREEN}Ready! Your Claude session is now semi-automated. 🚀${NC}"
