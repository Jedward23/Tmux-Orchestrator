#!/usr/bin/env python3
"""
Issue Relationship Tracker
Maps relationships between test failures and GitHub issues
"""

import json
import re
import subprocess
from collections import defaultdict
from datetime import datetime


class IssueRelationshipTracker:
    def __init__(self, state_file="issue_relationships.json"):
        self.state_file = state_file
        self.relationships = self.load_state()
        
    def load_state(self):
        """Load existing relationship data"""
        try:
            with open(self.state_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "issues": {},
                "test_to_issues": defaultdict(list),
                "error_patterns": defaultdict(list),
                "root_causes": {},
                "last_updated": None
            }
    
    def save_state(self):
        """Persist relationship data"""
        self.relationships["last_updated"] = datetime.now().isoformat()
        with open(self.state_file, 'w') as f:
            json.dump(self.relationships, f, indent=2, default=str)
    
    def analyze_issue_relationships(self):
        """Analyze all open test-failure issues for relationships"""
        print("🔍 Analyzing issue relationships...")
        
        # Get all test-failure issues
        cmd = 'gh issue list --label "test-failure" --state open --limit 200 --json number,title,body,labels'
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"Failed to fetch issues: {result.stderr}")
            return
        
        issues = json.loads(result.stdout)
        
        # Build relationship graph
        for issue in issues:
            self._analyze_single_issue(issue)
        
        # Identify patterns
        self._identify_error_patterns()
        self._identify_root_causes()
        
        # Save state
        self.save_state()
        
        return self.generate_relationship_report()
    
    def _analyze_single_issue(self, issue):
        """Extract relationship data from a single issue"""
        issue_num = issue['number']
        body = issue['body']
        
        # Extract test information
        test_match = re.search(r'Test Name[:\s]+`([^`]+)`', body)
        if test_match:
            test_name = test_match.group(1)
            self.relationships["test_to_issues"][test_name].append(issue_num)
        
        # Extract error type
        error_match = re.search(r'Error Details.*?```\n(.*?)```', body, re.DOTALL)
        if error_match:
            error_text = error_match.group(1)
            error_type = self._classify_error(error_text)
            self.relationships["error_patterns"][error_type].append(issue_num)
        
        # Extract related issues mentioned
        related_issues = re.findall(r'#(\d+)', body)
        if related_issues:
            if issue_num not in self.relationships["issues"]:
                self.relationships["issues"][issue_num] = {
                    "title": issue['title'],
                    "related": [],
                    "error_type": error_type if 'error_type' in locals() else "unknown",
                    "test": test_name if 'test_name' in locals() else "unknown"
                }
            self.relationships["issues"][issue_num]["related"].extend(related_issues)
    
    def _classify_error(self, error_text):
        """Classify error into categories"""
        error_patterns = {
            "assertion": r"assert.*?==|AssertionError",
            "timeout": r"timeout|timed out|TimeoutError",
            "connection": r"connection|refused|unreachable|NetworkError",
            "authentication": r"auth|token|permission|401|403",
            "null_reference": r"None|null|undefined|NullPointerException",
            "import": r"import|ImportError|ModuleNotFoundError",
            "type": r"TypeError|type.*?expected",
            "key": r"KeyError|key.*?not found",
            "index": r"IndexError|index.*?out of range",
            "database": r"database|sql|query|constraint"
        }
        
        for error_type, pattern in error_patterns.items():
            if re.search(pattern, error_text, re.IGNORECASE):
                return error_type
        
        return "other"
    
    def _identify_error_patterns(self):
        """Identify common error patterns across issues"""
        pattern_summary = {}
        
        for pattern, issues in self.relationships["error_patterns"].items():
            if len(issues) > 1:
                pattern_summary[pattern] = {
                    "count": len(issues),
                    "issues": issues,
                    "percentage": f"{len(issues) / len(self.relationships['issues']) * 100:.1f}%"
                }
        
        self.relationships["pattern_summary"] = pattern_summary
    
    def _identify_root_causes(self):
        """Identify potential root cause issues"""
        # Issues that are referenced by many others
        reference_count = defaultdict(int)
        
        for issue_num, issue_data in self.relationships["issues"].items():
            for related in issue_data.get("related", []):
                reference_count[related] += 1
        
        # Root causes are highly referenced issues
        root_causes = {
            issue: count 
            for issue, count in reference_count.items() 
            if count >= 2
        }
        
        self.relationships["root_causes"] = root_causes
    
    def generate_relationship_report(self):
        """Generate a human-readable relationship report"""
        report = ["# Issue Relationship Analysis Report\n"]
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}\n")
        
        # Summary statistics
        total_issues = len(self.relationships["issues"])
        report.append(f"## Summary")
        report.append(f"- Total test failure issues: {total_issues}")
        report.append(f"- Unique failing tests: {len(self.relationships['test_to_issues'])}")
        report.append(f"- Error pattern categories: {len(self.relationships['error_patterns'])}\n")
        
        # Error patterns
        if self.relationships.get("pattern_summary"):
            report.append("## Common Error Patterns")
            for pattern, data in sorted(
                self.relationships["pattern_summary"].items(), 
                key=lambda x: x[1]["count"], 
                reverse=True
            ):
                report.append(f"- **{pattern}**: {data['count']} issues ({data['percentage']})")
                report.append(f"  - Issues: {', '.join(f'#{i}' for i in data['issues'][:5])}")
        
        # Root causes
        if self.relationships.get("root_causes"):
            report.append("\n## Potential Root Cause Issues")
            for issue, ref_count in sorted(
                self.relationships["root_causes"].items(), 
                key=lambda x: x[1], 
                reverse=True
            ):
                report.append(f"- Issue #{issue}: Referenced by {ref_count} other issues")
        
        # Flaky tests (appearing in multiple issues)
        report.append("\n## Potentially Flaky Tests")
        for test, issues in self.relationships["test_to_issues"].items():
            if len(issues) > 1:
                report.append(f"- `{test}`: Failed in {len(issues)} issues")
                report.append(f"  - Issues: {', '.join(f'#{i}' for i in issues)}")
        
        # Recommendations
        report.append("\n## Recommendations")
        report.append("1. **Address Root Causes First**: Focus on issues referenced by multiple others")
        report.append("2. **Pattern-Based Fixes**: Group similar errors for batch resolution")
        report.append("3. **Flaky Test Investigation**: Tests failing repeatedly may need redesign")
        report.append("4. **Error Categories**: Prioritize by error pattern frequency")
        
        return "\n".join(report)
    
    def create_relationship_issue(self):
        """Create a GitHub issue with the relationship analysis"""
        report = self.generate_relationship_report()
        
        # Create issue
        cmd = [
            'gh', 'issue', 'create',
            '--title', '[Analysis] Test Failure Relationship Map',
            '--body', report,
            '--label', 'test-failure,analysis,automated'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Created analysis issue: {result.stdout.strip()}")
        else:
            print(f"❌ Failed to create issue: {result.stderr}")
    
    def update_issue_relationships(self, issue_number, related_issues):
        """Update an issue with discovered relationships"""
        # Get current issue body
        cmd = f'gh issue view {issue_number} --json body'
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            return
        
        current_body = json.loads(result.stdout)['body']
        
        # Update related issues section
        related_section = "\n### Related Issues\n"
        for issue in related_issues:
            related_section += f"- #{issue}\n"
        
        # Replace or append related section
        if "### Related Issues" in current_body:
            updated_body = re.sub(
                r'### Related Issues.*?(?=###|$)', 
                related_section, 
                current_body, 
                flags=re.DOTALL
            )
        else:
            updated_body = current_body + "\n" + related_section
        
        # Update issue
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(updated_body)
            temp_file = f.name
        
        cmd = f'gh issue edit {issue_number} --body-file {temp_file}'
        subprocess.run(cmd, shell=True)
        
        import os
        os.unlink(temp_file)


def main():
    """Run relationship analysis"""
    tracker = IssueRelationshipTracker()
    
    # Analyze relationships
    report = tracker.analyze_issue_relationships()
    print("\n" + report)
    
    # Optionally create analysis issue
    response = input("\nCreate GitHub issue with this analysis? (y/n): ")
    if response.lower() == 'y':
        tracker.create_relationship_issue()


if __name__ == "__main__":
    main()