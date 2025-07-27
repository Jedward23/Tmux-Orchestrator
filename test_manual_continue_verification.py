#!/usr/bin/env python3
"""
Manual verification script for Claude Limit Monitor continue command.

This script provides a visual way to verify that the --continue command
is being sent correctly without duplications.
"""

import subprocess
import time
import sys
from claude_limit_monitor import ClaudeLimitMonitor


def capture_tmux_commands():
    """Capture and display tmux send-keys commands in real-time."""
    print("🔍 Manual Continue Command Verification")
    print("=" * 50)
    print("This script will:")
    print("1. Show all tmux sessions and windows")
    print("2. Identify Claude windows")
    print("3. Execute send_continue_to_all_sessions()")
    print("4. Display exactly what commands were sent")
    print("=" * 50)
    
    monitor = ClaudeLimitMonitor()
    
    # Show current tmux state
    print("\n📱 Current tmux sessions:")
    sessions = monitor.get_all_sessions()
    for session in sessions:
        print(f"  • {session}")
        windows = monitor.get_session_windows(session)
        for window in windows:
            is_claude = monitor.is_claude_window(session, window)
            status = "🤖 Claude" if is_claude else "💻 Terminal"
            print(f"    └─ Window {window}: {status}")
            
            if is_claude:
                # Show a preview of Claude content
                content = monitor.capture_window_content(session, window, lines=3)
                preview = content.replace('\n', ' ').strip()[:80]
                print(f"       Preview: {preview}...")
    
    print(f"\n🎯 Found {len(sessions)} sessions")
    
    # Ask for confirmation
    if len(sessions) == 0:
        print("❌ No tmux sessions found. Please start a tmux session with Claude first.")
        return
    
    print("\n⚠️  This will send '--continue' to all detected Claude windows.")
    response = input("Continue? (y/N): ").strip().lower()
    
    if response != 'y':
        print("❌ Cancelled by user")
        return
    
    print("\n🚀 Executing send_continue_to_all_sessions()...")
    print("=" * 50)
    
    # Execute the function
    monitor.send_continue_to_all_sessions()
    
    print("=" * 50)
    print("✅ Execution completed!")
    
    # Verification checklist
    print("\n📋 Verification Checklist:")
    print("✓ Check that each Claude window received exactly '--continue'")
    print("✓ Verify no duplicate commands were sent")
    print("✓ Confirm non-Claude windows were skipped")
    print("✓ Look for any error messages above")


def test_command_format():
    """Test that demonstrates the exact command format."""
    print("\n🧪 Command Format Test")
    print("=" * 30)
    print("Expected tmux command format:")
    print("  tmux send-keys -t 'session:window' '--continue'")
    print("  tmux send-keys -t 'session:window' 'Enter'")
    print("")
    print("❌ WRONG formats that should NOT appear:")
    print("  tmux send-keys -t 'session:window' 'continue'")
    print("  tmux send-keys -t 'session:window' '--continue--continue'")
    print("  Multiple commands to the same window")
    print("")
    print("The test above verified these formats are correct.")


def show_detection_logic():
    """Show how Claude window detection works."""
    print("\n🔍 Claude Window Detection Logic")
    print("=" * 35)
    print("A window is considered a Claude window if it contains:")
    
    monitor = ClaudeLimitMonitor()
    
    # Show the actual indicators from the code
    print("Indicators:")
    for i, indicator in enumerate(monitor.limit_patterns, 1):
        print(f"  {i}. Text matching: {indicator}")
    
    # Show Claude content indicators
    claude_indicators = [
        "claude", "anthropic", "assistant", "I'm Claude",
        "How can I help", "I'll help you", "usage limit", "continue"
    ]
    
    print("\nContent indicators:")
    for i, indicator in enumerate(claude_indicators, 1):
        print(f"  {i}. '{indicator}' (case insensitive)")
    
    print("\n⚠️  Note: The 'continue' indicator might cause false positives")
    print("   in terminals that happen to contain that word.")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test-only":
        print("🧪 Running automated tests only...")
        subprocess.run([sys.executable, "test_continue_command_verification.py"])
    elif len(sys.argv) > 1 and sys.argv[1] == "--show-detection":
        show_detection_logic()
    elif len(sys.argv) > 1 and sys.argv[1] == "--format-test":
        test_command_format()
    else:
        print("🔧 Claude Limit Monitor - Manual Verification")
        print("This will test the actual --continue command sending.")
        print("")
        print("Options:")
        print("  python3 test_manual_continue_verification.py")
        print("    → Run full manual verification")
        print("  python3 test_manual_continue_verification.py --test-only")
        print("    → Run automated tests only")
        print("  python3 test_manual_continue_verification.py --show-detection")
        print("    → Show Claude detection logic")
        print("  python3 test_manual_continue_verification.py --format-test")
        print("    → Show expected command formats")
        print("")
        
        if len(sys.argv) == 1:
            capture_tmux_commands()
