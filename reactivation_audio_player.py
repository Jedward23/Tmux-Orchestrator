#!/usr/bin/env python3
"""
Reactivation Audio Player
Plays audio files from the reactivation_audio folder with specific timing.
Designed for bot reactivation notifications with non-blocking execution.
"""

import os
import sys
import subprocess
import glob
import threading
from pathlib import Path

class ReactivationAudioPlayer:
    def __init__(self, audio_folder="reactivation_audio"):
        """Initialize the audio player with the specified folder."""
        self.script_dir = Path(__file__).parent.absolute()
        self.audio_folder = self.script_dir / audio_folder
        self.start_time = 3.5  # Start playback at 3.5 seconds
        self.end_time = 25.0   # End playback at 8 seconds
        self.duration = self.end_time - self.start_time  # Duration in seconds (4.5s)

        # 🔊 VOLUME CONTROL - Adjust this value as needed
        # 0.0 = mute, 0.5 = 50%, 1.0 = 100%, 1.5 = 150%, etc.
        self.volume = 0.2  # Default: 20% volume
        
    def find_first_audio_file(self):
        """Find the first audio file in the reactivation_audio folder."""
        if not self.audio_folder.exists():
            print(f"❌ Audio folder not found: {self.audio_folder}")
            return None
            
        # Common audio file extensions
        audio_extensions = ['*.mp3', '*.wav', '*.m4a', '*.aac', '*.ogg', '*.flac']
        
        for extension in audio_extensions:
            files = list(self.audio_folder.glob(extension))
            if files:
                # Return the first file found
                audio_file = files[0]
                print(f"🎵 Found audio file: {audio_file.name}")
                return audio_file
                
        print(f"❌ No audio files found in {self.audio_folder}")
        return None
    
    def play_audio_segment(self, audio_file):
        """Play the specified segment of the audio file using ffplay."""
        try:
            # Use ffplay with specific timing parameters and volume control
            # -ss: start time, -t: duration, -nodisp: no video display, -autoexit: exit when done
            # -af volume: audio filter for volume control (0.0 = mute, 1.0 = normal, >1.0 = amplified)
            cmd = [
                'ffplay',
                '-ss', str(self.start_time),
                '-t', str(self.duration),
                '-af', f'volume={self.volume}',  # Volume control
                '-nodisp',
                '-autoexit',
                '-loglevel', 'quiet',  # Suppress ffplay output
                str(audio_file)
            ]

            volume_percent = int(self.volume * 100)
            print(f"🔊 Playing audio segment: {self.start_time}s - {self.end_time}s ({self.duration}s duration) at {volume_percent}% volume")

            # Run in background without blocking
            subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            return True
            
        except FileNotFoundError:
            print("❌ ffplay not found. Please install ffmpeg to enable audio playback.")
            print("   Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)")
            return False
        except Exception as e:
            print(f"❌ Error playing audio: {e}")
            return False
    
    def play_audio_with_afplay(self, audio_file):
        """Fallback method using macOS afplay (doesn't support timing or volume control)."""
        try:
            volume_percent = int(self.volume * 100)
            print(f"🔊 Playing full audio file with afplay: {audio_file.name} at {volume_percent}% volume")
            print("   Note: Timing and volume control not available with afplay. Consider installing ffmpeg for full control.")

            # afplay doesn't support volume control, so we use system volume
            # Run afplay in background
            subprocess.Popen(['afplay', str(audio_file)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
            
        except FileNotFoundError:
            print("❌ afplay not found. Audio playback not available.")
            return False
        except Exception as e:
            print(f"❌ Error playing audio with afplay: {e}")
            return False
    
    def play_reactivation_audio(self):
        """Main method to play reactivation audio."""
        audio_file = self.find_first_audio_file()
        
        if not audio_file:
            print("⚠️  No audio file found for reactivation notification")
            return False
        
        # Try ffplay first (supports timing), fallback to afplay
        if not self.play_audio_segment(audio_file):
            # Fallback to afplay on macOS
            if sys.platform == 'darwin':
                return self.play_audio_with_afplay(audio_file)
            else:
                print("❌ Audio playback failed. Please install ffmpeg for audio support.")
                return False
        
        return True
    
    def play_async(self):
        """Play audio asynchronously without blocking the main thread."""
        def play_in_background():
            self.play_reactivation_audio()
        
        # Start audio playback in a separate thread
        audio_thread = threading.Thread(target=play_in_background, daemon=True)
        audio_thread.start()
        print("🎵 Audio playback started in background")

def main():
    """Main function for command-line usage."""
    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print("Reactivation Audio Player")
        print("Usage: python3 reactivation_audio_player.py [--async]")
        print("  --async: Play audio in background without blocking")
        print("")
        print("To adjust volume, edit the self.volume value in the script")
        print("Plays audio from reactivation_audio folder with precise timing")
        return

    player = ReactivationAudioPlayer()

    if len(sys.argv) > 1 and sys.argv[1] == '--async':
        # Non-blocking playback
        player.play_async()
        print("✅ Audio playback initiated (non-blocking)")
    else:
        # Blocking playback
        success = player.play_reactivation_audio()
        if success:
            print("✅ Audio playback completed")
        else:
            print("❌ Audio playback failed")
            sys.exit(1)

if __name__ == "__main__":
    main()
