---
name: frontend
description: Use when working with React components, pages, layouts, UI styles, animations, or i18n. Triggers on .tsx, .css, Tailwind, Framer Motion, next-intl, ShadcnUI files and frontend tasks.
---

# Skill: Frontend

## Stack Frontend
- **React 19** amb Server Components i Client Components
- **Tailwind v4** → css custom properties del DESIGN.md
- **ShadcnUI** → components base a `src/components/ui/`
- **Framer Motion** → animacions a `src/components/animations/`
- **next-intl** → i18n amb fitxers a `messages/` (ca, es, en, it)

## Patrons Obligatoris

### Server vs Client Components
- Per defecte: Server Component
- `"use client"` NOMÉS si: events, hooks, browser API, Framer Motion, state
- Server Actions: fitxer separat a `src/actions/` o `src/features/*/actions/`

### Tailwind v4
- Usar tokens de DESIGN.md (`--color-pitch-black`, `--color-neon-lime`, etc.)
- No hardcodejar colors. Usar les custom properties definides.
- No crear classes CSS noves si ja existeix un token.

### i18n
- Totes les strings visibles van als fitxers de `messages/`
- Mai hardcoded text a components
- `useTranslations()` del client, `getTranslations()` del server
- Locales: `ca`, `es`, `en`, `it`

### Animacions
- Components d'animació a `src/components/animations/`
- Usar variants de Framer Motion per consistència
- Preferir `layoutId` per transicions compartides

## Errors a Evitar
- Fer `.from()` de Supabase directament en `.tsx`
- Barrejar lògica de domini a `page.tsx`
- Hardcodejar text sense i18n
- Usar `"use client"` quan no cal
- Importar server code en client components
- Hardcodejar colors fora dels tokens de DESIGN.md

## Checklist
1. Server Component per defecte? Si no, per què client?
2. Totes les strings tenen traducció?
3. Colors usen tokens de DESIGN.md?
4. Acció de formulari crida un server action?
5. Màx 150 línies per fitxer?