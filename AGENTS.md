# Agent Guidance for Premise

## Project Overview
Premise is a SaaS technical scoping tool. Helps teams break down ambiguous AI/ML projects into concrete, estimable components with realistic effort and risk analysis. Built separately from Roadshow Creative studio site.

## Tech Stack
- **Framework**: Next.js App Router
- **Database**: Neon (PostgreSQL) + Prisma ORM
- **Auth**: Clerk (independent org)
- **Styling**: Tailwind v4, shadcn/ui
- **Email**: Loops (transactional)
- **Deployment**: Vercel
- **Testing**: Vitest
- **AI Integration**: LMStudio (local) or Anthropic API

## Build & Run
```bash
npm run dev      # Start dev server (port 3003)
npm run build    # Production build
npm run test     # Run tests with Vitest
```

## Database
- Neon PostgreSQL database (independent, not shared with any other product)
- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/` (named descriptively)
- Use Skill: **database-migrations** for schema changes
- Core models: Scope, Component, Risk, Estimate

## Clerk Integration
- Independent Clerk organization (separate auth system)
- User authentication and team management
- Use Skill: **clerk-setup** for auth configuration

## Core Skill
- **premise-scoping-workflow** — The core Premise product
- Implements 6-phase scoping methodology: clarify → decompose → identify risks → present → iterate → finalize
- Supports stakeholder feedback loops

## Key Directories
- `src/app/(public)/` — Marketing pages, onboarding
- `src/app/(app)/` — Authenticated scoping interface
- `src/components/scope-*` — Scope editor components (Requirements, Components, Risks, etc.)
- `src/lib/scoping/` — Core scoping logic, estimation engine
- `src/actions/` — Server actions for scope management

## Code Conventions
- Server actions for all mutations (no API routes)
- Scoping state managed via server state + React forms
- Strict TypeScript mode
- Component estimation logic in `src/lib/scoping/estimator.ts`
- Buffer multiplier calculations: 1.0x (low) → 1.25x (medium) → 1.5x (high)

## Important Notes
- Never commit `.env.local` (use Vercel env vars for production)
- Premise is independent product (separate Vercel project from Roadshow)
- User data privacy: Scope documents may contain sensitive project details
- Estimation accuracy improves with feedback iterations (1st: ±50%, after 2nd: ±25%, after 3rd: ±10%)

## Product Core
The Premise workflow implements 6 sequential phases:
1. **Clarify Requirements** — Convert vague → specific (10-15 min)
2. **Decompose** — Break into 5-15 estimable components (20-30 min)
3. **Identify Risks** — Surface unknowns, add buffer time (10-15 min)
4. **Present Scope** — Clear document for stakeholder (5-10 min)
5. **Iterate** — Refine based on feedback (variable)
6. **Finalize** — Lock scope, begin execution (5 min)

## Related Skills
- **premise-scoping-workflow** — Core product implementation
- **database-migrations** — Schema changes
- **clerk-setup** — Auth configuration

## Team Patterns
- Feature branches off `main`, PR required before merge
- Squash commits on merge
- Scope documents version-controlled (audit trail)
- Estimation templates + rubrics in shared docs
