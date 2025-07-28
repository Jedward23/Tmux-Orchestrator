#!/usr/bin/env python3

import subprocess
import json
import time
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime


# Custom Exception Classes for Tmux Operations
class TmuxError(Exception):
    """Base exception for tmux utility errors."""
    pass


class TmuxSessionNotFound(TmuxError):
    """Raised when a specific tmux session cannot be found."""
    def __init__(self, session_name: str):
        self.session_name = session_name
        super().__init__(f"Tmux session '{session_name}' not found")


class TmuxWindowNotFound(TmuxError):
    """Raised when a specific tmux window cannot be found."""
    def __init__(self, session_name: str, window_index: int):
        self.session_name = session_name
        self.window_index = window_index
        super().__init__(f"Window {window_index} not found in session '{session_name}'")


class TmuxCommandError(TmuxError):
    """Raised when a tmux command fails to execute."""
    def __init__(self, command: List[str], stderr: str, returncode: Optional[int] = None):
        self.command = command
        self.stderr = stderr
        self.returncode = returncode
        super().__init__(f"Command '{' '.join(command)}' failed with error: {stderr}")


class TmuxPermissionDenied(TmuxError):
    """Raised when user denies permission for a tmux operation."""
    def __init__(self, operation: str, target: str):
        self.operation = operation
        self.target = target
        super().__init__(f"Permission denied for {operation} on {target}")


class TmuxCaptureError(TmuxError):
    """Raised when capturing window content fails."""
    def __init__(self, session_name: str, window_index: int, reason: str):
        self.session_name = session_name
        self.window_index = window_index
        self.reason = reason
        super().__init__(f"Failed to capture content from {session_name}:{window_index}: {reason}")

@dataclass
class TmuxWindow:
    session_name: str
    window_index: int
    window_name: str
    active: bool
    
@dataclass
class TmuxSession:
    name: str
    windows: List[TmuxWindow]
    attached: bool

class TmuxOrchestrator:
    def __init__(self):
        self.safety_mode = True
        self.max_lines_capture = 1000
        
    def get_tmux_sessions(self) -> List[TmuxSession]:
        """
        Get all tmux sessions and their windows.

        Returns:
            List[TmuxSession]: List of all tmux sessions with their windows

        Raises:
            TmuxCommandError: If tmux commands fail to execute
            TmuxSessionNotFound: If no tmux server is running
        """
        try:
            # Get sessions
            sessions_cmd = ["tmux", "list-sessions", "-F", "#{session_name}:#{session_attached}"]
            sessions_result = subprocess.run(sessions_cmd, capture_output=True, text=True, check=True)

            # Handle case where no sessions exist
            if not sessions_result.stdout.strip():
                return []

            sessions = []
            for line in sessions_result.stdout.strip().split('\n'):
                if not line:
                    continue

                try:
                    session_name, attached = line.split(':')
                except ValueError:
                    # Skip malformed lines
                    continue

                # Get windows for this session
                try:
                    windows_cmd = ["tmux", "list-windows", "-t", session_name, "-F", "#{window_index}:#{window_name}:#{window_active}"]
                    windows_result = subprocess.run(windows_cmd, capture_output=True, text=True, check=True)

                    windows = []
                    for window_line in windows_result.stdout.strip().split('\n'):
                        if not window_line:
                            continue
                        try:
                            window_index, window_name, window_active = window_line.split(':')
                            windows.append(TmuxWindow(
                                session_name=session_name,
                                window_index=int(window_index),
                                window_name=window_name,
                                active=window_active == '1'
                            ))
                        except (ValueError, IndexError):
                            # Skip malformed window lines
                            continue

                    sessions.append(TmuxSession(
                        name=session_name,
                        windows=windows,
                        attached=attached == '1'
                    ))

                except subprocess.CalledProcessError as e:
                    # If we can't get windows for a session, raise an error
                    raise TmuxCommandError(windows_cmd, e.stderr or str(e), e.returncode)

            return sessions

        except subprocess.CalledProcessError as e:
            if "no server running" in str(e.stderr).lower():
                raise TmuxSessionNotFound("No tmux server running")
            else:
                raise TmuxCommandError(sessions_cmd, e.stderr or str(e), e.returncode)
    
    def capture_window_content(self, session_name: str, window_index: int, num_lines: int = 50) -> str:
        """
        Safely capture the last N lines from a tmux window.

        Args:
            session_name: Name of the tmux session
            window_index: Index of the window to capture
            num_lines: Number of lines to capture (limited by max_lines_capture)

        Returns:
            str: The captured window content

        Raises:
            TmuxCaptureError: If capturing window content fails
            TmuxWindowNotFound: If the specified window doesn't exist
        """
        if num_lines > self.max_lines_capture:
            num_lines = self.max_lines_capture

        try:
            cmd = ["tmux", "capture-pane", "-t", f"{session_name}:{window_index}", "-p", "-S", f"-{num_lines}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr or str(e)
            if "can't find window" in error_msg.lower() or "no such window" in error_msg.lower():
                raise TmuxWindowNotFound(session_name, window_index)
            else:
                raise TmuxCaptureError(session_name, window_index, error_msg)
    
    def get_window_info(self, session_name: str, window_index: int) -> Dict:
        """
        Get detailed information about a specific window.

        Args:
            session_name: Name of the tmux session
            window_index: Index of the window

        Returns:
            Dict: Window information including name, active status, panes, layout, and content

        Raises:
            TmuxWindowNotFound: If the specified window doesn't exist
            TmuxCommandError: If tmux command fails
            TmuxCaptureError: If capturing window content fails
        """
        try:
            cmd = ["tmux", "display-message", "-t", f"{session_name}:{window_index}", "-p",
                   "#{window_name}:#{window_active}:#{window_panes}:#{window_layout}"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)

            if not result.stdout.strip():
                raise TmuxWindowNotFound(session_name, window_index)

            parts = result.stdout.strip().split(':')
            if len(parts) < 4:
                raise TmuxCommandError(cmd, f"Unexpected output format: {result.stdout.strip()}")

            # Capture window content - this may raise TmuxCaptureError
            content = self.capture_window_content(session_name, window_index)

            return {
                "name": parts[0],
                "active": parts[1] == '1',
                "panes": int(parts[2]),
                "layout": parts[3],
                "content": content
            }

        except subprocess.CalledProcessError as e:
            error_msg = e.stderr or str(e)
            if "can't find window" in error_msg.lower() or "no such window" in error_msg.lower():
                raise TmuxWindowNotFound(session_name, window_index)
            else:
                raise TmuxCommandError(cmd, error_msg, e.returncode)
    
    def send_keys_to_window(self, session_name: str, window_index: int, keys: str, confirm: bool = True) -> None:
        """
        Safely send keys to a tmux window with confirmation.

        Args:
            session_name: Name of the tmux session
            window_index: Index of the window
            keys: Keys to send to the window
            confirm: Whether to ask for user confirmation in safety mode

        Raises:
            TmuxPermissionDenied: If user denies permission in safety mode
            TmuxWindowNotFound: If the specified window doesn't exist
            TmuxCommandError: If tmux command fails
        """
        if self.safety_mode and confirm:
            print(f"SAFETY CHECK: About to send '{keys}' to {session_name}:{window_index}")
            response = input("Confirm? (yes/no): ")
            if response.lower() != 'yes':
                raise TmuxPermissionDenied("send keys", f"{session_name}:{window_index}")

        try:
            cmd = ["tmux", "send-keys", "-t", f"{session_name}:{window_index}", keys]
            subprocess.run(cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr or str(e)
            if "can't find window" in error_msg.lower() or "no such window" in error_msg.lower():
                raise TmuxWindowNotFound(session_name, window_index)
            else:
                raise TmuxCommandError(cmd, error_msg, e.returncode)
    
    def send_command_to_window(self, session_name: str, window_index: int, command: str, confirm: bool = True) -> None:
        """
        Send a command to a window (adds Enter automatically).

        Args:
            session_name: Name of the tmux session
            window_index: Index of the window
            command: Command to send to the window
            confirm: Whether to ask for user confirmation in safety mode

        Raises:
            TmuxPermissionDenied: If user denies permission in safety mode
            TmuxWindowNotFound: If the specified window doesn't exist
            TmuxCommandError: If tmux command fails
        """
        # First send the command text - this may raise exceptions
        self.send_keys_to_window(session_name, window_index, command, confirm)

        # Then send the actual Enter key (C-m)
        try:
            cmd = ["tmux", "send-keys", "-t", f"{session_name}:{window_index}", "C-m"]
            subprocess.run(cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr or str(e)
            if "can't find window" in error_msg.lower() or "no such window" in error_msg.lower():
                raise TmuxWindowNotFound(session_name, window_index)
            else:
                raise TmuxCommandError(cmd, error_msg, e.returncode)
    
    def get_all_windows_status(self) -> Dict:
        """
        Get status of all windows across all sessions.

        Returns:
            Dict: Status information for all sessions and windows

        Note:
            This method handles exceptions gracefully - if individual windows fail,
            they will have an "error" field in their info instead of raising exceptions.
            This ensures the monitoring functionality continues to work even if some
            windows are inaccessible.
        """
        try:
            sessions = self.get_tmux_sessions()
        except TmuxError as e:
            # If we can't get sessions at all, return error status
            return {
                "timestamp": datetime.now().isoformat(),
                "error": str(e),
                "sessions": []
            }

        status = {
            "timestamp": datetime.now().isoformat(),
            "sessions": []
        }

        for session in sessions:
            session_data = {
                "name": session.name,
                "attached": session.attached,
                "windows": []
            }

            for window in session.windows:
                try:
                    window_info = self.get_window_info(session.name, window.window_index)
                except TmuxError as e:
                    # If we can't get info for this window, include error info
                    window_info = {"error": str(e)}

                window_data = {
                    "index": window.window_index,
                    "name": window.window_name,
                    "active": window.active,
                    "info": window_info
                }
                session_data["windows"].append(window_data)

            status["sessions"].append(session_data)

        return status
    
    def find_window_by_name(self, window_name: str) -> List[Tuple[str, int]]:
        """
        Find windows by name across all sessions.

        Args:
            window_name: Name pattern to search for (case-insensitive)

        Returns:
            List[Tuple[str, int]]: List of (session_name, window_index) tuples

        Raises:
            TmuxError: If unable to get session information
        """
        sessions = self.get_tmux_sessions()
        matches = []

        for session in sessions:
            for window in session.windows:
                if window_name.lower() in window.window_name.lower():
                    matches.append((session.name, window.window_index))

        return matches
    
    def create_monitoring_snapshot(self) -> str:
        """
        Create a comprehensive snapshot for Claude analysis.

        Returns:
            str: Formatted snapshot of all tmux sessions and windows

        Note:
            This method handles errors gracefully and includes error information
            in the snapshot rather than raising exceptions, ensuring monitoring
            continues even when some windows are inaccessible.
        """
        status = self.get_all_windows_status()

        # Format for Claude consumption
        snapshot = f"Tmux Monitoring Snapshot - {status['timestamp']}\n"
        snapshot += "=" * 50 + "\n\n"

        # Handle case where we couldn't get sessions at all
        if 'error' in status:
            snapshot += f"ERROR: {status['error']}\n"
            return snapshot

        for session in status['sessions']:
            snapshot += f"Session: {session['name']} ({'ATTACHED' if session['attached'] else 'DETACHED'})\n"
            snapshot += "-" * 30 + "\n"

            for window in session['windows']:
                snapshot += f"  Window {window['index']}: {window['name']}"
                if window['active']:
                    snapshot += " (ACTIVE)"
                snapshot += "\n"

                # Handle both successful window info and error cases
                if 'error' in window['info']:
                    snapshot += f"    ERROR: {window['info']['error']}\n"
                elif 'content' in window['info']:
                    # Get last 10 lines for overview
                    content_lines = window['info']['content'].split('\n')
                    recent_lines = content_lines[-10:] if len(content_lines) > 10 else content_lines
                    snapshot += "    Recent output:\n"
                    for line in recent_lines:
                        if line.strip():
                            snapshot += f"    | {line}\n"
                snapshot += "\n"

        return snapshot

if __name__ == "__main__":
    orchestrator = TmuxOrchestrator()
    status = orchestrator.get_all_windows_status()
    print(json.dumps(status, indent=2))