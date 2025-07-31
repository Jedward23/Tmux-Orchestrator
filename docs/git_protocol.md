# Git Discipline - MANDATORY FOR ALL AGENTS

## Core Git Safety Rules

**CRITICAL**: Every agent MUST follow these git practices to prevent work loss:

### 1. Auto-Commit Every 30 Minutes
```bash
# Set a timer/reminder to commit regularly
git add -A
git commit -m "Progress: [specific description of what was done]"
```

### 2. Commit Before Task Switches
- ALWAYS commit current work before starting a new task
- Never leave uncommitted changes when switching context
- Tag working versions before major changes

### 3. Feature Branch Workflow
```bash
# Before starting any new feature/task
git checkout -b feature/[descriptive-name]

# After completing feature
git add -A
git commit -m "Complete: [feature description]"
git tag stable-[feature]-$(date +%Y%m%d-%H%M%S)
```

### 4. Meaningful Commit Messages
- Bad: "fixes", "updates", "changes"
- Good: "Add user authentication endpoints with JWT tokens"
- Good: "Fix null pointer in payment processing module"
- Good: "Refactor database queries for 40% performance gain"

### 5. Never Work >1 Hour Without Committing
- If you've been working for an hour, stop and commit
- Even if the feature isn't complete, commit as "WIP: [description]"
- This ensures work is never lost due to crashes or errors

## Git Emergency Recovery

If something goes wrong:
```bash
# Check recent commits
git log --oneline -10

# Recover from last commit if needed
git stash  # Save any uncommitted changes
git reset --hard HEAD  # Return to last commit

# Check stashed changes
git stash list
git stash pop  # Restore stashed changes if needed
```

## Project Manager Git Responsibilities

Project Managers must enforce git discipline:
- Remind engineers to commit every 30 minutes
- Verify feature branches are created for new work
- Ensure meaningful commit messages
- Check that stable tags are created

## Why This Matters

- **Work Loss Prevention**: Hours of work can vanish without commits
- **Collaboration**: Other agents can see and build on committed work
- **Rollback Safety**: Can always return to a working state
- **Progress Tracking**: Clear history of what was accomplished
