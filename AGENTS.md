# AGENTS Guidelines for Tmux Orchestrator

This file provides repository-specific instructions for AI agents and developers working with the Tmux Orchestrator and SuperClaude framework.

## Development Principles

- **Security First** – Follow the security rules in `CLAUDE.md`. Never commit secrets or personal configuration files. Use environment variables for sensitive values and keep the `.gitignore` up to date.
- **Dynamic Paths** – Avoid hard‑coded absolute paths in scripts. Determine the repository root dynamically with `$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)` as shown in `REFERENCE_GUIDELINES.md`.
- **Cross‑Platform Compatibility** – Use relative paths and portable commands so the orchestrator works on macOS, Linux, and WSL environments.
- **Documentation** – Update `CLAUDE.md` when adding new tmux commands, orchestration patterns, or SuperClaude workflows. Record lessons learned in `LEARNINGS.md`.
- **MCP Server** – The orchestrator integrates with the SuperClaude MCP server (e.g., Context7) for sequential analysis and pattern discovery. Follow the MCP usage rules in `agent-briefings/issue-curator-briefing.md`.

## Coding Standards

- Keep scripts in the `scripts/` directory shellcheck‑clean and executable.
- Python modules should pass `flake8` style checks (if configured) and be placed under `core/`, `cli/`, or `setup/` as appropriate.
- TypeScript/Node components should adhere to `prettier` formatting; run `npx prettier --write` on modified files.

## Testing

- Run `pytest -q` before committing any Python changes. All tests in `tests/` must pass.
- If Node tests are added in the future, run `npm test` as well.

## Workflow Notes

- Use the helper script `schedule_with_note.sh` to schedule orchestrator check‑ins. It writes to `next_check_note.txt` in the repository root.
- Status reports such as `orchestrator-status-report.md` help track progress; keep them concise.

## Commit Checklist

1. Verify no sensitive data or personal files are included.
2. Ensure dynamic path handling and cross‑platform compatibility.
3. Run the test suite (`pytest -q`).
4. Update documentation (`CLAUDE.md`, `LEARNINGS.md`, or relevant docs) when necessary.

---
These guidelines keep the Tmux Orchestrator consistent and secure while enabling autonomous agents to collaborate effectively.
