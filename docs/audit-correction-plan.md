# Audit i Pla de Correcció — DigitAI Studios

Data: 2026-05-20

## Resum

| Àrea | Estat |
|------|-------|
| Lint | Passem |
| Tests | 69/69 passen |
| Check (`check:lines` + `check:architecture`) | **FALLA** — 3 fitxers >150 línies |
| RLS (taules `public`) | Activat (21/21) |
| `.from()` en `.tsx` | Cap (correcte) |
| `.from()` en `actions/` | **4 fitxers** (violació d'arquitectura) |

---

## Fase 1 — Arquitectura: `.from()` en accions

Els següents fitxers criden `.from()` de Supabase directament, sense passar per repositoris:

| Fitxer | Línies `.from()` |
|--------|------------------|
| `src/actions/audit.ts` | `from('profiles')` |
| `src/actions/dashboard-session.ts` | `from('profiles')` |
| `src/actions/social-oauth-callback.ts` | `from('profiles')`, `from('social_connections')` |
| `src/actions/user-settings.ts` | `from('profiles')` |

**Acció:** Extreure les queries a `src/repositories/` i inyectar-les via service/action.

---

## Fase 2 — Fitxers >150 línies

| Fitxer | Línies |
|--------|--------|
| `src/i18n/learning-translations.ts` | 171 |
| `src/repositories/supabase/SupabaseLearningRepository.ts` | 170 |
| `src/repositories/supabase/learning-mappers.ts` | 190 |

**Acció:** Dividir cada fitxer en mòduls més petits seguint el principi de responsabilitat única.

---

## Fase 3 — Seguretat BD: Policies i Views

### 3a. Policies amb email hardcodejat

`analytics_events` té 2 policies que comparen amb `digitaistudios.developer@gmail.com` en lloc de fer servir `private.is_admin()` o `(select auth.uid())`.

**Acció:** Migració SQL per substituir les policies hardcodejades per policies basades en role.

### 3b. SECURITY DEFINER Views

Les views `v_learning_lessons`, `v_learning_modules`, `v_learning_tracks`, `v_learning_steps` usen `SECURITY DEFINER`, que fa bypass de RLS. Si l'usuari que les va crear és admin, qualsevol query a aquestes views té permisos d'admin.

**Acció:** Recrear les views com a `SECURITY INVOKER` (o deixar-les amb SECURITY DEFINER només si és intencionat i documentat).

### 3c. Leaked Password Protection desactivat

A Supabase Auth, la protecció contra contrasenyes compromeses (HaveIBeenPwned) està deshabilitada.

**Acció:** Activar des del Dashboard de Supabase → Authentication → Policies → Leaked Password Protection. No cal migració.

---

## Fase 4 — Performance BD

### 4a. `auth.uid()` sense `(select ...)`

Les següents taules tenen policies que reavaluen `auth.uid()` o `auth.jwt()` per cada fila:
- `web_audits` (3 policies)
- `analytics_events` (2 policies)
- `profiles` (2 policies)
- `contact_leads` (1 policy)

**Acció:** Migració SQL per substituir `auth.uid()` per `(select auth.uid())` i `auth.jwt()` per `(select auth.jwt())`.

### 4b. Policies permissives duplicades

| Taula | Acció/Role | Policies duplicades |
|-------|-----------|---------------------|
| `analytics_events` | authenticated/SELECT | "Admin Select Only" + "Enable select for admins only" |
| `contact_leads` | authenticated/SELECT | "Enable read access" + "policy_select_leads_private" |
| `posts` | authenticated/SELECT | "Public read published" + "Users manage own org posts" |
| `profiles` | anon/SELECT | "Org members can view" + "Users can manage own profile" |
| `profiles` | authenticated/DELETE | "Admins can delete" + "Users can manage own profile" |
| `profiles` | authenticated/SELECT | "Org members can view" + "Users can manage own profile" |
| `web_audits` | authenticated/SELECT | "Owner Read Policy" + "Users can view their own audits" |

**Acció:** Consolidar policies permissives duplicades en una sola policy per rol/acció.

### 4c. Index duplicat

`posts` té `idx_posts_org` i `idx_posts_org_id` que són idèntics.

**Acció:** Migració per eliminar l'index duplicat.

### 4d. FK sense index cobertor

| Taula | FK | Columna |
|-------|----|---------|
| `profiles` | `profiles_organization_id_fkey` | `organization_id` |
| `social_connections` | `social_connections_user_id_fkey` | `user_id` |

**Acció:** Migració per crear índexos cobertors per les FK.

---

## Fase 5 — Auth: Leaked Password Protection

Activar des de Supabase Dashboard → Authentication → Policies. No cal codi ni migració.

---

## Ordre d'execució

1. **Fase 1** → Arquitectura (codi) — commit per fitxer refactoritzat
2. **Fase 2** → Fitxers llargs (codi) — commit per fitxer dividit
3. **Fase 3** → Seguretat BD (migració SQL) — un commit
4. **Fase 4** → Performance BD (migració SQL) — un commit
5. **Fase 5** → Auth dashboard (manual) — sense commit