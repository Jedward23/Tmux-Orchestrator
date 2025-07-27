# Reactivation Audio

This folder contains audio files that will be played when the bot reactivates (either when schedules resume or when timers expire).

## How It Works

The bot automatically plays audio notifications during reactivation in two scenarios:

1. **Schedule-based reactivation** - When using `schedule_with_note.sh`
2. **Claude limit reactivation** - When `claude_limit_monitor.py` resumes sessions after usage limits reset

## Audio Playback Specifications

- **Timing**: Plays from second 3.5 to second 8.0 (4.5 seconds duration)
- **File Selection**: Automatically plays the first audio file found in this folder
- **Execution**: Non-blocking - audio plays concurrently with other reactivation tasks
- **Fallback**: Gracefully handles missing audio files

## Supported Audio Formats

- MP3 (`.mp3`)
- WAV (`.wav`)
- M4A (`.m4a`)
- AAC (`.aac`)
- OGG (`.ogg`)
- FLAC (`.flac`)

## Adding or Replacing Audio Files

1. **To replace the current audio**: Simply replace the existing file with your new audio file
2. **To add new audio**: Add any supported audio file to this folder
3. **File naming**: Use any descriptive filename - the system automatically detects the first audio file

## Requirements

### For Precise Timing (Recommended)
- **ffmpeg** with ffplay: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux)

### Fallback Option (macOS only)
- **afplay**: Built into macOS (plays full file, no timing control)

## Testing Audio Playback

```bash
# Test audio playback directly
python3 ../reactivation_audio_player.py

# Test with async (non-blocking) playback
python3 ../reactivation_audio_player.py --async

# Test full reactivation with audio
python3 ../claude_limit_monitor.py --continue-all

# Test scheduled reactivation
../schedule_with_note.sh 0.1 "Test audio" "your-session:0"
```

## Volume Control

To adjust the volume, simply edit the `self.volume` value in `reactivation_audio_player.py`:

```python
# 🔊 VOLUME CONTROL - Adjust this value as needed
# 0.0 = mute, 0.5 = 50%, 1.0 = 100%, 1.5 = 150%, etc.
self.volume = 0.4  # Default: 40% volume
```

- **Volume range**: 0.0 (mute) to 2.0+ (amplified)
- **Recommended values**: 0.2 (quiet) to 0.8 (loud)
- **Current default**: 0.4 (40% volume)

## Troubleshooting

### No Audio Plays
- Check if audio files exist in this folder
- Verify ffmpeg is installed: `ffplay -version`
- Check file permissions

### Audio Plays But Wrong Timing
- Ensure ffmpeg is installed (afplay doesn't support timing)
- Verify audio file is longer than 8 seconds

### Audio Blocks Other Operations
- Make sure you're using `--async` flag when calling the audio player directly
- The integrated reactivation systems automatically use non-blocking playback

## Current Audio File

- `PONE LA MUSICA - Fx Meroth.mp3` - Default reactivation sound

## Integration Details

The audio system is integrated into:

1. **schedule_with_note.sh** - Line 31: Calls `reactivation_audio_player.py --async`
2. **claude_limit_monitor.py** - `send_continue_to_all_sessions()` method: Calls audio player before continuing sessions

Both integrations are non-blocking and will continue with their normal operations even if audio playback fails.
