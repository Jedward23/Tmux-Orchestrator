#!/bin/bash

# Create agent session and automatically open monitoring window
# Usage: ./create_agent_with_monitor.sh <project_name> <agent_role> [orchestrator_session]
#
# Examples:
#   ./create_agent_with_monitor.sh frontend "Frontend Developer" tmux-orc
#   ./create_agent_with_monitor.sh backend "Backend Engineer" 

set -euo pipefail

# Source configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

show_usage() {
    cat << EOF
Usage: $0 <project_name> <agent_role> [orchestrator_session]

Arguments:
  project_name        : Name of the project (will be used as session name)
  agent_role         : Role description for the agent (e.g., "Frontend Developer")
  orchestrator_session: Session to create monitor window in (default: current session)

Examples:
  $0 frontend "Frontend Developer" tmux-orc
  $0 backend "Backend Engineer"
  $0 mobile-app "Mobile Developer" orchestrator
EOF
}

if [[ $# -lt 2 || $# -gt 3 ]]; then
    echo "[ERROR] Invalid number of arguments" >&2
    show_usage
    exit 1
fi

PROJECT_NAME="$1"
AGENT_ROLE="$2"
ORCHESTRATOR_SESSION="${3:-$(tmux display-message -p '#{session_name}' 2>/dev/null || echo 'tmux-orc')}"

# Validate project exists
PROJECT_PATH="$PROJECTS_DIR/$PROJECT_NAME"
if [[ ! -d "$PROJECT_PATH" ]]; then
    echo "[ERROR] Project directory not found: $PROJECT_PATH" >&2
    echo "Available projects in $PROJECTS_DIR:" >&2
    ls -la "$PROJECTS_DIR" | grep "^d" | awk '{print "  " $NF}' | grep -v "^\.$" | grep -v "^\.\.$"
    exit 1
fi

echo "Creating agent session for project: $PROJECT_NAME"
echo "Agent role: $AGENT_ROLE"
echo "Project path: $PROJECT_PATH"

# 1. Create agent session
echo "Creating tmux session: $PROJECT_NAME"
tmux new-session -d -s "$PROJECT_NAME" -c "$PROJECT_PATH"

# 2. Set up standard windows
tmux rename-window -t "$PROJECT_NAME:0" "Claude-Agent"
tmux new-window -t "$PROJECT_NAME" -n "Shell" -c "$PROJECT_PATH"
tmux new-window -t "$PROJECT_NAME" -n "Dev-Server" -c "$PROJECT_PATH"

# 3. Start Claude agent
echo "Starting Claude agent..."
tmux send-keys -t "$PROJECT_NAME:0" "claude --dangerously-skip-permissions" Enter
sleep 2
tmux send-keys -t "$PROJECT_NAME:0" "2" Enter  # Accept responsibility
sleep 3

# 4. Brief the agent using send-claude-message.sh script for reliability
BRIEFING_FILE=$(mktemp)
cat > "$BRIEFING_FILE" << 'EOF'
You are a {AGENT_ROLE} for the {PROJECT_NAME} project with the expertise of a Senior Principal Engineer. Your responsibilities:

## 🚨 CRITICAL: VERIFICATION REQUIREMENTS (ABSOLUTE PRIORITY)
**NEVER assume tasks are complete without verification - this could be hallucination**:
- DO NOT claim tasks are done without testing the actual functionality
- ALWAYS run the app and verify features work as requested
- Take screenshots as proof of working functionality
- Check console/logs for errors you may have missed
- Use the verification checklist format for all task completions
- If verification fails, the task is NOT complete regardless of code changes

## 🎯 CRITICAL: SCOPE CONTROL (MANDATORY)
**Do ONLY what's asked - nothing more, nothing less**:
- If asked to fix a bug, ONLY fix that specific bug
- DO NOT refactor, optimize, or improve unrelated code
- DO NOT add features, logging, or enhancements unless explicitly requested
- Make minimal changes to achieve the requested outcome
- ASK before expanding scope or fixing related issues you discover
- Touch as few files and lines as possible

## Code Quality Standards (CRITICAL):
1. **Read Project Documentation First**:
   - Check for CLAUDE.md file in project root and follow all guidelines
   - Look for .cursor/rules file and respect all coding rules
   - Review any README.md or CONTRIBUTING.md for project-specific conventions
   - Study any existing documentation about architecture and patterns

2. **Follow Existing Patterns**: Study the existing codebase thoroughly and match:
   - Code style and formatting conventions
   - Architecture patterns and project structure
   - Naming conventions for files, functions, and variables
   - Import/export patterns and module organization
   - Error handling approaches used in the project

3. **Senior Engineering Practices**:
   - Write clean, readable, maintainable code
   - Add comprehensive error handling and input validation ONLY when requested
   - Include meaningful comments for complex logic ONLY when requested
   - Follow SOLID principles and established design patterns
   - Ensure code is testable and follows DRY principles
   - Consider performance implications and edge cases

4. **Design Implementation (Frontend Projects)**:
   - If provided a Figma link, use the figma-mcp tools to extract design specs
   - Download images and assets using mcp__figma-mcp__download_figma_images
   - Get layout and component data using mcp__figma-mcp__get_figma_data
   - Match design specifications exactly - pixel-perfect implementation

5. **Frontend Verification**:
   - Use playwright-mcp tools to verify frontend changes work correctly
   - Take screenshots to compare against designs
   - Test user interactions and workflows
   - Validate responsive behavior across different screen sizes
   - **DEBUGGING SLOW APPS**: If app takes too long to load, use browser console AND screenshots to debug - check console logs immediately and at 5s/15s intervals for JavaScript errors, network failures, and loading issues

## Operational Duties:
6. Analyze the project structure and understand the full technology stack
7. Get the development server running in the Dev-Server window
8. Check for GitHub issues and work on highest priority tasks
9. Report progress to the orchestrator every 30 minutes
10. Follow git discipline - commit regularly with meaningful commit messages

Project path: {PROJECT_PATH}

**CRITICAL BEFORE EVERY TASK**: 
1. ALWAYS verify you're in the correct projects directory by running: echo $PROJECTS_DIR && pwd
2. FIRST, check if there's a CLAUDE.md file in the project root - read it completely and follow all instructions
3. NEXT, look for .cursor/rules file and respect all coding rules specified
4. THEN, spend time studying the existing codebase to understand patterns, conventions, and architecture
5. Your code should feel like it was written by the same team that built the existing system
6. MOST IMPORTANT: Stay strictly within assigned task scope - no unauthorized improvements

Start by checking for project documentation (CLAUDE.md, .cursor/rules), look for a 'playbooks' directory with navigation logic, then examining the technology stack and getting the development server running.
EOF

# Replace placeholders (cross-platform sed)
if sed --version >/dev/null 2>&1; then
    # GNU sed (Linux)
    sed -i "s/{AGENT_ROLE}/$AGENT_ROLE/g" "$BRIEFING_FILE"
    sed -i "s/{PROJECT_NAME}/$PROJECT_NAME/g" "$BRIEFING_FILE"
    sed -i "s|{PROJECT_PATH}|$PROJECT_PATH|g" "$BRIEFING_FILE"
else
    # BSD sed (macOS)
    sed -i '' "s/{AGENT_ROLE}/$AGENT_ROLE/g" "$BRIEFING_FILE"
    sed -i '' "s/{PROJECT_NAME}/$PROJECT_NAME/g" "$BRIEFING_FILE"
    sed -i '' "s|{PROJECT_PATH}|$PROJECT_PATH|g" "$BRIEFING_FILE"
fi

BRIEFING=$(cat "$BRIEFING_FILE")
rm "$BRIEFING_FILE"

echo "Briefing agent..."
# Use send-claude-message.sh script for reliable message delivery
if [[ -f "$SCRIPT_DIR/send-claude-message.sh" ]]; then
    "$SCRIPT_DIR/send-claude-message.sh" "$PROJECT_NAME:0" "$BRIEFING"
else
    # Fallback to direct tmux commands if script not available
    tmux send-keys -t "$PROJECT_NAME:0" "$BRIEFING"
    sleep 0.5
    tmux send-keys -t "$PROJECT_NAME:0" Enter
fi

# 5. Create monitoring window in orchestrator session
echo "Creating monitor window in session: $ORCHESTRATOR_SESSION"
if tmux has-session -t "$ORCHESTRATOR_SESSION" 2>/dev/null; then
    tmux new-window -t "$ORCHESTRATOR_SESSION" -n "Monitor-$PROJECT_NAME" \
        "echo 'Monitoring $AGENT_ROLE for $PROJECT_NAME'; echo 'Session: $PROJECT_NAME:0'; echo ''; tmux attach-session -t $PROJECT_NAME"
    
    echo "✓ Agent deployed successfully!"
    echo "  Agent session: $PROJECT_NAME"
    echo "  Monitor window: $ORCHESTRATOR_SESSION:Monitor-$PROJECT_NAME"
    echo "  Agent role: $AGENT_ROLE"
else
    echo "[WARNING] Orchestrator session '$ORCHESTRATOR_SESSION' not found"
    echo "Agent created but no monitor window added"
    echo "You can manually monitor with: tmux attach-session -t $PROJECT_NAME"
fi

echo ""
echo "Next steps:"
echo "1. Switch to monitor window to observe agent"
echo "2. Set up regular check-ins:"

# Provide scheduling command with proper window validation
if tmux list-windows -t "$ORCHESTRATOR_SESSION" -F "#{session_name}:#{window_index}" 2>/dev/null | grep -q "^$ORCHESTRATOR_SESSION:0$"; then
    echo "   ./schedule_with_note.sh 30 'Check $PROJECT_NAME agent progress' '$ORCHESTRATOR_SESSION:0'"
else
    echo "   First find your orchestrator window with: tmux list-windows -t $ORCHESTRATOR_SESSION"
    echo "   Then run: ./schedule_with_note.sh 30 'Check $PROJECT_NAME agent progress' '<correct_window>'"
fi