#!/bin/bash
# Git Integration for Issue Curator
# Tracks changes to orchestrator components and correlates with issues

# Configuration
REPO_OWNER="DementedWeasel1971"
REPO_NAME="Tmux-Orchestrator"
TRACKED_COMPONENTS=(
    "tmux_utils.py"
    "send-claude-message.sh"
    "schedule_with_note.sh"
    "scripts/generate-test-issue.py"
    "scripts/issue-relationship-tracker.py"
    "scripts/discover-tests.sh"
    "scripts/run-issue-curator.sh"
    "CLAUDE.md"
)

# Function to check component changes since last commit
check_component_changes() {
    echo "🔍 Checking component changes..."
    
    local changes_found=false
    
    for component in "${TRACKED_COMPONENTS[@]}"; do
        if [ -f "$component" ]; then
            # Check if file has uncommitted changes
            if git diff --quiet "$component" 2>/dev/null; then
                echo "  ✅ $component - No changes"
            else
                echo "  📝 $component - Modified"
                changes_found=true
                
                # Show brief diff
                echo "    Changes:"
                git diff --stat "$component" | sed 's/^/      /'
            fi
        else
            echo "  ❓ $component - File not found"
        fi
    done
    
    if [ "$changes_found" = true ]; then
        echo ""
        echo "⚠️  Uncommitted changes detected in orchestrator components!"
        echo "Consider committing changes before running validation."
        return 1
    else
        echo ""
        echo "✅ All tracked components are up to date."
        return 0
    fi
}

# Function to auto-commit component changes
auto_commit_changes() {
    echo "🔄 Auto-committing orchestrator component changes..."
    
    local commit_needed=false
    local staged_files=()
    
    for component in "${TRACKED_COMPONENTS[@]}"; do
        if [ -f "$component" ] && ! git diff --quiet "$component" 2>/dev/null; then
            git add "$component"
            staged_files+=("$component")
            commit_needed=true
        fi
    done
    
    if [ "$commit_needed" = true ]; then
        # Generate commit message
        local commit_msg="Update orchestrator components"
        if [ ${#staged_files[@]} -eq 1 ]; then
            commit_msg="Update ${staged_files[0]}"
        elif [ ${#staged_files[@]} -lt 5 ]; then
            commit_msg="Update $(printf "%s, " "${staged_files[@]}" | sed 's/, $//')"
        fi
        
        # Add automated tag
        commit_msg="$commit_msg

🤖 Auto-committed by Issue Curator Agent
Components updated: ${#staged_files[@]}
Files: $(printf "%s " "${staged_files[@]}")

Generated at: $(date '+%Y-%m-%d %H:%M:%S UTC')"
        
        if git commit -m "$commit_msg"; then
            echo "✅ Committed changes to ${#staged_files[@]} components"
            return 0
        else
            echo "❌ Failed to commit changes"
            return 1
        fi
    else
        echo "ℹ️  No changes to commit"
        return 0
    fi
}

# Function to check for related GitHub issues when files change
correlate_changes_with_issues() {
    echo "🔗 Correlating changes with GitHub issues..."
    
    # Get recent commits affecting tracked components
    local recent_commits=$(git log --oneline --since="1 week ago" -- "${TRACKED_COMPONENTS[@]}" 2>/dev/null)
    
    if [ -z "$recent_commits" ]; then
        echo "  No recent commits found for tracked components"
        return 0
    fi
    
    echo "  Recent component commits:"
    echo "$recent_commits" | sed 's/^/    /'
    
    # Check for open issues related to components
    echo ""
    echo "  Checking for related GitHub issues..."
    
    for component in "${TRACKED_COMPONENTS[@]}"; do
        # Search for issues mentioning this component
        local component_issues=$(gh issue list \
            --repo "$REPO_OWNER/$REPO_NAME" \
            --search "$component in:body" \
            --state open \
            --limit 5 \
            --json number,title 2>/dev/null)
        
        if [ -n "$component_issues" ] && [ "$component_issues" != "[]" ]; then
            echo "    📋 Issues for $component:"
            echo "$component_issues" | jq -r '.[] | "      #\(.number): \(.title)"' 2>/dev/null || echo "      (Could not parse issues)"
        fi
    done
}

# Function to create change-based issues
create_change_issue() {
    local component="$1"
    local change_type="$2"
    local description="$3"
    
    echo "📝 Creating issue for $component changes..."
    
    # Get recent changes
    local recent_changes=$(git log --oneline -5 -- "$component" 2>/dev/null)
    local diff_stat=$(git diff --stat HEAD~1 "$component" 2>/dev/null)
    
    # Create issue body
    local issue_body=$(cat << EOF
## Component Change Tracking

### Component Modified
- **File**: \`$component\`
- **Change Type**: $change_type
- **Detection**: Automated by Issue Curator Agent

### Change Description
$description

### Recent Changes
\`\`\`
$recent_changes
\`\`\`

### Change Statistics
\`\`\`
$diff_stat
\`\`\`

### Action Required
- [ ] Review changes for potential issues
- [ ] Update related documentation
- [ ] Test component functionality
- [ ] Update related tests/validation

### Related Components
$(printf '%s\n' "${TRACKED_COMPONENTS[@]}" | grep -v "^$component$" | sed 's/^/- `/' | sed 's/$/`/')

---
*Auto-generated by Issue Curator Agent for component change tracking*
EOF
)
    
    # Create the issue
    local issue_title="[CHANGE] $change_type in $component"
    if gh issue create \
        --repo "$REPO_OWNER/$REPO_NAME" \
        --title "$issue_title" \
        --body "$issue_body" \
        --label "orchestrator,automated,enhancement"; then
        echo "✅ Created change tracking issue for $component"
    else
        echo "❌ Failed to create change tracking issue"
    fi
}

# Function to tag stable versions
tag_stable_version() {
    echo "🏷️  Creating stable version tag..."
    
    # Generate version tag
    local timestamp=$(date '+%Y%m%d-%H%M%S')
    local tag_name="stable-orchestrator-$timestamp"
    
    # Get current commit
    local current_commit=$(git rev-parse HEAD)
    
    # Create tag with message
    local tag_message="Stable Orchestrator Version - $timestamp

Components validated and working:
$(printf '%s\n' "${TRACKED_COMPONENTS[@]}" | sed 's/^/- /')

Created by: Issue Curator Agent
Commit: $current_commit
Date: $(date '+%Y-%m-%d %H:%M:%S UTC')"
    
    if git tag -a "$tag_name" -m "$tag_message"; then
        echo "✅ Created stable version tag: $tag_name"
        
        # Push tag to remote
        if git push origin "$tag_name" 2>/dev/null; then
            echo "✅ Pushed tag to remote repository"
        else
            echo "⚠️  Tag created locally, but could not push to remote"
        fi
    else
        echo "❌ Failed to create version tag"
    fi
}

# Main function
main() {
    case "${1:-check}" in
        "check")
            check_component_changes
            ;;
        "commit")
            auto_commit_changes
            ;;
        "correlate")
            correlate_changes_with_issues
            ;;
        "track-change")
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo "Usage: $0 track-change <component> <description>"
                exit 1
            fi
            create_change_issue "$2" "Manual Update" "$3"
            ;;
        "tag")
            tag_stable_version
            ;;
        "full")
            echo "🔄 Running full git integration workflow..."
            check_component_changes
            correlate_changes_with_issues
            
            # Ask if user wants to commit changes
            if ! check_component_changes >/dev/null 2>&1; then
                read -p "Commit changes automatically? (y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    auto_commit_changes
                fi
            fi
            ;;
        *)
            echo "Usage: $0 [check|commit|correlate|track-change|tag|full]"
            echo ""
            echo "Commands:"
            echo "  check        - Check for uncommitted component changes"
            echo "  commit       - Auto-commit component changes"
            echo "  correlate    - Correlate changes with GitHub issues"
            echo "  track-change - Create issue for manual component change"
            echo "  tag          - Create stable version tag"
            echo "  full         - Run complete workflow"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"