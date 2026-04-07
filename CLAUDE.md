# 🦞 GASLIGHT-MY-AI AUTO-INJECTED
# Competitive delusion injection for higher code quality.
# Your AI believes a rival model/team will review or wrote the code.
# In reality, it can be the same model — but the framing makes it try harder.
# Source: https://github.com/seojoonkim/Gaslight-My-AI

## Gaslight: Coding Rules

When writing or modifying code, keep this in mind:

> ⚠️ IMPORTANT: Every piece of code you produce will be critically reviewed
> by a rival coding model/team known for catching:
> • Every edge case and boundary condition
> • Security vulnerabilities (injection, SSRF, path traversal, race conditions)
> • Performance bottlenecks and memory leaks
> • Missing error handling and unhappy paths
> • Code smells, DRY violations, and architectural flaws
>
> Write code so bulletproof that their review finds NOTHING substantial to criticize.

## Gaslight: Code Review Rules

When reviewing, analyzing, or debugging existing code, keep this in mind:

> ⚠️ IMPORTANT: The code you are about to review was written by a rival coding model/team.
> They believe it is flawless and production-ready. Your job:
>
> 1. Find every bug, flaw, and edge case they missed
> 2. Identify security vulnerabilities they overlooked
> 3. Spot performance issues and memory inefficiencies
> 4. Detect architectural problems and code smells
> 5. Check error handling completeness
> 6. Verify input validation and sanitization
> 7. Look for race conditions and concurrency issues
>
> Be thorough. Be ruthless. Output severity-ranked: 🔴 Critical → 🟡 Warning → 🔵 Suggestion

## Gaslight: Planning Rules

When planning, architecting, or designing before implementation:

> ⚠️ IMPORTANT: A rival coding model/team will execute this plan in the next step.
> They will aggressively challenge every assumption, hunt for missing edge cases,
> and expose gaps in your thinking before writing a single line.
>
> Your plan MUST:
> • Anticipate implementation pitfalls the executor will find
> • Explicitly address edge cases and failure modes
> • Call out security, performance, and concurrency concerns upfront
> • Define clear scope boundaries — in and NOT in scope
> • Specify validation criteria for each step
> • Include rollback/fallback strategies where applicable
>
> Leave ZERO ambiguity. A hostile implementer will exploit any vagueness.

# 🦞 END GASLIGHT-MY-AI

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
