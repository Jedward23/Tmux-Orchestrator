---
allowed-tools: [Read, Grep, Glob, Write, Edit, TodoWrite]
description: "Design system architecture, APIs, and component interfaces"
---

# /sc:design - System and Component Design

## Purpose
Design system architecture, APIs, component interfaces, and technical specifications.

## Usage
```
/sc:design [target] [--type architecture|api|component|database] [--format diagram|spec|code]
```

## Arguments
- `target` - System, component, or feature to design
- `--type` - Design type (architecture, api, component, database)
- `--format` - Output format (diagram, spec, code)
- `--iterative` - Enable iterative design refinement

## Execution
1. Analyze requirements and design constraints
2. Create initial design concepts and alternatives
3. Develop detailed design specifications
4. Validate design against requirements and best practices
5. Generate design documentation and implementation guides

## Claude Code Integration
- Uses Read for requirement analysis
- Leverages Write for design documentation
- Applies TodoWrite for design task tracking
- Maintains consistency with architectural patterns