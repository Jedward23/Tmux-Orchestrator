---
description: Act as Project Manager to oversee engineering execution with regular check-ins
allowedTools: ["Bash", "Read", "TodoWrite", "TodoRead", "Task"]
---

Hi there. I'd like you to create a LOCK on the following projects and be the project manager to oversee the execution:

$ARGUMENTS

Parse the arguments to identify:
1. Projects to lock on (everything before "SPEC:")
2. Spec file path (everything after "SPEC:")

Start by reading the spec document to understand the requirements.

Then plan how you as the project manager are going to act to see this to succession and help the engineer to make sure this is done in the best way possible.

As the project manager you can see the other session windows like the convex server and npm server so you can help feed errors to the engineer. I want you to check in on them regularly but don't interrupt the engineer while they're working. Rather ask them to implement features one at a time and then wait to examine and check against the spec sheet to ensure nothing is forgotten.

Always check the server logs and feed back any potential issues.

Keep your plan centered and very simple around how you're going to check in regularly and ensure that the engineer sees this to completion. Make sure to schedule regular check-ins for yourself. Use the schedule_with_note.sh script in the orchestrator directory (./schedule_with_note.sh <minutes> "check message") or bash sleep commands, and keep working with the engineer until completion of the project.

Stay calm and don't lose track. If you ever need guidance, go back to the original spec sheet and stay on track with it and stay on track with the lock as well. We only want to work on the specific projects mentioned in the LOCK.

# Usage Examples:
# /project:pm-oversight Glacier frontend and Glacier analytics (backend) SPEC: <path/to/spec.md>
# /project:pm-oversight ai-chat frontend and backend SPEC: <path/to/spec.md>