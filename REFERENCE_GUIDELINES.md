# Reference Guidelines

This repository aims for consistency across scripts and documentation.

## Path Handling

- Avoid hard-coded absolute paths in scripts.
- Determine the repository root dynamically using `$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)` when a script needs to reference files in the repo.
- Store transient files such as `next_check_note.txt` in the repository root or a configurable location using environment variables.

## Environment Variables

- All sensitive values should be provided via environment variables rather than committed files.
- Example variables: `API_KEY`, `TMUX_SESSION`, `NOTE_FILE`.

## Cross-Platform Support

- Use relative paths so that scripts work on macOS, Linux, and WSL environments.
- Document platform-specific commands separately if needed.

## Updating Documentation

- When paths are shown in documentation, prefer placeholders like `<path/to/file>`.
- Ensure code examples mirror the current implementation of scripts.

