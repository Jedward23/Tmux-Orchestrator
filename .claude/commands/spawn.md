---
allowed-tools: [Read, Grep, Glob, Bash, TodoWrite, Edit, MultiEdit, Write]
description: "Break complex tasks into coordinated subtasks with efficient execution"
---

# /sc:spawn - Task Orchestration

## Purpose
Decompose complex requests into manageable subtasks and coordinate their execution.

## Usage
```
/sc:spawn [task] [--sequential|--parallel] [--validate]
```

## Arguments
- `task` - Complex task or project to orchestrate
- `--sequential` - Execute tasks in dependency order (default)
- `--parallel` - Execute independent tasks concurrently
- `--validate` - Enable quality checkpoints between tasks

## Execution
1. Parse request and create hierarchical task breakdown
2. Map dependencies between subtasks
3. Choose optimal execution strategy (sequential/parallel)
4. Execute subtasks with progress monitoring
5. Integrate results and validate completion

## Claude Code Integration
- Uses TodoWrite for task breakdown and tracking
- Leverages file operations for coordinated changes
- Applies efficient batching for related operations
- Maintains clear dependency management