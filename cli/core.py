#!/usr/bin/env python3
"""
Core CLI implementation for SuperClaude + Tmux Orchestrator

This module provides the main CLI entry point and command dispatch.
"""

import argparse
import sys
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any

from .commands import CommandRegistry
from .router import CommandRouter
from .validator import CommandValidator
from .plugins import PluginManager
from .exceptions import CLIError, ValidationError, CommandNotFoundError


class OrchestratorCLI:
    """Main CLI interface for SuperClaude + Tmux Orchestrator"""
    
    def __init__(self):
        self.logger = self._setup_logging()
        self.registry = CommandRegistry()
        self.router = CommandRouter(self.registry)
        self.validator = CommandValidator()
        self.plugin_manager = PluginManager()
        self.parser = None
        self._initialize()
    
    def _setup_logging(self) -> logging.Logger:
        """Configure logging for the CLI"""
        logger = logging.getLogger("orchestrator-cli")
        logger.setLevel(logging.INFO)
        
        # Console handler
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        return logger
    
    def _initialize(self):
        """Initialize CLI components"""
        # Register built-in commands
        self._register_builtin_commands()
        
        # Load plugins
        self.plugin_manager.load_plugins()
        
        # Register plugin commands
        for plugin in self.plugin_manager.get_plugins():
            plugin.register_commands(self.registry)
        
        # Build parser
        self._build_parser()
    
    def _register_builtin_commands(self):
        """Register core built-in commands"""
        from .builtin_commands import (
            SessionCommand, AgentCommand, DeployCommand,
            MonitorCommand, AnalyzeCommand, ImproveCommand,
            StatusCommand, PluginCommand, ConfigCommand
        )
        
        # Session management
        self.registry.register("session", SessionCommand())
        
        # Agent management
        self.registry.register("agent", AgentCommand())
        
        # Deployment
        self.registry.register("deploy", DeployCommand())
        
        # Monitoring
        self.registry.register("monitor", MonitorCommand())
        
        # Analysis
        self.registry.register("analyze", AnalyzeCommand())
        
        # Improvements
        self.registry.register("improve", ImproveCommand())
        
        # Status
        self.registry.register("status", StatusCommand())
        
        # Plugin management
        self.registry.register("plugin", PluginCommand())
        
        # Configuration
        self.registry.register("config", ConfigCommand())
    
    def _build_parser(self):
        """Build the argument parser"""
        self.parser = argparse.ArgumentParser(
            prog="orchestrator",
            description="SuperClaude + Tmux Orchestrator CLI",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  orchestrator session create myproject --path ~/projects/myproject
  orchestrator agent deploy architect --session myproject
  orchestrator analyze --session myproject --type comprehensive
  orchestrator status --session myproject
  
For command-specific help:
  orchestrator <command> --help
            """
        )
        
        # Global arguments
        self.parser.add_argument(
            "--verbose", "-v",
            action="count",
            default=0,
            help="Increase verbosity (-v, -vv, -vvv)"
        )
        
        self.parser.add_argument(
            "--quiet", "-q",
            action="store_true",
            help="Suppress non-error output"
        )
        
        self.parser.add_argument(
            "--config", "-c",
            type=Path,
            help="Path to configuration file"
        )
        
        self.parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be done without executing"
        )
        
        self.parser.add_argument(
            "--version",
            action="version",
            version="%(prog)s 1.0.0"
        )
        
        # Create subparsers for commands
        subparsers = self.parser.add_subparsers(
            dest="command",
            title="Commands",
            description="Available commands",
            help="Command help"
        )
        
        # Add command parsers
        for name, command in self.registry.get_all().items():
            command_parser = subparsers.add_parser(
                name,
                help=command.get_help(),
                description=command.get_description()
            )
            command.configure_parser(command_parser)
    
    def _configure_logging_level(self, args):
        """Configure logging based on verbosity"""
        if args.quiet:
            self.logger.setLevel(logging.ERROR)
        elif args.verbose == 1:
            self.logger.setLevel(logging.INFO)
        elif args.verbose == 2:
            self.logger.setLevel(logging.DEBUG)
        elif args.verbose >= 3:
            # Set all loggers to DEBUG
            logging.getLogger().setLevel(logging.DEBUG)
    
    def run(self, argv: Optional[List[str]] = None) -> int:
        """Main entry point for CLI execution"""
        try:
            # Parse arguments
            args = self.parser.parse_args(argv)
            
            # Configure logging
            self._configure_logging_level(args)
            
            # No command specified
            if not args.command:
                self.parser.print_help()
                return 0
            
            # Validate command
            try:
                self.validator.validate_command(args.command, args)
            except ValidationError as e:
                self.logger.error(f"Validation error: {e}")
                return 1
            
            # Route and execute command
            result = self.router.route(args.command, args)
            
            return 0 if result else 1
            
        except CommandNotFoundError as e:
            self.logger.error(str(e))
            self.logger.info("Run 'orchestrator --help' for available commands")
            return 1
        except CLIError as e:
            self.logger.error(f"CLI error: {e}")
            return 1
        except KeyboardInterrupt:
            self.logger.info("\nOperation cancelled by user")
            return 130
        except Exception as e:
            self.logger.exception(f"Unexpected error: {e}")
            return 1
    
    def get_command_tree(self) -> Dict[str, Any]:
        """Get hierarchical command structure for documentation"""
        tree = {}
        for name, command in self.registry.get_all().items():
            category = command.get_category()
            if category not in tree:
                tree[category] = {}
            tree[category][name] = {
                "help": command.get_help(),
                "description": command.get_description(),
                "aliases": command.get_aliases()
            }
        return tree


def main():
    """Console script entry point"""
    cli = OrchestratorCLI()
    sys.exit(cli.run())


if __name__ == "__main__":
    main()