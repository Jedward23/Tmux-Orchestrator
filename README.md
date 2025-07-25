![Orchestrator Hero](/Orchestrator.png)

**Run AI agents 24/7 while you sleep** - The Tmux Orchestrator enables Claude agents to work autonomously, schedule their own check-ins, and coordinate across multiple projects without human intervention.

## 🤖 Key Capabilities & Autonomous Features

- **Self-trigger** - Agents schedule their own check-ins and continue work autonomously
- **Coordinate** - Project managers assign tasks to engineers across multiple codebases  
- **Persist** - Work continues even when you close your laptop
- **Scale** - Run multiple teams working on different projects simultaneously

## 🏗️ Architecture

The Tmux Orchestrator uses a three-tier hierarchy to overcome context window limitations:

```
┌─────────────┐
│ Orchestrator│ ← You interact here
└──────┬──────┘
       │ Monitors & coordinates
       ▼
┌─────────────┐     ┌─────────────┐
│  Project    │     │  Project    │
│  Manager 1  │     │  Manager 2  │ ← Assign tasks, enforce specs
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Engineer 1  │     │ Engineer 2  │ ← Write code, fix bugs
└─────────────┘     └─────────────┘
```

### Why Separate Agents?
- **Limited context windows** - Each agent stays focused on its role
- **Specialized expertise** - PMs manage, engineers code
- **Parallel work** - Multiple engineers can work simultaneously
- **Better memory** - Smaller contexts mean better recall

## 📸 Examples in Action

### Project Manager Coordination
![Initiate Project Manager](Examples/Initiate%20Project%20Manager.png)
*The orchestrator creating and briefing a new project manager agent*

### Status Reports & Monitoring
![Status Reports](Examples/Status%20reports.png)
*Real-time status updates from multiple agents working in parallel*

### Tmux Communication
![Reading TMUX Windows and Sending Messages](Examples/Reading%20TMUX%20Windows%20and%20Sending%20Messages.png)
*How agents communicate across tmux windows and sessions*

### Project Completion
![Project Completed](Examples/Project%20Completed.png)
*Successful project completion with all tasks verified and committed*

## 🎯 Quick Start

### Step 1: Initial Setup
```bash
# Clone or copy the orchestrator to your system
cd /path/to/Tmux-Orchestrator

# Run the setup script - this configures everything automatically
./setup.sh

# The setup will:
# ✅ Check dependencies (tmux, bc, logger)
# ✅ Find or create your projects directory 
# ✅ Set up all required directories
# ✅ Configure script permissions
# ✅ Save your preferences
```

### Step 2: Basic Project Setup

```bash
# 1. Create a project spec
cat > project_spec.md << 'EOF'
PROJECT: My Web App
GOAL: Add user authentication system
CONSTRAINTS:
- Use existing database schema
- Follow current code patterns  
- Commit every 30 minutes
- Write tests for new features

DELIVERABLES:
1. Login/logout endpoints
2. User session management
3. Protected route middleware
EOF

# 2. Start tmux session
tmux new-session -s my-project

# 3. Start project manager in window 0
claude --dangerously-skip-permissions
# Accept responsibility dialog (press 2)
sleep 2 && tmux send-keys -t my-project:0 "2" Enter

# 4. Give PM the spec and let it create an engineer
"You are a Project Manager. Read project_spec.md and create an engineer 
in window 1 to implement it. Schedule check-ins every 30 minutes."

# 5. Schedule orchestrator check-in (from orchestrator directory)
cd /path/to/Tmux-Orchestrator
./schedule_with_note.sh 30 "Check PM progress on auth system"
```

### Step 3: Full Orchestrator Setup

```bash
# Start the orchestrator (after running setup.sh)
tmux new-session -s orchestrator
claude --dangerously-skip-permissions
# Accept responsibility dialog (press 2)
sleep 2 && tmux send-keys -t orchestrator:0 "2" Enter

# Give it your projects
"You are the Orchestrator. Set up project managers for:
1. Frontend (React app) - Add dashboard charts
2. Backend (FastAPI) - Optimize database queries
Schedule yourself to check in every hour."
```

## 🔧 Configuration Options

The setup script creates a `.orchestrator.conf` file with your preferences:

```bash
# View current configuration
cat .orchestrator.conf

# Reconfigure if needed
./setup.sh  # Run again to change settings
```

**Environment Variables** (optional):
```bash
# Add to ~/.bashrc or ~/.zshrc for convenience
export PROJECTS_DIR="/your/projects/directory"
export DEFAULT_SESSION_PREFIX="your-prefix"
```

## ✨ Key Features

### 🔄 Self-Scheduling Agents
Agents can schedule their own check-ins using:
```bash
./schedule_with_note.sh 30 "Continue dashboard implementation"
```

### 👥 Multi-Agent Coordination
- Project managers communicate with engineers
- Orchestrator monitors all project managers
- Cross-project knowledge sharing

### 💾 Automatic Git Backups
- Commits every 30 minutes of work
- Tags stable versions
- Creates feature branches for experiments

### 📊 Real-Time Monitoring
- See what every agent is doing
- Intervene when needed
- Review progress across all projects

## 📋 Best Practices

### Writing Effective Specifications

```markdown
PROJECT: E-commerce Checkout
GOAL: Implement multi-step checkout process

CONSTRAINTS:
- Use existing cart state management
- Follow current design system
- Maximum 3 API endpoints
- Commit after each step completion

DELIVERABLES:
1. Shipping address form with validation
2. Payment method selection (Stripe integration)
3. Order review and confirmation page
4. Success/failure handling

SUCCESS CRITERIA:
- All forms validate properly
- Payment processes without errors  
- Order data persists to database
- Emails send on completion
```

### Git Safety Rules

1. **Before Starting Any Task**
   ```bash
   git checkout -b feature/[task-name]
   git status  # Ensure clean state
   ```

2. **Every 30 Minutes**
   ```bash
   git add -A
   git commit -m "Progress: [what was accomplished]"
   ```

3. **When Task Completes**
   ```bash
   git tag stable-[feature]-[date]
   git checkout main
   git merge feature/[task-name]
   ```

## 🚨 Common Pitfalls & Solutions

| Pitfall | Consequence | Solution |
|---------|-------------|----------|
| Vague instructions | Agent drift, wasted compute | Write clear, specific specs |
| No git commits | Lost work, frustrated devs | Enforce 30-minute commit rule |
| Too many tasks | Context overload, confusion | One task per agent at a time |
| No specifications | Unpredictable results | Always start with written spec |
| Missing checkpoints | Agents stop working | Schedule regular check-ins |

## 🛠️ How It Works

### The Magic of Tmux
Tmux (terminal multiplexer) is the key enabler because:
- It persists terminal sessions even when disconnected
- Allows multiple windows/panes in one session
- Claude runs in the terminal, so it can control other Claude instances
- Commands can be sent programmatically to any window

### 💬 Simplified Agent Communication

We now use the `send-claude-message.sh` script for all agent communication:

```bash
# Send message to any Claude agent (run from orchestrator directory)
./send-claude-message.sh session:window "Your message here"

# Examples:
./send-claude-message.sh frontend:0 "What's your progress on the login form?"
./send-claude-message.sh backend:1 "The API endpoint /api/users is returning 404"
./send-claude-message.sh project-manager:0 "Please coordinate with the QA team"
```

The script handles all timing complexities automatically and includes:
- ✅ Input validation and error handling
- ✅ Tmux session/window verification
- ✅ Automatic logging of all messages
- ✅ Cross-platform compatibility

### Scheduling Check-ins
```bash
# Schedule with specific, actionable notes (run from orchestrator directory)
./schedule_with_note.sh 30 "Review auth implementation, assign next task"
./schedule_with_note.sh 60 "Check test coverage, merge if passing"
./schedule_with_note.sh 120 "Full system check, rotate tasks if needed"

# Specify custom target window
./schedule_with_note.sh 15 "Check deployment status" "backend-project:2"
```

**New Features**:
- ✅ Automatic tmux session/window validation
- ✅ Cross-platform date command support (macOS/Linux)
- ✅ Comprehensive error handling and logging  
- ✅ Usage help with examples (`./schedule_with_note.sh` without args)
- ✅ Process ID tracking for scheduled tasks

## 🎓 Advanced Usage

### Multi-Project Orchestration
```bash
# Start orchestrator
tmux new-session -s orchestrator

# Create project managers for each project
tmux new-window -n frontend-pm
tmux new-window -n backend-pm  
tmux new-window -n mobile-pm

# Each PM manages their own engineers
# Orchestrator coordinates between PMs
```

### Cross-Project Intelligence
The orchestrator can share insights between projects:
- "Frontend is using /api/v2/users, update backend accordingly"
- "Authentication is working in Project A, use same pattern in Project B"
- "Performance issue found in shared library, fix across all projects"

## 📚 Core Files

- **`setup.sh`** - One-time configuration script (run first!)
- **`config.sh`** - Portable configuration system with auto-detection
- **`send-claude-message.sh`** - Robust agent communication with validation
- **`schedule_with_note.sh`** - Self-scheduling with error handling
- **`tmux_utils.py`** - Tmux interaction utilities
- **`CLAUDE.md`** - Agent behavior instructions and protocols
- **`LEARNINGS.md`** - Accumulated knowledge base
- **`.orchestrator.conf`** - Your personalized configuration (created by setup)

## 🤝 Contributing & Optimization

The orchestrator evolves through community discoveries and optimizations. When contributing:

1. Document new tmux commands and patterns in CLAUDE.md
2. Share novel use cases and agent coordination strategies
3. Submit optimizations for claudes synchronization
4. Keep command reference up-to-date with latest findings
5. Test improvements across multiple sessions and scenarios

Key areas for enhancement:
- Agent communication patterns
- Cross-project coordination
- Novel automation workflows

## 📄 License

MIT License - Use freely but wisely. Remember: with great automation comes great responsibility.

---

*"The tools we build today will program themselves tomorrow"* - Alan Kay, 1971