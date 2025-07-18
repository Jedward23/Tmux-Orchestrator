#!/usr/bin/env python3
"""
Claude Auto-Responder for Tmux Sessions

Automatically responds to Claude's confirmation prompts in tmux sessions.
Monitors all windows in a session and responds with appropriate confirmations.
"""

import subprocess
import time
import re
import sys
from typing import List, Dict

class ClaudeAutoResponder:
    """Automatically responds to Claude confirmation prompts in tmux sessions."""

    def __init__(self, session_name: str):
        self.session_name = session_name
        self.running = True

        # Patterns that indicate Claude is asking for confirmation
        self.question_patterns = [
            r"1\.\s*yes\s*2\.\s*no",
            r"1\.\s*yes\s*2\.\s*yes and don't ask again\s*3\.\s*no",
            r"Confirm\?\s*\(yes/no\)",
            r"Continue\?\s*\(y/n\)",
            r"Proceed\?\s*\(yes/no\)",
            r"Do you want to continue\?",
            r"Do you want to proceed\?",
            r"Apply these changes\?",
            r"Execute this command\?"
        ]
    
    def get_session_windows(self) -> List[int]:
        """Get all windows in the tmux session."""
        try:
            cmd = ["tmux", "list-windows", "-t", self.session_name, "-F", "#{window_index}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return [int(w) for w in result.stdout.strip().split('\n') if w]
        except subprocess.CalledProcessError:
            return []

    def capture_window_content(self, window_index: int, lines: int = 20) -> str:
        """Capture content from a tmux window."""
        try:
            cmd = ["tmux", "capture-pane", "-t", f"{self.session_name}:{window_index}",
                   "-p", "-S", f"-{lines}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError:
            return ""

    def send_response(self, window_index: int, response: str = "1"):
        """Send automatic response to a tmux window."""
        try:
            subprocess.run(["tmux", "send-keys", "-t", f"{self.session_name}:{window_index}", response])
            time.sleep(0.5)
            subprocess.run(["tmux", "send-keys", "-t", f"{self.session_name}:{window_index}", "Enter"])
            print(f"✅ Auto-responded '{response}' to window {window_index}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Error sending response: {e}")
            return False
    
    def check_for_questions(self, window_index: int) -> bool:
        """Check if there are Claude questions in the window."""
        content = self.capture_window_content(window_index)
        if not content:
            return False

        for pattern in self.question_patterns:
            if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
                print(f"🔍 Question detected in window {window_index}")
                print(f"Pattern: {pattern}")
                print(f"Content: {content[-200:]}")
                return True

        return False

    def watch_session(self, check_interval: float = 2.0):
        """Monitor the entire tmux session continuously."""
        print(f"🔍 Starting Claude Auto-Responder for session: {self.session_name}")
        print(f"⏱️  Check interval: {check_interval} seconds")
        print("🛑 Press Ctrl+C to stop")

        try:
            while self.running:
                windows = self.get_session_windows()

                for window_index in windows:
                    if self.check_for_questions(window_index):
                        content = self.capture_window_content(window_index)
                        if "yes and don't ask again" in content.lower():
                            self.send_response(window_index, "2")
                        else:
                            self.send_response(window_index, "1")

                time.sleep(check_interval)

        except KeyboardInterrupt:
            print("\n🛑 Auto-responder stopped by user")
        except Exception as e:
            print(f"❌ Error in watcher: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 claude_auto_responder.py <session_name> [check_interval]")
        print("Example: python3 claude_auto_responder.py antko-corporate 1.5")
        sys.exit(1)
    
    session_name = sys.argv[1]
    check_interval = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
    
    responder = ClaudeAutoResponder(session_name)
    responder.watch_session(check_interval)

if __name__ == "__main__":
    main()