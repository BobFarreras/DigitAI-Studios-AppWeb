# Skill: Security

## Quan carregar
Qualsevol task que impliqui auth, permisos, validació d'inputs, protecció de dades, o canvis en middleware.

## Autenticació (Supabase Auth SSR)
- Server: `@supabase/ssr` → `createServerClient`
- Client: `@supabase/supabase-js` → `createBrowserClient`
- Middleware: `src/proxy.ts` (NO crear `src/middleware.ts`)

## Regles Obligatòries

### 1. Validació d'Inputs
- **Tots** els inputs externs es validen amb Zod
- Server actions: Zod schema com a primera línia de la funció
- APIs: Zod schema al handler

### 2. Autorització
- Check d'auth ABANS de qualsevol mutació
- Check de rol ABANS d'accés a dades privilegiades
- Default deny: si no hi ha sessió/rol vàlid → `return { success: false, error: \"Unauthorized\" }`

### 3. Secrets
- Claus sensibles NOMÉS a `server-env.ts` o `.env.local`
- Mai exposar `SUPABASE_SERVICE_ROLE_KEY` al client
- Server components: usar `createServerClient` amb service role key
- Client components: usar `createBrowserClient` amb anon key

### 4. Supabase RLS
- Totes les taules han de tenir RLS activat
- Policies: default deny, després obrir per casos específics
- Mai confiar en client-side checks per seguretat

### 5. Middleware
- `src/proxy.ts` és l'ÚNIC fitxer de middleware
- No crear `src/middleware.ts` — TRECA rutes i18n
- Si es modifica proxy.ts: `rm -rf .next && pnpm dev`

## Patrons

### Server Action amb Auth
```typescript
\"use server\"
import { getSession } from \"@/lib/auth/session\"
const schema = z.object({ ... })

export async function myAction(input: unknown) {
  const session = await getSession()
  if (!session) return { success: false, error: \"Unauthorized\" }
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { success: false, error: \"Invalid input\" }
  // ... delegar al service
}
```

### Supabase Client
```typescript
// Server (amb service role)
import { createServerClient } from \"@/lib/supabase/server\"
const supabase = await createServerClient()

// Browser (només anon key)
import { createBrowserClient } from \"@/lib/supabase/client\"
const supabase = createBrowserClient()
```

## Errors a Evitar
- ❌ Exposar service role key al client
- ❌ Skip auth checks en mutacions
- ❌ Confiar en client-side validation per seguretat
- ❌ Crear `middleware.ts`
- ❌ Supabase queries fora de repositories
- ❌ RLS desactivat en alguna taula

## Checklist
1. Zod valida tots els inputs externs?
2. Auth check abans de mutacions?
3. Secrets només a server runtime?
4. RLS activat en totes les taules?