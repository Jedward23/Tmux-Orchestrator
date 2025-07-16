#!/usr/bin/env python3
"""Generate a combined tmux status report for all sessions."""

import argparse
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tmux_utils import TmuxOrchestrator


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate multi-project status report")
    parser.add_argument("-o", "--output", help="Write report to file")
    args = parser.parse_args()

    orchestrator = TmuxOrchestrator()
    snapshot = orchestrator.create_monitoring_snapshot()

    if args.output:
        with open(args.output, "w") as f:
            f.write(snapshot)
        print(f"Status report written to {args.output}")
    else:
        print(snapshot)


if __name__ == "__main__":
    main()
