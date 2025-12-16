# DOCUMENTS.md - Guia Completa del Projecte DigitAI Studios

## 📖 Visió General
Plataforma professional desenvolupada amb l'objectiu de **Zero Deute Tècnic**, màxim rendiment SEO i automatització total de processos de màrqueting i gestió de clients.

---

## 🧱 Stack Tecnològic
- **Framework:** Next.js 16 (App Router, Server Actions, RSC).
- **Llenguatge:** TypeScript (Strict Mode).
- **Backend Services:** Supabase (Auth, DB Postgres, Edge Functions, Storage).
- **Deploy & Runtime:** Vercel (Edge Runtime, Analytics).
- **Infraestructura:** Hostinger (Dominis, DNS, Correu).
- **Gestor de Paquets:** `pnpm`.

---
## 🧩 Principis d'Arquitectura

### 1. Separació de Responsabilitats
- **`(marketing)`**: Optimitzat per SEO, càrrega instantània i conversió.
- **`dashboard`**: Optimitzat per funcionalitat, gestió d'estat i dades en temps real.
- **`lib/`**: Conté tota la lògica pura. Els components de React només pinten dades, no calculen.

### 2. Zero Deute Tècnic
- **Validació total:** Tot input (API o Form) passa per **Zod**.
- **Tipatge estricte:** No existeix el tipus `any`.
- **Server Actions:** Substitueixen les API routes tradicionals per a mutacions de dades.

### 3. Performance i SEO
- **Metadades:** Ús de `generateMetadata` dinàmic.
- **Imatges:** Optimització nativa amb `next/image` i formats WebP/AVIF.
- **RSC:** El 90% del codi s'executa al servidor per reduir el bundle del client.

---

## 📈 Sistema d'Analytics Personalitzat
Hem implementat un sistema propi per no dependre de cookies de tercers invasives.

1. **Captura:** Script lleuger a `(marketing)/layout.tsx`.
2. **Processament:** Endpoint `app/api/track/route.ts`.
3. **Emmagatzematge:** Taula `analytics_events` a Supabase.
4. **Visualització:** Gràfics amb Recharts al Dashboard.

**Exemple de payload d'event:**
```json
{
  "event": "click",
  "element": "cta-audit-header",
  "path": "/serveis/seo",
  "timestamp": 1730000000,
  "visitorId": "uuid-gen-123"
}
