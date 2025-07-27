#!/usr/bin/env python3
"""
Claude Usage Limit Monitor

Monitors all tmux sessions for Claude usage limit messages and automatically
schedules continuation when the limit resets.
"""

import subprocess
import time
import re
import sys
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple

class ClaudeLimitMonitor:
    """Monitors Claude usage limits and schedules automatic continuation."""
    
    def __init__(self):
        self.running = True
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Patterns to detect Claude usage limit messages
        self.limit_patterns = [
            r"Claude usage limit reached\.\s*Your limit will reset at (\d{1,2})(am|pm)",
            r"usage limit reached.*reset at (\d{1,2})(am|pm)",
            r"limit will reset at (\d{1,2})(am|pm)",
            r"Your limit will reset at (\d{1,2})(am|pm)"
        ]
    
    def get_all_sessions(self) -> List[str]:
        """Get all active tmux sessions."""
        try:
            cmd = ["tmux", "list-sessions", "-F", "#{session_name}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return [s.strip() for s in result.stdout.strip().split('\n') if s.strip()]
        except subprocess.CalledProcessError:
            return []
    
    def get_session_windows(self, session_name: str) -> List[int]:
        """Get all windows in a tmux session."""
        try:
            cmd = ["tmux", "list-windows", "-t", session_name, "-F", "#{window_index}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return [int(w) for w in result.stdout.strip().split('\n') if w.strip()]
        except subprocess.CalledProcessError:
            return []
    
    def capture_window_content(self, session_name: str, window_index: int, lines: int = 30) -> str:
        """Capture content from a tmux window."""
        try:
            cmd = ["tmux", "capture-pane", "-t", f"{session_name}:{window_index}", 
                   "-p", "-S", f"-{lines}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError:
            return ""
    
    def parse_reset_time(self, content: str) -> Optional[Tuple[int, str]]:
        """Parse reset time from Claude limit message."""
        for pattern in self.limit_patterns:
            match = re.search(pattern, content, re.IGNORECASE | re.MULTILINE)
            if match:
                hour = int(match.group(1))
                period = match.group(2).lower()
                return (hour, period)
        return None
    
    def calculate_wait_minutes(self, reset_hour: int, period: str) -> int:
        """Calculate minutes to wait until reset time + 1 minute buffer."""
        now = datetime.now()
        
        # Convert to 24-hour format
        if period == 'pm' and reset_hour != 12:
            reset_hour += 12
        elif period == 'am' and reset_hour == 12:
            reset_hour = 0
        
        # Create reset time for today
        reset_time = now.replace(hour=reset_hour, minute=1, second=0, microsecond=0)  # +1 minute buffer
        
        # If reset time has passed today, schedule for tomorrow
        if reset_time <= now:
            reset_time += timedelta(days=1)
        
        # Calculate minutes to wait
        wait_time = reset_time - now
        return int(wait_time.total_seconds() / 60)
    
    def is_claude_window(self, session_name: str, window_index: int) -> bool:
        """Check if a window likely contains Claude by looking for common indicators."""
        content = self.capture_window_content(session_name, window_index, lines=10)
        if not content:
            return False

        # Look for Claude indicators in recent content
        claude_indicators = [
            "claude",
            "anthropic",
            "assistant",
            "I'm Claude",
            "How can I help",
            "I'll help you",
            "usage limit",
            "continue"
        ]

        content_lower = content.lower()
        return any(indicator in content_lower for indicator in claude_indicators)

    def send_continue_to_all_sessions(self):
        """Send '--continue' + Enter to all Claude sessions."""
        sessions = self.get_all_sessions()
        continued_count = 0

        print(f"🔍 Checking {len(sessions)} sessions for Claude windows...")

        for session_name in sessions:
            windows = self.get_session_windows(session_name)
            session_continued = 0

            for window_index in windows:
                # Only send to windows that likely contain Claude
                if self.is_claude_window(session_name, window_index):
                    try:
                        # Send '--continue'
                        subprocess.run(["tmux", "send-keys", "-t", f"{session_name}:{window_index}", "--continue"])
                        time.sleep(0.5)
                        # Send Enter
                        subprocess.run(["tmux", "send-keys", "-t", f"{session_name}:{window_index}", "Enter"])
                        continued_count += 1
                        session_continued += 1
                        print(f"✅ Sent '--continue' to {session_name}:{window_index}")

                        # Add a small delay between windows to avoid overwhelming
                        time.sleep(1.0)

                    except subprocess.CalledProcessError as e:
                        print(f"❌ Error sending to {session_name}:{window_index}: {e}")
                else:
                    print(f"⏭️  Skipped {session_name}:{window_index} (not Claude)")

            if session_continued > 0:
                print(f"📊 Session '{session_name}': {session_continued} Claude windows continued")

        print(f"🚀 Total: Sent '--continue' to {continued_count} Claude windows across {len(sessions)} sessions")
    
    def schedule_continuation(self, wait_minutes: int, reset_time_str: str):
        """Schedule continuation using the existing scheduling system."""
        # Create a lock file to prevent multiple scheduling
        lock_file = os.path.join(self.script_dir, ".claude_limit_scheduled")

        if os.path.exists(lock_file):
            print(f"⚠️  Continuation already scheduled (lock file exists)")
            return False

        # Create lock file
        try:
            with open(lock_file, 'w') as f:
                f.write(f"Scheduled at {datetime.now().isoformat()}\n")
                f.write(f"Reset time: {reset_time_str}\n")
                f.write(f"Wait minutes: {wait_minutes}\n")
        except Exception as e:
            print(f"❌ Error creating lock file: {e}")
            return False

        # Create a note for the scheduled continuation
        note = f"Claude limit reset at {reset_time_str} - Auto-continuing all sessions"

        try:
            # Use nohup to schedule the continuation with lock cleanup
            script_path = os.path.join(self.script_dir, "claude_limit_monitor.py")
            cmd = f'nohup bash -c "sleep {wait_minutes * 60} && rm -f {lock_file} && python3 {script_path} --continue-all" > /dev/null 2>&1 &'
            subprocess.run(cmd, shell=True, check=True)

            reset_time = datetime.now() + timedelta(minutes=wait_minutes)
            print(f"⏰ Scheduled continuation for {reset_time.strftime('%H:%M:%S')} ({wait_minutes} minutes)")
            print(f"📝 Note: {note}")
            print(f"🔒 Lock file created: {lock_file}")
            return True
        except subprocess.CalledProcessError as e:
            # Clean up lock file if scheduling failed
            try:
                os.remove(lock_file)
            except:
                pass
            print(f"❌ Error scheduling continuation: {e}")
            return False
    
    def check_for_limits(self) -> bool:
        """Check all sessions for Claude usage limit messages."""
        sessions = self.get_all_sessions()
        limit_detected = False
        
        for session_name in sessions:
            windows = self.get_session_windows(session_name)
            for window_index in windows:
                content = self.capture_window_content(session_name, window_index)
                if not content:
                    continue
                
                reset_info = self.parse_reset_time(content)
                if reset_info:
                    hour, period = reset_info
                    reset_time_str = f"{hour}{period}"
                    wait_minutes = self.calculate_wait_minutes(hour, period)
                    
                    print(f"🚨 Claude limit detected in {session_name}:{window_index}")
                    print(f"📅 Reset time: {reset_time_str} (in {wait_minutes} minutes)")
                    print(f"Content preview: {content[-200:]}")
                    
                    if self.schedule_continuation(wait_minutes, reset_time_str):
                        limit_detected = True
                        print(f"✅ Auto-continuation scheduled successfully")
                    else:
                        print(f"❌ Failed to schedule auto-continuation")
        
        return limit_detected
    
    def monitor_continuously(self, check_interval: float = 30.0):
        """Monitor all sessions continuously for usage limits."""
        print(f"🔍 Starting Claude Limit Monitor")
        print(f"⏱️  Check interval: {check_interval} seconds")
        print("🛑 Press Ctrl+C to stop")
        
        try:
            while self.running:
                if self.check_for_limits():
                    print("🎯 Limit detected and scheduled - stopping monitor")
                    break
                
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            print("\n🛑 Monitor stopped by user")
        except Exception as e:
            print(f"❌ Error in monitor: {e}")

def main():
    if len(sys.argv) > 1:
        if sys.argv[1] == "--continue-all":
            # This is called by the scheduled continuation
            monitor = ClaudeLimitMonitor()
            monitor.send_continue_to_all_sessions()
            return
        elif sys.argv[1] == "--clear-lock":
            # Clear the scheduling lock file
            monitor = ClaudeLimitMonitor()
            lock_file = os.path.join(monitor.script_dir, ".claude_limit_scheduled")
            if os.path.exists(lock_file):
                os.remove(lock_file)
                print("🔓 Lock file cleared")
            else:
                print("ℹ️  No lock file found")
            return
        elif sys.argv[1] in ["--help", "-h"]:
            print("Claude Limit Monitor")
            print("Usage:")
            print("  python3 claude_limit_monitor.py [check_interval]")
            print("  python3 claude_limit_monitor.py --continue-all")
            print("  python3 claude_limit_monitor.py --clear-lock")
            print("")
            print("Arguments:")
            print("  check_interval    Seconds between checks (default: 30)")
            print("  --continue-all    Send '--continue' to all Claude sessions")
            print("  --clear-lock      Clear scheduling lock file")
            print("")
            print("Examples:")
            print("  python3 claude_limit_monitor.py 60    # Check every 60 seconds")
            print("  ./start_limit_monitor.sh              # Use convenience script")
            return
        else:
            try:
                check_interval = float(sys.argv[1])
            except ValueError:
                print(f"Error: Invalid check interval '{sys.argv[1]}'. Must be a number.")
                print("Use --help for usage information.")
                sys.exit(1)
    else:
        check_interval = 30.0

    monitor = ClaudeLimitMonitor()
    monitor.monitor_continuously(check_interval)

if __name__ == "__main__":
    main()
