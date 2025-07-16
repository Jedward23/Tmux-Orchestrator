---
allowed-tools: [Read, Grep, Glob, Bash]
description: "Provide development estimates for tasks, features, or projects"
---

# /sc:estimate - Development Estimation

## Purpose
Generate accurate development estimates for tasks, features, or projects based on complexity analysis.

## Usage
```
/sc:estimate [target] [--type time|effort|complexity|cost] [--unit hours|days|weeks]
```

## Arguments
- `target` - Task, feature, or project to estimate
- `--type` - Estimation type (time, effort, complexity, cost)
- `--unit` - Time unit for estimates (hours, days, weeks)
- `--breakdown` - Provide detailed breakdown of estimates

## Execution
1. Analyze scope and requirements of target
2. Identify complexity factors and dependencies
3. Apply estimation methodologies and historical data
4. Generate estimates with confidence intervals
5. Present detailed breakdown with risk factors

## Claude Code Integration
- Uses Read for requirement analysis
- Leverages Glob for codebase complexity assessment
- Applies Grep for pattern-based estimation
- Maintains structured estimation documentation