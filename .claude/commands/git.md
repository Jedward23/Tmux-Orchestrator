---
allowed-tools: [Bash, Read, Glob, TodoWrite, Edit]
description: "Git operations with intelligent commit messages and branch management"
---

# /sc:git - Git Operations

## Purpose
Execute Git operations with intelligent commit messages, branch management, and workflow optimization.

## Usage
```
/sc:git [operation] [args] [--smart-commit] [--branch-strategy]
```

## Arguments
- `operation` - Git operation (add, commit, push, pull, merge, branch, status)
- `args` - Operation-specific arguments
- `--smart-commit` - Generate intelligent commit messages
- `--branch-strategy` - Apply branch naming conventions
- `--interactive` - Interactive mode for complex operations

## Execution
1. Analyze current Git state and repository context
2. Execute requested Git operations with validation
3. Apply intelligent commit message generation
4. Handle merge conflicts and branch management
5. Provide clear feedback and next steps

## Claude Code Integration
- Uses Bash for Git command execution
- Leverages Read for repository analysis
- Applies TodoWrite for operation tracking
- Maintains Git best practices and conventions