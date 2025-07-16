---
allowed-tools: [Read, Grep, Glob, Write, Edit]
description: "Create focused documentation for specific components or features"
---

# /sc:document - Focused Documentation

## Purpose
Generate precise, focused documentation for specific components, functions, or features.

## Usage
```
/sc:document [target] [--type inline|external|api|guide] [--style brief|detailed]
```

## Arguments
- `target` - Specific file, function, or component to document
- `--type` - Documentation type (inline, external, api, guide)
- `--style` - Documentation style (brief, detailed)
- `--template` - Use specific documentation template

## Execution
1. Analyze target component and extract key information
2. Identify documentation requirements and audience
3. Generate appropriate documentation based on type and style
4. Apply consistent formatting and structure
5. Integrate with existing documentation ecosystem

## Claude Code Integration
- Uses Read for deep component analysis
- Leverages Edit for inline documentation updates
- Applies Write for external documentation creation
- Maintains documentation standards and conventions