# Skill: Database Rules

## Quan carregar
Qualsevol task que impliqui Supabase, PostgreSQL, migrations, schemas, RLS, o queries.

## Stack de Dades
- **Supabase** — Postgres + Auth + Storage + Realtime
- Client: `@supabase/supabase-js` + `@supabase/ssr`
- Migrations: `supabase/migrations/`
- Types: `src/types/database.types.ts`

## Arquitectura d'Accés a Dades

### Flux Obligatori
```
UI → Action → Service → Repository → Supabase Client
```

### Repositories (`src/repositories/`)
- Interfícies a `src/repositories/interfaces/`
- Implementacions Supabase a `src/repositories/supabase/`
- Retornen **domain types** (mai Supabase rows directament)
- Una interfície per repository

### Migrations (`supabase/migrations/`)
- Una migració per canvi lògic
- Nom del fitxer: `YYYYMMDD_descripcio.sql`
- Incloure RLS policies
- Incloure rollback quan sigui possible

## Regles de Supabase

### RLS (Row Level Security)
- **SIEMPRE** activat en totes les taules
- Default deny → obrir per casos específics
- Policies basades en `auth.uid()` i roles
- Testar policies amb `SUPABASE_SERVICE_ROLE_KEY` vs `anon key`

### Queries
- Usar Supabase Client tipat (mai raw SQL des de la app)
- Select només els camps necessaris (no `select('*')`)
- Paginació amb `.range()` per resultats grans
- Usar `.eq()`, `.in()`. Mai concatenar valors

### Tipus
- Generar types amb `supabase gen types`
- Mantingut a `src/types/database.types.ts`
- Repositories mapejen Supabase types → domain types

## Taules Actives
- `organizations` — ownership boundary
- `profiles` — extensió d'`auth.users`
- `posts`, `social_posts`, `social_connections` — RRSS
- `web_audits`, `analytics_events`, `analytics_visitors` — analytics
- `contact_leads` — leads del landing
- Taules de `learning_*` — formació gamificada

## Errors a Evitar
- ❌ Queries Supabase fora de repositories
- ❌ `select('*')` — seleccionar només camps necessaris
- ❌ RLS desactivat
- ❌ Concatenar valors en queries
- ❌ Exposar service role key al client
- ❌ Migració sense RLS policies

## Checklist
1. Accés a DB passa per repository?
2. RLS activat en la taula afectada?
3. Query selecciona només camps necessaris?
4. Migració inclou RLS policies?
5. Types estan generats i actualitzats?