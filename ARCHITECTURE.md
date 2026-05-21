# ARCHITECTURE.md

## 1. Product Scope
- **Landing pública:** Marketing modern, auditoria web, contacte.
- **Admin privat:** Analytics, gestió de contingut, RRSS, formació gamificada (learning).

## 2. Bounded Contexts
- `marketing-site`: landing sections, CTA, contact, legal pages, web audit.
- `admin-console`: dashboard, analytics, social content, learning platform, user settings.
- `shared-platform`: i18n (ca/es/en/it), auth/session infra, UI primitives, error handling.
- `legacy-archive`: codi retirat sota `legacy/`, exclòs de TypeScript i ESLint.

## 3. Mandatory Layering
```
UI (src/app, src/components, src/features/*/ui)
  → Action (src/actions | src/features/*/actions)
    → Service (src/services)
      → Repository (src/repositories)
        → DB/Adapter (src/lib/supabase, src/adapters)
```

**Forbidden:**
- DB queries (`.from()`) in `.tsx` files
- Service logic in pages
- Repositories importing UI modules

## 4. Directory Ownership
| Directory | Responsibility |
|-----------|---------------|
| `src/app` | Routing, page composition, metadata |
| `src/components` | Reusable view components |
| `src/features` | Feature UI + feature actions |
| `src/actions` | Cross-feature server actions |
| `src/services` | Business orchestration and rules |
| `src/repositories` | Data access only (Supabase queries live here) |
| `src/adapters` | Third-party API boundaries |
| `src/lib` | Shared infra helpers (supabase, auth, utils, schemas) |
| `src/types` | Domain types and generated DB types |
| `src/config` | Server env, site config |
| `src/i18n` | Translations and i18n helpers |
| `src/hooks` | Custom React hooks |
| `legacy` | Archived code; active runtime MUST NOT import from it |

## 5. Active Data Scope
- `organizations` — ownership boundary
- `profiles` — extends `auth.users` with role and locale
- `posts`, `social_posts`, `social_connections` — admin content/RRSS
- `web_audits`, `analytics_events`, `analytics_visitors` — analytics
- `contact_leads`, `contactos_cualificados` — lead management
- `learning_*` — gamified learning platform (tracks, modules, lessons, steps, attempts, progress, streaks, xp_events)

## 6. Security Baseline
- Service role keys only on server runtime (`src/config/server-env.ts`)
- No sensitive env vars in client components
- Zod validation on all external inputs
- Auth checks before mutating actions; default deny
- RLS enabled on all public tables
- SQL views use `SECURITY INVOKER` (not `SECURITY DEFINER`)
- No hardcoded emails in RLS policies; use `private.is_admin()`

## 7. Testing and TDD Policy
- New logic: start with a failing test
- Bugfix: create regression test before the fix
- Refactor: preserve behavior via existing tests
- Minimum PR checks: `pnpm lint`, `pnpm test -- --run`, `pnpm check`
- CI: GitHub Actions runs lint + test + check on every push and PR

## 8. Quality Gates
- Max 150 lines per file (except generated typings, migrations, and i18n locale files)
- Every new/refactored non-trivial file includes a header comment:
  - `@file` relative path
  - `@updated` date (`YYYY-MM-DD`)
  - `@summary` file purpose
  - `@scope` responsibility boundary
- No `any` unless documented with rationale
- Server actions return `{ success, data?, error? }`

## 9. Refactor Strategy
- Incremental, feature by feature
- Keep app deployable after each PR
- Priority: direct DB access from UI → oversized files → naming inconsistencies

## 10. Design References
- **Landing page:** Follow `DESIGN.md` (Linear-style dark UI)
- **Learning platform (admin):** Follow `DUOLINGO.md` (Duolingo-style light gamified UI)