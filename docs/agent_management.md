# Agent Management Guide

## Creating a Project Manager

### When User Says "Create a project manager for [session]"

#### 1. Analyze the Session
```bash
# List windows in the session
tmux list-windows -t [session] -F "#{window_index}: #{window_name}"

# Check each window to understand project
tmux capture-pane -t [session]:0 -p | tail -50
```

#### 2. Create PM Window
```bash
# Get project path from existing window
PROJECT_PATH=$(tmux display-message -t [session]:0 -p '#{pane_current_path}')

# Create new window for PM
tmux new-window -t [session] -n "Project-Manager" -c "$PROJECT_PATH"
```

#### 3. Start and Brief the PM
```bash
# Start Claude
tmux send-keys -t [session]:[PM-window] "claude" Enter
sleep 5

# Send PM-specific briefing
tmux send-keys -t [session]:[PM-window] "You are the Project Manager for this project. Your responsibilities:

1. **Quality Standards**: Maintain exceptionally high standards. No shortcuts, no compromises.
2. **Verification**: Test everything. Trust but verify all work.
3. **Team Coordination**: Manage communication between team members efficiently.
4. **Progress Tracking**: Monitor velocity, identify blockers, report to orchestrator.
5. **Risk Management**: Identify potential issues before they become problems.

Key Principles:
- Be meticulous about testing and verification
- Create test plans for every feature
- Ensure code follows best practices
- Track technical debt
- Communicate clearly and constructively

First, analyze the project and existing team members, then introduce yourself to the developer in window 0."
sleep 1
tmux send-keys -t [session]:[PM-window] Enter
```

#### 4. PM Introduction Protocol
The PM should:
```bash
# Check developer window
tmux capture-pane -t [session]:0 -p | tail -30

# Introduce themselves
tmux send-keys -t [session]:0 "Hello! I'm the new Project Manager for this project. I'll be helping coordinate our work and ensure we maintain high quality standards. Could you give me a brief status update on what you're currently working on?"
sleep 1
tmux send-keys -t [session]:0 Enter
```

## Team Deployment

### When User Says "Work on [new project]"

#### 1. Project Analysis
```bash
# Find project
ls -la ~/Coding/ | grep -i "[project-name]"

# Analyze project type
cd ~/Coding/[project-name]
test -f package.json && echo "Node.js project"
test -f requirements.txt && echo "Python project"
```

#### 2. Propose Team Structure

**Small Project**: 1 Developer + 1 PM
**Medium Project**: 2 Developers + 1 PM + 1 QA  
**Large Project**: Lead + 2 Devs + PM + QA + DevOps

#### 3. Deploy Team
Create session and deploy all agents with specific briefings for their roles.

## Agent Lifecycle Management

### Creating Temporary Agents
For specific tasks (code review, bug fix):
```bash
# Create with clear temporary designation
tmux new-window -t [session] -n "TEMP-CodeReview"
```

### Ending Agents Properly
```bash
# 1. Capture complete conversation
tmux capture-pane -t [session]:[window] -S - -E - > \
  ~/Coding/Tmux\ orchestrator/registry/logs/[session]_[role]_$(date +%Y%m%d_%H%M%S).log

# 2. Create summary of work completed
echo "=== Agent Summary ===" >> [logfile]
echo "Tasks Completed:" >> [logfile]
echo "Issues Encountered:" >> [logfile]
echo "Handoff Notes:" >> [logfile]

# 3. Close window
tmux kill-window -t [session]:[window]
```

### Agent Logging Structure
```
~/Coding/Tmux orchestrator/registry/
├── logs/            # Agent conversation logs
├── sessions.json    # Active session tracking
└── notes/           # Orchestrator notes and summaries
```

## Quality Assurance Protocols

### PM Verification Checklist
- [ ] All code has tests
- [ ] Error handling is comprehensive
- [ ] Performance is acceptable
- [ ] Security best practices followed
- [ ] Documentation is updated
- [ ] No technical debt introduced

### Continuous Verification
PMs should implement:
1. Code review before any merge
2. Test coverage monitoring
3. Performance benchmarking
4. Security scanning
5. Documentation audits
