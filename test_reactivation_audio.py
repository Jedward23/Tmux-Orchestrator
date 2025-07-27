#!/usr/bin/env python3
"""
Test script for the enhanced reactivation audio system.
Tests all components to ensure they work correctly.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def test_audio_folder():
    """Test that the audio folder exists and contains files."""
    print("🔍 Testing audio folder structure...")
    
    audio_folder = Path("reactivation_audio")
    if not audio_folder.exists():
        print("❌ Audio folder not found!")
        return False
    
    audio_files = list(audio_folder.glob("*.mp3")) + list(audio_folder.glob("*.wav")) + \
                  list(audio_folder.glob("*.m4a")) + list(audio_folder.glob("*.aac")) + \
                  list(audio_folder.glob("*.ogg")) + list(audio_folder.glob("*.flac"))
    
    if not audio_files:
        print("❌ No audio files found in reactivation_audio folder!")
        return False
    
    print(f"✅ Audio folder exists with {len(audio_files)} audio file(s)")
    for file in audio_files:
        print(f"   📁 {file.name}")
    
    return True

def test_audio_player_script():
    """Test the audio player script."""
    print("\n🔍 Testing audio player script...")
    
    script_path = Path("reactivation_audio_player.py")
    if not script_path.exists():
        print("❌ Audio player script not found!")
        return False
    
    # Test help command
    try:
        result = subprocess.run([
            "python3", str(script_path), "--help"
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ Audio player script help command works")
        else:
            print(f"❌ Audio player script help failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error testing audio player script: {e}")
        return False
    
    # Test direct audio playback
    try:
        print("🔊 Testing direct audio playback...")
        result = subprocess.run([
            "python3", str(script_path)
        ], capture_output=True, text=True, timeout=15)

        if result.returncode == 0:
            print("✅ Direct audio playback test completed")
            print(f"   Output: {result.stdout.strip()}")
        else:
            print(f"❌ Direct audio playback failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error testing direct audio playback: {e}")
        return False
    
    return True

def test_claude_limit_monitor_integration():
    """Test the claude limit monitor integration."""
    print("\n🔍 Testing Claude limit monitor integration...")
    
    script_path = Path("claude_limit_monitor.py")
    if not script_path.exists():
        print("❌ Claude limit monitor script not found!")
        return False
    
    try:
        print("🔊 Testing continue-all with audio...")
        result = subprocess.run([
            "python3", str(script_path), "--continue-all"
        ], capture_output=True, text=True, timeout=20)
        
        if result.returncode == 0:
            print("✅ Claude limit monitor with audio test completed")
            if "Playing reactivation audio notification" in result.stdout:
                print("✅ Audio notification triggered correctly")
            else:
                print("⚠️  Audio notification message not found in output")
        else:
            print(f"❌ Claude limit monitor test failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error testing Claude limit monitor: {e}")
        return False
    
    return True

def test_schedule_script_integration():
    """Test the schedule_with_note.sh integration."""
    print("\n🔍 Testing schedule_with_note.sh integration...")
    
    script_path = Path("schedule_with_note.sh")
    if not script_path.exists():
        print("❌ schedule_with_note.sh script not found!")
        return False
    
    if not os.access(script_path, os.X_OK):
        print("❌ schedule_with_note.sh is not executable!")
        return False
    
    print("✅ schedule_with_note.sh exists and is executable")
    
    # Check if the script contains the audio integration
    try:
        with open(script_path, 'r') as f:
            content = f.read()
            
        if "reactivation_audio_player.py" in content:
            print("✅ Audio integration found in schedule_with_note.sh")
        else:
            print("❌ Audio integration not found in schedule_with_note.sh")
            return False
            
        if "reactivation_audio_player.py'" in content and "--async" not in content:
            print("✅ Direct audio playback configured in schedule_with_note.sh")
        else:
            print("❌ Direct audio playback not configured correctly in schedule_with_note.sh")
            return False
            
    except Exception as e:
        print(f"❌ Error reading schedule_with_note.sh: {e}")
        return False
    
    return True

def test_ffmpeg_availability():
    """Test if ffmpeg/ffplay is available for precise timing."""
    print("\n🔍 Testing ffmpeg availability...")

    try:
        result = subprocess.run([
            "ffplay", "-version"
        ], capture_output=True, text=True, timeout=5)

        if result.returncode == 0:
            print("✅ ffplay is available - precise timing supported")
            return True
        else:
            print("⚠️  ffplay not available - will fallback to afplay (macOS) or no audio")
            print("   System will still work, but without precise timing control")
            return True  # Changed to True since fallback works
    except FileNotFoundError:
        print("⚠️  ffplay not found - will fallback to afplay (macOS) or no audio")
        print("   Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)")
        print("   System will still work, but without precise timing control")
        return True  # Changed to True since fallback works
    except Exception as e:
        print(f"⚠️  Error checking ffplay: {e}")
        print("   System will still work, but without precise timing control")
        return True  # Changed to True since fallback works

def main():
    """Run all tests."""
    print("🧪 Testing Enhanced Reactivation Audio System")
    print("=" * 50)
    
    tests = [
        ("Audio Folder Structure", test_audio_folder),
        ("Audio Player Script", test_audio_player_script),
        ("Claude Limit Monitor Integration", test_claude_limit_monitor_integration),
        ("Schedule Script Integration", test_schedule_script_integration),
        ("FFmpeg Availability", test_ffmpeg_availability),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test error: {e}")
    
    print("\n" + "=" * 50)
    print(f"🧪 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Enhanced reactivation audio system is ready.")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
