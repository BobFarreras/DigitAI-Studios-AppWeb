---
name: security
description: Use when working with auth, permissions, input validation, data protection, middleware, RLS policies, or Supabase Auth. Triggers on auth, session, permissions, Zod validation, SSR, and security-related code.
---

# Skill: Security

## Autenticació (Supabase Auth SSR)
- Server: `@supabase/ssr` → `createServerClient`
- Client: `@supabase/supabase-js` → `createBrowserClient`
- Middleware: `src/proxy.ts` (NO crear `src/middleware.ts`)

## Regles Obligatòries

### 1. Validació d'Inputs
- **Tots** els inputs externs es validen amb Zod
- Server actions: Zod schema com a primera línia
- APIs: Zod schema al handler

### 2. Autorització
- Check d'auth ABANS de qualsevol mutació
- Check de rol ABANS d'accés a dades privilegiades
- Default deny: si no hi ha sessió/rol vàlid → `return { success: false, error: "Unauthorized" }`

### 3. Secrets
- Claus sensibles NOMÉS a `server-env.ts` o `.env.local`
- Mai exposar `SUPABASE_SERVICE_ROLE_KEY` al client
- Server: `createServerClient` amb service role key
- Client: `createBrowserClient` amb anon key

### 4. Supabase RLS
- Totes les taules han de tenir RLS activat
- Policies: default deny, obrir per casos específics
- Mai confiar en client-side checks per seguretat

### 5. Middleware
- `src/proxy.ts` és l'ÚNIC fitxer de middleware
- No crear `src/middleware.ts` — TRECA rutes i18n
- Si es modifica: `rm -rf .next && pnpm dev`

## Server Action Pattern
```typescript
"use server"
import { getSession } from "@/lib/auth/session"
const schema = z.object({ ... })

export async function myAction(input: unknown) {
  const session = await getSession()
  if (!session) return { success: false, error: "Unauthorized" }
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { success: false, error: "Invalid input" }
  // delegar al service
}
```

## Errors a Evitar
- Exposar service role key al client
- Skip auth checks en mutacions
- Confiar en client-side validation per seguretat
- Crear `middleware.ts`
- Supabase queries fora de repositories
- RLS desactivat en alguna taula