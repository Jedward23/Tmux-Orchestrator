#!/bin/bash
# SuperClaude + Tmux Orchestrator Integration Setup
# Ensures both systems work together seamlessly

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 SuperClaude + Tmux Orchestrator Integration Setup${NC}"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "CLAUDE.md" ] || [ ! -d "SuperClaude" ]; then
    echo -e "${RED}❌ Error: Must be run from Tmux-Orchestrator root directory${NC}"
    echo "Expected files: CLAUDE.md, SuperClaude/"
    exit 1
fi

echo -e "${GREEN}✅ Found SuperClaude integration files${NC}"

# 1. Verify directory structure
echo -e "${BLUE}📁 Verifying directory structure...${NC}"

required_dirs=(
    "SuperClaude/Core"
    "SuperClaude/Commands" 
    ".claude/commands"
    "scripts"
    "agent-briefings"
    "setup"
    "config"
    "profiles"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ✅ $dir"
    else
        echo -e "  ❌ $dir (missing)"
        exit 1
    fi
done

# 2. Check SuperClaude commands
echo -e "${BLUE}🛠️  Checking SuperClaude commands...${NC}"

superclaude_commands=(
    "analyze.md"
    "build.md"
    "implement.md"
    "improve.md"
    "troubleshoot.md"
    "document.md"
    "design.md"
)

for cmd in "${superclaude_commands[@]}"; do
    if [ -f ".claude/commands/$cmd" ]; then
        echo -e "  ✅ /$(basename "$cmd" .md)"
    else
        echo -e "  ❌ /$(basename "$cmd" .md) (missing)"
    fi
done

# 3. Verify script permissions
echo -e "${BLUE}🔧 Checking script permissions...${NC}"

scripts=(
    "send-claude-message.sh"
    "schedule_with_note.sh"
    "scripts/discover-tests.sh"
    "scripts/run-issue-curator.sh"
    "scripts/setup-github-labels.sh"
    "scripts/git-integration.sh"
    "scripts/superclaude-enhanced-orchestrator.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo -e "  ✅ $script (executable)"
        else
            echo -e "  🔧 $script (fixing permissions)"
            chmod +x "$script"
        fi
    else
        echo -e "  ❌ $script (missing)"
    fi
done

# 4. Create logs directory
echo -e "${BLUE}📊 Setting up logging structure...${NC}"
mkdir -p logs
echo -e "  ✅ logs/ directory created"

# 5. Verify Python environment
echo -e "${BLUE}🐍 Checking Python environment...${NC}"

if command -v python3 >/dev/null 2>&1; then
    echo -e "  ✅ Python 3 available: $(python3 --version)"
else
    echo -e "  ❌ Python 3 not found"
    exit 1
fi

# Test Python scripts
python_scripts=(
    "tmux_utils.py"
    "scripts/generate-test-issue.py"
    "scripts/issue-relationship-tracker.py"
)

for script in "${python_scripts[@]}"; do
    if [ -f "$script" ]; then
        if python3 -m py_compile "$script" 2>/dev/null; then
            echo -e "  ✅ $script (syntax OK)"
        else
            echo -e "  ❌ $script (syntax error)"
        fi
    fi
done

# 6. Check system dependencies
echo -e "${BLUE}🔍 Checking system dependencies...${NC}"

dependencies=("tmux" "git" "gh")

for dep in "${dependencies[@]}"; do
    if command -v "$dep" >/dev/null 2>&1; then
        version_info=""
        case "$dep" in
            "tmux") version_info="$(tmux -V)" ;;
            "git") version_info="$(git --version)" ;;
            "gh") version_info="$(gh --version | head -1)" ;;
        esac
        echo -e "  ✅ $dep: $version_info"
    else
        echo -e "  ❌ $dep not found"
        exit 1
    fi
done

# 7. Test GitHub CLI authentication
echo -e "${BLUE}🔐 Checking GitHub CLI authentication...${NC}"

if gh auth status >/dev/null 2>&1; then
    echo -e "  ✅ GitHub CLI authenticated"
    
    # Test repository access
    if gh repo view DementedWeasel1971/Tmux-Orchestrator >/dev/null 2>&1; then
        echo -e "  ✅ Repository access confirmed"
    else
        echo -e "  ⚠️  Repository access test failed (may be private)"
    fi
else
    echo -e "  ❌ GitHub CLI not authenticated"
    echo -e "  💡 Run: ${YELLOW}gh auth login${NC}"
fi

# 8. Test tmux functionality
echo -e "${BLUE}📱 Testing tmux functionality...${NC}"

if tmux list-sessions >/dev/null 2>&1 || [ $? -eq 1 ]; then
    echo -e "  ✅ Tmux server accessible"
else
    echo -e "  ❌ Tmux server not accessible"
fi

# 9. Create sample configuration
echo -e "${BLUE}⚙️  Creating sample configuration...${NC}"

cat > ".claude/settings.json.example" << 'EOF'
{
  "superclaude": {
    "enable_personas": true,
    "enable_mcp": true,
    "enable_wave": true,
    "default_persona": "architect",
    "token_optimization": true
  },
  "orchestrator": {
    "default_session": "enhanced-orchestrator",
    "auto_scheduling": true,
    "schedule_interval": 120,
    "log_level": "info"
  }
}
EOF

echo -e "  ✅ Sample configuration created (.claude/settings.json.example)"

# 10. Generate integration summary
echo -e "${BLUE}📋 Integration Summary${NC}"
echo "============================================================"

echo -e "${GREEN}🎉 SuperClaude + Tmux Orchestrator Integration Complete!${NC}"
echo ""
echo -e "${YELLOW}Available Enhanced Commands:${NC}"
echo "  /analyze [target] --focus [domain] --think-hard"
echo "  /implement [feature] --type component|api|service"
echo "  /improve [target] --quality --security --loop"
echo "  /troubleshoot [symptoms] --persona-analyzer"
echo "  /document [target] --persona-scribe=en"
echo ""
echo -e "${YELLOW}Enhanced Scripts:${NC}"
echo "  ./scripts/superclaude-enhanced-orchestrator.sh - Main orchestrator"
echo "  ./scripts/run-issue-curator.sh - Enhanced issue curation"
echo "  ./send-claude-message.sh - Agent communication"
echo ""
echo -e "${YELLOW}Quick Start:${NC}"
echo "  1. Deploy enhanced team:"
echo "     ./scripts/superclaude-enhanced-orchestrator.sh . deploy"
echo ""
echo "  2. Run full analysis:"
echo "     ./scripts/superclaude-enhanced-orchestrator.sh . full"
echo ""
echo "  3. Create enhanced issue curator:"
echo "     ./scripts/run-issue-curator.sh init"
echo ""
echo -e "${GREEN}✨ Integration ready! Both systems now work together seamlessly.${NC}"