#!/usr/bin/env python3
"""
Comprehensive test for Claude Limit Monitor continue command verification.

This test verifies that:
1. Exactly "--continue" is sent (not "continue" or duplicated commands)
2. Each Claude window receives exactly one "--continue" + Enter sequence
3. No duplications occur across multiple sessions
4. Non-Claude windows are properly skipped
5. Error handling works correctly
"""

import unittest
from unittest.mock import patch, MagicMock, call
import subprocess
import sys
import os

# Add the current directory to Python path to import claude_limit_monitor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from claude_limit_monitor import ClaudeLimitMonitor


class TestContinueCommandVerification(unittest.TestCase):
    """Test suite for verifying correct --continue command behavior."""

    def setUp(self):
        """Set up test fixtures."""
        self.monitor = ClaudeLimitMonitor()
        
        # Mock data for tmux sessions and windows
        self.mock_sessions = ["session1", "session2", "session3"]
        self.mock_windows = {
            "session1": [0, 1, 2],  # 3 windows
            "session2": [0, 1],     # 2 windows  
            "session3": [0]         # 1 window
        }
        
        # Mock window content - some with Claude, some without
        self.mock_content = {
            "session1:0": "I'm Claude, an AI assistant. How can I help you today?",
            "session1:1": "bash-5.1$ ls -la\ntotal 16",  # Not Claude
            "session1:2": "Claude usage limit reached. Your limit will reset at 2pm",
            "session2:0": "How can I help you with your project?",  # Claude
            "session2:1": "vim editor - editing file.py",  # Not Claude
            "session3:0": "I'll help you with that task. Let me continue working..."  # Claude
        }

    @patch('claude_limit_monitor.subprocess.run')
    @patch('claude_limit_monitor.time.sleep')  # Mock sleep to speed up tests
    def test_exact_continue_command_sent(self, mock_sleep, mock_subprocess):
        """Test that exactly '--continue' is sent, not 'continue' or duplicated."""
        
        # Mock subprocess responses
        def mock_subprocess_side_effect(cmd, **kwargs):
            if cmd[0] == "tmux" and cmd[1] == "list-sessions":
                result = MagicMock()
                result.stdout = "\n".join(self.mock_sessions)
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "list-windows":
                session = cmd[3]  # -t session_name
                result = MagicMock()
                result.stdout = "\n".join(map(str, self.mock_windows[session]))
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "capture-pane":
                target = cmd[3]  # -t session:window
                result = MagicMock()
                result.stdout = self.mock_content.get(target, "")
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "send-keys":
                # Just return success for send-keys commands
                result = MagicMock()
                result.returncode = 0
                return result
            else:
                raise subprocess.CalledProcessError(1, cmd)

        mock_subprocess.side_effect = mock_subprocess_side_effect

        # Execute the function under test
        self.monitor.send_continue_to_all_sessions()

        # Collect all send-keys calls
        send_keys_calls = [call for call in mock_subprocess.call_args_list 
                          if len(call[0]) > 0 and len(call[0][0]) > 2 and 
                          call[0][0][0] == "tmux" and call[0][0][1] == "send-keys"]

        # Expected Claude windows based on mock content
        expected_claude_windows = ["session1:0", "session1:2", "session2:0", "session3:0"]
        
        # Verify each Claude window gets exactly one --continue and one Enter
        continue_commands = []
        enter_commands = []
        
        for call_args in send_keys_calls:
            cmd = call_args[0][0]  # The command list
            if len(cmd) >= 5 and cmd[4] == "--continue":
                continue_commands.append(cmd[3])  # target session:window
            elif len(cmd) >= 5 and cmd[4] == "Enter":
                enter_commands.append(cmd[3])  # target session:window

        # Verify exactly the expected windows received --continue
        self.assertEqual(sorted(continue_commands), sorted(expected_claude_windows),
                        "Not all Claude windows received --continue command")
        
        # Verify exactly the expected windows received Enter
        self.assertEqual(sorted(enter_commands), sorted(expected_claude_windows),
                        "Not all Claude windows received Enter command")
        
        # Verify no duplications - each window should appear exactly once
        self.assertEqual(len(continue_commands), len(set(continue_commands)),
                        "Duplicate --continue commands detected")
        self.assertEqual(len(enter_commands), len(set(enter_commands)),
                        "Duplicate Enter commands detected")

        # Verify the exact command is "--continue", not "continue"
        for call_args in send_keys_calls:
            cmd = call_args[0][0]
            if len(cmd) >= 5 and cmd[4] not in ["Enter"]:
                self.assertEqual(cmd[4], "--continue", 
                               f"Wrong command sent: {cmd[4]}, expected '--continue'")

    @patch('claude_limit_monitor.subprocess.run')
    @patch('claude_limit_monitor.time.sleep')
    def test_no_commands_to_non_claude_windows(self, mock_sleep, mock_subprocess):
        """Test that non-Claude windows don't receive any commands."""
        
        # Mock subprocess responses (same as above)
        def mock_subprocess_side_effect(cmd, **kwargs):
            if cmd[0] == "tmux" and cmd[1] == "list-sessions":
                result = MagicMock()
                result.stdout = "session1"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "list-windows":
                result = MagicMock()
                result.stdout = "0\n1"  # Two windows
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "capture-pane":
                target = cmd[3]
                result = MagicMock()
                # Only window 0 has Claude content, window 1 doesn't
                if target == "session1:0":
                    result.stdout = "I'm Claude, how can I help?"
                else:
                    result.stdout = "bash-5.1$ echo 'no claude here'"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "send-keys":
                result = MagicMock()
                result.returncode = 0
                return result

        mock_subprocess.side_effect = mock_subprocess_side_effect

        # Execute the function
        self.monitor.send_continue_to_all_sessions()

        # Collect send-keys calls
        send_keys_calls = [call for call in mock_subprocess.call_args_list 
                          if len(call[0]) > 0 and len(call[0][0]) > 2 and 
                          call[0][0][0] == "tmux" and call[0][0][1] == "send-keys"]

        # Should only have commands for session1:0 (the Claude window)
        targets = []
        for call_args in send_keys_calls:
            cmd = call_args[0][0]
            if len(cmd) >= 4:
                targets.append(cmd[3])  # target session:window

        # All commands should be to session1:0 only
        for target in targets:
            self.assertEqual(target, "session1:0", 
                           f"Command sent to non-Claude window: {target}")

    @patch('claude_limit_monitor.subprocess.run')
    @patch('claude_limit_monitor.time.sleep')
    def test_error_handling_no_duplicates(self, mock_sleep, mock_subprocess):
        """Test that errors don't cause duplicate commands."""
        
        call_count = 0
        
        def mock_subprocess_side_effect(cmd, **kwargs):
            nonlocal call_count
            call_count += 1
            
            if cmd[0] == "tmux" and cmd[1] == "list-sessions":
                result = MagicMock()
                result.stdout = "session1"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "list-windows":
                result = MagicMock()
                result.stdout = "0"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "capture-pane":
                result = MagicMock()
                result.stdout = "I'm Claude, ready to help!"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "send-keys":
                # Simulate error on first send-keys, success on retry
                if call_count <= 10:  # First few calls fail
                    raise subprocess.CalledProcessError(1, cmd)
                else:
                    result = MagicMock()
                    result.returncode = 0
                    return result

        mock_subprocess.side_effect = mock_subprocess_side_effect

        # Execute the function - should handle errors gracefully
        self.monitor.send_continue_to_all_sessions()

        # Count actual send-keys attempts
        send_keys_attempts = [call for call in mock_subprocess.call_args_list 
                             if len(call[0]) > 0 and len(call[0][0]) > 2 and 
                             call[0][0][0] == "tmux" and call[0][0][1] == "send-keys"]

        # Should have attempted send-keys but not succeeded due to errors
        # The important thing is no infinite loops or excessive retries
        self.assertLess(len(send_keys_attempts), 10,
                       "Too many send-keys attempts, possible infinite loop")

    @patch('claude_limit_monitor.subprocess.run')
    @patch('claude_limit_monitor.time.sleep')
    def test_multiple_sessions_no_cross_contamination(self, mock_sleep, mock_subprocess):
        """Test that commands don't get sent to wrong sessions."""

        def mock_subprocess_side_effect(cmd, **kwargs):
            if cmd[0] == "tmux" and cmd[1] == "list-sessions":
                result = MagicMock()
                result.stdout = "session_a\nsession_b"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "list-windows":
                session = cmd[3]
                result = MagicMock()
                result.stdout = "0\n1" if session == "session_a" else "0"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "capture-pane":
                target = cmd[3]
                result = MagicMock()
                # Only specific windows have Claude
                claude_windows = ["session_a:0", "session_b:0"]
                if target in claude_windows:
                    result.stdout = f"I'm Claude in {target}"
                else:
                    result.stdout = f"Regular terminal in {target}"
                result.returncode = 0
                return result
            elif cmd[0] == "tmux" and cmd[1] == "send-keys":
                result = MagicMock()
                result.returncode = 0
                return result

        mock_subprocess.side_effect = mock_subprocess_side_effect

        # Execute the function
        self.monitor.send_continue_to_all_sessions()

        # Verify commands were sent to correct targets only
        send_keys_calls = [call for call in mock_subprocess.call_args_list
                          if len(call[0]) > 0 and len(call[0][0]) > 2 and
                          call[0][0][0] == "tmux" and call[0][0][1] == "send-keys"]

        targets = set()
        for call_args in send_keys_calls:
            cmd = call_args[0][0]
            if len(cmd) >= 4:
                targets.add(cmd[3])

        # Should only target the Claude windows
        expected_targets = {"session_a:0", "session_b:0"}
        self.assertEqual(targets, expected_targets,
                        "Commands sent to incorrect targets")

    def test_integration_with_real_monitor_instance(self):
        """Integration test to verify the monitor instance works correctly."""

        # Test that the monitor can be instantiated and has correct methods
        monitor = ClaudeLimitMonitor()

        # Verify key methods exist
        self.assertTrue(hasattr(monitor, 'send_continue_to_all_sessions'))
        self.assertTrue(hasattr(monitor, 'is_claude_window'))
        self.assertTrue(hasattr(monitor, 'get_all_sessions'))
        self.assertTrue(hasattr(monitor, 'get_session_windows'))

        # Verify the limit patterns are correctly configured
        self.assertIsInstance(monitor.limit_patterns, list)
        self.assertGreater(len(monitor.limit_patterns), 0)

        # Verify script directory is set
        self.assertTrue(os.path.isdir(monitor.script_dir))


def run_manual_verification():
    """Manual verification helper - can be run separately."""
    print("\n🔧 Manual Verification Helper")
    print("=" * 40)
    print("To manually verify the fix:")
    print("1. Start a tmux session with Claude")
    print("2. Run: python3 claude_limit_monitor.py --continue-all")
    print("3. Check that exactly '--continue' appears in Claude window")
    print("4. Verify no duplicates or wrong commands")
    print("\nExpected behavior:")
    print("✓ Sends '--continue' (not 'continue')")
    print("✓ Sends exactly once per Claude window")
    print("✓ Skips non-Claude windows")
    print("✓ No duplications across sessions")


if __name__ == "__main__":
    print("🧪 Claude Limit Monitor - Continue Command Verification Test")
    print("=" * 60)
    print("Testing:")
    print("✓ Exact '--continue' command (not 'continue')")
    print("✓ No duplicate commands per window")
    print("✓ Correct targeting of Claude windows only")
    print("✓ Error handling without duplications")
    print("=" * 60)
    
    unittest.main(verbosity=2)
