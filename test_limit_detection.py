#!/usr/bin/env python3
"""
Test script for Claude Limit Monitor

Simulates Claude usage limit messages to test the detection and scheduling system.
"""

from claude_limit_monitor import ClaudeLimitMonitor
from datetime import datetime

def test_limit_detection():
    """Test the limit detection patterns."""
    monitor = ClaudeLimitMonitor()
    
    # Test cases with different message formats
    test_messages = [
        "Claude usage limit reached. Your limit will reset at 2pm",
        "Sorry, your usage limit reached. Your limit will reset at 11am tomorrow",
        "Usage limit reached for today. Your limit will reset at 3pm",
        "Your limit will reset at 12am (midnight)",
        "Claude usage limit reached. Your limit will reset at 9pm (America/Santiago)",
        "Rate limit exceeded. Your limit will reset at 6am",
    ]
    
    print("🧪 Testing Claude Limit Detection Patterns")
    print("=" * 50)
    
    for i, message in enumerate(test_messages, 1):
        print(f"\nTest {i}: {message}")
        reset_info = monitor.parse_reset_time(message)
        
        if reset_info:
            hour, period = reset_info
            wait_minutes = monitor.calculate_wait_minutes(hour, period)
            reset_time = datetime.now().replace(hour=hour if period == 'am' or hour == 12 else hour + 12, minute=1, second=0)
            
            print(f"  ✅ Detected: {hour}{period}")
            print(f"  ⏰ Reset time: {reset_time.strftime('%H:%M:%S')}")
            print(f"  ⏱️  Wait time: {wait_minutes} minutes")
        else:
            print(f"  ❌ Not detected")
    
    print("\n" + "=" * 50)
    print("🎯 Test completed!")

def test_time_calculation():
    """Test time calculation logic."""
    monitor = ClaudeLimitMonitor()
    
    print("\n🕐 Testing Time Calculation")
    print("=" * 30)
    
    current_time = datetime.now()
    print(f"Current time: {current_time.strftime('%H:%M:%S')}")
    
    # Test different reset times
    test_times = [
        (2, 'pm'),   # 2 PM
        (11, 'am'),  # 11 AM
        (12, 'pm'),  # 12 PM (noon)
        (12, 'am'),  # 12 AM (midnight)
        (9, 'pm'),   # 9 PM
    ]
    
    for hour, period in test_times:
        wait_minutes = monitor.calculate_wait_minutes(hour, period)
        
        # Calculate actual reset time
        reset_hour = hour
        if period == 'pm' and hour != 12:
            reset_hour += 12
        elif period == 'am' and hour == 12:
            reset_hour = 0
            
        reset_time = current_time.replace(hour=reset_hour, minute=1, second=0)
        if reset_time <= current_time:
            reset_time = reset_time.replace(day=reset_time.day + 1)
        
        print(f"  {hour}{period} -> {reset_time.strftime('%H:%M:%S')} ({wait_minutes} min)")

if __name__ == "__main__":
    test_limit_detection()
    test_time_calculation()
    
    print("\n🚀 To test the full system:")
    print("1. ./start_limit_monitor.sh")
    print("2. Simulate a limit message in any Claude session")
    print("3. Watch the automatic scheduling in action!")
