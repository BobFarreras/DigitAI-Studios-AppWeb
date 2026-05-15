# Refactor Roadmap

## Baseline (2026-05-07)
- Architecture boundary exceptions: 33 files (`scripts/architecture-db-allowlist.txt`).
- File-size exceptions (>150 lines): 50 files (`scripts/line-limit-allowlist.txt`).

## Phase A - High Risk First
Objective: remove DB access from UI-heavy paths and centralize into actions/services/repositories.

1. `src/components/admin/socials/SocialPostCard.tsx`
- Move storage upload/delete and DB writes into server actions.
- Keep component presentation-only.

2. `src/app/[locale]/dashboard/projects/page.tsx`
- Move Supabase membership/project queries into repository + service.

3. `src/app/[locale]/admin/projects/[id]/page.tsx`
- Extract data loading to service layer.

4. `src/features/blog/actions.ts`
- Normalize through service/repository contracts.

Done criteria:
- Each target removed from `architecture-db-allowlist.txt`.
- Tests added/updated per refactor.

## Phase B - Oversized File Split
Objective: reduce maintainability risk and enforce 150-line policy incrementally.

Priority candidates:
1. `src/repositories/supabase/SupabaseTestRepository.ts` (422)
2. `src/repositories/supabase/SupabasePostRepository.ts` (265)
3. `src/components/admin/socials/SocialPostCard.tsx` (287)
4. `src/features/email/templates/AuditReadyEmail.tsx` (244)
5. `src/components/landing/solutions/mockups/MockupFinance.tsx` (232)

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
