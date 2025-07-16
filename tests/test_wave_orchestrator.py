import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.wave_orchestrator import WaveOrchestrator


def test_score_complexity():
    orchestrator = WaveOrchestrator()
    score = orchestrator.score_complexity(0.8, 50, 3)
    assert 0.5 <= score <= 1.0


def test_strategy_selection():
    orchestrator = WaveOrchestrator()
    score = orchestrator.score_complexity(0.9, 120, 4)
    strategy = orchestrator.select_strategy(score, 120)
    assert strategy == "enterprise"


def test_plan_waves():
    orchestrator = WaveOrchestrator()
    waves = orchestrator.plan_waves("systematic")
    assert [w.name for w in waves] == ["Analyze", "Design", "Implement", "Validate"]
