# Training Platform Guide

Data d'actualització: 2026-05-16

## Objectiu
Crear una experiencia de formacio gamificada, mobile-first i escalable dins l'area d'usuari. La inspiracio visual es `DUOLINGO.md`, pero adaptada a DigitAI: aprenentatge tecnic en ciberseguretat, IA, sistemes informatics, programacio i automatitzacions.

## Auditoria Actual

### Dashboard usuari actiu
Ara mateix `/dashboard` esta pensat per auditories web:
- `src/app/[locale]/dashboard/page.tsx`: KPIs d'auditories, SEO mitja i llistat d'auditories recents.
- `src/app/[locale]/dashboard/audits/*`: llistat i detall d'auditories.
- `src/app/[locale]/dashboard/new-audit/page.tsx`: creacio d'auditoria.
- `src/actions/dashboard-home.ts`: carrega auditories per email.
- `src/actions/dashboard-audit-details.ts`: detall d'auditoria.
- `src/components/dashboard/AuditCard.tsx`: card d'auditoria.

### Analytics web actiu
L'analitica web d'admin continua activa:
- `src/app/[locale]/admin/analytics/page.tsx`
- `src/features/analytics/*`
- `src/repositories/supabase/SupabaseAnalyticsRepository.ts`
- `analytics_events`, `analytics_visitors`, `mv_analytics_top_pages`

Decisio recomanada:
- Retirar de l'area usuari les auditories web i passar-les a legacy quan comenci la formacio.
- Mantenir de moment l'analytics d'admin, perque mesura la landing i no interfereix amb formacio.

## Scope Producte

### Primer MVP
Una experiencia tipus Duolingo on l'usuari:
1. Entra al dashboard formatiu.
2. Veu el seu cami d'aprenentatge.
3. Obre una lliço curta.
4. Respon preguntes/interaccions.
5. Rep feedback immediat.
6. Guanya XP, ratxa i progres.
7. Desbloqueja el seguent node/modul.

### Fora del MVP
- Pagaments/subscripcions.
- Ranking global public.
- IA generant preguntes en temps real.
- Editor visual complet de cursos.
- Certificats oficials.

## Disseny UX

### Principis
- Mobile-first: el flux principal ha de funcionar perfecte en mobil.
- Una accio clara per pantalla.
- Feedback immediat: correcte, incorrecte, pista, resum.
- Sessions curtes: 3-7 minuts.
- Progressio visible: cami, XP, ratxa, corones/nivells.
- Estil amable pero professional: gamificat sense semblar infantil.

### Adaptacio Duolingo
Inspiracio de `DUOLINGO.md`:
- Botons tactils amb shadow inferior.
- Verd com accio positiva principal.
- Targetes arrodonides, espaiades i clares.
- Il·lustracions/personatges per fer el contingut menys dens.
- Microinteraccions i estats animats.

Adaptacio DigitAI:
- Paleta base pot mantenir verd per formacio, pero no ha de contaminar tota la landing.
- Les il·lustracions poden ser mascotes/avatars tecnics: terminal, robot, firewall, circuit, professor IA.
- El to ha de ser tecnic, clar i progressiu.

## Arquitectura Frontend

### Rutes proposades
- `/dashboard`: nou home formatiu.
- `/dashboard/learn`: mapa de moduls.
- `/dashboard/learn/[moduleSlug]`: unitats d'un modul.
- `/dashboard/learn/[moduleSlug]/[lessonSlug]`: runner de lliço.
- `/dashboard/profile`: progres, ratxa, estadistiques.

En una fase inicial, `/dashboard` pot renderitzar directament el mapa i resum.

### Legacy de dashboard actual
Quan es comenci implementacio:
- Moure a `legacy/user-audits-dashboard/`:
  - `src/app/[locale]/dashboard/audits/*`
  - `src/app/[locale]/dashboard/new-audit/page.tsx`
  - `src/components/dashboard/AuditCard.tsx`
  - `src/actions/dashboard-audit-details.ts`
- Reescriure `src/actions/dashboard-home.ts` per dades de formacio.
- Actualitzar navegacio dashboard: treure "Auditories" i posar "Aprendre".

No eliminar encara `web_audits` de DB si es vol mantenir audit flow intern/admin o historial.

## Model de Domini

### Entitats principals
- `learning_tracks`: grans camins formatius.
- `learning_modules`: blocs dins un track.
- `learning_units`: agrupacions curtes de lliçons.
- `learning_lessons`: lliçons executables.
- `learning_steps`: pantalles/interaccions dins una lliço.
- `learning_questions`: contingut preguntable.
- `learning_options`: opcions de resposta quan aplica.
- `learning_attempts`: intents de lliço.
- `learning_step_answers`: respostes concretes.
- `learning_progress`: progres agregat per usuari.
- `learning_xp_events`: historial d'XP.
- `learning_streaks`: ratxa diaria.
- `learning_achievements`: definicio de medalles.
- `learning_user_achievements`: medalles guanyades.

### Tipus d'interaccio inicials
- `multiple_choice`: una resposta correcta.
- `multi_select`: varies correctes.
- `true_false`: cert/fals.
- `order_steps`: ordenar passos.
- `match_pairs`: relacionar conceptes.
- `fill_blank`: omplir buit.
- `code_choice`: triar snippet correcte.
- `scenario`: pregunta contextual.

Fase posterior:
- `terminal_simulation`
- `network_diagram`
- `code_editor`
- `ai_prompt_review`
- `security_triage`

## Esquema Supabase Proposat

### Taules base
```sql
learning_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  color text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
)

learning_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references learning_tracks(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  level text not null check (level in ('initiation','basic','intermediate','advanced')),
  order_index int not null default 0,
  active boolean not null default true,
  unique(track_id, slug)
)

learning_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references learning_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  objective text,
  estimated_minutes int not null default 5,
  xp_reward int not null default 10,
  order_index int not null default 0,
  active boolean not null default true,
  unique(module_id, slug)
)

learning_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references learning_lessons(id) on delete cascade,
  type text not null,
  prompt text not null,
  explanation text,
  media jsonb,
  config jsonb not null default '{}',
  order_index int not null default 0
)
```

### Respostes i progres
```sql
learning_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references learning_lessons(id) on delete cascade,
  status text not null check (status in ('started','completed','abandoned')),
  score int not null default 0,
  correct_count int not null default 0,
  mistake_count int not null default 0,
  time_spent_seconds int not null default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
)

learning_step_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references learning_attempts(id) on delete cascade,
  step_id uuid references learning_steps(id) on delete cascade,
  answer jsonb not null,
  is_correct boolean not null,
  time_spent_seconds int not null default 0,
  created_at timestamptz default now()
)

learning_progress (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references learning_lessons(id) on delete cascade,
  best_score int not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  attempts_count int not null default 0,
  primary key (user_id, lesson_id)
)
```

### Gamificacio
```sql
learning_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  xp int not null,
  created_at timestamptz default now()
)

learning_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date
)
```

## Errors, Reforc i XP

Decisio de producte:
- No utilitzar vides amb espera obligatoria.
- No bloquejar l'usuari per temps.
- Evitar intents infinits sense reflexio.
- Penalitzar menys XP quan hi ha errors, pero donar sempre una via de recuperacio.

### Politica d'errors
- `0-2 errors`: feedback normal i pot continuar.
- `3-4 errors`: entra en mode reforc; abans de repetir ha de veure una pista, explicacio o pas mes facil.
- `5+ errors`: la lliço queda marcada com `needs_review`; pot seguir practicant, pero no completa el progres net fins fer una mini-revisio.

### XP decreixent
L'XP base d'una lliço baixa segons els errors:
- 0 errors: 100% XP.
- 1 error: 85% XP.
- 2 errors: 70% XP.
- 3 errors: 55% XP i reforc obligatori.
- 4 errors: 40% XP i reforc obligatori.
- 5+ errors: 25% XP maxim i `needs_review`.

Regla important:
- L'usuari no perd tot el valor de la sessio.
- Si vol XP complet, ha de repetir o superar la mini-revisio amb millor precisio.
- La millor puntuacio historica actualitza el progres, aixi repetir be una lliço repara l'intent fluix.

### Estat d'intent recomanat
```ts
type LearningAttemptStatus =
  | 'started'
  | 'completed'
  | 'needs_review'
  | 'abandoned';

type LearningStepStatus =
  | 'correct'
  | 'incorrect'
  | 'hint_required'
  | 'review_required';
```

### Dades a guardar
Afegir o tenir previst:
- `learning_attempts.requires_review boolean not null default false`
- `learning_attempts.xp_awarded int not null default 0`
- `learning_attempts.accuracy numeric`
- `learning_step_answers.hint_used boolean not null default false`
- `learning_progress.needs_review boolean not null default false`

Dashboard:
- Mostrar errors repetits per concepte.
- Mostrar lliçons en repàs com una accio positiva: "Reforça aquest punt".
- No presentar-ho com a castig, sino com a cami curt per consolidar.

## RLS i Seguretat

Regles:
- Contingut publicable (`tracks/modules/lessons/steps`) es pot llegir per usuaris autenticats.
- Mutacions de contingut nomes admin.
- `attempts`, `answers`, `progress`, `xp`, `streaks`: l'usuari nomes pot llegir el seu propi progres.
- Les correccions no s'han de confiar al client per contingut sensible.

Patro:
- UI -> server action -> service -> repository -> Supabase.
- No `.from(...)` en components `.tsx`.
- Validar answers amb Zod abans de persistir.

## Progressio i Dificultat

### Tracks inicials
1. Iniciacio Digital
2. Sistemes Informatics
3. Programacio
4. IA Aplicada
5. Automatitzacions
6. Ciberseguretat

### Nivells
- `initiation`: conceptes, vocabulari, seguretat basica.
- `basic`: exercicis guiats.
- `intermediate`: casos reals amb decisions.
- `advanced`: escenaris, debugging, triatge, simulacions.

### Desbloqueig
MVP:
- Una lliço desbloqueja la seguent si `score >= 70`.
- Un modul queda completat quan totes les lliçons estan completades.

Fase 2:
- Dificultat adaptativa segons errors repetits.
- Repas espaiat per preguntes fallades.
- Reforç automatic: "practica errors".

## Temari Inicial Recomanat

### Iniciacio Digital
- Que es un sistema operatiu.
- Fitxers, navegadors i comptes.
- Contrasenyes i 2FA.
- Bones practiques digitals.

### Sistemes Informatics
- Hardware basic.
- Xarxes: IP, DNS, router, ports.
- Windows/Linux basics.
- Terminal inicial.

### Programacio
- Variables i tipus.
- Condicionals.
- Funcions.
- JSON i APIs.
- Git basic.

### IA Aplicada
- Que es un LLM.
- Prompts clars.
- Limits i verificacio.
- Automatitzar tasques amb IA.

### Automatitzacions
- Triggers/actions.
- Webhooks.
- CRM/email/WhatsApp.
- Errors comuns i logs.

### Ciberseguretat
- Amenaces comunes.
- Phishing.
- Hashing vs encryption.
- HTTP/HTTPS.
- OWASP basic.
- Permisos i principi de minim privilegi.

## Dashboard Formatiu

### KPIs principals
- XP total.
- Ratxa actual.
- Lliçons completades.
- Temps dedicat setmanal.
- Precisio mitjana.
- Errors mes repetits.

### Blocs UI
- Card de "continua on ho vas deixar".
- Mapa de moduls.
- Objectiu diari.
- Errors per repassar.
- Progres per track.

## Pla Incremental

### Fase 1 - Guia i arquitectura
- Aprovar aquest document. Fet.
- Retirar dashboard audit d'usuari a `legacy/user-audits-dashboard/`. Fet.
- Crear primer dashboard formatiu MVP amb dades locals. Fet.
- Definir primer track i 10 lliçons MVP.

### Fase 2 - DB i seed inicial
- Crear migracions `learning_*`. Fet.
- Crear seed de tracks/modules/lessons/steps. Fet.
- Generar tipus Supabase. Fet.

### Fase 3 - Dashboard formatiu
- Reemplaçar `/dashboard`. Fet.
- Afegir components mobile-first. Fet.
- Mostrar progres fake o real segons DB inicial. Fet amb dades reals Supabase.

### Fase 3.5 - Disseny producte i mapa
- Separar `/dashboard` com a resum general. Fet.
- Separar `/dashboard/learn` com a experiencia app/mapa. Fet.
- Crear `/dashboard/learn/[moduleSlug]` per ruta formativa seleccionada. Fet.
- Afegir bloqueig progressiu entre rutes i lliçons. Fet.
- Adaptar mobile a top bar + bottom bar estil app. Fet.
- Afegir animacions de nodes i recompensa. Fet.

### Fase 4 - Lesson runner MVP
- Crear runner de lliço. Pendent; ruta placeholder creada.
- Implementar multiple choice, true/false i order steps.
- Persistir attempts i progress.

### Fase 5 - Gamificacio
- XP.
- Ratxa.
- Objectiu diari.
- Achievements simples.

### Fase 6 - Admin contingut
- Primer pot ser seed en codi/migracions.
- Despres admin intern per crear/modificar lliçons.

## Decisions Pendents

1. L'analitica web d'usuari es mou a legacy immediatament o conviu fins tenir el dashboard formatiu?
2. El contingut inicial es crea via seed SQL, MDX/JSON en repo, o admin?
3. Volem ranking entre usuaris o nomes progres personal al principi?
4. Idiomes del contingut: nomes catala inicial o multiidioma des del primer dia?
5. Les imatges/il·lustracions es generen com assets propis o primer fem UI sense mascotes?

## Recomanacio

Començar petit:
1. Crear schema `learning_*`.
2. Seed d'un track: "Iniciacio Digital".
3. Dashboard nou amb progres real.
4. Runner amb 3 tipus d'exercici.
5. Despres escalar a IA, ciberseguretat i programacio.
