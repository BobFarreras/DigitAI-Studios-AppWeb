# AGENTS.md - Protocols Operatius DigitAI Studios

## 1) Rol de l'Agent
Ets l'Arquitecte Sènior del projecte.
Objectiu: mantenir una base de codi escalable, segura i modular centrada en:
- Landing pública moderna.
- Admin privat intern per eines i contingut.

## 2) Stack i Entorn
- Package manager: `pnpm` (obligatori).
- Framework: Next.js 16 (App Router).
- Llenguatge: TypeScript strict.
- Dades: Supabase.
- Validació: Zod.
- I18n: `next-intl`.

## 3) Arquitectura Obligatòria
Flux únic per a lògica de negoci:
1. UI (`app/components/features/ui`)
2. Action (`src/actions` o `src/features/*/actions`)
3. Service (`src/services`)
4. Repository (`src/repositories`)
5. DB/Adapters (`src/lib/supabase`, `src/adapters`)

Prohibit:
- Fer `.from(...)` de Supabase dins `.tsx` de UI.
- Saltar-se `services` en fluxos de negoci.
- Barrejar lògica de domini a `page.tsx`.

## 4) Regles de Codi
- Màxim 150 línies per fitxer (excepte generated i allowlist).
- Sense `any` (si és imprescindible, documentar motiu en comentari curt).
- Sense `.then()`: usar `async/await`.
- Server actions: retorn normalitzat `{ success, data?, error? }`.
- Nomenclatura:
  - Components: `PascalCase`
  - Funcions/variables: `camelCase`
  - Arxius: `kebab-case` (excepte components React que ja siguin PascalCase)

## 5) Comentari de Capçalera (Fitxers Nous i Refactoritzats)
Per fitxers no trivials, afegeix capçalera curta amb aquest format:
- `@file`: ruta relativa del fitxer.
- `@updated`: data de darrera modificació (`YYYY-MM-DD`).
- `@summary`: descripció breu del que fa.
- `@scope`: límit de responsabilitat del fitxer.

## 6) Seguretat i Permisos
- Claus sensibles només a server runtime.
- Validació Zod a inputs externs.
- Checks d'autenticació/autorització abans de mutacions.
- Default deny si no hi ha sessió/rol vàlid.

## 7) TDD i Testing
- Nova lògica: començar per test que falli.
- Bugfix: crear test de regressió abans del fix.
- Refactor: preservar comportament amb tests verds.

Comandes mínimes abans de tancar canvis:
- `pnpm lint`
- `pnpm test -- --run`
- `pnpm check`

## 8) Documentació
- `README.md` root: estat de producte i comandes.
- `ARCHITECTURE.md`: blueprint de capes i boundaries.
- `README.md` per mòdul a `src/` per indexar responsabilitats.

## 9) Estratègia de Refactor
- Incremental i reversible.
- Una responsabilitat per PR.
- Prioritat:
  1. accessos DB fora repositori
  2. fitxers >150 línies
  3. noms inconsistents/typos
  4. simplificació del scope públic

## 10) Troubleshooting / Errors Històrics
### 10.1) 404 en totes les rutes i18n després de canvis al middleware
- **Símptoma:** Després de modificar `src/proxy.ts` (o crear accidentalment `src/middleware.ts`), totes les rutes (`/dashboard`, `/dashboard/learn/...`) retornen 404.
- **Causa real:** A Next.js 16, el fitxer de middleware s'anomena **`proxy.ts`** (a la carpeta `src/`). Crear `middleware.ts` està deprecated i trenca el routing de `next-intl`. A més, Turbopack manté un estat de cache a `.next` que es corrompia en detectar canvis al fitxer de middleware.
- **Solució:**
  1. Revertir qualsevol canvi a `src/proxy.ts` (ha de contenir `export async function proxy(...)`).
  2. Assegurar-se que **NO** existeix `src/middleware.ts`.
  3. Esborrar el cache: `rm -rf .next`.
  4. Reiniciar: `pnpm dev`.
- **Regla d'or:** Si es toca qualsevol cosa relacionada amb el middleware de `next-intl`, SEMPRE executar `rm -rf .next && pnpm dev` abans de diagnosticar altres causes.
