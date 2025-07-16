#!/bin/bash

# Security Scanning Script for SuperClaude + Tmux Orchestrator
# Issue #15: Security Measures Implementation
# Usage: ./scripts/security-scan.sh [--pre-commit|--full-scan|--quick]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SCAN_REPORT="${PROJECT_ROOT}/logs/security-scan-$(date +%Y%m%d-%H%M%S).log"
EXIT_CODE=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure logs directory exists
mkdir -p "${PROJECT_ROOT}/logs"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$SCAN_REPORT"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$SCAN_REPORT"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$SCAN_REPORT"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$SCAN_REPORT"
    EXIT_CODE=1
}

# Security scan functions
scan_credentials() {
    log_info "Scanning for credentials and secrets..."
    
    # Check for API keys, tokens, secrets
    if grep -r -i -n --include="*.py" --include="*.sh" --include="*.js" --include="*.json" --include="*.yaml" --include="*.yml" --include="*.md" \
        -E "(api_key|secret_key|private_key|access_token|jwt_secret|db_password|database_url|mongo_uri|aws_secret|gcp_key|azure_key|auth_token|bearer_token)\s*=\s*[\"']?[^\"'\s]+" \
        "${PROJECT_ROOT}" 2>/dev/null || true; then
        log_error "Potential credentials found in files"
        return 1
    fi
    
    # Check for common secret patterns
    if grep -r -i -n --include="*.py" --include="*.sh" --include="*.js" --include="*.json" --include="*.yaml" --include="*.yml" \
        -E "(sk-[a-zA-Z0-9-_]{40,}|ghp_[a-zA-Z0-9]{36}|[a-zA-Z0-9]{32}|[a-zA-Z0-9]{40}|[a-zA-Z0-9]{64})" \
        "${PROJECT_ROOT}" 2>/dev/null || true; then
        log_error "Potential secret tokens found in files"
        return 1
    fi
    
    # Check for private keys
    if grep -r -n --include="*.py" --include="*.sh" --include="*.js" --include="*.json" --include="*.yaml" --include="*.yml" --include="*.md" \
        -E "(BEGIN.*(PRIVATE|RSA|CERTIFICATE)|-----BEGIN)" \
        "${PROJECT_ROOT}" 2>/dev/null || true; then
        log_error "Potential private keys found in files"
        return 1
    fi
    
    log_success "No credentials found in tracked files"
    return 0
}

scan_gitignore() {
    log_info "Validating .gitignore coverage..."
    
    local gitignore_file="${PROJECT_ROOT}/.gitignore"
    
    if [[ ! -f "$gitignore_file" ]]; then
        log_error ".gitignore file not found"
        return 1
    fi
    
    # Check for required patterns
    local required_patterns=(
        "*.key"
        "*.pem"
        "*.p12"
        "*.pfx"
        "*.crt"
        "*.cer"
        "*.der"
        "secrets.json"
        "credentials.json"
        ".env"
        ".env.*"
        ".claude.json"
        "token.json"
        "auth.json"
        "private_key*"
        "secret_key*"
        ".secrets/"
        ".credentials/"
        "id_rsa*"
        "id_ed25519*"
        "*.gpg"
        "*.asc"
        ".aws/"
        ".gcp/"
        ".azure/"
    )
    
    local missing_patterns=()
    
    for pattern in "${required_patterns[@]}"; do
        if ! grep -q "^${pattern}$" "$gitignore_file" 2>/dev/null; then
            missing_patterns+=("$pattern")
        fi
    done
    
    if [[ ${#missing_patterns[@]} -gt 0 ]]; then
        log_warning "Missing .gitignore patterns: ${missing_patterns[*]}"
        log_info "Consider adding these patterns to .gitignore"
    else
        log_success ".gitignore has comprehensive security coverage"
    fi
    
    return 0
}

scan_file_permissions() {
    log_info "Checking file permissions..."
    
    # Check for overly permissive files
    local sensitive_files=(
        ".env*"
        "*.key"
        "*.pem"
        "*.p12"
        "*.pfx"
        "secrets*"
        "credentials*"
        ".claude.json*"
        "token*"
        "auth*"
        "private_key*"
        "secret_key*"
        "id_rsa*"
        "id_ed25519*"
    )
    
    local found_files=()
    
    for pattern in "${sensitive_files[@]}"; do
        while IFS= read -r -d '' file; do
            if [[ -f "$file" ]]; then
                local perms=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%A" "$file" 2>/dev/null || echo "unknown")
                if [[ "$perms" != "600" ]] && [[ "$perms" != "400" ]]; then
                    found_files+=("$file (permissions: $perms)")
                fi
            fi
        done < <(find "${PROJECT_ROOT}" -name "$pattern" -type f -print0 2>/dev/null || true)
    done
    
    if [[ ${#found_files[@]} -gt 0 ]]; then
        log_warning "Files with potentially insecure permissions found:"
        for file in "${found_files[@]}"; do
            log_warning "  $file"
        done
        log_info "Consider setting permissions to 600 or 400 for sensitive files"
    else
        log_success "No sensitive files with insecure permissions found"
    fi
    
    return 0
}

scan_git_history() {
    log_info "Scanning git history for secrets (last 10 commits)..."
    
    if ! git -C "${PROJECT_ROOT}" rev-parse --git-dir >/dev/null 2>&1; then
        log_info "Not a git repository, skipping git history scan"
        return 0
    fi
    
    # Check recent commits for potential secrets
    local secret_patterns=(
        "api_key"
        "secret_key"
        "private_key"
        "access_token"
        "jwt_secret"
        "password"
        "auth_token"
        "bearer"
        "sk-"
        "ghp_"
        "-----BEGIN"
    )
    
    local found_secrets=()
    
    for pattern in "${secret_patterns[@]}"; do
        if git -C "${PROJECT_ROOT}" log --oneline -10 -S "$pattern" 2>/dev/null | grep -q .; then
            found_secrets+=("$pattern")
        fi
    done
    
    if [[ ${#found_secrets[@]} -gt 0 ]]; then
        log_warning "Potential secrets found in recent git history: ${found_secrets[*]}"
        log_info "Consider using git-filter-repo or BFG to clean history if needed"
    else
        log_success "No obvious secrets found in recent git history"
    fi
    
    return 0
}

scan_environment_variables() {
    log_info "Checking for hardcoded environment variables..."
    
    # Look for hardcoded environment variable assignments
    if grep -r -n --include="*.py" --include="*.sh" --include="*.js" \
        -E "(export|set)?\s*(API_KEY|SECRET_KEY|PRIVATE_KEY|ACCESS_TOKEN|JWT_SECRET|DB_PASSWORD|DATABASE_URL|MONGO_URI|AWS_SECRET|GCP_KEY|AZURE_KEY)\s*=\s*[\"']?[^\"'\s\$]+" \
        "${PROJECT_ROOT}" 2>/dev/null || true; then
        log_error "Hardcoded environment variables found"
        return 1
    fi
    
    log_success "No hardcoded environment variables found"
    return 0
}

# Pre-commit specific checks
pre_commit_scan() {
    log_info "Running pre-commit security scan..."
    
    # Check staged files only
    if git -C "${PROJECT_ROOT}" rev-parse --git-dir >/dev/null 2>&1; then
        local staged_files
        staged_files=$(git -C "${PROJECT_ROOT}" diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")
        
        if [[ -n "$staged_files" ]]; then
            log_info "Scanning staged files: $staged_files"
            
            # Check each staged file
            while IFS= read -r file; do
                if [[ -f "${PROJECT_ROOT}/$file" ]]; then
                    # Check for credentials in staged file
                    if grep -i -n \
                        -E "(api_key|secret_key|private_key|access_token|jwt_secret|db_password|database_url|mongo_uri|aws_secret|gcp_key|azure_key|auth_token|bearer_token)\s*=\s*[\"']?[^\"'\s]+" \
                        "${PROJECT_ROOT}/$file" 2>/dev/null; then
                        log_error "Potential credentials found in staged file: $file"
                        EXIT_CODE=1
                    fi
                    
                    # Check for secret patterns in staged file
                    if grep -i -n \
                        -E "(sk-[a-zA-Z0-9-_]{40,}|ghp_[a-zA-Z0-9]{36}|[a-zA-Z0-9]{32}|[a-zA-Z0-9]{40}|[a-zA-Z0-9]{64})" \
                        "${PROJECT_ROOT}/$file" 2>/dev/null; then
                        log_error "Potential secret tokens found in staged file: $file"
                        EXIT_CODE=1
                    fi
                fi
            done <<< "$staged_files"
        else
            log_info "No staged files to scan"
        fi
    else
        log_info "Not a git repository, scanning all files"
        scan_credentials
        scan_environment_variables
    fi
    
    return $EXIT_CODE
}

# Full security scan
full_scan() {
    log_info "Running full security scan..."
    
    scan_gitignore
    scan_credentials
    scan_environment_variables
    scan_file_permissions
    scan_git_history
    
    return $EXIT_CODE
}

# Quick scan
quick_scan() {
    log_info "Running quick security scan..."
    
    scan_credentials
    scan_environment_variables
    
    return $EXIT_CODE
}

# Main function
main() {
    local scan_type="${1:-quick}"
    
    log_info "Starting security scan (type: $scan_type)"
    log_info "Report location: $SCAN_REPORT"
    
    case "$scan_type" in
        --pre-commit)
            pre_commit_scan
            ;;
        --full-scan|--full)
            full_scan
            ;;
        --quick)
            quick_scan
            ;;
        *)
            log_info "Usage: $0 [--pre-commit|--full-scan|--quick]"
            quick_scan
            ;;
    esac
    
    if [[ $EXIT_CODE -eq 0 ]]; then
        log_success "Security scan completed successfully"
    else
        log_error "Security scan found issues - review the report above"
    fi
    
    log_info "Scan report saved to: $SCAN_REPORT"
    exit $EXIT_CODE
}

# Run main function
main "$@"