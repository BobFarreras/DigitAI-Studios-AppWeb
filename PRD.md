# PRODUCT REQUIREMENTS DOCUMENT (PRD)

| Atribut                   | Detall                                 |
| :------------------------ | :------------------------------------- |
| **Versió del Document**   | 1.0.0                                  |
| **Estat**                 | DRAFT / APROVAT                        |
| **Darrera Actualització** | [DATA_AVUI]                            |
| **Stack Principal**       | Next.js 16, React 19, Supabase, Vercel |

---

## 1. VISIÓ TÈCNICA I TECNOLOGIES (IMMUTABLE)

Aquest projecte es construeix sobre una base estricta per garantir **0 Deute
Tècnic**. No es permeten desviacions d'aquest stack sense revisió
d'arquitectura.

### 1.1 Core Stack

- **Framework:** Next.js 16 (App Router, Turbopack).
- **Llenguatge:** TypeScript 5.x (Mode Strict actiu).
- **UI Library:** React 19 (Hooks, Server Components, Server Actions).
- **Estils:** Tailwind CSS (si s'escau) / ShadcnUI (recomanat).
- **Gestor de Paquets:** pnpm (Strict hoisting).

### 1.2 Dades i Backend

- **Base de Dades:** Supabase (PostgreSQL).
- **Autenticació:** Supabase Auth (SSR).
- **ORM/Query:** Supabase Client (Typed).
- **Validació:** Zod (Obligatori per a tots els inputs d'usuari i API).

### 1.3 Qualitat i Testing (TDD)

- **Unit/Integration:** Vitest (compatible amb Jest API).
- **E2E Testing:** Playwright.
- **CI/CD:** GitHub Actions + Vercel Deployments.
- **Monitorització:** Sentry (Error Tracking & Performance).

---

## 2. PRINCIPIS D'ARQUITECTURA I DESENVOLUPAMENT

### 2.1 Clean Architecture a Next.js

Per mantenir la "Separació de Responsabilitats", seguirem aquesta estructura de
carpetes estricta:

- **`app/` (Presentation Layer):** Només components React (Server/Client). NO
  lògica de negoci complexa.
- **`actions/` (Application Layer):** Server Actions. Aquí resideixen els Casos
  d'Ús. Validació amb Zod aquí.
- **`lib/` (Infrastructure Layer):** Clients de Supabase, utilitats, helpers de
  dates, etc.
- **`types/` (Domain Layer):** Definicions de tipus globals i models de domini.

### 2.2 Flux de Treball TDD (Red-Green-Refactor)

1. **RED:** Definir l'User Story i els Criteris d'Acceptació (Gherkin) en aquest
   PRD. Crear el test a `tests/` que falli.
2. **GREEN:** Implementar la mínima lògica necessària perquè el test passi.
3. **REFACTOR:** Optimitzar el codi sense trencar el test.

### 2.3 Seguretat (OWASP Top 10)

- **A01: Broken Access Control:** Totes les consultes a Supabase han de tenir
  **RLS (Row Level Security)** actives.
- **A03: Injection:** Mai concatenar SQL. Utilitzar sempre el client de Supabase
  i validar inputs amb **Zod**.
- **Gestió de Secrets:** Mai pujar `.env` al repo. Utilitzar variables d'entorn
  de Vercel.

---

## 3. MODEL DE DADES (Esborrany)

_Definiu aquí les entitats principals abans de crear les taules._

### Exemple: Entitat `Users`

- **Taula:** `profiles` (estén `auth.users`)
- **Camps:** `id` (uuid, PK), `email` (text), `full_name` (text), `role` (enum:
  'admin', 'user').
- **RLS Policies:**
  - `SELECT`: Users can see their own profile. Admins can see all.
  - `UPDATE`: Users can update own profile only.

---

## 4. USER STORIES & CRITERIS D'ACCEPTACIÓ (FEATURES)

_Afegeix noves funcionalitats aquí sota seguint el format estricte._

### Feature [FEAT-001]: [Nom de la Funcionalitat]

**User Story:**

> **Com a** [Rol d'Usuari] **Vull** [Acció] **Per tal de** [Benefici]

**Requeriments Funcionals:**

1. El sistema ha de...
2. L'usuari ha de poder...

**Criteris d'Acceptació (GHERKIN - Contracte per a Playwright/Vitest):**

```gherkin
Scenario: [Nom de l'Escenari, ex: Login correcte]
  GIVEN [Context inicial, ex: L'usuari és a la pàgina de login]
  WHEN [Acció, ex: Introdueix credencials vàlides]
  THEN [Resultat esperat, ex: Redirigit al dashboard]
  AND [Estat, ex: Es guarda la sessió]
```

Scenario: [Nom de l'Escenari d'Error, ex: Login fallit] GIVEN [Context inicial]
WHEN [Acció errònia] THEN [Missatge d'error visible] AND [No es redirigeix]

5. DOCUMENTACIÓ I OBSERVABILITAT Logs: Utilitzar console.error només per a
   depuració local. En producció, utilitzar Sentry.

Comentaris: Utilitzar JSDoc (/** ... */) per a funcions complexes i Server
Actions, explicant paràmetres i retorns.

Aquest és el teu document base. **No es comença a picar codi fins que l'apartat 4 (User Stories) de la funcionalitat que vols fer estigui omplert.**

Vols que passem ara al **PAS 2: Crear el `AGENTS.md`**, que serà la guia perquè la IA sàpiga com interpretar i executar aquest PRD?
