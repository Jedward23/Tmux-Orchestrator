"""Wave Orchestration Engine

Implements multi-stage wave planning and execution across tmux sessions.
This module addresses Issue #7 - Phase 3.1: Wave Orchestration System Implementation.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Dict

from tmux_utils import TmuxOrchestrator


@dataclass
class Wave:
    name: str
    commands: List[str] = field(default_factory=list)


class WaveOrchestrator:
    """Core Wave Orchestration system."""

    def __init__(self, tmux: Optional[TmuxOrchestrator] = None) -> None:
        self.tmux = tmux or TmuxOrchestrator()

    # ----------------------------
    # Complexity Assessment
    # ----------------------------
    def score_complexity(
        self,
        complexity: float,
        file_count: int,
        operation_types: int,
        domains: int = 1,
        flags: int = 0,
    ) -> float:
        """Calculate overall complexity score (0.0 - 1.0)."""
        score = 0.0
        score += max(0.0, min(1.0, complexity)) * 0.3
        score += max(0.0, min(1.0, file_count / 100)) * 0.25
        score += max(0.0, min(1.0, operation_types / 5)) * 0.2
        score += max(0.0, min(1.0, domains / 4)) * 0.15
        score += max(0.0, min(1.0, flags / 5)) * 0.1
        return round(min(score, 1.0), 3)

    def should_enable_wave(
        self, score: float, file_count: int, operation_types: int
    ) -> bool:
        """Determine if wave mode should activate."""
        return score >= 0.7 and file_count > 20 and operation_types > 2

    # ----------------------------
    # Wave Strategy Determination
    # ----------------------------
    def select_strategy(self, score: float, file_count: int) -> str:
        if file_count > 100 and score >= 0.7:
            return "enterprise"
        if score >= 0.7:
            return "systematic"
        if score >= 0.5:
            return "adaptive"
        return "progressive"

    def plan_waves(self, strategy: str) -> List[Wave]:
        """Generate a wave plan based on strategy."""
        if strategy == "enterprise":
            names = [
                "Assessment",
                "Planning",
                "Coordination",
                "Execution",
                "Validation",
                "Optimization",
            ]
        elif strategy == "systematic":
            names = ["Analyze", "Design", "Implement", "Validate"]
        elif strategy == "adaptive":
            names = ["Adapt", "Implement", "Validate", "Optimize"]
        else:  # progressive
            names = ["Plan", "Implement", "Validate", "Optimize"]

        return [Wave(name=n) for n in names]

    # ----------------------------
    # Wave Execution
    # ----------------------------
    def execute_waves(
        self,
        session_name: str,
        window_index: int,
        waves: List[Wave],
        confirm: bool = False,
    ) -> None:
        """Execute planned waves sequentially."""
        for wave in waves:
            for command in wave.commands:
                self.tmux.send_command_to_window(
                    session_name, window_index, command, confirm=confirm
                )

    # Convenience method tying everything together
    def orchestrate(
        self,
        session: str,
        window: int,
        complexity: float,
        file_count: int,
        operation_types: int,
        commands_per_wave: Dict[str, List[str]],
        domains: int = 1,
        flags: int = 0,
        confirm: bool = False,
    ) -> List[Wave]:
        """High-level API to score, plan and execute waves."""
        score = self.score_complexity(
            complexity, file_count, operation_types, domains, flags
        )
        strategy = self.select_strategy(score, file_count)
        waves = self.plan_waves(strategy)

        # attach commands
        for wave in waves:
            if wave.name in commands_per_wave:
                wave.commands.extend(commands_per_wave[wave.name])

        if self.should_enable_wave(score, file_count, operation_types):
            self.execute_waves(session, window, waves, confirm=confirm)
        return waves
