---
description: Enable Claude auto-responder with preset configurations
allowedTools: ["Bash"]
---

I want to enable the Claude auto-responder for this tmux session.

**Arguments:** $ARGUMENTS

Parse the arguments to identify the preset type:
- If no arguments: Use pm_orchestrator preset (default)
- If "pm": Use pm_orchestrator preset
- If "safe" or "dev": Use safe_development preset
- If "auto" or "autonomous": Use autonomous_agent preset
- If "conservative": Use conservative preset

**Immediately run the setup command:**

```bash
./enable_auto_responder.sh [preset_name]
```

**Preset Explanations:**

🎯 **pm_orchestrator** (default for PMs):
- ✅ File operations (documentation, reports)
- ✅ General confirmations (workflow)
- ✅ Continue operations (task flow)
- ❌ Command execution (developers handle)
- ❌ Git operations (oversight only)
- ❌ Package management (technical team)
- 🛡️ Risk: LOW-MEDIUM

🔧 **safe_development** (for developers):
- ✅ File operations (coding)
- ✅ General confirmations
- ✅ Continue operations
- ❌ Command execution (manual control)
- ❌ Git operations (manual control)
- ❌ Package management (manual control)
- 🛡️ Risk: LOW

🚀 **autonomous_agent** (full automation):
- ✅ File operations
- ✅ Command execution
- ✅ General confirmations
- ✅ Package management
- ❌ Git operations (safety)
- ⚠️ Risk: MEDIUM

🔒 **conservative** (minimal automation):
- ✅ General confirmations only
- ❌ Everything else manual
- 🛡️ Risk: VERY LOW

**After setup, explain:**
1. What was enabled/disabled
2. How this is safer than --dangerously-skip-permissions
3. How to stop it (kill Auto-Responder window)
4. How to check status

**Key Benefits:**
- Maintains Claude's permission system
- Granular control vs all-or-nothing
- Safety controls prevent dangerous operations
- Complete audit trail
- Can be stopped anytime

# Usage Examples:
# /enable-auto
# /enable-auto pm
# /enable-auto safe
# /enable-auto autonomous
# /enable-auto conservative

# PM + Engineer Workflow Example:
# PM: /enable-auto pm
# PM: "You are a project manager, create an engineer in window 2 and say him:
#      '/enable-auto conservative' and after say him create denofresh default
#      project for now, schedule in 10 minutes to check engineer progress"
