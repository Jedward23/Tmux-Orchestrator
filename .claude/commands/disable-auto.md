---
description: Disable Claude auto-responder for current session
allowedTools: ["Bash"]
---

I want to disable the Claude auto-responder for this tmux session.

**Immediately run:**

```bash
# Get current session name
CURRENT_SESSION=$(tmux display-message -p "#{session_name}")

# Kill the auto-responder window
tmux kill-window -t "$CURRENT_SESSION:Auto-Responder" 2>/dev/null || echo "Auto-responder was not running"

# Show status
echo "✅ Auto-responder disabled for session: $CURRENT_SESSION"
```

**Then explain:**
1. Auto-responder has been stopped
2. All future prompts will require manual approval
3. How to re-enable if needed (/enable-auto)
4. Current session is back to full manual control

**Manual Control Restored:**
- All file operations require confirmation
- All commands require confirmation  
- All git operations require confirmation
- Maximum security, manual oversight

**To re-enable:** Use `/enable-auto [preset]`

# Usage:
# /disable-auto
