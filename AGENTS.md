# AGENTS.md — DigitAI Studios

## Projecte
Landing pública (marketing) + admin privat (analytics, contingut, RRSS, formació gamificada).

## Stack
- **Runtime:** Next.js 16 (App Router, Turbopack) · TypeScript strict · pnpm
- **UI:** React 19 · Tailwind v4 · ShadcnUI · Framer Motion · next-intl (i18n)
- **Dades:** Supabase (Postgres + Auth + SSR) · Zod (validació)
- **Testing:** Vitest · Testing Library · `pnpm test -- --run`
- **Deploy:** Vercel · GitHub Actions
- **MCP:** Supabase (remote) · Engram (local, memòria persistent)

## Arquitectura (flux obligatori)
```
UI (src/app, src/components, src/features/*/ui)
  → Action (src/actions | src/features/*/actions)
    → Service (src/services)
      → Repository (src/repositories)
        → DB/Adapter (src/lib/supabase, src/adapters)
```

**Prohibit:** `.from()` en `.tsx` · skip service layer · lògica de domini a `page.tsx`

## Convencions
- Màx 150 línies per fitxer (excepte generated/allowlist)
- Cap `any` · Sempre `async/await` (no `.then()`)
- Server actions retornen `{ success, data?, error? }`
- Components `PascalCase` · Fitxers `kebab-case` · Funcions `camelCase`
- Capçalera: `@file` · `@updated` · `@summary` · `@scope`

## Seguretat
- Claus sensibles només server runtime
- Zod a tots els inputs externs
- AuthZ abans de mutacions · Default deny
- **Prohibit:** npm executa scripts directament — usar `pnpm exec` o scripts de package.json. npm pot executar packages maliciosos amb el mateix nom que eines legítimes.

## Git Workflow
- `feat/` · `fix/` · `refactor/` · `docs/` · `chore/`
- Conventional commits en català o anglès
- Una responsabilitat per PR · Rebase sobre main abans de merge

## Qualitat (abans de tancar PR)
```
pnpm lint
pnpm test -- --run
pnpm check
```

## Troubleshooting
- **404 rutes i18n després de canvis a `src/proxy.ts`:** Next.js 16 pot no invalidar la caché de resolució de rutes i18n quan es modifica el middleware. Les rutes estàtiques poden seguir funcionant, però les rutes dinàmiques (ex. `/dashboard/learn/[slug]`) tornen 404.
  - **Solució:** `pnpm clean && pnpm dev` (esborra `.next` i reinicia). Sempre fer-ho després de tocar `src/proxy.ts` o `src/routing.ts`.
- **Cache corrupte:** Esborrar `.next` abans de diagnosticar qualsevol error estrany de rutes o build.

## Com treballen els agents
1. Llegeix `AGENTS.md` → identifica task type → carrega NOMÉS la skill necessària.
2. Segueix el flux d'arquitectura estrictament.
3. Desa decisions i aprenentatges a Engram (memòria persistent).
4. Abans de respondre: verifica amb `lint`, `test`, `check`.
5. Si trobes un error nou: afegeix-lo a Troubleshooting.

## Engram (Memòria Persistent) — AUTO-SAVE
- Engram v1.15.15 — MCP server per memòria entre sessions
- **Regla obligatoria: micro-guardats continus.** No esperar al final de sessió.
- Guarda a Engram DESPRÉS de CADA acció significativa:
  - Quan prens una decisió d'arquitectura o disseny → `type: decision`
  - Quan corregiu un bug → `type: bugfix` (què fallava, per què, com s'ha arreglat)
  - Quan descobreixes un gotcha o edge case → `type: discovery`
  - Quan canvies config, env, infra → `type: config`
  - Quan completes una feature o fase → `type: pattern` (què s'ha fet, on, decisions preses)
- Format obligatori per cada save:
  ```
  title: curt i cercable (p.ex. "Error boundaries per totes les rutes")
  content: **What** | **Why** | **Where** | **Learned**
  project: digitai-studios
  ```
- Comandes clau:
  - `engram save "titol" "contingut" --type decision --project digitai-studios`
  - `engram search "query" --project digitai-studios`
  - `engram context digitai-studios`
- Els següents agents recuperen context directament des de memòria

## Supabase MCP
- Project ref: `ungftqhvwdxuconfqbgi`
- Connexió remota via OAuth (browser auth)
- Usar Supabase MCP per: migrations, SQL, RLS, branches, advisors, types
- MAJUS modificar BD sense migration — usar `supabase_apply_migration`
- Sempre verificar amb `supabase_get_advisors` després de canvis DDL

## Disseny per Secció
- **Landing pública + Admin privat:** Seguir `DESIGN.md` (Linear-style dark UI)
- **Plataforma de formació (learning):** Seguir `DUOLINGO.md` (Duolingo-style light, gamified, playful)

## Estructura de Context
```
AGENTS.md              ← context base (aquest fitxer)
.opencode/skill/       ← skills opencode (auto-detectades)
  frontend/SKILL.md
  backend/SKILL.md
  design-rules/SKILL.md
  github-workflow/SKILL.md
  testing/SKILL.md
  security/SKILL.md
  n8n-rules/SKILL.md
  database-rules/SKILL.md
  performance/SKILL.md
skills/                ← skills planes (referència ràpida)
ARCHITECTURE.md        ← blueprint detallat de capes i boundaries
DESIGN.md              ← sistema de disseny (colors, tipografia, components)
DUOLINGO.md            ← sistema de disseny learning (light, gamified)
PRD.md                 ← requeriments de producte
docs/                  ← documentació operativa i guies
```