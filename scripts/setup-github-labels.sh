#!/bin/bash
# Setup GitHub Labels for Tmux-Orchestrator Repository
# Creates labels specific to orchestrator components and issue types

echo "🏷️  Setting up GitHub labels for Tmux-Orchestrator..."

# Repository info
REPO="DementedWeasel1971/Tmux-Orchestrator"

# Function to create label if it doesn't exist
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"
    
    # Check if label exists
    if gh label list --repo "$REPO" | grep -q "^$name"; then
        echo "  ✅ Label '$name' already exists"
    else
        if gh label create "$name" --color "$color" --description "$description" --repo "$REPO"; then
            echo "  ✅ Created label '$name'"
        else
            echo "  ❌ Failed to create label '$name'"
        fi
    fi
}

echo ""
echo "Creating orchestrator-specific labels..."

# Priority labels
create_label "priority-critical" "d73a4a" "Critical issues that break core functionality"
create_label "priority-high" "e99695" "High priority issues affecting major features"
create_label "priority-medium" "f9d0c4" "Medium priority issues"
create_label "priority-low" "fef2f2" "Low priority issues"

# Component labels
create_label "orchestrator" "0052cc" "Issues related to orchestrator functionality"
create_label "python" "3776ab" "Python script issues"
create_label "shell-script" "89e051" "Shell script issues"
create_label "tmux" "1d76db" "Tmux integration issues"
create_label "github" "24292e" "GitHub integration issues"
create_label "scheduling" "fbca04" "Scheduling and automation issues"

# Issue type labels
create_label "syntax" "d4c5f9" "Syntax errors in scripts"
create_label "permissions" "f9c513" "File permission issues"
create_label "auth" "ff6b6b" "Authentication and authorization issues"
create_label "dependencies" "5319e7" "Missing or broken dependencies"
create_label "validation-error" "ffeaa7" "Component validation failures"

# Agent assignment labels
create_label "needs-developer" "0e8a16" "Requires developer agent"
create_label "needs-devops" "1f77b4" "Requires DevOps agent"
create_label "needs-pm" "ff7f0e" "Requires project manager oversight"

# Workflow labels
create_label "automated" "c5def5" "Automatically generated issue"
create_label "enhancement" "a2eeef" "New feature or enhancement"
create_label "bug" "d73a4a" "Bug report"
create_label "documentation" "0075ca" "Documentation related"

echo ""
echo "✅ GitHub labels setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify labels in repository: gh label list --repo $REPO"
echo "2. Run issue curator: ./scripts/run-issue-curator.sh"
echo "3. Check created issues have proper labels"