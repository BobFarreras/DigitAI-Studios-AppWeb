# Training Platform Status

Data d'actualitzacio: 2026-05-17

## Objectiu del Document
Aquest document deixa constancia de l'estat real de la plataforma de formacio DigitAI dins l'area d'usuari. Serveix com a referencia de continuacio per no dependre de la conversa i per evitar perdre decisions, fases, riscos o feina pendent.

## Principis Actius
- Producte final, no prototip temporal.
- Arquitectura obligatoria: UI -> Action -> Service -> Repository -> Supabase.
- Cap `.from(...)` en components `.tsx`.
- Validacio server-side amb Zod per inputs externs.
- Respostes correctes mai exposades al client.
- Disseny inspirat en `DUOLINGO.md`: verd principal, botons/nodes tactils, mobile-first, top bar, bottom bar i animacions.
- Fitxers nous/refactoritzats sota 150 linies.
- Tests d'integracio per fluxos reals, no nomes tests cosmeticos.

## Estat de Branques i Commits
Commits fets:
- `e69f0cb feat: add learning dashboard foundation`
- `78ccf0d feat: refine learning map experience`
- `787a4b4 feat: implement learning lesson runner`

Canvis pendents de commit:
- Fase 4.1 enduriment del runner:
  - Feedback immediat server-side per step.
  - Resposta seleccionada en blau abans de validar.
  - Correcte en verd i incorrecte en vermell.
  - `timeSpentSeconds` real per step.
  - Errors visibles de server action.
  - Proteccio contra doble check/submit.
  - Tests d'integracio de lliço completa, errors i persistencia incorrecta.

## Implementat

### Fase 1 - Guia i arquitectura
Estat: fet.

Inclou:
- `docs/training-platform-guide.md`.
- Retirada del dashboard d'auditories d'usuari cap a `legacy/user-audits-dashboard/`.
- `/dashboard` deixa de ser un panell d'auditories i passa a ser base formativa.
- Navegacio actualitzada: "Aprendre" substitueix auditories en l'area usuari.

### Fase 2 - DB i seed inicial
Estat: fet.

Migracions:
- `supabase/migrations/202605160826_create_learning_platform_mvp.sql`
- `supabase/migrations/202605160832_optimize_learning_policies_indexes.sql`
- `supabase/migrations/202605160900_seed_learning_product_tracks.sql`
- `supabase/migrations/202605160910_seed_learning_runner_interactions.sql`
- `supabase/migrations/202605160915_seed_first_lesson_interactions.sql`
- `supabase/migrations/202605161026_seed_missing_learning_lesson_steps.sql`

Taules actives:
- `learning_tracks`
- `learning_modules`
- `learning_lessons`
- `learning_steps`
- `learning_attempts`
- `learning_step_answers`
- `learning_progress`
- `learning_xp_events`
- `learning_streaks`

Rutes formatives seedades:
- Iniciacio Digital
- Sistemes Informatics
- Programacio
- IA Aplicada
- Automatitzacions
- Ciberseguretat

Control aplicat:
- RLS actiu.
- Indexos per FK crítiques.
- Politiques optimitzades amb `(select auth.uid())`.
- Contingut llegible per autenticats.
- Progres, attempts, answers, XP i streaks restringits per usuari.

### Fase 3 - Dashboard formatiu
Estat: fet.

Rutes:
- `/dashboard`: resum general.
- `/dashboard/learn`: mapa d'aprenentatge app-style.
- `/dashboard/learn/[moduleSlug]`: mapa d'una ruta concreta.
- `/dashboard/learn/[moduleSlug]/[lessonSlug]`: runner de llico.

Components principals:
- `src/features/learning/ui/LearningDashboard.tsx`
- `src/features/learning/ui/LearningHero.tsx`
- `src/features/learning/ui/LearningStatsGrid.tsx`
- `src/features/learning/ui/LearningTrackGrid.tsx`
- `src/features/learning/ui/LearningReviewCard.tsx`

### Fase 3.5 - Disseny producte i mapa
Estat: fet.

Implementat:
- Separacio real entre dashboard i mapa.
- Cards per tracks formatius.
- Bloqueig progressiu entre rutes.
- Bloqueig progressiu entre lliçons.
- Top bar app-style amb stats.
- Bottom bar mobile amb Resum, Aprendre, Repassar, Perfil i Logout.
- Nodes circulars estil Duolingo.
- Animacions amb `framer-motion`.
- Ruta bloquejada mostra pantalla de bloqueig.

Components:
- `src/features/learning/ui/LearningAppTopBar.tsx`
- `src/features/learning/ui/LearningMapHome.tsx`
- `src/features/learning/ui/LearningTrackMap.tsx`
- `src/features/learning/ui/LearningTrackPage.tsx`

### Fase 4 - Lesson Runner
Estat: fet.

Interaccions suportades:
- `multiple_choice`
- `true_false`
- `scenario`
- `order_steps`
- `match_pairs`

Flux:
1. La page crida action server.
2. L'action valida auth.
3. Service carrega llico.
4. Repository llegeix Supabase.
5. Service saneja `config` i elimina `correctAnswer`.
6. Client renderitza exercici.
7. Submit envia respostes.
8. Action valida payload amb Zod.
9. Service recalcula correccio al server.
10. Repository persisteix attempt, answers, progress i XP.

Fitxers:
- `src/actions/learning-lesson.ts`
- `src/services/learning/learning-lesson-service.ts`
- `src/repositories/supabase/SupabaseLearningRepository.ts`
- `src/repositories/supabase/learning-mappers.ts`
- `src/repositories/supabase/learning-persistence.ts`
- `src/features/learning/ui/LearningLessonRunner.tsx`
- `src/features/learning/ui/lesson-runner/StepInteraction.tsx`

Robustesa afegida:
- Si una llico arriba sense steps, el runner mostra "Llico en preparacio" i no peta.
- Seed afegit per garantir que cap llico existent quedi amb 0 steps.
- Primeres lliçons tenen dinamiques mixtes, no nomes test.

## Bugs Detectats i Correccions

### Hydration mismatch al body
Símptoma:
- Atributs injectats al `<body>` per extensions del navegador (`bis_register`, `__processed...`).

Correccio:
- `suppressHydrationWarning` tambe al `<body>`.

Fitxer:
- `src/app/[locale]/layout.tsx`

### Script renderitzat per ThemeProvider
Símptoma:
- React avisava que hi havia un `<script>` dins components.

Causa:
- `next-themes` injectava script dins l'arbre client.

Correccio:
- Theme provider propi sense scripts.
- Toggle adaptat al provider propi.

Fitxers:
- `src/components/theme-provider.tsx`
- `src/components/ui/theme-toggle.tsx`

### `asChild` filtrat al DOM
Símptoma:
- React avisava que no reconeixia prop `asChild` en `<button>`.

Causa:
- `Button` tenia prop `asChild` però no usava `Slot`.

Correccio:
- `Button` usa `@radix-ui/react-slot` quan `asChild=true`.

Fitxer:
- `src/components/ui/button.tsx`

### Llico sense steps
Símptoma:
- `Cannot read properties of undefined (reading 'id')` en `LearningLessonRunner`.

Causa:
- `fitxers-i-navegadors` tenia 0 steps.

Correccio:
- Guard UI per llico buida.
- Seed per omplir lliçons sense steps.
- Verificat a Supabase: `empty_lessons = 0`.

## Tests Actius

Suite actual validada:
- `pnpm lint`
- `pnpm check`
- `pnpm exec tsc --noEmit`
- `pnpm test -- --run`

Tests rellevants afegits:
- `tests/integration/button-as-child.test.tsx`
  - Verifica que `Button asChild` no filtra props invalides al DOM.
- `tests/integration/theme-provider.test.tsx`
  - Verifica que el provider no renderitza scripts i aplica tema.
- `tests/integration/learning-lesson-flow.test.tsx`
  - Verifica runner sanejat sense `correctAnswer`.
  - Verifica correccio de `multiple_choice`, `order_steps`, `match_pairs`.
  - Verifica persistencia mockejada d'attempt complet.
  - Verifica que una llico sense steps no trenca la UI.
- `src/services/learning/__tests__/learning-lesson-service.test.ts`
  - Verifica grading i `needs_review`.
- `src/services/learning/__tests__/learning-dashboard-service.test.ts`
  - Verifica mapping, desbloqueig progressiu i continuacio.

## Decisions Tècniques Importants
- `learning_steps.config.correctAnswer` existeix a DB, pero es treu abans d'arribar al client.
- Per ara el contingut es seed SQL. Admin editor queda per fase posterior.
- El progres complet es `score >= 70` i no `requiresReview`.
- Repetir una llico conserva el millor `best_score`.
- Un intent dolent posterior no hauria de descompletar una llico ja completada.
- No es fan "vides" bloquejants. Es prioritza reforç i XP decreixent.

## Fases Pendents

### Fase 4.1 - Enduriment del Runner
Estat: implementat, pendent de commit.

Inclou:
- Feedback immediat per step abans de passar al següent.
- Seleccio inicial en blau estil Duolingo, sense donar sensacio de correcte.
- Correcte en verd i incorrecte en vermell despres de validar.
- Explicacio de resposta quan el server retorna feedback.
- `timeSpentSeconds` real per step.
- Errors visibles si falla `checkLearningStepAnswer` o `submitLearningLesson`.
- Proteccio per evitar doble check/submit.
- Tests UI amb `userEvent` per resposta incorrecta, lliço completa i error d'action.
- Test de persistencia on respostes incorrectes queden `isCorrect=false` i `needs_review`.

### Fase 4.2 - Interaccions Avançades
Estat: parcialment implementat.

Tipus implementats:
- `multi_select`
- `fill_blank`
- `code_choice`
- `terminal_simulation`
- `network_diagram`
- `code_editor`
- `ai_prompt_review`
- `security_triage`

Inclou:
- Validacio server-side per cada tipus.
- UI propia per seleccio multiple, input de resposta i snippets de codi.
- UI propia per terminal, diagrama de xarxa, editor de codi, review de prompt IA i triatge de seguretat.
- Tests de servei per grading de tots els tipus avançats.
- Tests d'integracio UI amb `userEvent` per totes les interaccions avançades.
- Migracio local `supabase/migrations/202605171200_seed_advanced_learning_interactions.sql`.
- Migracio local `supabase/migrations/202605171230_seed_expert_learning_interactions.sql`.
- Seed aplicat remotament via Supabase REST per bloqueig de `supabase db push` amb historial remot divergent.
- Constraint i seed expert aplicats remotament amb `supabase db query --linked`.

Requisit:
- Cada tipus ha de tenir validacio server-side i test especific.

### Fase 5 - Gamificacio
Estat: fet.

Implementat:
- Ratxa diaria real actualitzada a `learning_streaks` quan es completa un intent.
- Objectiu diari d'XP derivat de `learning_xp_events` del dia.
- Achievements simples derivats de progres real: primera llico, 100 XP i ratxa de 3 dies.
- Cards de dashboard per objectiu diari i medalles.
- Historial XP visible derivat de `learning_xp_events`.
- Recompenses/cofres del mapa derivats del progres real de cada ruta.
- Panell de repas a `/dashboard/review` amb llicons `needs_review`.
- Top bar sense energia fake; mostra progres real de l'objectiu diari.
- Tests purs de ratxa, objectiu diari i achievements.
- Test de servei que verifica que el dashboard incorpora gamificacio des de metriques persistides.

### Fase 6 - Admin de Contingut
Estat: en curs.

Implementat:
- Ruta admin `/admin/learning` per inventari de contingut formatiu.
- Lectura de tracks, modules, lessons i steps via Action -> Service -> Repository -> Supabase.
- Preview read-only d'una llico amb steps.
- Navegacio admin desktop/mobile cap a Formacio.
- Test de servei per resum i preview.

Pendent:
- Admin per crear/editar tracks, modules, lessons i steps.
- Preview de llico abans de publicar.
- Validacio Zod per config de cada interaction type.
- Estat `draft/published`.
- Permisos admin estrictes.
- Tests d'actions admin.

### Fase 7 - Perfil i Repàs
Prioritat: mitjana.

Tasques:
- `/dashboard/profile` real.
- `/dashboard/review` o seccio de repàs.
- Errors repetits per concepte.
- Lliçons `needs_review`.
- Mini-revisions per recuperar XP/progres net.

### Fase 8 - I18n del Contingut
Prioritat: mitjana.

Opcions:
- Taules `learning_*_translations`.
- JSONB per camps traduibles.
- Contingut inicial en catala i traduccions posteriors.

Decision pendent:
- Si el contingut formatiu ha de ser multiidioma des del DB o gestionat per seeds separats.

### Fase 9 - Qualitat Visual i Assets
Prioritat: mitjana.

Tasques:
- Mascota/avatar tecnic propi.
- Il·lustracions per rutes.
- Revisio mobile real amb screenshots.
- Animacions de feedback correcte/incorrecte.
- So opcional desactivable.

### Fase 10 - Observabilitat i Product Analytics
Prioritat: mitjana.

Tasques:
- Events per start lesson, complete lesson, wrong answer, review required.
- Dashboard admin de progres agregat.
- No capturar respostes sensibles si hi ha exercicis de codi/seguretat.

## Riscos Oberts
- El contingut seed actual es suficient per provar producte, pero no per produccio educativa completa.
- Falta admin editor; escalar nomes amb SQL seeds generara friccio.
- Falta testing E2E real amb navegador contra Next dev server.
- Cal revisar UX mobile amb screenshots abans de tancar Fase 4 com producte polit.

## Proper Pas Recomanat
1. Commitar la Fase 4.1 quan el navegador confirmi el comportament.
2. Implementar Fase 4.2: `multi_select`, `fill_blank` i `code_choice`.
3. Despres Fase 5: gamificacio real amb streak i objectiu diari.
