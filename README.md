# DigitAI Studios

Modern landing + private admin workspace built with Next.js 16, TypeScript, Supabase and `next-intl`.

## Current Direction
- Public focus: high-impact landing experience.
- Private focus: internal admin tools (content, RRSS, operational workflows).
- De-emphasized from public nav: blog, projects, audit flows.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript strict mode
- Supabase (Auth + Postgres)
- Tailwind + shadcn/ui
- Vitest + Testing Library
- Zod validation

## Project Commands
- `pnpm dev`: run local app
- `pnpm build`: production build check
- `pnpm lint`: eslint checks
- `pnpm test -- --run`: headless tests
- `pnpm check:lines`: file length guard (<=150)
- `pnpm check:architecture`: DB access boundary guard
- `pnpm check`: full quality gate

## Quality Gate Policy
Every meaningful change should pass:
1. `pnpm lint`
2. `pnpm test -- --run`
3. `pnpm check`

## Architecture Docs
- Global rules: `AGENTS.md`
- Target architecture: `ARCHITECTURE.md`
- Documentation index: `docs/INDEX.md`
- Module indexes: `src/*/README.md`

## Structure
- `src/app`: routes and page composition
- `src/components`: reusable UI
- `src/features`: feature modules
- `src/actions`: shared server actions
- `src/services`: business logic
- `src/repositories`: data access layer
- `src/adapters`: external integrations
