#!/bin/bash
# Multi-Project Tmux Orchestrator
# Simplified orchestration across multiple projects using tmux sessions
# Usage: ./scripts/multi-project-orchestrator.sh [deploy|status] [config_file]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CONFIG_FILE="${2:-${PROJECT_ROOT}/config/projects.conf}"
LOG_DIR="${PROJECT_ROOT}/logs"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_status() {
    echo -e "${GREEN}[STATUS]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    for cmd in tmux python3; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            log_error "$cmd not found. Please install it first."
            exit 1
        fi
    done
    mkdir -p "$LOG_DIR"
}

start_project_session() {
    local session_name="$1"
    local project_path="$2"

    if tmux has-session -t "$session_name" 2>/dev/null; then
        log_info "Session $session_name already exists"
    else
        tmux new-session -d -s "$session_name" -c "$project_path"
        tmux rename-window -t "$session_name:0" "Manager"
        tmux send-keys -t "$session_name:0" "claude" Enter
        sleep 2
        "$SCRIPT_DIR/../send-claude-message.sh" "$session_name:0" "You are the Project Manager for $session_name. Coordinate tasks and report status." || true
        log_status "Started session $session_name at $project_path"
    fi
}

deploy_projects() {
    if [ ! -f "$CONFIG_FILE" ]; then
        log_error "Config file not found: $CONFIG_FILE"
        exit 1
    fi
    while IFS= read -r line; do
        [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
        session="${line%%:*}"
        path="${line#*:}"
        start_project_session "$session" "$path"
    done < "$CONFIG_FILE"
}

generate_status() {
    local status_file="$LOG_DIR/multi-project-status-$(date +%Y%m%d-%H%M%S).md"
    python3 - <<PY
from tmux_utils import TmuxOrchestrator
orchestrator = TmuxOrchestrator()
print(orchestrator.create_monitoring_snapshot())
PY
    > "$status_file"
    log_status "Status report generated: $status_file"
}

main() {
    local cmd="${1:-deploy}"
    check_dependencies
    case "$cmd" in
        deploy)
            deploy_projects
            ;;
        status)
            generate_status
            ;;
        *)
            echo "Usage: $0 [deploy|status] [config_file]"
            exit 1
            ;;
    esac
}

main "$@"
