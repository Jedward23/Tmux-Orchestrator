#!/bin/bash

# Tmux Orchestrator Configuration
# This file provides portable, customizable configuration for all orchestrator scripts
# Follow best practices: validate inputs, handle errors gracefully, provide clear feedback

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# =============================================================================
# CONFIGURATION DETECTION AND DEFAULTS
# =============================================================================

# Get the absolute path of the orchestrator directory
ORCHESTRATOR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ORCHESTRATOR_DIR

# Try to find a reasonable projects directory
detect_projects_dir() {
    local candidates=(
        "${PROJECTS_DIR:-}"           # User-specified via environment
        "$HOME/code"                  # Common convention
        "$HOME/Code"                  # macOS default
        "$HOME/projects"              # Another common name
        "$HOME/Projects"              # Capitalized version
        "$HOME/workspace"             # Eclipse/IDE convention
        "$HOME/dev"                   # Short form
        "$HOME/Development"           # Descriptive
        "$HOME/src"                   # Source code
        "$HOME/repos"                 # Git repositories
        "$HOME/git"                   # Git repositories
        "$(pwd)"                      # Current directory as fallback
    )
    
    for dir in "${candidates[@]}"; do
        if [[ -n "$dir" && -d "$dir" && -w "$dir" ]]; then
            echo "$dir"
            return 0
        fi
    done
    
    # If nothing found, suggest creating one
    echo "$HOME/code"
    return 1
}

# Set projects directory with validation
if ! PROJECTS_DIR=$(detect_projects_dir); then
    echo "Warning: No suitable projects directory found. Will use: $PROJECTS_DIR" >&2
    echo "You may want to create this directory or set PROJECTS_DIR environment variable." >&2
fi
export PROJECTS_DIR

# =============================================================================
# SESSION AND WINDOW CONFIGURATION
# =============================================================================

# Default session settings - highly customizable
export DEFAULT_SESSION_PREFIX="${DEFAULT_SESSION_PREFIX:-tmux-orc}"
export DEFAULT_TARGET_WINDOW="${DEFAULT_TARGET_WINDOW:-$DEFAULT_SESSION_PREFIX:0}"

# =============================================================================
# FILE PATHS AND DIRECTORIES
# =============================================================================

# Core orchestrator files
export NEXT_CHECK_NOTE="$ORCHESTRATOR_DIR/next_check_note.txt"
export REGISTRY_DIR="$ORCHESTRATOR_DIR/registry"
export LOGS_DIR="$REGISTRY_DIR/logs"
export NOTES_DIR="$REGISTRY_DIR/notes"
export CONFIG_FILE="$ORCHESTRATOR_DIR/.orchestrator.conf"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Logging functions
log_info() { echo "[INFO] $*" >&2; }
log_warn() { echo "[WARN] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }

# Ensure required directories exist
ensure_directories() {
    local dirs=("$REGISTRY_DIR" "$LOGS_DIR" "$NOTES_DIR")
    local created=()
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            if mkdir -p "$dir" 2>/dev/null; then
                created+=("$dir")
            else
                log_error "Failed to create directory: $dir"
                return 1
            fi
        fi
    done
    
    if [[ ${#created[@]} -gt 0 ]]; then
        log_info "Created directories: ${created[*]}"
    fi
}

# Validate projects directory exists and is writable
validate_projects_dir() {
    if [[ ! -d "$PROJECTS_DIR" ]]; then
        log_warn "Projects directory does not exist: $PROJECTS_DIR"
        read -p "Create it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if mkdir -p "$PROJECTS_DIR"; then
                log_info "Created projects directory: $PROJECTS_DIR"
            else
                log_error "Failed to create projects directory: $PROJECTS_DIR"
                return 1
            fi
        else
            log_error "Cannot proceed without a valid projects directory"
            return 1
        fi
    fi
    
    if [[ ! -w "$PROJECTS_DIR" ]]; then
        log_error "Projects directory is not writable: $PROJECTS_DIR"
        return 1
    fi
}

# Get absolute path to a project
get_project_path() {
    local project_name="$1"
    if [[ -z "$project_name" ]]; then
        log_error "Project name is required"
        return 1
    fi
    echo "$PROJECTS_DIR/$project_name"
}

# Get absolute path to a script in the orchestrator directory
get_script_path() {
    local script_name="$1"
    if [[ -z "$script_name" ]]; then
        log_error "Script name is required"
        return 1
    fi
    
    local script_path="$ORCHESTRATOR_DIR/$script_name"
    if [[ ! -f "$script_path" ]]; then
        log_error "Script not found: $script_path"
        return 1
    fi
    
    echo "$script_path"
}

# Check if a tmux session exists
tmux_session_exists() {
    local session_name="$1"
    tmux has-session -t "$session_name" 2>/dev/null
}

# Check if a tmux window exists
tmux_window_exists() {
    local target="$1"
    tmux list-windows -t "${target%:*}" -F "#{session_name}:#{window_index}" 2>/dev/null | grep -q "^$target$"
}

# Validate tmux target format (session:window or session:window.pane)
validate_tmux_target() {
    local target="$1"
    if [[ ! "$target" =~ ^[a-zA-Z0-9_-]+:[0-9]+(\.[0-9]+)?$ ]]; then
        log_error "Invalid tmux target format: $target (expected: session:window or session:window.pane)"
        return 1
    fi
}

# List available projects
list_projects() {
    if [[ -d "$PROJECTS_DIR" ]]; then
        find "$PROJECTS_DIR" -maxdepth 1 -type d -not -name ".*" -exec basename {} \; | sort
    else
        log_warn "Projects directory does not exist: $PROJECTS_DIR"
    fi
}

# Save configuration to file
save_config() {
    cat > "$CONFIG_FILE" << EOF
# Tmux Orchestrator Configuration
# Generated on $(date)

PROJECTS_DIR="$PROJECTS_DIR"
DEFAULT_SESSION_PREFIX="$DEFAULT_SESSION_PREFIX"
DEFAULT_TARGET_WINDOW="$DEFAULT_TARGET_WINDOW"
ORCHESTRATOR_DIR="$ORCHESTRATOR_DIR"
EOF
    log_info "Configuration saved to: $CONFIG_FILE"
}

# Load configuration from file
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
        log_info "Configuration loaded from: $CONFIG_FILE"
    fi
}

# =============================================================================
# INITIALIZATION
# =============================================================================

# Create required directories on first load
ensure_directories

# Load any existing configuration
load_config

# Validate configuration if not in setup mode
if [[ "${ORCHESTRATOR_SETUP_MODE:-}" != "true" ]]; then
    if ! validate_projects_dir; then
        log_error "Configuration validation failed. Run setup.sh to configure."
        exit 1
    fi
fi

# Export all configuration for other scripts
export PROJECTS_DIR DEFAULT_SESSION_PREFIX DEFAULT_TARGET_WINDOW
export NEXT_CHECK_NOTE REGISTRY_DIR LOGS_DIR NOTES_DIR CONFIG_FILE

log_info "Orchestrator configuration loaded successfully"
log_info "Projects directory: $PROJECTS_DIR"
log_info "Orchestrator directory: $ORCHESTRATOR_DIR"