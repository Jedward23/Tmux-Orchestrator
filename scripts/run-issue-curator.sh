#!/bin/bash
# Tmux Orchestrator Issue Curator Agent
# Validates orchestrator components and creates GitHub issues for problems
# Repository: DementedWeasel1971/Tmux-Orchestrator

set -e  # Exit on any error

# Configuration
CURATOR_LOG="logs/issue-curator.log"
VALIDATION_LOG="logs/component-validation.log"
SCHEDULE_INTERVAL=120  # 2 hours in minutes
REPO_OWNER="DementedWeasel1971"
REPO_NAME="Tmux-Orchestrator"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$CURATOR_LOG"
}

log_status() {
    echo -e "${GREEN}[STATUS]${NC} $1" | tee -a "$CURATOR_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$CURATOR_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$CURATOR_LOG"
}

# Initialize curator
initialize_curator() {
    log_status "Initializing Issue Curator Agent..."
    
    # Create logs directory
    mkdir -p logs
    
    # Check dependencies
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) not found. Please install it first."
        exit 1
    fi
    
    # Verify GitHub authentication
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI not authenticated. Run 'gh auth login' first."
        exit 1
    fi
    
    # Verify repository access
    if ! gh repo view "$REPO_OWNER/$REPO_NAME" &> /dev/null; then
        log_error "Cannot access repository $REPO_OWNER/$REPO_NAME"
        exit 1
    fi
    
    log_status "Curator initialized successfully for $REPO_OWNER/$REPO_NAME"
}

# Discover orchestrator components
discover_components() {
    log_status "Discovering orchestrator components..."
    
    # Run discovery script
    if [ -f "scripts/discover-tests.sh" ]; then
        ./scripts/discover-tests.sh > "logs/component-discovery.log" 2>&1
        log_status "Component discovery completed. See logs/component-discovery.log for details."
    else
        log_warning "Component discovery script not found."
        return 1
    fi
    
    # Set framework to orchestrator validation
    FRAMEWORK="orchestrator"
    VALIDATION_COMMAND="python3 scripts/generate-test-issue.py"
    
    log_status "Framework: Orchestrator Component Validation"
    log_status "Validation command: $VALIDATION_COMMAND"
}

# Run component validation
run_validation() {
    log_status "Running component validation..."
    
    # Clear previous output
    > "$VALIDATION_LOG"
    
    # Run validation with timeout (10 minutes max)
    if timeout 600 $VALIDATION_COMMAND > "$VALIDATION_LOG" 2>&1; then
        log_status "Component validation completed successfully"
        return 0
    else
        exit_code=$?
        if [ $exit_code -eq 124 ]; then
            log_error "Validation timed out after 10 minutes"
        else
            log_warning "Validation completed with issues (exit code: $exit_code)"
        fi
        return $exit_code
    fi
}

# Process validation results and create issues
process_validation_results() {
    log_status "Processing validation results..."
    
    if [ ! -f "$VALIDATION_LOG" ]; then
        log_error "Validation output log not found"
        return 1
    fi
    
    # Check if validation found issues
    local issue_count=0
    
    if [[ "$FRAMEWORK" == "orchestrator" ]]; then
        issue_count=$(grep -c "Found.*issues" "$VALIDATION_LOG" 2>/dev/null || echo "0")
    fi
    
    log_status "Validation result logged to $VALIDATION_LOG"
    
    # The Python script handles issue creation internally
    log_status "Component validation and issue generation completed"
    
    return 0
}

# Analyze issue relationships
analyze_relationships() {
    log_status "Analyzing issue relationships..."
    
    if [ -f "scripts/issue-relationship-tracker.py" ]; then
        python3 scripts/issue-relationship-tracker.py 2>&1 | tee -a "$CURATOR_LOG"
    else
        log_warning "Relationship tracker not found"
    fi
}

# Generate status report
generate_status_report() {
    local component_count=$(find . -name "*.py" -o -name "*.sh" | grep -v __pycache__ | wc -l)
    local python_count=$(find . -name "*.py" | grep -v __pycache__ | wc -l)
    local shell_count=$(find . -name "*.sh" | wc -l)
    
    # Check for any validation errors
    local issue_count=0
    if [ -f "$VALIDATION_LOG" ]; then
        issue_count=$(grep -c "❌\|issues:" "$VALIDATION_LOG" 2>/dev/null || echo "0")
    fi
    
    # Calculate next run time
    local next_run=$(date -d "+${SCHEDULE_INTERVAL} minutes" '+%Y-%m-%d %H:%M UTC')
    
    # Create status message
    cat > "logs/curator-status.txt" << EOF
ORCHESTRATOR ISSUE CURATOR STATUS $(date '+%Y-%m-%d %H:%M UTC')
Repository: $REPO_OWNER/$REPO_NAME
Components Validated: $component_count
Python Scripts: $python_count
Shell Scripts: $shell_count
Issues Found: $issue_count
Framework: $FRAMEWORK
Validation Command: $VALIDATION_COMMAND
Next Run: $next_run
Log: $CURATOR_LOG
EOF
    
    # Display status
    cat "logs/curator-status.txt"
    
    # Send to orchestrator if in tmux
    if [ ! -z "$TMUX" ]; then
        local orchestrator_window="tmux-orc:0"  # Adjust as needed
        if tmux list-windows -t "tmux-orc" 2>/dev/null | grep -q ":0:"; then
            ./send-claude-message.sh "$orchestrator_window" "$(cat logs/curator-status.txt)"
        fi
    fi
}

# Schedule next run
schedule_next_run() {
    local current_window=$(tmux display-message -p "#{session_name}:#{window_index}" 2>/dev/null || echo "unknown")
    
    if [ -f "schedule_with_note.sh" ] && [ "$current_window" != "unknown" ]; then
        log_status "Scheduling next curator run in $SCHEDULE_INTERVAL minutes..."
        ./schedule_with_note.sh $SCHEDULE_INTERVAL "Issue Curator: Run test suite and update GitHub issues" "$current_window"
    else
        log_warning "Could not schedule next run (not in tmux or script missing)"
    fi
}

# Main execution flow
main() {
    log_status "=== Issue Curator Agent Starting ==="
    
    # Parse command line arguments
    case "${1:-run}" in
        "init")
            initialize_curator
            ;;
        "discover")
            discover_components
            ;;
        "validate")
            run_validation
            ;;
        "process")
            process_validation_results
            ;;
        "analyze")
            analyze_relationships
            ;;
        "run")
            # Full workflow
            initialize_curator
            discover_components
            run_validation
            process_validation_results
            analyze_relationships
            generate_status_report
            schedule_next_run
            ;;
        "status")
            generate_status_report
            ;;
        *)
            echo "Usage: $0 [init|discover|validate|process|analyze|run|status]"
            echo "  init     - Initialize curator (check dependencies and GitHub access)"
            echo "  discover - Discover orchestrator components and dependencies"
            echo "  validate - Run component validation only"
            echo "  process  - Process validation results and create issues"
            echo "  analyze  - Analyze issue relationships"
            echo "  run      - Full workflow (default)"
            echo "  status   - Generate status report only"
            exit 1
            ;;
    esac
    
    log_status "=== Issue Curator Agent Complete ==="
}

# Execute main function
main "$@"