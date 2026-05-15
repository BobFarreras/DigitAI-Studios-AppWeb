# ARCHITECTURE.md

## 1. Product Scope (Current)
- Public app: Modern marketing landing only.
- Private app: Internal admin workspace for analytics, users, messages, content and RRSS.
- Retired: public blog, public projects, factory, booking/ecommerce, project dashboard and QA/tests.

## 2. Bounded Contexts
- `marketing-site`: landing sections, CTA, contact, legal pages.
- `admin-console`: private tools, social content, internal workflows.
- `shared-platform`: i18n, auth/session infra, UI primitives, telemetry, error handling.
- `legacy-archive`: non-runtime reference code under `legacy/`, excluded from TypeScript and ESLint.

## 3. Mandatory Layering
All business flows must follow this path:
1. UI (`src/app`, `src/components`, `src/features/*/ui`)
2. Action (`src/actions` or `src/features/*/actions`)
3. Service (`src/services`)
4. Repository (`src/repositories`)
5. Supabase/External adapter (`src/lib/supabase`, `src/adapters`)

Forbidden:
- DB queries in `.tsx` files.
- Service logic in pages.
- Repositories importing UI modules.

## 4. Directory Ownership
- `src/app`: routing, page composition, metadata.
- `src/components`: reusable view components only.
- `src/features`: feature UI + feature actions.
- `src/actions`: cross-feature server actions.
- `src/services`: business orchestration and rules.
- `src/repositories`: data access only.
- `src/adapters`: third-party API boundaries.
- `src/lib`: shared infra helpers.
- `legacy`: archived code only; active runtime must not import from it.

## 5. Active Data Scope
- Keep `organizations` while it remains the ownership boundary for profiles, posts, audits, content queue and social connections.
- Keep `posts`, `social_posts` and `social_connections` for admin content/RRSS.
- Keep `web_audits`, `analytics_events`, `analytics_visitors` and `contact_leads` for active product operations.
- Retired tables live only as locked backups in `legacy_backup`.

## 6. Security Baseline
- Service role keys only on server runtime.
- No sensitive env vars in client components.
- Validate all action input with Zod.
- Authorization checks before mutating actions.
- Fail closed: default deny when user/role is missing.

## 7. Testing and TDD Policy
- New logic starts with a failing unit/integration test.
- Refactors must preserve behavior via tests.
- Minimum PR checks: `pnpm lint`, `pnpm test -- --run`, architecture guards.

## 8. Quality Gates
- Max 150 lines per file (except generated typings, migrations, and explicit allowlist).
- Every new/refactored non-trivial file includes a short header comment:
  - `@file` relative path
  - `@updated` date (`YYYY-MM-DD`)
  - `@summary` file purpose
  - `@scope` responsibility boundary
- No `any` unless documented with rationale.

## 9. Refactor Strategy
- Incremental, feature by feature.
- Keep app deployable after each PR.
- Prioritize high-risk modules: direct DB access from UI and oversized files.
