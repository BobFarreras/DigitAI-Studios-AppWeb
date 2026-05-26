# Skill: Backend

## Quan carregar
Qualsevol task que impliqui server actions, services, repositories, supabase, auth, validació o lògica de domini.

## Flux Obligatori
```
UI → Action → Service → Repository → DB/Adapter
```

### Server Actions (`src/actions/` | `src/features/*/actions/`)
- Punt d'entrada des de UI
- Validació Zod OBLIGATÒRIA a tots els inputs
- Retorn normalitzat: `{ success: boolean, data?: T, error?: string }`
- Auth check abans de qualsevol mutació
- No lògica de negoci — delegar al service

### Services (`src/services/`)
- Lògica de negoci i orquestració
- Poden cridar múltiples repositories
- Interface injection via `container.ts`
- No accedeixen directament a DB

### Repositories (`src/repositories/`)
- Accés a dades NOMÉS aquí
- Interfícies a `src/repositories/interfaces/`
- Implementacions Supabase a `src/repositories/supabase/`
- Retornen types purs, no Supabase rows

### Adapters (`src/adapters/`)
- Integracions externes (Google, nodemailer, etc.)
- Interfícies a `src/adapters/interfaces/`
- Aïllen APIs de terceres de la lògica de domini

## Patrons

### Injecció de dependències
```typescript
// src/services/container.ts
export const container = {
  auditService: new AuditService(auditRepository),
  // ...
}
```

### Server Action Pattern
```typescript
\"use server\"
const schema = z.object({ id: z.string().uuid() })
export async function myAction(formData: FormData) {
  const parsed = schema.safeParse({ id: formData.get(\"id\") })
  if (!parsed.success) return { success: false, error: \"Invalid input\" }
  return myService.doSomething(parsed.data)
}
```

## Errors a Evitar
- ❌ `.from()` fora de repositories
- ❌ Lògica de negoci a server actions
- ❌ Retornar Supabase rows directament (mapejar a domain types)
- ❌ Oblidar auth check en mutacions
- ❌ Oblidar Zod validation
- ❌ Usar `.then()` — sempre `async/await`
- ❌ Cap `any`

## Checklist
1. La ruta de dades segueix UI → Action → Service → Repository?
2. Zod valida tots els inputs externs?
3. Hi ha auth check abans de mutacions?
4. El repository retorna domain types (no Supabase rows)?
5. Màx 150 línies per fitxer?