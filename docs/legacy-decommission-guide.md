# Legacy Decommission Guide

Data d'actualització: 2026-05-15

## Objectiu
Reduir deute tecnic retirant funcionalitats que ja no formen part del producte actual, sense trencar la landing moderna ni l'admin intern.

Scope actual confirmat a `AGENTS.md`, `ARCHITECTURE.md` i `README.md`:
- Public: landing moderna.
- Private: admin intern per analitiques, usuaris, contingut/RRSS i operativa necessaria.
- Fora del scope public: landing antiga, blog public, projectes publics i audit flow public.

## Estat Detectat

### Actiu i alineat
- `src/app/[locale]/(marketing)/page.tsx` renderitza `LandingV2`.
- `src/components/landing/v2/*` es la landing actual.
- `src/components/landing/v2/ContactSectionV2.tsx` manté el formulari comercial actual.
- Analytics, missatges i auth encara formen part de l'admin.

### Legacy candidat
- Landing antiga: `src/components/landing/*.tsx`, `src/components/landing/services/*`, `src/components/landing/solutions/*`, excepte `src/components/landing/v2/*`.
- Blog public: `src/app/[locale]/(marketing)/blog/*`, `src/features/blog/ui/ReactionDock.tsx`, `content/posts/*`.
- Projectes public/admin factory: `src/app/[locale]/admin/projects/*`, `src/features/projects/*`, `src/services/factory/*`, `src/services/TenantService.ts`, `scripts/test-factory-integration.ts`.
- Dashboard project/test client si es decideix retirar QA lligat a projectes: `src/app/[locale]/dashboard/projects/*`, `src/app/[locale]/dashboard/tests/*`, `src/repositories/supabase/SupabaseTestRepository.ts`.

### No eliminar sense decisio explicita
- Admin blog pot ser legacy o pot ser eina interna de RRSS. Depen de si es mantindra la generacio/publicacio social basada en posts.
- `posts` i `social_posts` estan relacionats amb el flux RRSS actual.
- `organizations` encara es FK de `profiles`, `posts`, `web_audits`, `social_connections`, `projects`, `services`, `bookings`, etc.
- `projects` encara es FK de `project_members` i `test_campaigns`.

## Regla Important Sobre Carpeta `legacy`
El `tsconfig.json` actual inclou `**/*.ts` i `**/*.tsx`. Si es mou codi React a una carpeta `legacy/`, TypeScript el seguira compilant.

Abans de moure codi font a `legacy/`, fer una d'aquestes dues opcions:
- Preferida: afegir `"legacy"` i `"legacy/**/*"` a `tsconfig.exclude`.
- Alternativa: arxivar codi antic com a patch/documentacio dins `docs/archive/legacy-source/` sense mantenir-lo com a runtime TypeScript.

Estructura recomanada:
- `legacy/landing-v1/`
- `legacy/public-blog/`
- `legacy/public-projects/`
- `legacy/factory/`

No crear carpetes `legacy` disperses dins de cada modul. Una carpeta general a l'arrel fa mes facil auditar que no queda cap import actiu cap al codi retirat.

## Pla Incremental

### Fase 0 - Baseline i proteccio
1. Crear branca dedicada: `legacy/decommission-factory-public`.
2. Executar baseline:
   - `pnpm lint`
   - `pnpm test -- --run`
   - `pnpm check`
3. Exportar snapshot DB abans de DDL destructiu.
4. Crear manifest `docs/legacy-manifest.md` amb:
   - fitxers moguts,
   - rutes retirades,
   - taules candidates,
   - motiu de cada decisio.

Done:
- Baseline verd.
- Manifest inicial aprovat.

### Fase 1 - Tallar navegacio i rutes publiques legacy
Objectiu: que el producte public nomes exposi landing moderna i legal pages.

Accions:
1. Confirmar que navbar publica no enllaca a `/blog`, `/projectes` ni audit flow.
2. Retirar o redirigir:
   - `src/app/[locale]/(marketing)/blog/page.tsx`
   - `src/app/[locale]/(marketing)/blog/[slug]/page.tsx`
   - `src/app/[locale]/(marketing)/projectes/page.tsx`
3. Decidir estrategia SEO:
   - si no hi ha valor SEO: `notFound()`;
   - si hi ha backlinks: redirect 301 cap a landing o seccio relevant.
4. Treure imports de landing antiga no utilitzats.

Done:
- Build sense rutes publiques legacy.
- Sitemap/robots no publiquen URLs retirades.
- `pnpm lint`, `pnpm test -- --run`, `pnpm check`.

Estat 2026-05-15:
- `/blog`, `/blog/[slug]` i `/projectes` redirigeixen permanentment cap a la landing localitzada.
- L'admin no s'ha modificat.

### Fase 2 - Arxivar landing antiga
Objectiu: treure soroll del runtime sense perdre referencia historica.

Accions:
1. Crear `legacy/landing-v1/` nomes despres d'excloure `legacy/**/*` del `tsconfig`.
2. Moure landing antiga:
   - `src/components/landing/AuditSection.tsx`
   - `BenefitsSection.tsx`
   - `HeroSection.tsx`
   - `LatestPostsSection.tsx`
   - `ProductTeaser.tsx`
   - `ServicesGrid.tsx`
   - `SocialSection.tsx`
   - `TechStackSection.tsx`
   - `TestimonialsSection.tsx`
   - `services/*`
   - `solutions/*`
3. Mantenir actiu:
   - `src/components/landing/v2/*`
   - `src/components/landing/contact/*` nomes si encara el fa servir algun flux actual; si no, arxivar tambe.
4. Actualitzar allowlists:
   - `scripts/line-limit-allowlist.txt`
   - `scripts/architecture-db-allowlist.txt` si aplica.

Done:
- `src/components/landing` queda centrat en `v2`.
- Cap import trencat.
- Quality gates verds.

Estat 2026-05-15:
- `legacy/**/*` queda exclos de TypeScript i ESLint.
- Landing v1 moguda a `legacy/landing-v1/components/landing`.
- Components publics de projectes moguts a `legacy/public-projects`.
- `src/components/landing` queda nomes amb `v2`.

### Fase 3 - Desactivar Factory a l'admin
Objectiu: eliminar la capacitat de crear webs/client factory des del compte admin.

Accions:
1. Retirar enllacos admin:
   - `src/components/admin/AdminSidebar.tsx`
   - `src/components/admin/AminMobileMenu.tsx`
2. Retirar rutes o convertir-les en `notFound()` temporal:
   - `src/app/[locale]/admin/projects/page.tsx`
   - `src/app/[locale]/admin/projects/new/page.tsx`
   - `src/app/[locale]/admin/projects/[id]/page.tsx`
3. Arxivar codi factory:
   - `src/features/projects/*`
   - `src/services/factory/*`
   - `src/services/TenantService.ts`
   - `src/actions/admin/projects.ts`
   - `src/actions/admin/project-page.ts`
   - `src/actions/projects-seeding.ts`
   - `scripts/test-factory-integration.ts`
4. Retirar variables env no necessaries del factory si ja no s'usen:
   - GitHub token de generacio,
   - Vercel token,
   - configs de deploy automatic.

Done:
- No existeix cap CTA o ruta funcional per generar webs.
- No queden imports de `services/factory`.
- Quality gates verds.

Estat 2026-05-15:
- `/admin/projects/new` retorna `notFound()` despres del check admin.
- El llistat d'admin projectes ja no mostra CTA per generar webs.
- El detall d'admin projectes ja no exposa l'accio de destruccio factory.
- La logica factory s'ha mogut a `legacy/factory`:
  - creacio automatica de repos/deploy,
  - tenant/seeding DB,
  - formulari de nova web,
  - destruccio GitHub/Vercel/Supabase,
  - script d'integracio factory.

### Fase 4 - Separar QA/tests de Projectes
Objectiu: decidir si QA intern continua o si tambe es legacy.

Risc:
- `test_campaigns`, `test_tasks`, `test_results`, `test_assignments` depenen de `projects`.
- Dashboard client te rutes de projectes/tests.

Opcio A: retirar QA completament.
1. Arxivar:
   - `src/app/[locale]/admin/tests/*`
   - `src/app/[locale]/dashboard/projects/*`
   - `src/app/[locale]/dashboard/tests/*`
   - `src/features/tests/*`
   - `src/repositories/supabase/SupabaseTestRepository.ts`
   - `src/services/GamificationService.ts` si nomes depen de tests.
2. Treure navegacio de dashboard/admin.

Opcio B: mantenir QA pero sense factory.
1. Crear un model mes simple `qa_targets` o `internal_projects`.
2. Migrar `test_campaigns.project_id` cap al nou model.
3. Despres retirar `projects`.

Recomanacio:
- Si no s'utilitza QA, Opcio A. Es mes neta i redueix molt deute.

### Fase 5 - Retirar Blog Public i decidir RRSS
Objectiu: no barrejar blog public legacy amb admin RRSS si aquest encara aporta valor.

Opcio A: mantenir blog admin com a content/RRSS intern.
1. Retirar nomes rutes publiques `/blog`.
2. Mantenir:
   - `posts`
   - `social_posts`
   - `social_connections`
   - `src/actions/social-media.ts`
   - `src/components/admin/socials/*`
3. Renombrar domini de "blog" a "content" en una fase posterior.

Opcio B: retirar blog complet.
1. Arxivar `src/features/blog/*`.
2. Arxivar admin blog routes.
3. Retirar social generator si depen de posts.
4. Preparar DDL per eliminar `post_reactions`, `social_posts`, `posts`.

Recomanacio:
- Opcio A primer. El blog public pot marxar ara; RRSS/admin content pot ser un context intern separat.

### Fase 6 - Neteja de Base de Dades
Objectiu: eliminar taules nomes quan no hi ha codi actiu ni dades necessaries.

Estat de files observat:
- `organizations`: 1
- `services`: 1
- `bookings`: 1
- `analytics_events`: 1316
- la majoria de taules factory/projectes/ecommerce: 0

Nota:
- Les files de `organizations`, `services` i `bookings` inclouen dades de prova MCP creades el 2026-05-15. Es poden eliminar quan es faci neteja controlada.

Ordre segur de retirada si es retira factory/ecommerce/booking/QA:
1. Drop dependents sense fills principals:
   - `order_items`
   - `bookings`
   - `schedules`
   - `blocked_dates`
   - `products`
   - `services`
2. Drop QA/project relations:
   - `test_results`
   - `test_assignments`
   - `test_tasks`
   - `test_campaigns`
   - `project_members`
   - `projects`
3. Revisar abans de tocar `organizations`:
   - `profiles.organization_id`
   - `posts.organization_id`
   - `web_audits.organization_id`
   - `content_queue.organization_id`
   - `social_connections.organization_id`
4. No eliminar `organizations` fins que auth/profile i admin multi-tenant estiguin simplificats.

Recomanacio:
- Primer fer migrations que retirin FKs/codi dependent.
- Despres una migration separada per eliminar taules.
- No barrejar refactor de codi i `DROP TABLE` en el mateix PR.

### Fase 7 - Tipus, policies i docs
1. Regenerar `src/types/database.types.ts` despres de DDL.
2. Retirar policies RLS de taules eliminades.
3. Actualitzar:
   - `README.md`
   - `ARCHITECTURE.md`
   - `docs/INDEX.md`
   - `scripts/line-limit-allowlist.txt`
   - `scripts/architecture-db-allowlist.txt`
4. Reexecutar Security Advisor.

## PRs Recomanades

1. `docs: add legacy decommission plan`
2. `refactor(public): remove legacy public routes`
3. `refactor(landing): archive landing v1`
4. `refactor(factory): disable admin project factory`
5. `refactor(qa): remove or decouple project-based QA`
6. `db: drop unused booking/ecommerce/factory tables`
7. `docs: update architecture after decommission`

## Criteris de No Regressio
Cada PR ha de passar:
- `pnpm lint`
- `pnpm test -- --run`
- `pnpm check`

Per canvis DB:
- `get_advisors('security')` sense nous warnings.
- Snapshot abans de `DROP TABLE`.
- Migration separada i revisable.
