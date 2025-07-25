#!/bin/bash

# Tmux Orchestrator Setup Script
# Run this script to configure the orchestrator for first-time use

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() { echo -e "${BLUE}[INFO]${NC} $*"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $*"; }
print_error() { echo -e "${RED}[ERROR]${NC} $*"; }

print_header() {
    echo
    echo "=================================================="
    echo " Tmux Orchestrator Setup"
    echo "=================================================="
    echo
}

print_section() {
    echo
    echo "-- $1 --"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ORCHESTRATOR_SETUP_MODE=true

print_header

print_info "Orchestrator directory: $SCRIPT_DIR"

# =============================================================================
# DEPENDENCY CHECKS
# =============================================================================

print_section "Checking Dependencies"

# Check for tmux
if command -v tmux >/dev/null 2>&1; then
    TMUX_VERSION=$(tmux -V | cut -d' ' -f2)
    print_success "tmux found: version $TMUX_VERSION"
else
    print_error "tmux is not installed"
    echo "Please install tmux first:"
    echo "  macOS: brew install tmux"
    echo "  Ubuntu/Debian: sudo apt install tmux"
    echo "  RHEL/CentOS: sudo yum install tmux"
    exit 1
fi

# Check for required utilities
for cmd in bc logger; do
    if command -v "$cmd" >/dev/null 2>&1; then
        print_success "$cmd found"
    else
        print_error "$cmd is required but not found"
        exit 1
    fi
done

# =============================================================================
# CONFIGURATION SETUP
# =============================================================================

print_section "Configuration Setup"

# Load config in setup mode
if [[ -f "$SCRIPT_DIR/config.sh" ]]; then
    source "$SCRIPT_DIR/config.sh"
else
    print_error "config.sh not found in $SCRIPT_DIR"
    exit 1
fi

print_info "Current configuration:"
echo "  Orchestrator directory: $ORCHESTRATOR_DIR"
echo "  Projects directory: $PROJECTS_DIR"
echo "  Default session prefix: $DEFAULT_SESSION_PREFIX"

# Ask user if they want to customize
echo
read -p "Do you want to customize the configuration? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Customize projects directory
    echo
    print_info "Current projects directory: $PROJECTS_DIR"
    read -p "Enter new projects directory (or press Enter to keep current): " NEW_PROJECTS_DIR
    
    if [[ -n "$NEW_PROJECTS_DIR" ]]; then
        # Expand tilde and relative paths
        NEW_PROJECTS_DIR=$(eval echo "$NEW_PROJECTS_DIR")
        if [[ "${NEW_PROJECTS_DIR:0:1}" != "/" ]]; then
            NEW_PROJECTS_DIR="$(pwd)/$NEW_PROJECTS_DIR"
        fi
        
        if [[ ! -d "$NEW_PROJECTS_DIR" ]]; then
            read -p "Directory doesn't exist. Create it? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                if mkdir -p "$NEW_PROJECTS_DIR"; then
                    print_success "Created directory: $NEW_PROJECTS_DIR"
                    PROJECTS_DIR="$NEW_PROJECTS_DIR"
                else
                    print_error "Failed to create directory: $NEW_PROJECTS_DIR"
                    exit 1
                fi
            fi
        else
            PROJECTS_DIR="$NEW_PROJECTS_DIR"
        fi
    fi
    
    # Customize session prefix
    echo
    print_info "Current session prefix: $DEFAULT_SESSION_PREFIX"
    read -p "Enter new session prefix (or press Enter to keep current): " NEW_PREFIX
    if [[ -n "$NEW_PREFIX" ]]; then
        DEFAULT_SESSION_PREFIX="$NEW_PREFIX"
        DEFAULT_TARGET_WINDOW="$DEFAULT_SESSION_PREFIX:0"
    fi
fi

# =============================================================================
# DIRECTORY CREATION
# =============================================================================

print_section "Creating Required Directories"

# Create projects directory if it doesn't exist
if [[ ! -d "$PROJECTS_DIR" ]]; then
    if mkdir -p "$PROJECTS_DIR"; then
        print_success "Created projects directory: $PROJECTS_DIR"
    else
        print_error "Failed to create projects directory: $PROJECTS_DIR"
        exit 1
    fi
else
    print_success "Projects directory exists: $PROJECTS_DIR"
fi

# Create orchestrator directories
for dir in "$REGISTRY_DIR" "$LOGS_DIR" "$NOTES_DIR"; do
    if [[ ! -d "$dir" ]]; then
        if mkdir -p "$dir"; then
            print_success "Created: $dir"
        else
            print_error "Failed to create: $dir"
            exit 1
        fi
    else
        print_success "Directory exists: $dir"
    fi
done

# =============================================================================
# SCRIPT PERMISSIONS
# =============================================================================

print_section "Setting Script Permissions"

SCRIPTS=("config.sh" "schedule_with_note.sh" "send-claude-message.sh" "tmux_utils.py")

for script in "${SCRIPTS[@]}"; do
    script_path="$SCRIPT_DIR/$script"
    if [[ -f "$script_path" ]]; then
        if chmod +x "$script_path"; then
            print_success "Made executable: $script"
        else
            print_warning "Failed to make executable: $script"
        fi
    else
        print_warning "Script not found: $script"
    fi
done

# =============================================================================
# SAVE CONFIGURATION
# =============================================================================

print_section "Saving Configuration"

# Update environment variables
export PROJECTS_DIR DEFAULT_SESSION_PREFIX DEFAULT_TARGET_WINDOW

# Save configuration
cat > "$SCRIPT_DIR/.orchestrator.conf" << EOF
# Tmux Orchestrator Configuration
# Generated on $(date)

PROJECTS_DIR="$PROJECTS_DIR"
DEFAULT_SESSION_PREFIX="$DEFAULT_SESSION_PREFIX"
DEFAULT_TARGET_WINDOW="$DEFAULT_TARGET_WINDOW"
ORCHESTRATOR_DIR="$ORCHESTRATOR_DIR"
EOF

print_success "Configuration saved to: $SCRIPT_DIR/.orchestrator.conf"

# =============================================================================
# VALIDATION TESTS
# =============================================================================

print_section "Running Validation Tests"

# Test config loading
if source "$SCRIPT_DIR/config.sh" >/dev/null 2>&1; then
    print_success "Configuration loads successfully"
else
    print_error "Configuration failed to load"
    exit 1
fi

# Test script syntax
for script in schedule_with_note.sh send-claude-message.sh; do
    if bash -n "$SCRIPT_DIR/$script" 2>/dev/null; then
        print_success "Syntax check passed: $script"
    else
        print_error "Syntax check failed: $script"
        exit 1
    fi
done

# Test tmux connectivity
if tmux info >/dev/null 2>&1; then
    print_success "tmux server is running"
    
    # List sessions if any exist
    if tmux list-sessions >/dev/null 2>&1; then
        print_info "Existing tmux sessions:"
        tmux list-sessions -F "  #{session_name}" | head -5
    else
        print_info "No active tmux sessions"
    fi
else
    print_warning "tmux server not running (this is normal if you haven't started tmux yet)"
fi

# =============================================================================
# SUCCESS AND NEXT STEPS
# =============================================================================

print_section "Setup Complete!"

print_success "Tmux Orchestrator has been configured successfully!"

echo
echo "Configuration Summary:"
echo "  Projects Directory: $PROJECTS_DIR"
echo "  Session Prefix: $DEFAULT_SESSION_PREFIX"
echo "  Default Target: $DEFAULT_TARGET_WINDOW"
echo "  Registry Directory: $REGISTRY_DIR"
echo

echo "Next Steps:"
echo "  1. Start tmux: tmux new-session -s $DEFAULT_SESSION_PREFIX"
echo "  2. Test scheduler: ./schedule_with_note.sh 1 \"Test message\""
echo "  3. Test messaging: ./send-claude-message.sh $DEFAULT_TARGET_WINDOW \"Hello\""
echo "  4. Read CLAUDE.md for detailed usage instructions"
echo

echo "Environment Variables (optional):"
echo "  Add these to your ~/.bashrc or ~/.zshrc for convenience:"
echo "  export PROJECTS_DIR=\"$PROJECTS_DIR\""
echo "  export DEFAULT_SESSION_PREFIX=\"$DEFAULT_SESSION_PREFIX\""
echo

unset ORCHESTRATOR_SETUP_MODE
print_success "Setup completed successfully!"