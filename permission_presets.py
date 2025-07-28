#!/usr/bin/env python3
"""
Permission Presets for Claude Auto-Responder

Unified configuration system where each permission specifies which presets include it.
No code duplication - much cleaner and easier to maintain.
"""

# 🎯 UNIFIED CONFIGURATION - Each permission lists which presets enable it

# 🎛️ GRANULAR CONTROLS CONFIGURATION
# Each control specifies which presets enable it
GRANULAR_CONTROLS = {
    "file_operations": {
        "description": "File creation, editing, saving",
        "patterns": [
            "Apply these changes\\?",
            "Save file\\?",
            "Create file\\?",
            "Overwrite file\\?",
            "Write to file\\?"
        ],
        "response": "1",
        "enabled_in": ["pm_orchestrator", "safe_development", "autonomous_agent"]
    },
    "command_execution": {
        "description": "Shell commands and script execution",
        "patterns": [
            "Execute this command\\?",
            "Run this script\\?",
            "Execute in terminal\\?",
            "Run command\\?"
        ],
        "response": "1",
        "enabled_in": ["autonomous_agent"]
    },
    "general_confirmations": {
        "description": "General yes/no confirmations",
        "patterns": [
            "1\\. yes\\s*2\\. no",
            "Confirm\\?\\s*\\(yes/no\\)",
            "Continue\\?\\s*\\(y/n\\)",
            "Proceed\\?\\s*\\(yes/no\\)"
        ],
        "response": "1",
        "enabled_in": ["pm_orchestrator", "safe_development", "conservative", "autonomous_agent"]
    },
    "persistent_choices": {
        "description": "Yes and don't ask again options",
        "patterns": [
            "1\\. yes\\s*2\\. yes and don't ask again\\s*3\\. no"
        ],
        "response": "2",
        "enabled_in": ["autonomous_agent"]
    },
    "continue_operations": {
        "description": "Continue with current operation",
        "patterns": [
            "Do you want to continue\\?",
            "Do you want to proceed\\?",
            "Continue with this action\\?"
        ],
        "response": "1",
        "enabled_in": ["pm_orchestrator", "safe_development", "autonomous_agent"]
    },
    "package_management": {
        "description": "Package installations and updates",
        "patterns": [
            "Install package\\?",
            "Update dependencies\\?",
            "Add to package\\.json\\?",
            "Install npm package\\?"
        ],
        "response": "1",
        "enabled_in": ["autonomous_agent"]
    },
    "git_operations": {
        "description": "Git commits, pushes, and repository operations",
        "patterns": [
            "Commit changes\\?",
            "Push to repository\\?",
            "Create branch\\?",
            "Merge branch\\?"
        ],
        "response": "1",
        "enabled_in": []  # Disabled in all presets for safety
    }
}

# 🛡️ SAFETY CONTROLS CONFIGURATION
SAFETY_CONTROLS = {
    "skip_dangerous_operations": True,
    "dangerous_patterns": [
        "delete", "remove", "rm -rf", "DROP TABLE", "DELETE FROM",
        "truncate", "format", "destroy", "purge"
    ],
    "require_manual_approval": [
        "production", "prod", "live", "master", "main branch"
    ]
}

# 📋 PRESET METADATA
PRESET_INFO = {
    "pm_orchestrator": {
        "description": "PM Orchestrator Preset",
        "perfect_for": "Project management, team coordination, oversight",
        "risk_level": "LOW-MEDIUM ⚠️",
        "check_interval": 2.0,
        "response_delay": 0.5
    },
    "safe_development": {
        "description": "Safe Development Preset",
        "perfect_for": "Daily coding, file editing, basic development",
        "risk_level": "LOW ✅",
        "check_interval": 2.0,
        "response_delay": 0.5
    },
    "conservative": {
        "description": "Conservative Preset",
        "perfect_for": "Learning, testing, high-security environments",
        "risk_level": "VERY LOW 🔒",
        "check_interval": 3.0,
        "response_delay": 1.0
    },
    "autonomous_agent": {
        "description": "Autonomous Agent Preset",
        "perfect_for": "Overnight development, autonomous agents, CI/CD",
        "risk_level": "MEDIUM ⚠️",
        "check_interval": 1.5,
        "response_delay": 0.3
    }
}

def generate_preset_config(preset_name):
    """Generate configuration for a specific preset."""
    if preset_name not in PRESET_INFO:
        available = ", ".join(PRESET_INFO.keys())
        raise ValueError(f"Unknown preset '{preset_name}'. Available: {available}")

    preset_info = PRESET_INFO[preset_name]

    # Generate granular controls for this preset
    granular_controls = {}
    for control_name, control_config in GRANULAR_CONTROLS.items():
        enabled = preset_name in control_config["enabled_in"]
        granular_controls[control_name] = {
            "enabled": enabled,
            "description": control_config["description"],
            "patterns": control_config["patterns"],
            "response": control_config["response"]
        }
    return {
        "auto_responder": {
            "enabled": True,
            "check_interval": preset_info["check_interval"],
            "response_delay": preset_info["response_delay"],
            "log_responses": True,
            "granular_controls": granular_controls,
            "safety_controls": SAFETY_CONTROLS
        }
    }

# 🎯 LEGACY FUNCTIONS (for backward compatibility)
def safe_development():
    """Safe Development Preset - Perfect for: Daily coding, file editing, basic development - Risk Level: LOW ✅"""
    return generate_preset_config("safe_development")

def autonomous_agent():
    """Autonomous Agent Preset - Perfect for: Overnight development, autonomous agents, CI/CD - Risk Level: MEDIUM ⚠️"""
    return generate_preset_config("autonomous_agent")

def conservative():
    """Conservative Preset - Perfect for: Learning, testing, high-security environments - Risk Level: VERY LOW 🔒"""
    return generate_preset_config("conservative")

def pm_orchestrator():
    """PM Orchestrator Preset - Perfect for: Project management, team coordination, oversight - Risk Level: LOW-MEDIUM ⚠️"""
    return generate_preset_config("pm_orchestrator")

# 🎯 PRESET REGISTRY
PRESETS = {
    "safe_development": safe_development,
    "autonomous_agent": autonomous_agent,
    "conservative": conservative,
    "pm_orchestrator": pm_orchestrator
}

def get_preset(name):
    """Get a preset configuration by name."""
    if name in PRESETS:
        return PRESETS[name]()
    else:
        return generate_preset_config(name)

def list_presets():
    """List all available presets with descriptions."""
    print("🎯 Available Permission Presets:")
    print("=" * 40)

    for name, info in PRESET_INFO.items():
        print(f"\n📋 {name}")
        print(f"   {info['description']}")
        print(f"   Perfect for: {info['perfect_for']}")
        print(f"   Risk Level: {info['risk_level']}")

        # Show what's enabled
        enabled_controls = []
        for control_name, control_config in GRANULAR_CONTROLS.items():
            if name in control_config["enabled_in"]:
                enabled_controls.append(control_name)

        if enabled_controls:
            print(f"   ✅ Enabled: {', '.join(enabled_controls)}")
        else:
            print(f"   ✅ Enabled: general_confirmations only")

if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) < 2:
        list_presets()
        print(f"\nUsage: python3 {sys.argv[0]} <preset_name>")
        print("Example: python3 permission_presets.py safe_development")
        sys.exit(1)

    preset_name = sys.argv[1]
    try:
        config = get_preset(preset_name)
        print(json.dumps(config, indent=2))
    except ValueError as e:
        print(f"❌ {e}")
        sys.exit(1)


