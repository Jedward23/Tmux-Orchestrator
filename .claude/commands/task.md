---
allowed-tools: [Read, Glob, Grep, TodoWrite, Task, mcp__sequential-thinking__sequentialthinking]
description: "Execute complex tasks with intelligent workflow management and cross-session persistence"
wave-enabled: true
complexity-threshold: 0.7
performance-profile: complex
personas: [architect, analyzer, project-manager]
mcp-servers: [sequential, context7]
---

# /sc:task - Enhanced Task Management

## Purpose
Execute complex tasks with intelligent workflow management, cross-session persistence, hierarchical task organization, and advanced orchestration capabilities.

## Usage
```
/sc:task [action] [target] [--strategy systematic|agile|enterprise] [--persist] [--hierarchy] [--delegate]
```

## Actions
- `create` - Create new project-level task hierarchy
- `execute` - Execute task with intelligent orchestration
- `status` - View task status across sessions
- `analytics` - Task performance and analytics dashboard
- `optimize` - Optimize task execution strategies
- `delegate` - Delegate tasks across multiple agents
- `validate` - Validate task completion with evidence

## Arguments
- `target` - Task description, project scope, or existing task ID
- `--strategy` - Execution strategy (systematic, agile, enterprise)
- `--persist` - Enable cross-session task persistence
- `--hierarchy` - Create hierarchical task breakdown
- `--delegate` - Enable multi-agent task delegation
- `--wave-mode` - Enable wave-based execution
- `--validate` - Enforce quality gates and validation
- `--mcp-routing` - Enable intelligent MCP server routing

## Execution Modes

### Systematic Strategy
1. **Discovery Phase**: Comprehensive project analysis and scope definition
2. **Planning Phase**: Hierarchical task breakdown with dependency mapping
3. **Execution Phase**: Sequential execution with validation gates
4. **Validation Phase**: Evidence collection and quality assurance
5. **Optimization Phase**: Performance analysis and improvement recommendations

### Agile Strategy
1. **Sprint Planning**: Priority-based task organization
2. **Iterative Execution**: Short cycles with continuous feedback
3. **Adaptive Planning**: Dynamic task adjustment based on outcomes
4. **Continuous Integration**: Real-time validation and testing
5. **Retrospective Analysis**: Learning and process improvement

### Enterprise Strategy
1. **Stakeholder Analysis**: Multi-domain impact assessment
2. **Resource Allocation**: Optimal resource distribution across tasks
3. **Risk Management**: Comprehensive risk assessment and mitigation
4. **Compliance Validation**: Regulatory and policy compliance checks
5. **Governance Reporting**: Detailed progress and compliance reporting

## Advanced Features

### Task Hierarchy Management
- **Epic Level**: Large-scale project objectives (weeks to months)
- **Story Level**: Feature-specific implementations (days to weeks)
- **Task Level**: Specific actionable items (hours to days)
- **Subtask Level**: Granular implementation steps (minutes to hours)

### Intelligent Task Orchestration
- **Dependency Resolution**: Automatic dependency detection and sequencing
- **Parallel Execution**: Independent task parallelization
- **Resource Optimization**: Intelligent resource allocation and scheduling
- **Context Sharing**: Cross-task context and knowledge sharing

### Cross-Session Persistence
- **Task State Management**: Persistent task states across sessions
- **Context Continuity**: Preserved context and progress tracking
- **Historical Analytics**: Task execution history and learning
- **Recovery Mechanisms**: Automatic recovery from interruptions

### Quality Gates and Validation
- **Evidence Collection**: Systematic evidence gathering during execution
- **Validation Criteria**: Customizable completion criteria
- **Quality Metrics**: Comprehensive quality assessment
- **Compliance Checks**: Automated compliance validation

## Integration Points

### Wave System Integration
- **Wave Coordination**: Multi-wave task execution strategies
- **Context Accumulation**: Progressive context building across waves
- **Performance Monitoring**: Real-time performance tracking and optimization
- **Error Recovery**: Graceful error handling and recovery mechanisms

### MCP Server Coordination
- **Context7**: Framework patterns and library documentation
- **Sequential**: Complex analysis and multi-step reasoning
- **Magic**: UI component generation and design systems
- **Playwright**: End-to-end testing and performance validation

### Persona Integration
- **Architect**: System design and architectural decisions
- **Analyzer**: Code analysis and quality assessment
- **Project Manager**: Resource allocation and progress tracking
- **Domain Experts**: Specialized expertise for specific task types

## Performance Optimization

### Execution Efficiency
- **Batch Operations**: Grouped execution for related tasks
- **Parallel Processing**: Independent task parallelization
- **Context Caching**: Reusable context and analysis results
- **Resource Pooling**: Shared resource utilization

### Intelligence Features
- **Predictive Planning**: AI-driven task estimation and planning
- **Adaptive Execution**: Dynamic strategy adjustment based on progress
- **Learning Systems**: Continuous improvement from execution patterns
- **Optimization Recommendations**: Data-driven improvement suggestions

## Usage Examples

### Create Project-Level Task Hierarchy
```
/sc:task create "Implement user authentication system" --hierarchy --persist --strategy systematic
```

### Execute with Multi-Agent Delegation
```
/sc:task execute AUTH-001 --delegate --wave-mode --validate
```

### Analytics and Optimization
```
/sc:task analytics --project AUTH --optimization-recommendations
```

### Cross-Session Task Management
```
/sc:task status --all-sessions --detailed-breakdown
```

## Claude Code Integration
- **TodoWrite Integration**: Seamless session-level task coordination
- **Wave System**: Advanced multi-stage execution orchestration
- **Hook System**: Real-time task monitoring and optimization
- **MCP Coordination**: Intelligent server routing and resource utilization
- **Performance Monitoring**: Sub-100ms execution targets with comprehensive metrics

## Success Criteria
- **Task Completion Rate**: >95% successful task completion
- **Performance Targets**: <100ms hook execution, <5s task creation
- **Quality Metrics**: >90% validation success rate
- **Cross-Session Continuity**: 100% task state preservation
- **Intelligence Effectiveness**: >80% accurate predictive planning