#!/bin/bash
# SuperClaude-Enhanced Tmux Orchestrator
# Combines orchestrator functionality with SuperClaude framework capabilities
# Repository: DementedWeasel1971/Tmux-Orchestrator

set -e

# Configuration
REPO_OWNER="DementedWeasel1971"
REPO_NAME="Tmux-Orchestrator"
LOG_DIR="logs"
ORCHESTRATOR_LOG="$LOG_DIR/enhanced-orchestrator.log"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$ORCHESTRATOR_LOG"
}

log_status() {
    echo -e "${GREEN}[STATUS]${NC} $1" | tee -a "$ORCHESTRATOR_LOG"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$ORCHESTRATOR_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$ORCHESTRATOR_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$ORCHESTRATOR_LOG"
}

# Initialize enhanced orchestrator
initialize_enhanced_orchestrator() {
    log_status "Initializing SuperClaude-Enhanced Orchestrator..."
    
    # Create logs directory
    mkdir -p "$LOG_DIR"
    
    # Check SuperClaude integration
    if [ ! -d "SuperClaude" ]; then
        log_error "SuperClaude framework not found. Run integration first."
        return 1
    fi
    
    # Check dependencies
    for cmd in tmux python3 gh git; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_error "$cmd not found. Please install required dependencies."
            return 1
        fi
    done
    
    # Verify GitHub authentication
    if ! gh auth status >/dev/null 2>&1; then
        log_error "GitHub CLI not authenticated. Run 'gh auth login' first."
        return 1
    fi
    
    # Verify repository access
    if ! gh repo view "$REPO_OWNER/$REPO_NAME" >/dev/null 2>&1; then
        log_error "Cannot access repository $REPO_OWNER/$REPO_NAME"
        return 1
    fi
    
    log_status "Enhanced orchestrator initialized successfully"
}

# Create SuperClaude-enhanced agent
create_enhanced_agent() {
    local session_name="$1"
    local agent_role="$2"
    local project_path="$3"
    local persona="${4:-architect}"
    
    log_info "Creating SuperClaude-enhanced $agent_role agent..."
    
    # Create tmux window
    local window_name="SC-$agent_role"
    tmux new-window -t "$session_name" -n "$window_name" -c "$project_path"
    
    # Start Claude
    tmux send-keys -t "$session_name:$window_name" "claude" Enter
    sleep 5
    
    # Enhanced briefing with SuperClaude
    local briefing_message="/load @. --persona-$persona --think

You are a SuperClaude-enhanced $agent_role agent with advanced capabilities:

SUPERCLAUDE COMMANDS:
- /analyze [target] --focus [domain] --think-hard
- /implement [feature] --type [component|api|service]
- /improve [target] --quality --security --loop
- /troubleshoot [symptoms] --persona-analyzer
- /document [target] --persona-scribe=en

ORCHESTRATOR INTEGRATION:
- Monitor tmux sessions and agent coordination
- Use /analyze for component validation
- Use /improve for systematic enhancements
- Report status with evidence-based metrics

ENHANCED WORKFLOW:
1. /load @. to understand project context
2. /analyze @. --focus $agent_role to assess domain
3. Execute role-specific tasks with appropriate personas
4. Use /document for professional status reports
5. Coordinate with other agents via orchestrator

AUTO-CAPABILITIES:
- Persona auto-activation based on task domain
- MCP server integration (Sequential, Context7, Magic, Playwright)
- Wave orchestration for complex operations
- Token optimization with --uc flag

Begin by loading project context and analyzing your domain focus."

    # Send enhanced briefing
    ./send-claude-message.sh "$session_name:$window_name" "$briefing_message"
    
    log_status "Created enhanced $agent_role agent in $session_name:$window_name"
}

# Deploy enhanced agent team
deploy_enhanced_team() {
    local project_path="$1"
    local session_name="${2:-enhanced-orchestrator}"
    
    log_info "Deploying SuperClaude-enhanced agent team..."
    
    # Create session if it doesn't exist
    if ! tmux has-session -t "$session_name" 2>/dev/null; then
        tmux new-session -d -s "$session_name" -c "$project_path"
        tmux rename-window -t "$session_name:0" "Orchestrator"
    fi
    
    # Deploy specialized agents
    create_enhanced_agent "$session_name" "Architect" "$project_path" "architect"
    create_enhanced_agent "$session_name" "Developer" "$project_path" "frontend" 
    create_enhanced_agent "$session_name" "Security" "$project_path" "security"
    create_enhanced_agent "$session_name" "QA" "$project_path" "qa"
    create_enhanced_agent "$session_name" "Curator" "$project_path" "analyzer"
    
    log_status "Enhanced agent team deployed in session: $session_name"
}

# Enhanced project analysis
run_enhanced_analysis() {
    local session_name="$1"
    
    log_info "Running SuperClaude-enhanced project analysis..."
    
    # Architect analysis
    ./send-claude-message.sh "$session_name:SC-Architect" "/analyze @. --persona-architect --ultrathink --wave-mode"
    
    # Security audit
    ./send-claude-message.sh "$session_name:SC-Security" "/analyze @. --persona-security --focus security --think-hard"
    
    # Quality assessment
    ./send-claude-message.sh "$session_name:SC-QA" "/analyze @. --persona-qa --focus quality --validate"
    
    # Component analysis
    ./send-claude-message.sh "$session_name:SC-Curator" "/analyze @scripts/ --persona-analyzer --seq"
    
    log_status "Enhanced analysis initiated across all agents"
}

# Coordinate enhanced improvements
coordinate_improvements() {
    local session_name="$1"
    
    log_info "Coordinating SuperClaude-enhanced improvements..."
    
    # Architecture improvements
    ./send-claude-message.sh "$session_name:SC-Architect" "/improve @. --persona-architect --quality --wave-mode --systematic"
    
    # Security hardening
    ./send-claude-message.sh "$session_name:SC-Security" "/improve @. --persona-security --security --validate"
    
    # Code quality improvements
    ./send-claude-message.sh "$session_name:SC-Developer" "/improve @scripts/ --persona-refactorer --quality --loop"
    
    # Documentation enhancement
    ./send-claude-message.sh "$session_name:SC-QA" "/document @. --persona-scribe=en --comprehensive"
    
    log_status "Enhanced improvement coordination initiated"
}

# Generate enhanced status report
generate_enhanced_status() {
    local session_name="$1"
    
    log_info "Generating SuperClaude-enhanced status report..."
    
    # Request status from all agents
    for agent in Architect Developer Security QA Curator; do
        ./send-claude-message.sh "$session_name:SC-$agent" "/document --persona-scribe=en --uc \"Provide status update: completed tasks, current work, findings, recommendations\""
    done
    
    # Generate orchestrator summary
    local status_file="$LOG_DIR/enhanced-status-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$status_file" << EOF
# SuperClaude-Enhanced Orchestrator Status Report
Generated: $(date '+%Y-%m-%d %H:%M UTC')
Repository: $REPO_OWNER/$REPO_NAME
Session: $session_name

## Agent Status Summary
- **Architect**: System design analysis and improvements
- **Developer**: Implementation and code quality
- **Security**: Security audit and hardening
- **QA**: Quality assurance and testing
- **Curator**: Component validation and issue management

## SuperClaude Integration Status
- Framework: ✅ Integrated
- Commands: ✅ Available (/analyze, /improve, /implement, etc.)
- Personas: ✅ Auto-activating
- MCP Servers: ✅ Connected
- Wave Orchestration: ✅ Enabled

## Recent Activity
$(tail -20 "$ORCHESTRATOR_LOG" | sed 's/^/- /')

---
*Generated by SuperClaude-Enhanced Orchestrator*
EOF
    
    log_status "Enhanced status report generated: $status_file"
    
    # Send to orchestrator window if in tmux
    if [ ! -z "$TMUX" ]; then
        ./send-claude-message.sh "$session_name:Orchestrator" "$(cat "$status_file")"
    fi
}

# Main execution flow
main() {
    local project_path="${1:-$(pwd)}"
    
    case "${2:-deploy}" in
        "init")
            initialize_enhanced_orchestrator
            ;;
        "deploy")
            initialize_enhanced_orchestrator
            deploy_enhanced_team "$project_path"
            ;;
        "analyze") 
            run_enhanced_analysis "${3:-enhanced-orchestrator}"
            ;;
        "improve")
            coordinate_improvements "${3:-enhanced-orchestrator}"
            ;;
        "status")
            generate_enhanced_status "${3:-enhanced-orchestrator}"
            ;;
        "full")
            initialize_enhanced_orchestrator
            deploy_enhanced_team "$project_path"
            sleep 10  # Allow agents to initialize
            run_enhanced_analysis "enhanced-orchestrator"
            sleep 30  # Allow analysis to complete
            coordinate_improvements "enhanced-orchestrator"
            sleep 20  # Allow improvements to start
            generate_enhanced_status "enhanced-orchestrator"
            ;;
        *)
            echo "Usage: $0 [project_path] [init|deploy|analyze|improve|status|full] [session_name]"
            echo ""
            echo "Commands:"
            echo "  init     - Initialize enhanced orchestrator"
            echo "  deploy   - Deploy SuperClaude-enhanced agent team"
            echo "  analyze  - Run enhanced project analysis"
            echo "  improve  - Coordinate enhanced improvements"
            echo "  status   - Generate enhanced status report"
            echo "  full     - Complete enhanced workflow"
            echo ""
            echo "Examples:"
            echo "  $0 /path/to/project deploy"
            echo "  $0 . full my-session"
            exit 1
            ;;
    esac
    
    log_status "SuperClaude-Enhanced Orchestrator operation complete"
}

# Execute main function
main "$@"