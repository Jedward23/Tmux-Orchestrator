#!/usr/bin/env python3
"""
Test script to verify the fixed continue functionality
"""

from claude_limit_monitor import ClaudeLimitMonitor
import subprocess
import time

def test_claude_detection():
    """Test the Claude window detection logic."""
    monitor = ClaudeLimitMonitor()
    
    print("🧪 Testing Claude Window Detection")
    print("=" * 40)
    
    sessions = monitor.get_all_sessions()
    
    for session_name in sessions:
        print(f"\n📱 Session: {session_name}")
        windows = monitor.get_session_windows(session_name)
        
        for window_index in windows:
            is_claude = monitor.is_claude_window(session_name, window_index)
            status = "✅ Claude" if is_claude else "❌ Not Claude"
            print(f"  Window {window_index}: {status}")
            
            if is_claude:
                # Show a preview of the content
                content = monitor.capture_window_content(session_name, window_index, lines=3)
                preview = content.replace('\n', ' ').strip()[:100]
                print(f"    Preview: {preview}...")

def test_continue_sending():
    """Test sending continue to Claude sessions."""
    monitor = ClaudeLimitMonitor()
    
    print("\n🚀 Testing Continue Sending")
    print("=" * 40)
    
    # This will only send to detected Claude windows
    monitor.send_continue_to_all_sessions()

def test_lock_mechanism():
    """Test the scheduling lock mechanism."""
    monitor = ClaudeLimitMonitor()
    
    print("\n🔒 Testing Lock Mechanism")
    print("=" * 40)
    
    # Try to schedule twice
    print("First scheduling attempt:")
    result1 = monitor.schedule_continuation(1, "test-2pm")
    
    print("\nSecond scheduling attempt (should be blocked):")
    result2 = monitor.schedule_continuation(1, "test-2pm")
    
    print(f"\nResults: First={result1}, Second={result2}")
    
    # Clear the lock
    print("\nClearing lock...")
    subprocess.run(["python3", "claude_limit_monitor.py", "--clear-lock"])

if __name__ == "__main__":
    print("🔧 Claude Limit Monitor - Continue Fix Test")
    print("=" * 50)
    
    test_claude_detection()
    test_continue_sending()
    test_lock_mechanism()
    
    print("\n✅ All tests completed!")
    print("\nTo test manually:")
    print("1. python3 claude_limit_monitor.py --continue-all")
    print("2. python3 claude_limit_monitor.py --clear-lock")
