#!/bin/bash

# Security Monitoring and Audit Script
# Issue #15: Security Measures Implementation
# Usage: ./scripts/security-monitor.sh [--setup|--daily|--weekly|--monthly|--status]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
SECURITY_LOG="${LOG_DIR}/security-monitor.log"
AUDIT_LOG="${LOG_DIR}/security-audit.log"
METRICS_FILE="${LOG_DIR}/security-metrics.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure logs directory exists
mkdir -p "$LOG_DIR"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$SECURITY_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> "$SECURITY_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$SECURITY_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$SECURITY_LOG"
}

log_audit() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$AUDIT_LOG"
}

# Metrics functions
update_metrics() {
    local metric_type="$1"
    local metric_value="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Create or update metrics file
    if [[ ! -f "$METRICS_FILE" ]]; then
        echo '{"metrics": []}' > "$METRICS_FILE"
    fi
    
    # Add metric entry
    local temp_file=$(mktemp)
    jq ".metrics += [{\"timestamp\": \"$timestamp\", \"type\": \"$metric_type\", \"value\": $metric_value}]" "$METRICS_FILE" > "$temp_file"
    mv "$temp_file" "$METRICS_FILE"
}

get_metrics_summary() {
    if [[ ! -f "$METRICS_FILE" ]]; then
        echo "No metrics available"
        return
    fi
    
    local total_scans=$(jq '.metrics | map(select(.type == "security_scan")) | length' "$METRICS_FILE")
    local failed_scans=$(jq '.metrics | map(select(.type == "security_scan" and .value != 0)) | length' "$METRICS_FILE")
    local last_scan=$(jq -r '.metrics | map(select(.type == "security_scan")) | sort_by(.timestamp) | last | .timestamp // "Never"' "$METRICS_FILE")
    
    echo "Security Metrics Summary:"
    echo "  Total security scans: $total_scans"
    echo "  Failed scans: $failed_scans"
    echo "  Last scan: $last_scan"
    echo "  Success rate: $(( (total_scans - failed_scans) * 100 / (total_scans == 0 ? 1 : total_scans) ))%"
}

# Security monitoring functions
setup_monitoring() {
    log_info "Setting up security monitoring..."
    
    # Create git hooks if they don't exist
    local git_hooks_dir="${PROJECT_ROOT}/.git/hooks"
    if [[ -d "$git_hooks_dir" ]]; then
        # Pre-commit hook
        cat > "${git_hooks_dir}/pre-commit" << 'EOF'
#!/bin/bash
exec ./scripts/security-scan.sh --pre-commit
EOF
        chmod +x "${git_hooks_dir}/pre-commit"
        log_success "Pre-commit hook installed"
        
        # Pre-push hook
        cat > "${git_hooks_dir}/pre-push" << 'EOF'
#!/bin/bash
echo "Running security scan before push..."
exec ./scripts/security-scan.sh --quick
EOF
        chmod +x "${git_hooks_dir}/pre-push"
        log_success "Pre-push hook installed"
    else
        log_warning "Not a git repository, skipping git hooks setup"
    fi
    
    # Create cron job for daily monitoring
    local cron_job="0 9 * * * cd ${PROJECT_ROOT} && ./scripts/security-monitor.sh --daily >> ${LOG_DIR}/cron-security.log 2>&1"
    
    log_info "To enable daily monitoring, add this cron job:"
    echo "$cron_job"
    
    # Create monitoring configuration
    cat > "${PROJECT_ROOT}/config/security-monitor.conf" << EOF
# Security Monitoring Configuration
DAILY_SCAN_HOUR=9
WEEKLY_SCAN_DAY=1
MONTHLY_SCAN_DATE=1
RETENTION_DAYS=90
ALERT_EMAIL=""
SLACK_WEBHOOK=""
ENABLE_NOTIFICATIONS=false
EOF
    
    log_success "Security monitoring setup complete"
    log_audit "Security monitoring setup completed"
}

daily_monitoring() {
    log_info "Running daily security monitoring..."
    log_audit "Daily security monitoring started"
    
    # Run quick security scan
    if "${SCRIPT_DIR}/security-scan.sh" --quick; then
        log_success "Daily security scan passed"
        update_metrics "security_scan" 0
    else
        log_error "Daily security scan failed"
        update_metrics "security_scan" 1
        alert_security_team "Daily security scan failed"
    fi
    
    # Check for new sensitive files
    local new_files
    new_files=$(find "$PROJECT_ROOT" -type f \( -name "*.key" -o -name "*.pem" -o -name "*.p12" -o -name "*.pfx" -o -name "secrets*" -o -name "credentials*" -o -name ".env*" \) -mtime -1 2>/dev/null || true)
    
    if [[ -n "$new_files" ]]; then
        log_warning "New potentially sensitive files detected:"
        echo "$new_files"
        log_audit "New sensitive files detected: $new_files"
        update_metrics "sensitive_files" 1
    else
        update_metrics "sensitive_files" 0
    fi
    
    # Check git history for recent commits
    if git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
        local recent_commits
        recent_commits=$(git -C "$PROJECT_ROOT" log --oneline --since="24 hours ago" | wc -l)
        
        if [[ $recent_commits -gt 0 ]]; then
            log_info "Found $recent_commits recent commits"
            update_metrics "recent_commits" "$recent_commits"
            
            # Check recent commits for security issues
            local suspicious_commits
            suspicious_commits=$(git -C "$PROJECT_ROOT" log --oneline --since="24 hours ago" -S "password" -S "secret" -S "key" -S "token" | wc -l)
            
            if [[ $suspicious_commits -gt 0 ]]; then
                log_warning "Found $suspicious_commits commits with potentially sensitive changes"
                update_metrics "suspicious_commits" "$suspicious_commits"
                alert_security_team "Suspicious commits detected in last 24 hours"
            fi
        fi
    fi
    
    log_audit "Daily security monitoring completed"
}

weekly_monitoring() {
    log_info "Running weekly security monitoring..."
    log_audit "Weekly security monitoring started"
    
    # Run full security scan
    if "${SCRIPT_DIR}/security-scan.sh" --full-scan; then
        log_success "Weekly security scan passed"
        update_metrics "weekly_scan" 0
    else
        log_error "Weekly security scan failed"
        update_metrics "weekly_scan" 1
        alert_security_team "Weekly security scan failed"
    fi
    
    # Check for changes in .gitignore
    if git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
        local gitignore_changes
        gitignore_changes=$(git -C "$PROJECT_ROOT" log --oneline --since="7 days ago" -- .gitignore | wc -l)
        
        if [[ $gitignore_changes -gt 0 ]]; then
            log_info "Found $gitignore_changes changes to .gitignore this week"
            update_metrics "gitignore_changes" "$gitignore_changes"
        fi
    fi
    
    # Generate weekly report
    generate_weekly_report
    
    log_audit "Weekly security monitoring completed"
}

monthly_monitoring() {
    log_info "Running monthly security monitoring..."
    log_audit "Monthly security monitoring started"
    
    # Comprehensive security audit
    comprehensive_audit
    
    # Clean up old logs
    cleanup_old_logs
    
    # Generate monthly report
    generate_monthly_report
    
    log_audit "Monthly security monitoring completed"
}

comprehensive_audit() {
    log_info "Running comprehensive security audit..."
    
    # Check all files for potential security issues
    local total_files
    total_files=$(find "$PROJECT_ROOT" -type f | wc -l)
    log_info "Auditing $total_files files"
    
    # Check for executable files that shouldn't be
    local suspicious_executables
    suspicious_executables=$(find "$PROJECT_ROOT" -type f -perm +111 ! -path "*/scripts/*" ! -name "*.sh" ! -name "*.py" ! -path "*/.git/*" | wc -l)
    
    if [[ $suspicious_executables -gt 0 ]]; then
        log_warning "Found $suspicious_executables potentially suspicious executable files"
        update_metrics "suspicious_executables" "$suspicious_executables"
    fi
    
    # Check for world-writable files
    local writable_files
    writable_files=$(find "$PROJECT_ROOT" -type f -perm -o+w ! -path "*/.git/*" | wc -l)
    
    if [[ $writable_files -gt 0 ]]; then
        log_warning "Found $writable_files world-writable files"
        update_metrics "writable_files" "$writable_files"
    fi
    
    # Check for large files that might contain secrets
    local large_files
    large_files=$(find "$PROJECT_ROOT" -type f -size +10M ! -path "*/.git/*" | wc -l)
    
    if [[ $large_files -gt 0 ]]; then
        log_info "Found $large_files large files (>10MB) - review for potential secrets"
        update_metrics "large_files" "$large_files"
    fi
    
    update_metrics "comprehensive_audit" 1
}

cleanup_old_logs() {
    log_info "Cleaning up old security logs..."
    
    # Remove logs older than 90 days
    find "$LOG_DIR" -name "security-*.log" -type f -mtime +90 -delete 2>/dev/null || true
    find "$LOG_DIR" -name "audit-*.log" -type f -mtime +90 -delete 2>/dev/null || true
    
    # Truncate metrics file to last 1000 entries
    if [[ -f "$METRICS_FILE" ]]; then
        local temp_file=$(mktemp)
        jq '.metrics | sort_by(.timestamp) | .[-1000:]' "$METRICS_FILE" > "$temp_file"
        jq '.metrics = . ' "$temp_file" > "$METRICS_FILE"
        rm "$temp_file"
    fi
    
    log_success "Old logs cleaned up"
}

generate_weekly_report() {
    local report_file="${LOG_DIR}/weekly-security-report-$(date +%Y-%m-%d).txt"
    
    {
        echo "Weekly Security Report - $(date)"
        echo "======================================"
        echo ""
        get_metrics_summary
        echo ""
        echo "Recent Security Events:"
        tail -n 50 "$SECURITY_LOG" | grep -E "(ERROR|WARNING)" || echo "No security issues found"
        echo ""
        echo "Audit Trail:"
        tail -n 20 "$AUDIT_LOG"
    } > "$report_file"
    
    log_success "Weekly report generated: $report_file"
}

generate_monthly_report() {
    local report_file="${LOG_DIR}/monthly-security-report-$(date +%Y-%m).txt"
    
    {
        echo "Monthly Security Report - $(date)"
        echo "======================================="
        echo ""
        get_metrics_summary
        echo ""
        echo "Security Trends:"
        if [[ -f "$METRICS_FILE" ]]; then
            echo "  Total security events: $(jq '.metrics | length' "$METRICS_FILE")"
            echo "  Failed scans this month: $(jq '.metrics | map(select(.type == "security_scan" and .value != 0 and (.timestamp | strptime("%Y-%m-%d %H:%M:%S") | mktime) > (now - 2592000))) | length' "$METRICS_FILE")"
        fi
        echo ""
        echo "Recommendations:"
        echo "  - Review and update security policies"
        echo "  - Validate team security training"
        echo "  - Update security tools and dependencies"
        echo "  - Review access controls and permissions"
    } > "$report_file"
    
    log_success "Monthly report generated: $report_file"
}

alert_security_team() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    log_error "SECURITY ALERT: $message"
    log_audit "SECURITY ALERT: $message"
    
    # Here you would integrate with your alerting system
    # Examples:
    # - Send email notification
    # - Post to Slack
    # - Create GitHub issue
    # - Send SMS alert
    
    echo "[$timestamp] SECURITY ALERT: $message" >> "${LOG_DIR}/security-alerts.log"
}

show_status() {
    log_info "Security monitoring status:"
    echo ""
    
    # Check if monitoring is set up
    if [[ -f "${PROJECT_ROOT}/.git/hooks/pre-commit" ]]; then
        log_success "Pre-commit hook: Installed"
    else
        log_warning "Pre-commit hook: Not installed"
    fi
    
    if [[ -f "${PROJECT_ROOT}/.git/hooks/pre-push" ]]; then
        log_success "Pre-push hook: Installed"
    else
        log_warning "Pre-push hook: Not installed"
    fi
    
    # Show recent activity
    echo ""
    echo "Recent Security Activity:"
    if [[ -f "$SECURITY_LOG" ]]; then
        tail -n 10 "$SECURITY_LOG"
    else
        echo "No security log found"
    fi
    
    echo ""
    get_metrics_summary
}

# Main function
main() {
    local action="${1:-status}"
    
    case "$action" in
        --setup)
            setup_monitoring
            ;;
        --daily)
            daily_monitoring
            ;;
        --weekly)
            weekly_monitoring
            ;;
        --monthly)
            monthly_monitoring
            ;;
        --status)
            show_status
            ;;
        *)
            echo "Usage: $0 [--setup|--daily|--weekly|--monthly|--status]"
            echo ""
            echo "Options:"
            echo "  --setup    Set up security monitoring (git hooks, cron jobs)"
            echo "  --daily    Run daily security monitoring"
            echo "  --weekly   Run weekly security monitoring"
            echo "  --monthly  Run monthly security monitoring"
            echo "  --status   Show current security monitoring status"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"