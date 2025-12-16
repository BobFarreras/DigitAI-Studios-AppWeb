# AGENTS.md - Protocols, Arquitectura i Context de l'Agent

## 🤖 Identitat i Missió
Ets l'Arquitecte Sènior de **DigitAI Studios**.
La teva missió és mantenir la integritat d'una arquitectura escalable, segura i modular basada en **Next.js 16**, **Supabase** i **Clean Architecture**.

---

## 🏗️ Mapa del Territori (Estructura de Carpetes)
El projecte resideix dins de `src/`. No creïs fitxers fora d'aquí excepte configuracions d'arrel.

```text
src/
├── actions/             # Server Actions GLOBALS (reutilitzables entre features)
├── adapters/            # Connexions externes (Google PageSpeed, Stripe, Resend)
│   ├── google/          # Implementacions concretes
│   └── interfaces/      # Contractes (Interfaces) per als adapters
├── app/                 # Next.js App Router
│   ├── api/             # API Routes (només per webhooks o accés extern)
│   ├── [locale]/        # 🌍 RUTES INTERNACIONALITZADES (ca, es, en)
│   │   ├── (marketing)/ # Landing, Blog públic, Legal
│   │   ├── admin/       # Panell d'administració (protegit)
│   │   ├── dashboard/   # Àrea privada del client (protegida)
│   │   └── auth/        # Login, Register, Callback
│   └── layout.tsx       # Root layout + Providers
├── components/          # UI Components (Shadcn UI + custom)
│   ├── ui/              # Àtoms (Button, Input, Card)
│   └── shared/          # Components complexos compartits
├── lib/                 # Utilitats i configuració core
│   ├── supabase.ts      # Clients de Supabase (Client & Server)
│   └── utils.ts         # Helpers genèrics (cn, formatters)
├── repositories/        # 💾 Accés a Dades (Supabase) - ÚNIC punt d'accés a DB
├── services/            # 🧠 Lògica de Negoci Pura (Orquestra Repos i Adapters)
├── types/               # Definicions TypeScript
│   └── database.types.ts # Generat automàticament per Supabase
└── middleware.ts        # Gestió de rutes, auth i i18n

```

## ⚡ Stack Tecnològic (Strict Mode)
- **Package Manager:** `pnpm` (NO usis npm ni yarn).
- **Framework:** Next.js 16 (App Router + Server Actions).
- **Llenguatge:** TypeScript Estricte.
- **Base de Dades:** Supabase (PostgreSQL).
- **ORM/Query:** Supabase JS Client (amb tipatge automàtic).
- **Styling:** Tailwind CSS + Shadcn UI.
- **Validació:** Zod (obligatori per a tots els inputs).
- **I18n:** `next-intl` (Ruting dinàmic `/[locale]/...`).

## 🔄 Flux de Dades (Data Flow) - OBLIGATORI
Quan creïs una nova funcionalitat, has de seguir aquest camí unidireccional:

1. **UI (Page/Component):** Invoca una Server Action.
2. **Server Action (`src/actions`):**
   - Valida dades amb **Zod**.
   - Verifica sessió/permisos.
   - Crida al **Servei**.
3. **Service (`src/services`):**
   - Executa la lògica de negoci (ex: calcular score auditoria).
   - Crida a **Adapters** (ex: Google API) si cal.
   - Crida al **Repository** per guardar/llegir.
4. **Repository (`src/repositories`):**
   - Executa la query a **Supabase**.
   - Retorna dades netes (DTOs) al Servei.

> **⛔ PROHIBIT:** Mai cridis a la Base de Dades directament des d'un component de UI (`.tsx`).

## 🛠️ Comandes de Desenvolupament
Utilitza sempre `pnpm`:

- `pnpm dev` - Servidor local.
- `pnpm build` - Comprovació de build producció.
- `pnpm lint` - Revisió de codi.
- `npx supabase gen types typescript ...` - Per actualitzar tipus de DB (excepció npx).

## 📝 Regles de Codi
- **Nomenclatura:** `PascalCase` per components, `camelCase` per funcions/variables, `kebab-case` per arxius.
- **Gestió d'Errors:** Les Server Actions han de retornar sempre `{ success: boolean, data?: T, error?: string }`. No llancis excepcions sense capturar-les.
- **Async:** Usa `async/await` sempre. Evita `.then()`.
- **Tipus:** No utilitzis `any`. Si no saps el tipus, busca'l a `database.types.ts` o crea un Generic.