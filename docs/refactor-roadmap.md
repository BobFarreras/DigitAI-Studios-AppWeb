# Refactor Roadmap

## Baseline (updated 2026-05-15)
- Legacy public blog, public projects, factory, project dashboard and QA/tests are archived under `legacy/`.
- Booking/ecommerce, project/QA and public reaction tables were removed from `public` with locked backups in `legacy_backup`.
- Current refactor work should focus only on active runtime code.

## Phase A - High Risk First
Objective: remove DB access from UI-heavy paths and centralize into actions/services/repositories.

1. `src/components/admin/socials/SocialPostCard.tsx`
- Move storage upload/delete and DB writes into server actions.
- Keep component presentation-only.

2. `src/features/blog/actions.ts`
- Normalize through service/repository contracts.

Done criteria:
- Each target removed from `architecture-db-allowlist.txt`.
- Tests added/updated per refactor.

## Phase B - Oversized File Split
Objective: reduce maintainability risk and enforce 150-line policy incrementally.

Priority candidates:
1. `src/repositories/supabase/SupabasePostRepository.ts`
2. `src/components/admin/socials/SocialPostCard.tsx`
3. `src/features/email/templates/AuditReadyEmail.tsx`
4. `src/actions/social-media.ts`

Split rules:
- One responsibility per file.
- Extract pure helpers first.
- Avoid behavioral changes without tests.

## Phase C - Naming and Consistency
- Rename typo-prone files/components (`AminMobileMenu`, `InfrastrocutreService`, `MobilePreviw`, etc.).
- Add compatibility re-exports when needed to avoid big-bang breaks.

## Phase D - Test Hardening (TDD)
- Add regression tests before each bugfix/refactor.
- Stabilize env-dependent tests (`MAIN_ORG_ID` path already identified).
- Keep `pnpm test -- --run` green at each phase.

## Quality Gate for Every Phase
1. `pnpm lint`
2. `pnpm test -- --run`
3. `pnpm check`

No phase closes without all 3 green.
