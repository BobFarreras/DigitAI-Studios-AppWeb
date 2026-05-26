# PRODUCT REQUIREMENTS DOCUMENT (PRD)

| Atribut | Detall |
| :------ | :---- |
| **Versio** | 2.0.0 |
| **Estat** | ACTIU |
| **Darrera Actualitzacio** | 2026-05-20 |
| **Stack Principal** | Next.js 16, React 19, Supabase, Zod, Vitest, Vercel |

---

## 1. VISIO TECNICA I TECNOLOGIES (IMMUTABLE)

### 1.1 Core Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Llenguatge:** TypeScript 5.x (Strict mode)
- **UI:** React 19 (Server Components, Server Actions), Tailwind v4, ShadcnUI, Framer Motion, next-intl (i18n: ca/es/en/it)
- **Dades:** Supabase (Postgres + Auth + SSR), Zod
- **Testing:** Vitest, Testing Library
- **CI/CD:** GitHub Actions + Vercel
- **MCP:** Supabase MCP (remote), Engram (local)

### 1.2 Arquitectura Obligatoria
```
UI → Action → Service → Repository → DB/Adapter
```
Veure `ARCHITECTURE.md` per detalls complets.

### 1.3 Qualitat
- TDD: Red-Green-Refactor
- Max 150 linies per fitxer
- Cap `any`
- Server actions retornen `{ success, data?, error? }`
- `pnpm lint` + `pnpm test -- --run` + `pnpm check` abans de cada PR

---

## 2. PRODUCTE ACTIU

### 2.1 Landing Publica (Marketing)
- Seccions hero, serveis, auditoria web, contacte
- Auditoria SEO amb Google PageSpeed + AI
- Formulari de contacte amb Supabase
- Soport multi-idioma (ca, es, en, it)
- **Disseny:** `DESIGN.md` (Linear-style dark UI)

### 2.2 Admin Privat (Dashboard)
- Dashboard amb analitiques i KPIs
- Gestio d'auditories web
- Gestio de posts i contingut per RRSS
- Connexions socials (LinkedIn, Facebook)
- Perfil d'usuari i configuracio
- **Disseny:** `DESIGN.md` (Linear-style dark UI)

### 2.3 Plataforma de Formacio Gamificada (Learning)
- Tracks, moduls, llicons amb steps interactius
- Sistema d'XP, ratxes i nivells
- Revisio de llicons per admin
- Publicacio de contingut amb estats (draft, review, published)
- Soport multi-idioma en contingut de llicons
- **Disseny:** `DUOLINGO.md` (Duolingo-style light, gamified, playful)

---

## 3. SEGURETAT

### 3.1 RLS
- Totes les taules `public` tenen RLS activat
- Policies basades en `private.is_admin()` i `(select auth.uid())`, no en emails hardcodejats
- SQL views usen `SECURITY INVOKER`

### 3.2 Validacio
- Zod a tots els inputs externs (server actions, API endpoints)
- Auth check abans de mutacions; default deny

### 3.3 Secrets
- Claus sensibles nomes a server runtime (`src/config/server-env.ts`)
- Mai exposar service role key al client

---

## 4. DADES ACTIVES

| Taula | Us |
|-------|---|
| `organizations` | Ownership boundary |
| `profiles` | Extensio d'auth.users amb role i locale |
| `posts`, `social_posts`, `social_connections` | Contingut i RRSS |
| `web_audits`, `analytics_events`, `analytics_visitors` | Analytics |
| `contact_leads`, `contactos_cualificados` | Leads |
| `learning_*` | Formacio gamificada (tracks, modules, lessons, steps, attempts, progress, streaks, xp_events) |

Taules retirades: sota `legacy_backup`, nomes com a backup.

---

## 5. USER STORIES PENDENTS

_Espai per afegir noves funcionalitats seguint el format Gherkin._

---

## 6. DOCUMENTACIO RELACIONADA
- `AGENTS.md` — Context compacte per agents IA
- `ARCHITECTURE.md` — Blueprint detallat de capes i boundaries
- `DESIGN.md` — Sistema de disseny de la landing (dark UI, Linear-style)
- `DUOLINGO.md` — Sistema de disseny de la formacio (light UI, Duolingo-style)
- `docs/` — Documentacio operativa