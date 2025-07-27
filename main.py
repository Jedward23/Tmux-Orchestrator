#!/usr/bin/env python3
"""
Tmux Orchestrator - Main Entry Point

This is the primary entry point for the Tmux Orchestrator system.
Run this script to start monitoring and managing Claude agents across tmux sessions.

Usage:
    python main.py              # Interactive mode
    python main.py --status     # Show current status
    python main.py --monitor    # Continuous monitoring mode
    python main.py --snapshot   # Generate snapshot for analysis
"""

import sys
import argparse
import json
from tmux_utils import TmuxOrchestrator


def main():
    """Main entry point for Tmux Orchestrator"""
    parser = argparse.ArgumentParser(
        description="Tmux Orchestrator - AI-powered session management",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                    # Interactive mode
  python main.py --status           # Show all sessions/windows
  python main.py --monitor          # Start monitoring mode
  python main.py --snapshot         # Generate Claude analysis snapshot
  python main.py --find "Claude"    # Find windows containing "Claude"
        """
    )
    
    parser.add_argument(
        '--status', 
        action='store_true',
        help='Display current status of all tmux sessions and windows'
    )
    
    parser.add_argument(
        '--monitor',
        action='store_true', 
        help='Start continuous monitoring mode'
    )
    
    parser.add_argument(
        '--snapshot',
        action='store_true',
        help='Generate a formatted snapshot for Claude analysis'
    )
    
    parser.add_argument(
        '--find',
        type=str,
        metavar='NAME',
        help='Find windows by name across all sessions'
    )
    
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output in JSON format (works with --status)'
    )
    
    parser.add_argument(
        '--disable-safety',
        action='store_true',
        help='Disable safety confirmations for automated scripts'
    )
    
    args = parser.parse_args()
    
    # Initialize orchestrator
    orchestrator = TmuxOrchestrator()
    
    # Disable safety mode if requested
    if args.disable_safety:
        orchestrator.safety_mode = False
    
    try:
        if args.status:
            handle_status(orchestrator, args.json)
        elif args.monitor:
            handle_monitor(orchestrator)
        elif args.snapshot:
            handle_snapshot(orchestrator)
        elif args.find:
            handle_find(orchestrator, args.find)
        else:
            handle_interactive(orchestrator)
            
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def handle_status(orchestrator, json_output=False):
    """Handle --status command"""
    status = orchestrator.get_all_windows_status()
    
    if json_output:
        print(json.dumps(status, indent=2))
    else:
        print("Tmux Orchestrator Status")
        print("=" * 40)
        
        for session in status['sessions']:
            print(f"\nSession: {session['name']}")
            print(f"  Attached: {'Yes' if session['attached'] else 'No'}")
            print(f"  Windows: {len(session['windows'])}")
            
            for window in session['windows']:
                active_marker = " (ACTIVE)" if window['active'] else ""
                print(f"    {window['index']}: {window['name']}{active_marker}")


def handle_monitor(orchestrator):
    """Handle --monitor command"""
    print("Starting Tmux Orchestrator monitoring mode...")
    print("Press Ctrl+C to stop")
    print("-" * 40)
    
    import time
    
    while True:
        try:
            # Clear screen and show current status
            print("\033[2J\033[H")  # Clear screen and move cursor to top
            print(f"Tmux Orchestrator - Monitoring Mode")
            print(f"Last update: {orchestrator.get_all_windows_status()['timestamp']}")
            print("-" * 60)
            
            handle_status(orchestrator, json_output=False)
            
            print("\nPress Ctrl+C to stop monitoring...")
            time.sleep(10)  # Update every 10 seconds
            
        except KeyboardInterrupt:
            break


def handle_snapshot(orchestrator):
    """Handle --snapshot command"""
    snapshot = orchestrator.create_monitoring_snapshot()
    print(snapshot)


def handle_find(orchestrator, window_name):
    """Handle --find command"""
    matches = orchestrator.find_window_by_name(window_name)
    
    if matches:
        print(f"Found {len(matches)} window(s) matching '{window_name}':")
        for session_name, window_index in matches:
            print(f"  {session_name}:{window_index}")
    else:
        print(f"No windows found matching '{window_name}'")


def handle_interactive(orchestrator):
    """Handle interactive mode"""
    print("Tmux Orchestrator - Interactive Mode")
    print("=" * 40)
    print("Available commands:")
    print("  status    - Show current status")
    print("  snapshot  - Generate analysis snapshot")
    print("  find NAME - Find windows by name")
    print("  quit      - Exit")
    print()
    
    while True:
        try:
            command = input("orchestrator> ").strip().lower()
            
            if command == 'quit' or command == 'exit':
                break
            elif command == 'status':
                handle_status(orchestrator)
            elif command == 'snapshot':
                handle_snapshot(orchestrator)
            elif command.startswith('find '):
                window_name = command[5:].strip()
                handle_find(orchestrator, window_name)
            elif command == 'help':
                print("Available commands: status, snapshot, find NAME, quit")
            elif command == '':
                continue
            else:
                print(f"Unknown command: {command}")
                print("Type 'help' for available commands")
                
        except KeyboardInterrupt:
            break
        except EOFError:
            break
    
    print("\nGoodbye!")


if __name__ == "__main__":
    main()