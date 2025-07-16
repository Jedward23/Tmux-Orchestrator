#!/bin/bash
# Tmux Orchestrator Component Discovery Script
# Discovers and validates orchestrator components instead of traditional tests
# Designed for DementedWeasel1971/Tmux-Orchestrator

echo "=== Tmux Orchestrator Component Discovery ==="

# Function to discover Python scripts
discover_python_components() {
    echo "📋 Discovering Python Components..."
    
    PYTHON_SCRIPTS=$(find . -name "*.py" -not -path "./__pycache__/*" | sort)
    
    if [ -n "$PYTHON_SCRIPTS" ]; then
        echo "Python scripts found:"
        for script in $PYTHON_SCRIPTS; do
            echo "  - $script"
            
            # Check if script is executable
            if [ -x "$script" ]; then
                echo "    ✅ Executable"
            else
                echo "    ⚠️  Not executable"
            fi
            
            # Check syntax
            if python3 -m py_compile "$script" 2>/dev/null; then
                echo "    ✅ Syntax OK"
            else
                echo "    ❌ Syntax errors"
            fi
        done
    else
        echo "No Python scripts found"
    fi
    
    echo ""
}

# Function to discover shell scripts
discover_shell_components() {
    echo "🐚 Discovering Shell Scripts..."
    
    SHELL_SCRIPTS=$(find . -name "*.sh" | sort)
    
    if [ -n "$SHELL_SCRIPTS" ]; then
        echo "Shell scripts found:"
        for script in $SHELL_SCRIPTS; do
            echo "  - $script"
            
            # Check if script is executable
            if [ -x "$script" ]; then
                echo "    ✅ Executable"
            else
                echo "    ❌ Not executable (run: chmod +x $script)"
            fi
            
            # Check syntax
            if bash -n "$script" 2>/dev/null; then
                echo "    ✅ Syntax OK"
            else
                echo "    ❌ Syntax errors"
            fi
        done
    else
        echo "No shell scripts found"
    fi
    
    echo ""
}

# Function to check system dependencies
check_system_dependencies() {
    echo "🔧 Checking System Dependencies..."
    
    # Check tmux
    if command -v tmux >/dev/null 2>&1; then
        echo "  ✅ tmux: $(tmux -V)"
    else
        echo "  ❌ tmux: Not installed"
    fi
    
    # Check Python
    if command -v python3 >/dev/null 2>&1; then
        echo "  ✅ python3: $(python3 --version)"
    else
        echo "  ❌ python3: Not installed"
    fi
    
    # Check GitHub CLI
    if command -v gh >/dev/null 2>&1; then
        echo "  ✅ GitHub CLI: $(gh --version | head -1)"
        
        # Check authentication
        if gh auth status >/dev/null 2>&1; then
            echo "    ✅ Authenticated"
        else
            echo "    ❌ Not authenticated (run: gh auth login)"
        fi
    else
        echo "  ❌ GitHub CLI: Not installed"
    fi
    
    # Check git
    if command -v git >/dev/null 2>&1; then
        echo "  ✅ git: $(git --version)"
    else
        echo "  ❌ git: Not installed"
    fi
    
    echo ""
}

# Function to check repository status
check_repository_status() {
    echo "📁 Repository Information..."
    
    # Check if we're in a git repository
    if git rev-parse --git-dir >/dev/null 2>&1; then
        echo "  ✅ Git repository detected"
        echo "    Branch: $(git branch --show-current)"
        echo "    Remote: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
        
        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            echo "    ⚠️  Uncommitted changes detected"
        else
            echo "    ✅ Working directory clean"
        fi
    else
        echo "  ❌ Not a git repository"
    fi
    
    echo ""
}

# Function to check orchestrator core files
check_orchestrator_files() {
    echo "📋 Orchestrator Core Files..."
    
    CORE_FILES=(
        "tmux_utils.py"
        "send-claude-message.sh"
        "schedule_with_note.sh"
        "CLAUDE.md"
        "README.md"
    )
    
    for file in "${CORE_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file (missing)"
        fi
    done
    
    echo ""
}

# Function to generate validation commands
generate_validation_commands() {
    echo "=== Recommended Validation Commands ==="
    echo ""
    echo "🔍 Component Validation:"
    echo "  python3 scripts/generate-test-issue.py  # Run orchestrator validation"
    echo "  ./scripts/run-issue-curator.sh init     # Initialize issue curator"
    echo ""
    echo "🧪 Manual Testing:"
    echo "  python3 tmux_utils.py                   # Test tmux utilities"
    echo "  ./send-claude-message.sh test:0 'test'  # Test message sending"
    echo "  ./schedule_with_note.sh 1 'test note'   # Test scheduling"
    echo ""
    echo "📊 GitHub Integration:"
    echo "  gh issue list --label orchestrator      # List orchestrator issues"
    echo "  gh repo view DementedWeasel1971/Tmux-Orchestrator  # View repository"
    echo ""
}

# Main discovery flow
echo "Current directory: $(pwd)"
echo "Repository: DementedWeasel1971/Tmux-Orchestrator"
echo "==================================="

# Run all discovery functions
check_system_dependencies
check_repository_status
check_orchestrator_files
discover_python_components
discover_shell_components

# Generate validation commands
generate_validation_commands

echo "==================================="
echo "Orchestrator component discovery complete."
echo ""
echo "💡 Next Steps:"
echo "1. Fix any missing dependencies or files"
echo "2. Run validation commands above"
echo "3. Deploy Issue Curator Agent with: ./scripts/run-issue-curator.sh"