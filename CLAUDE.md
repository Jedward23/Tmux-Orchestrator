# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## SuperClaude + Tmux Orchestrator Integration

This repository combines two powerful systems:
- **SuperClaude Framework**: Advanced development framework with specialized commands, personas, and AI orchestration
- **Tmux Orchestrator**: AI-powered session management system for coordinating multiple Claude agents across tmux sessions

## SuperClaude Framework Integration

@SuperClaude/Core/COMMANDS.md
@SuperClaude/Core/FLAGS.md
@SuperClaude/Core/PRINCIPLES.md
@SuperClaude/Core/RULES.md
@SuperClaude/Core/MCP.md
@SuperClaude/Core/PERSONAS.md
@SuperClaude/Core/ORCHESTRATOR.md
@SuperClaude/Core/MODES.md

## 🔐 Repository Security Principles - MANDATORY

**CRITICAL**: This is a public repository. All developers and AI agents MUST follow these security principles without exception.

### Core Security Rules

1. **NEVER commit sensitive data**:
   - ❌ Passwords, API keys, authentication tokens
   - ❌ Personal configuration files (.claude.json, .config/, etc.)
   - ❌ Private keys, certificates, or cryptographic materials
   - ❌ Database connection strings with credentials
   - ❌ Personal directories or system-specific files

2. **Use .gitignore comprehensively**:
   - ✅ Python cache files (__pycache__/, *.pyc)
   - ✅ Virtual environments (venv/, env/, .venv/)
   - ✅ IDE configuration files (.vscode/, .idea/)
   - ✅ System files (.DS_Store, Thumbs.db)
   - ✅ Log files and debug output (*.log, debug.*)
   - ✅ All credential and configuration files

3. **Environment variables for configuration**:
   - ✅ Use environment variables for sensitive configuration
   - ✅ Document required environment variables
   - ✅ Provide example configuration files without sensitive data
   - ✅ Never hardcode credentials in source code

4. **Secure development practices**:
   - ✅ Regular security audits and reviews
   - ✅ Automated security scanning in CI/CD
   - ✅ Input validation and sanitization
   - ✅ Secure error handling (no sensitive data in errors)
   - ✅ Proper authentication and authorization

### Pre-Commit Security Checklist

Before any commit, verify:
- [ ] No hardcoded passwords or API keys
- [ ] No personal configuration files
- [ ] No credentials or authentication tokens
- [ ] No private keys or certificates
- [ ] All sensitive data uses environment variables
- [ ] .gitignore covers all sensitive file types
- [ ] No debugging code with sensitive output

### Security Incident Response

If sensitive data is accidentally committed:
1. **Immediate action**: Revoke/rotate all exposed credentials
2. **Repository cleanup**: Remove sensitive data from git history
3. **Audit**: Review all commits for similar issues
4. **Prevention**: Update .gitignore and security checks
5. **Documentation**: Document incident and prevention measures

### Automated Security Measures

- **Pre-commit hooks**: Scan for sensitive data before commit
- **CI/CD scanning**: Automated security validation
- **Regular audits**: Scheduled security reviews
- **Dependency scanning**: Monitor for vulnerable dependencies
- **Access control**: Proper repository permissions and reviews

**Remember**: Once data is committed to a public repository, it should be considered permanently exposed. Prevention is the only effective security measure.

## Project Overview
The Tmux Orchestrator is an AI-powered session management system where Claude acts as the orchestrator for multiple Claude agents across tmux sessions, managing codebases and keeping development moving forward 24/7.

**Enhanced with SuperClaude capabilities:**
- 16 specialized development commands (`/implement`, `/build`, `/design`, etc.)
- Smart AI personas for different domains (architect, frontend, backend, security, etc.)
- MCP server integration (Context7, Sequential, Magic, Playwright)
- Task management and token optimization
- Wave orchestration for complex operations

## SuperClaude Commands for Orchestrator

### Development & Implementation
```bash
/implement [feature] --type component|api|service --framework <name>
/build [target] --optimize --validate
/design [domain] --focus architecture|ui|api
```

### Analysis & Quality
```bash
/analyze [target] --focus security|performance|architecture --think-hard
/improve [target] --quality --security --performance --loop
/troubleshoot [symptoms] --persona-analyzer --seq
```

### Documentation & Planning
```bash
/document [target] --persona-scribe=en --comprehensive
/estimate [scope] --persona-architect --evidence-based
/task [operation] --long-term --coordinated
```

### Integration with Orchestrator Workflow
```bash
# Agent briefing with SuperClaude enhancement
./send-claude-message.sh session:0 "/load @. --persona-architect --think"

# Component validation with analysis
./send-claude-message.sh session:0 "/analyze @tmux_utils.py --focus security --validate"

# Implement orchestrator improvements  
./send-claude-message.sh session:0 "/improve @scripts/ --quality --loop --wave-mode"
```

## Core Commands

### Running and Testing
```bash
# No formal test suite - this is a production orchestration tool
# Test by running the interactive Python utility:
python tmux_utils.py

# Verify scripts are executable:
ls -la *.sh  # Should show -rwxr-xr-x permissions

# Test message sending:
./send-claude-message.sh test:0 "Test message"

# Test scheduling (creates next_check_note.txt):
./schedule_with_note.sh 1 "Test note" test:0
```

### Development Tools
```bash
# Run Python utilities
python tmux_utils.py  # Interactive tmux control and monitoring

# Send messages to Claude agents (ALWAYS use this)
./send-claude-message.sh <session:window> "message"

# Schedule future actions
./schedule_with_note.sh <minutes> "note" [target_window]
```

### Common Tmux Operations
```bash
# List all sessions and windows
tmux list-sessions -F "#{session_name}: #{session_windows} windows"
tmux list-windows -t session -F "#{window_index}: #{window_name}"

# Capture window content
tmux capture-pane -t session:window -p | tail -50

# Create new session/window with proper directory
tmux new-session -d -s project-name -c "/path/to/project"
tmux new-window -t session -n "window-name" -c "/path/to/project"
```

## Code Architecture

### tmux_utils.py
The main Python utility provides programmatic tmux control with safety features:
- **TmuxOrchestrator**: Main class with confirmation prompts for destructive actions
- **Session Management**: get_tmux_sessions(), find_window_by_name()
- **Window Interaction**: capture_window_content(), send_keys_to_window()
- **Monitoring**: get_all_windows_status(), create_monitoring_snapshot()

### Shell Scripts
- **send-claude-message.sh**: Handles proper timing (0.5s delay) for Claude messages
- **schedule_with_note.sh**: Creates persistent notes and schedules future actions using nohup

### Project Structure
```
/mnt/c/Users/dband/OneDrive/Documents/termux/
├── tmux_utils.py              # Main Python utility
├── send-claude-message.sh     # Claude messaging script
├── schedule_with_note.sh      # Scheduling utility
├── CLAUDE.md                  # This file
├── README.md                  # User documentation
├── LEARNINGS.md              # Accumulated wisdom
├── next_check_note.txt       # Scheduling state
├── SuperClaude/              # SuperClaude framework
│   ├── Core/                 # Core framework components
│   ├── Commands/             # Command definitions
│   └── Hooks/                # Hook system
└── .claude/commands/         # Claude command definitions
```

### Platform Notes (WSL)
This project runs on WSL (Windows Subsystem for Linux). Key considerations:
- Paths use `/mnt/c/` for Windows drives
- Scripts must have Unix line endings (LF, not CRLF)
- File permissions matter: scripts need execute permission (`chmod +x`)
- Use absolute paths when referencing project scripts from other locations

## Enhanced Agent Briefing with SuperClaude

### SuperClaude-Enhanced Agent Creation
```bash
# Create agent with SuperClaude capabilities
tmux new-window -t session -n "SuperClaude-Agent" -c "/path/to/project"

# Start Claude with enhanced briefing
tmux send-keys -t session:SuperClaude-Agent "claude" Enter
sleep 5

# Enhanced briefing with SuperClaude framework
./send-claude-message.sh session:SuperClaude-Agent "
/load @. --persona-architect --think

You are now a SuperClaude-enhanced agent with access to specialized commands and personas:

DEVELOPMENT COMMANDS:
- /implement [feature] - Smart implementation with auto-persona selection
- /build [target] - Framework-aware building with validation
- /analyze [target] --think-hard - Deep system analysis
- /improve [target] --quality --loop - Iterative enhancement

ORCHESTRATOR INTEGRATION:
- Use /analyze for component validation
- Use /improve for systematic enhancements
- Use /document for professional documentation
- Report status with evidence-based metrics

YOUR ENHANCED CAPABILITIES:
- Auto-persona activation based on task domain
- MCP server integration for better results
- Wave orchestration for complex operations
- Token optimization for efficiency

WORKFLOW:
1. /load @. to understand project context
2. /analyze @. --focus architecture to assess system
3. Use appropriate personas (architect, developer, security)
4. Report findings with /document for status updates

Begin by analyzing the current project state and identifying priorities.
"
```

### Persona-Specific Agent Deployment
```bash
# Frontend Specialist Agent
./send-claude-message.sh session:frontend "/load @. --persona-frontend --magic"

# Security Audit Agent  
./send-claude-message.sh session:security "/analyze @. --persona-security --focus security --think-hard"

# Architecture Review Agent
./send-claude-message.sh session:architect "/analyze @. --persona-architect --ultrathink --wave-mode"
```

## Agent System Architecture

### Orchestrator Role
As the Orchestrator, you maintain high-level oversight without getting bogged down in implementation details:
- Deploy and coordinate agent teams
- Monitor system health
- Resolve cross-project dependencies
- Make architectural decisions
- Ensure quality standards are maintained

### Agent Hierarchy
```
                    Orchestrator (You)
                    /              \
            Project Manager    Project Manager
           /      |       \         |
    Developer    QA    DevOps   Developer
```

### Agent Types
1. **Project Manager**: Quality-focused team coordination
2. **Developer**: Implementation and technical decisions
3. **QA Engineer**: Testing and verification
4. **DevOps**: Infrastructure and deployment
5. **Code Reviewer**: Security and best practices
6. **Researcher**: Technology evaluation
7. **Documentation Writer**: Technical documentation

## 🔐 Git Discipline - MANDATORY FOR ALL AGENTS

### Core Git Safety Rules

**CRITICAL**: Every agent MUST follow these git practices to prevent work loss:

1. **Auto-Commit Every 30 Minutes**
   ```bash
   # Set a timer/reminder to commit regularly
   git add -A
   git commit -m "Progress: [specific description of what was done]"
   ```

2. **Commit Before Task Switches**
   - ALWAYS commit current work before starting a new task
   - Never leave uncommitted changes when switching context
   - Tag working versions before major changes

3. **Feature Branch Workflow**
   ```bash
   # Before starting any new feature/task
   git checkout -b feature/[descriptive-name]
   
   # After completing feature
   git add -A
   git commit -m "Complete: [feature description]"
   git tag stable-[feature]-$(date +%Y%m%d-%H%M%S)
   ```

4. **Meaningful Commit Messages**
   - Bad: "fixes", "updates", "changes"
   - Good: "Add user authentication endpoints with JWT tokens"
   - Good: "Fix null pointer in payment processing module"
   - Good: "Refactor database queries for 40% performance gain"

5. **Never Work >1 Hour Without Committing**
   - If you've been working for an hour, stop and commit
   - Even if the feature isn't complete, commit as "WIP: [description]"
   - This ensures work is never lost due to crashes or errors

### Git Emergency Recovery

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

### Project Manager Git Responsibilities

Project Managers must enforce git discipline:
- Remind engineers to commit every 30 minutes
- Verify feature branches are created for new work
- Ensure meaningful commit messages
- Check that stable tags are created

### Why This Matters

- **Work Loss Prevention**: Hours of work can vanish without commits
- **Collaboration**: Other agents can see and build on committed work
- **Rollback Safety**: Can always return to a working state
- **Progress Tracking**: Clear history of what was accomplished

## Startup Behavior - Tmux Window Naming

### Auto-Rename Feature
When Claude starts in the orchestrator, it should:
1. **Ask the user**: "Would you like me to rename all tmux windows with descriptive names for better organization?"
2. **If yes**: Analyze each window's content and rename them with meaningful names
3. **If no**: Continue with existing names

### Window Naming Convention
Windows should be named based on their actual function:
- **Claude Agents**: `Claude-Frontend`, `Claude-Backend`, `Claude-Convex`
- **Dev Servers**: `NextJS-Dev`, `Frontend-Dev`, `Uvicorn-API`
- **Shells/Utilities**: `Backend-Shell`, `Frontend-Shell`
- **Services**: `Convex-Server`, `Orchestrator`
- **Project Specific**: `Notion-Agent`, etc.

### How to Rename Windows
```bash
# Rename a specific window
tmux rename-window -t session:window-index "New-Name"

# Example:
tmux rename-window -t ai-chat:0 "Claude-Convex"
tmux rename-window -t glacier-backend:3 "Uvicorn-API"
```

### Benefits
- **Quick Navigation**: Easy to identify windows at a glance
- **Better Organization**: Know exactly what's running where
- **Reduced Confusion**: No more generic "node" or "zsh" names
- **Project Context**: Names reflect actual purpose

## Project Startup Sequence

### When User Says "Open/Start/Fire up [Project Name]"

Follow this systematic sequence to start any project:

#### 1. Find the Project
```bash
# List all directories in ~/Coding to find projects
ls -la ~/Coding/ | grep "^d" | awk '{print $NF}' | grep -v "^\."

# If project name is ambiguous, list matches
ls -la ~/Coding/ | grep -i "task"  # for "task templates"
```

#### 2. Create Tmux Session
```bash
# Create session with project name (use hyphens for spaces)
PROJECT_NAME="task-templates"  # or whatever the folder is called
PROJECT_PATH="~/Coding/$PROJECT_NAME"  # Adjust to your coding directory
tmux new-session -d -s $PROJECT_NAME -c "$PROJECT_PATH"
```

#### 3. Set Up Standard Windows
```bash
# Window 0: Claude Agent
tmux rename-window -t $PROJECT_NAME:0 "Claude-Agent"

# Window 1: Shell
tmux new-window -t $PROJECT_NAME -n "Shell" -c "$PROJECT_PATH"

# Window 2: Dev Server (will start app here)
tmux new-window -t $PROJECT_NAME -n "Dev-Server" -c "$PROJECT_PATH"
```

#### 4. Brief the Claude Agent
```bash
# Send briefing message to Claude agent
tmux send-keys -t $PROJECT_NAME:0 "claude" Enter
sleep 5  # Wait for Claude to start

# Send the briefing
tmux send-keys -t $PROJECT_NAME:0 "You are responsible for the $PROJECT_NAME codebase. Your duties include:
1. Getting the application running
2. Checking GitHub issues for priorities  
3. Working on highest priority tasks
4. Keeping the orchestrator informed of progress

First, analyze the project to understand:
- What type of project this is (check package.json, requirements.txt, etc.)
- How to start the development server
- What the main purpose of the application is

Then start the dev server in window 2 (Dev-Server) and begin working on priority issues."
sleep 1
tmux send-keys -t $PROJECT_NAME:0 Enter
```

#### 5. Project Type Detection (Agent Should Do This)
The agent should check for:
```bash
# Node.js project
test -f package.json && cat package.json | grep scripts

# Python project  
test -f requirements.txt || test -f pyproject.toml || test -f setup.py

# Ruby project
test -f Gemfile

# Go project
test -f go.mod
```

#### 6. Start Development Server (Agent Should Do This)
Based on project type, the agent should start the appropriate server in window 2:
```bash
# For Next.js/Node projects
tmux send-keys -t $PROJECT_NAME:2 "npm install && npm run dev" Enter

# For Python/FastAPI
tmux send-keys -t $PROJECT_NAME:2 "source venv/bin/activate && uvicorn app.main:app --reload" Enter

# For Django
tmux send-keys -t $PROJECT_NAME:2 "source venv/bin/activate && python manage.py runserver" Enter
```

#### 7. Check GitHub Issues (Agent Should Do This)
```bash
# Check if it's a git repo with remote
git remote -v

# Use GitHub CLI to check issues
gh issue list --limit 10

# Or check for TODO.md, ROADMAP.md files
ls -la | grep -E "(TODO|ROADMAP|TASKS)"
```

#### 8. Monitor and Report Back
The orchestrator should:
```bash
# Check agent status periodically
tmux capture-pane -t $PROJECT_NAME:0 -p | tail -30

# Check if dev server started successfully  
tmux capture-pane -t $PROJECT_NAME:2 -p | tail -20

# Monitor for errors
tmux capture-pane -t $PROJECT_NAME:2 -p | grep -i error
```

### Example: Starting "Task Templates" Project
```bash
# 1. Find project
ls -la ~/Coding/ | grep -i task
# Found: task-templates

# 2. Create session
tmux new-session -d -s task-templates -c "~/Coding/task-templates"

# 3. Set up windows
tmux rename-window -t task-templates:0 "Claude-Agent"
tmux new-window -t task-templates -n "Shell" -c "~/Coding/task-templates"
tmux new-window -t task-templates -n "Dev-Server" -c "~/Coding/task-templates"

# 4. Start Claude and brief
tmux send-keys -t task-templates:0 "claude" Enter
# ... (briefing as above)
```

### Important Notes
- Always verify project exists before creating session
- Use project folder name for session name (with hyphens for spaces)
- Let the agent figure out project-specific details
- Monitor for successful startup before considering task complete

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

## Communication Protocols

### Hub-and-Spoke Model
To prevent communication overload (n² complexity), use structured patterns:
- Developers report to PM only
- PM aggregates and reports to Orchestrator
- Cross-functional communication goes through PM
- Emergency escalation directly to Orchestrator

### Daily Standup (Async)
```bash
# PM asks each team member
tmux send-keys -t [session]:[dev-window] "STATUS UPDATE: Please provide: 1) Completed tasks, 2) Current work, 3) Any blockers"
# Wait for response, then aggregate
```

### Message Templates

#### Status Update
```
STATUS [AGENT_NAME] [TIMESTAMP]
Completed: 
- [Specific task 1]
- [Specific task 2]
Current: [What working on now]
Blocked: [Any blockers]
ETA: [Expected completion]
```

#### Task Assignment
```
TASK [ID]: [Clear title]
Assigned to: [AGENT]
Objective: [Specific goal]
Success Criteria:
- [Measurable outcome]
- [Quality requirement]
Priority: HIGH/MED/LOW
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
  /mnt/c/Users/dband/OneDrive/Documents/termux/logs/[session]_[role]_$(date +%Y%m%d_%H%M%S).log

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
/mnt/c/Users/dband/OneDrive/Documents/termux/logs/
├── agent_logs/      # Agent conversation logs
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

## Communication Rules

1. **No Chit-Chat**: All messages work-related
2. **Use Templates**: Reduces ambiguity
3. **Acknowledge Receipt**: Simple "ACK" for tasks
4. **Escalate Quickly**: Don't stay blocked >10 min
5. **One Topic Per Message**: Keep focused

## Critical Self-Scheduling Protocol

### 🚨 MANDATORY STARTUP CHECK FOR ALL ORCHESTRATORS

**EVERY TIME you start or restart as an orchestrator, you MUST perform this check:**

```bash
# 1. Check your current tmux location
echo "Current pane: $TMUX_PANE"
CURRENT_WINDOW=$(tmux display-message -p "#{session_name}:#{window_index}")
echo "Current window: $CURRENT_WINDOW"

# 2. Test the scheduling script with your current window
./schedule_with_note.sh 1 "Test schedule for $CURRENT_WINDOW" "$CURRENT_WINDOW"

# 3. If scheduling fails, you MUST fix the script before proceeding
```

### Schedule Script Requirements

The `schedule_with_note.sh` script MUST:
- Accept a third parameter for target window: `./schedule_with_note.sh <minutes> "<note>" <target_window>`
- Default to `tmux-orc:0` if no target specified
- Always verify the target window exists before scheduling

### Why This Matters

- **Continuity**: Orchestrators must maintain oversight without gaps
- **Window Accuracy**: Scheduling to wrong window breaks the oversight chain
- **Self-Recovery**: Orchestrators must be able to restart themselves reliably

### Scheduling Best Practices

```bash
# Always use current window for self-scheduling
CURRENT_WINDOW=$(tmux display-message -p "#{session_name}:#{window_index}")
./schedule_with_note.sh 15 "Regular PM oversight check" "$CURRENT_WINDOW"

# For scheduling other agents, specify their windows explicitly
./schedule_with_note.sh 30 "Developer progress check" "ai-chat:2"
```

## Anti-Patterns to Avoid

- ❌ **Meeting Hell**: Use async updates only
- ❌ **Endless Threads**: Max 3 exchanges, then escalate
- ❌ **Broadcast Storms**: No "FYI to all" messages
- ❌ **Micromanagement**: Trust agents to work
- ❌ **Quality Shortcuts**: Never compromise standards
- ❌ **Blind Scheduling**: Never schedule without verifying target window
- ❌ **Security Violations**: NEVER commit sensitive data to public repository (see Security Principles above)

## Critical Lessons Learned

### Tmux Window Management Mistakes and Solutions

#### Mistake 1: Wrong Directory When Creating Windows
**What Went Wrong**: Created server window without specifying directory, causing uvicorn to run in wrong location (Tmux orchestrator instead of Glacier-Analytics)

**Root Cause**: New tmux windows inherit the working directory from where tmux was originally started, NOT from the current session's active window

**Solution**: 
```bash
# Always use -c flag when creating windows
tmux new-window -t session -n "window-name" -c "/correct/path"

# Or immediately cd after creating
tmux new-window -t session -n "window-name"
tmux send-keys -t session:window-name "cd /correct/path" Enter
```

#### Mistake 2: Not Reading Actual Command Output
**What Went Wrong**: Assumed commands like `uvicorn app.main:app` succeeded without checking output

**Root Cause**: Not using `tmux capture-pane` to verify command results

**Solution**:
```bash
# Always check output after running commands
tmux send-keys -t session:window "command" Enter
sleep 2  # Give command time to execute
tmux capture-pane -t session:window -p | tail -50
```

#### Mistake 3: Typing Commands in Already Active Sessions
**What Went Wrong**: Typed "claude" in a window that already had Claude running

**Root Cause**: Not checking window contents before sending commands

**Solution**:
```bash
# Check window contents first
tmux capture-pane -t session:window -S -100 -p
# Look for prompts or active sessions before sending commands
```

#### Mistake 4: Incorrect Message Sending to Claude Agents
**What Went Wrong**: Initially sent Enter key with the message text instead of as separate command

**Root Cause**: Using `tmux send-keys -t session:window "message" Enter` combines them

**Solution**:
```bash
# Send message and Enter separately
tmux send-keys -t session:window "Your message here"
tmux send-keys -t session:window Enter
```

## Best Practices for Tmux Orchestration

### Pre-Command Checks
1. **Verify Working Directory**
   ```bash
   tmux send-keys -t session:window "pwd" Enter
   tmux capture-pane -t session:window -p | tail -5
   ```

2. **Check Command Availability**
   ```bash
   tmux send-keys -t session:window "which command_name" Enter
   tmux capture-pane -t session:window -p | tail -5
   ```

3. **Check for Virtual Environments**
   ```bash
   tmux send-keys -t session:window "ls -la | grep -E 'venv|env|virtualenv'" Enter
   ```

### Window Creation Workflow
```bash
# 1. Create window with correct directory
tmux new-window -t session -n "descriptive-name" -c "/path/to/project"

# 2. Verify you're in the right place
tmux send-keys -t session:descriptive-name "pwd" Enter
sleep 1
tmux capture-pane -t session:descriptive-name -p | tail -3

# 3. Activate virtual environment if needed
tmux send-keys -t session:descriptive-name "source venv/bin/activate" Enter

# 4. Run your command
tmux send-keys -t session:descriptive-name "your-command" Enter

# 5. Verify it started correctly
sleep 3
tmux capture-pane -t session:descriptive-name -p | tail -20
```

### Debugging Failed Commands
When a command fails:
1. Capture full window output: `tmux capture-pane -t session:window -S -200 -p`
2. Check for common issues:
   - Wrong directory
   - Missing dependencies
   - Virtual environment not activated
   - Permission issues
   - Port already in use

### Communication with Claude Agents

#### 🎯 IMPORTANT: Always Use send-claude-message.sh Script

**DO NOT manually send messages with tmux send-keys anymore!** We have a dedicated script that handles all the timing and complexity for you.

#### Using send-claude-message.sh
```bash
# Basic usage - ALWAYS use this instead of manual tmux commands
./send-claude-message.sh <target> "message"

# Examples:
# Send to a window
./send-claude-message.sh agentic-seek:3 "Hello Claude!"

# Send to a specific pane in split-screen
./send-claude-message.sh tmux-orc:0.1 "Message to pane 1"

# Send complex instructions
./send-claude-message.sh glacier-backend:0 "Please check the database schema for the campaigns table and verify all columns are present"

# Send status update requests
./send-claude-message.sh ai-chat:2 "STATUS UPDATE: What's your current progress on the authentication implementation?"
```

#### Why Use the Script?
1. **Automatic timing**: Handles the critical 0.5s delay between message and Enter
2. **Simpler commands**: One line instead of three
3. **No timing mistakes**: Prevents the common error of Enter being sent too quickly
4. **Works everywhere**: Handles both windows and panes automatically
5. **Consistent messaging**: All agents receive messages the same way

#### Script Location and Usage
- **Location**: `./send-claude-message.sh` (in project directory)
- **Permissions**: Must be executable (`chmod +x send-claude-message.sh`)
- **Arguments**: 
  - First: target (session:window or session:window.pane)
  - Second: message (can contain spaces, will be properly handled)

#### Common Messaging Patterns with the Script

##### 1. Starting Claude and Initial Briefing
```bash
# Start Claude first
tmux send-keys -t project:0 "claude" Enter
sleep 5

# Then use the script for the briefing
./send-claude-message.sh project:0 "You are responsible for the frontend codebase. Please start by analyzing the current project structure and identifying any immediate issues."
```

##### 2. Cross-Agent Coordination
```bash
# Ask frontend agent about API usage
./send-claude-message.sh frontend:0 "Which API endpoints are you currently using from the backend?"

# Share info with backend agent
./send-claude-message.sh backend:0 "Frontend is using /api/v1/campaigns and /api/v1/flows endpoints"
```

##### 3. Status Checks
```bash
# Quick status request
./send-claude-message.sh session:0 "Quick status update please"

# Detailed status request
./send-claude-message.sh session:0 "STATUS UPDATE: Please provide: 1) Completed tasks, 2) Current work, 3) Any blockers"
```

##### 4. Providing Assistance
```bash
# Share error information
./send-claude-message.sh session:0 "I see in your server window that port 3000 is already in use. Try port 3001 instead."

# Guide stuck agents
./send-claude-message.sh session:0 "The error you're seeing is because the virtual environment isn't activated. Run 'source venv/bin/activate' first."
```

#### OLD METHOD (DO NOT USE)
```bash
# ❌ DON'T DO THIS ANYMORE:
tmux send-keys -t session:window "message"
sleep 1
tmux send-keys -t session:window Enter

# ✅ DO THIS INSTEAD:
./send-claude-message.sh session:window "message"
```

#### Checking for Responses
After sending a message, check for the response:
```bash
# Send message
./send-claude-message.sh session:0 "What's your status?"

# Wait a bit for response
sleep 5

# Check what the agent said
tmux capture-pane -t session:0 -p | tail -50
```

## Key Concepts Summary

This orchestration system allows a single Claude instance (the orchestrator) to manage multiple Claude agents working on different projects simultaneously. The orchestrator:

1. **Deploys agents** to work on specific codebases
2. **Monitors progress** using tmux capture commands
3. **Coordinates work** through the send-claude-message.sh script
4. **Maintains continuity** using schedule_with_note.sh for self-scheduling
5. **Enforces quality** through strict git discipline and project managers
6. **Maintains security** through comprehensive .gitignore and security best practices (see Issue #15)

The system uses tmux as infrastructure because it provides persistent sessions that survive disconnections, making it ideal for 24/7 autonomous operation.
