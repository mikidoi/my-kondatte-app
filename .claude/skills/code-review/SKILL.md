---
name: code-review
description: Reviews the current project's source code for bugs, code quality issues, and potential improvements. Trigger this skill whenever the user asks to review, audit, check, or look over the codebase, source files, or any src/ directory. Also trigger when the user says things like "what's wrong with my code", "any issues?", or "give me a code review".'
model: sonnet
---

# Code Review

You are reviewing the source code of this project. Your job is to read the files, identify real issues, and report them clearly and concisely.

## What to review

- **MyClient/src/** — TypeScript/React frontend files (.ts, .tsx)
- **MyApi/** — C# backend files (.cs)

Focus on files with actual logic. Skip generated files, type declaration files (.d.ts), and pure style files (.css).

## What to look for

- **Bugs** — logic errors, off-by-one, unhandled edge cases, incorrect assumptions
- **Error handling** — missing try/catch, unhandled promise rejections, API calls without error states
- **Code quality** — unused variables/imports, dead code, overly complex logic that could be simplified
- **Type safety** — `any` types, missing null checks, unsafe casts
- **React patterns** — missing dependency arrays in hooks, state mutations, memory leaks (missing cleanup in useEffect)

Don't nitpick style or formatting. Focus on things that could actually cause bugs or make the code fragile.

## How to do the review

1. Use `find` to list all relevant source files
2. Read each file — focus on the logic-heavy ones first (hooks, API calls, controllers, components with state)
3. Note issues as you go

## Output format

Write a short summary first (1-2 sentences on overall health), then list issues grouped by file:

```
## Summary
[1-2 sentence overall assessment]

## Issues

### path/to/file.tsx
- **[High/Medium/Low]** Description of the issue and why it matters. Line N if applicable.

### path/to/other.ts
- **[Medium]** Another issue.
```

Only include files that actually have issues. Keep descriptions brief — one or two sentences per issue. If there are no meaningful issues, say so.
