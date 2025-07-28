#!/usr/bin/env python3
"""
Integrated Claude Auto-Responder for Tmux Orchestrator

This version can be enabled directly from the orchestrator configuration
and provides safer, more controlled automation than --dangerously-skip-permissions.
"""

import subprocess
import time
import re
import sys
import json
import os
import threading
from typing import List, Dict, Optional
from datetime import datetime

class IntegratedAutoResponder:
    """
    Integrated auto-responder that can be controlled by the orchestrator.
    
    Key differences from --dangerously-skip-permissions:
    - Maintains Claude's permission system
    - Only responds to specific confirmation prompts
    - Logs all responses for audit trail
    - Can be configured to skip dangerous operations
    - Granular control over what gets auto-confirmed
    """

    def __init__(self, config_path: str = "auto_responder_config.json", preset: str = "pm_orchestrator"):
        self.config_path = config_path
        self.preset = preset
        self.config = self.load_config()
        self.running = False
        self.response_log = []
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
    def load_config(self) -> Dict:
        """Load configuration from JSON file or generate from preset."""
        try:
            # Try to load from file first
            with open(self.config_path, 'r') as f:
                all_configs = json.load(f)

            # If file contains multiple presets, use the specified one
            if self.preset in all_configs:
                return all_configs[self.preset]
            # If file contains single config, use it directly
            elif "auto_responder" in all_configs:
                return all_configs
            else:
                print(f"⚠️  Preset '{self.preset}' not found in config file")
                return self.get_preset_config()

        except FileNotFoundError:
            print(f"⚠️  Config file {self.config_path} not found, using preset: {self.preset}")
            return self.get_preset_config()
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing config file: {e}")
            return self.get_preset_config()

    def get_preset_config(self) -> Dict:
        """Get configuration for the specified preset."""
        try:
            from permission_presets import get_preset
            return get_preset(self.preset)
        except ImportError:
            print(f"❌ Could not import permission_presets")
            return self.get_default_config()
        except ValueError as e:
            print(f"❌ {e}")
            return self.get_default_config()

    def get_default_config(self) -> Dict:
        """Return default configuration."""
        return {
            "auto_responder": {
                "enabled": False,
                "check_interval": 2.0,
                "response_delay": 0.5,
                "log_responses": True,
                "patterns": {
                    "confirmation_prompts": [
                        r"1\.\s*yes\s*2\.\s*no",
                        r"Confirm\?\s*\(yes/no\)",
                        r"Continue\?\s*\(y/n\)",
                        r"Proceed\?\s*\(yes/no\)"
                    ],
                    "skip_patterns": [
                        "delete", "remove", "rm -rf", "DROP TABLE", "DELETE FROM"
                    ]
                },
                "responses": {
                    "default": "1",
                    "yes_and_dont_ask": "2"
                }
            }
        }

    def is_enabled(self) -> bool:
        """Check if auto-responder is enabled in config."""
        return self.config.get("auto_responder", {}).get("enabled", False)

    def enable(self):
        """Enable auto-responder and save config."""
        if "auto_responder" not in self.config:
            self.config["auto_responder"] = {}
        self.config["auto_responder"]["enabled"] = True
        self.save_config()
        print("✅ Auto-responder enabled")

    def disable(self):
        """Disable auto-responder and save config."""
        if "auto_responder" not in self.config:
            self.config["auto_responder"] = {}
        self.config["auto_responder"]["enabled"] = False
        self.save_config()
        self.stop()
        print("❌ Auto-responder disabled")

    def save_config(self):
        """Save current configuration to file."""
        try:
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            print(f"❌ Error saving config: {e}")

    def get_session_windows(self, session_name: str) -> List[int]:
        """Get all windows in a tmux session."""
        try:
            cmd = ["tmux", "list-windows", "-t", session_name, "-F", "#{window_index}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return [int(w) for w in result.stdout.strip().split('\n') if w]
        except subprocess.CalledProcessError:
            return []

    def capture_window_content(self, session_name: str, window_index: int, lines: int = 20) -> str:
        """Capture content from a tmux window."""
        try:
            cmd = ["tmux", "capture-pane", "-t", f"{session_name}:{window_index}",
                   "-p", "-S", f"-{lines}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError:
            return ""

    def is_dangerous_operation(self, content: str) -> bool:
        """Check if the content contains dangerous operations that should be skipped."""
        safety_controls = self.config.get("auto_responder", {}).get("safety_controls", {})

        if not safety_controls.get("skip_dangerous_operations", True):
            return False

        dangerous_patterns = safety_controls.get("dangerous_patterns", [])
        manual_approval_patterns = safety_controls.get("require_manual_approval", [])

        # Check for dangerous operations
        for pattern in dangerous_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return True

        # Check for operations requiring manual approval
        for pattern in manual_approval_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return True

        return False

    def check_for_confirmation_prompt(self, session_name: str, window_index: int) -> Optional[Dict]:
        """Check if there's a confirmation prompt in the window with granular control."""
        content = self.capture_window_content(session_name, window_index)
        if not content:
            return None

        # Skip if dangerous operation detected
        if self.is_dangerous_operation(content):
            self.log_response(session_name, window_index, "SKIPPED", "Dangerous operation detected")
            return None

        # Check each granular control category
        granular_controls = self.config.get("auto_responder", {}).get("granular_controls", {})

        for category_name, category_config in granular_controls.items():
            # Skip if this category is disabled
            if not category_config.get("enabled", False):
                continue

            patterns = category_config.get("patterns", [])
            response = category_config.get("response", "1")

            for pattern in patterns:
                if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                    return {
                        "response": response,
                        "category": category_name,
                        "description": category_config.get("description", ""),
                        "pattern_matched": pattern
                    }

        return None

    def send_response(self, session_name: str, window_index: int, response: str) -> bool:
        """Send response using send-claude-message.sh if available, fallback to direct tmux."""
        send_script = os.path.join(self.script_dir, "send-claude-message.sh")
        target = f"{session_name}:{window_index}"
        
        try:
            if os.path.exists(send_script):
                # Use send-claude-message.sh for consistency
                cmd = [send_script, target, response]
                subprocess.run(cmd, check=True, capture_output=True)
                method = "send-claude-message.sh"
            else:
                # Fallback to direct tmux commands
                subprocess.run(["tmux", "send-keys", "-t", target, response])
                time.sleep(self.config.get("auto_responder", {}).get("response_delay", 0.5))
                subprocess.run(["tmux", "send-keys", "-t", target, "Enter"])
                method = "direct tmux"
            
            self.log_response(session_name, window_index, response, f"Success via {method}")
            return True
            
        except subprocess.CalledProcessError as e:
            self.log_response(session_name, window_index, response, f"Error: {e}")
            return False

    def log_response(self, session_name: str, window_index: int, response: str, status: str, category: str = "", description: str = ""):
        """Log auto-responder actions with granular details."""
        if not self.config.get("auto_responder", {}).get("log_responses", True):
            return

        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "session": session_name,
            "window": window_index,
            "response": response,
            "status": status,
            "category": category,
            "description": description
        }

        self.response_log.append(log_entry)
        category_info = f" [{category}]" if category else ""
        print(f"🤖 [{datetime.now().strftime('%H:%M:%S')}] {session_name}:{window_index}{category_info} → {response} ({status})")

    def monitor_session(self, session_name: str):
        """Monitor a single session for confirmation prompts."""
        check_interval = self.config.get("auto_responder", {}).get("check_interval", 2.0)
        
        while self.running and self.is_enabled():
            try:
                windows = self.get_session_windows(session_name)
                
                for window_index in windows:
                    if not self.running:
                        break

                    prompt_info = self.check_for_confirmation_prompt(session_name, window_index)
                    if prompt_info:
                        response = prompt_info["response"]
                        category = prompt_info["category"]
                        description = prompt_info["description"]

                        success = self.send_response(session_name, window_index, response)
                        if success:
                            self.log_response(session_name, window_index, response, "Auto-approved", category, description)
                
                time.sleep(check_interval)
                
            except Exception as e:
                print(f"❌ Error monitoring session {session_name}: {e}")
                time.sleep(check_interval)

    def start_for_session(self, session_name: str):
        """Start monitoring a specific session in a background thread."""
        if not self.is_enabled():
            print("❌ Auto-responder is disabled in config")
            return False
            
        self.running = True
        thread = threading.Thread(target=self.monitor_session, args=(session_name,), daemon=True)
        thread.start()
        print(f"🚀 Auto-responder started for session: {session_name}")
        return True

    def stop(self):
        """Stop the auto-responder."""
        self.running = False
        print("🛑 Auto-responder stopped")

    def enable_category(self, category: str):
        """Enable a specific approval category."""
        if "auto_responder" not in self.config:
            self.config["auto_responder"] = {}
        if "granular_controls" not in self.config["auto_responder"]:
            self.config["auto_responder"]["granular_controls"] = {}

        if category in self.config["auto_responder"]["granular_controls"]:
            self.config["auto_responder"]["granular_controls"][category]["enabled"] = True
            self.save_config()
            print(f"✅ Enabled auto-approval for: {category}")
            return True
        else:
            print(f"❌ Unknown category: {category}")
            return False

    def disable_category(self, category: str):
        """Disable a specific approval category."""
        if "auto_responder" not in self.config:
            self.config["auto_responder"] = {}
        if "granular_controls" not in self.config["auto_responder"]:
            self.config["auto_responder"]["granular_controls"] = {}

        if category in self.config["auto_responder"]["granular_controls"]:
            self.config["auto_responder"]["granular_controls"][category]["enabled"] = False
            self.save_config()
            print(f"❌ Disabled auto-approval for: {category}")
            return True
        else:
            print(f"❌ Unknown category: {category}")
            return False

    def list_categories(self) -> Dict:
        """List all available approval categories and their status."""
        granular_controls = self.config.get("auto_responder", {}).get("granular_controls", {})
        categories = {}

        for category, config in granular_controls.items():
            categories[category] = {
                "enabled": config.get("enabled", False),
                "description": config.get("description", ""),
                "patterns_count": len(config.get("patterns", []))
            }

        return categories

    def get_status(self) -> Dict:
        """Get current status and recent logs."""
        return {
            "enabled": self.is_enabled(),
            "running": self.running,
            "recent_responses": self.response_log[-10:],  # Last 10 responses
            "categories": self.list_categories(),
            "config": self.config.get("auto_responder", {})
        }

def main():
    """CLI interface for the integrated auto-responder."""
    if len(sys.argv) < 2:
        print("Integrated Claude Auto-Responder with Granular Controls")
        print("Usage:")
        print("  python3 integrated_auto_responder.py enable")
        print("  python3 integrated_auto_responder.py disable")
        print("  python3 integrated_auto_responder.py start <session_name> [preset]")
        print("  python3 integrated_auto_responder.py status [preset]")
        print("  python3 integrated_auto_responder.py categories [preset]")
        print("  python3 integrated_auto_responder.py enable-category <category> [preset]")
        print("  python3 integrated_auto_responder.py disable-category <category> [preset]")
        print("")
        print("Available categories:")
        print("  file_operations      - File creation, editing, saving")
        print("  command_execution    - Shell commands and script execution")
        print("  general_confirmations - General yes/no confirmations")
        print("  persistent_choices   - Yes and don't ask again options")
        print("  continue_operations  - Continue with current operation")
        print("  package_management   - Package installations and updates")
        print("  git_operations       - Git commits, pushes, and repository operations")
        sys.exit(1)

    responder = IntegratedAutoResponder()
    command = sys.argv[1]

    if command == "enable":
        responder.enable()
    elif command == "disable":
        responder.disable()
    elif command == "start" and len(sys.argv) > 2:
        session_name = sys.argv[2]
        preset = sys.argv[3] if len(sys.argv) > 3 else "pm_orchestrator"

        # Create responder with specific preset
        responder = IntegratedAutoResponder(preset=preset)

        if responder.start_for_session(session_name):
            try:
                while responder.running:
                    time.sleep(1)
            except KeyboardInterrupt:
                responder.stop()
    elif command == "status":
        status = responder.get_status()
        print(json.dumps(status, indent=2))
    elif command == "categories":
        categories = responder.list_categories()
        print("📋 Auto-Approval Categories:")
        for category, info in categories.items():
            status = "✅ ENABLED" if info["enabled"] else "❌ DISABLED"
            print(f"  {category}: {status}")
            print(f"    Description: {info['description']}")
            print(f"    Patterns: {info['patterns_count']}")
            print()
    elif command == "enable-category" and len(sys.argv) > 2:
        category = sys.argv[2]
        responder.enable_category(category)
    elif command == "disable-category" and len(sys.argv) > 2:
        category = sys.argv[2]
        responder.disable_category(category)
    else:
        print("❌ Invalid command")
        sys.exit(1)

if __name__ == "__main__":
    main()
