#!/usr/bin/env python3
"""
SuperClaude + Tmux Orchestrator CLI
Core command interface implementation

This module provides the unified CLI interface for SuperClaude framework
integrated with the Tmux Orchestrator system.
"""

from .core import OrchestratorCLI
from .commands import CommandRegistry
from .router import CommandRouter
from .validator import CommandValidator
from .plugins import PluginManager

__version__ = "1.0.0"
__all__ = [
    "OrchestratorCLI",
    "CommandRegistry",
    "CommandRouter",
    "CommandValidator",
    "PluginManager"
]