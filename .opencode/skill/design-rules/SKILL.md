---
name: design-rules
description: Use when working with UI styles, colors, typography, spacing, visual components, or design. Triggers on CSS, Tailwind, theme tokens, ShadcnUI, layout, spacing, and visual design tasks.
---

# Skill: Design Rules

## Sistema de Disseny (Linear-style Dark UI)

### Paleta Core
| Token | Color | Ús |
|-------|-------|----|
| `--color-pitch-black` | #08090a | Background principal |
| `--color-graphite` | #0f1011 | Cards primàries |
| `--color-deep-slate` | #161718 | Cards elevades |
| `--color-charcoal-grey` | #23252a | Borders |
| `--color-porcelain` | #f7f8f8 | Text principal |
| `--color-light-steel` | #d0d6e0 | Text secundari |
| `--color-storm-cloud` | #8a8f98 | Text terciari |
| `--color-neon-lime` | #e4f222 | Accions primàries (ÚNIC accent brillant) |

### Regla d'Or
**Només `--color-neon-lime` com a accent brillant.** No afegir colors saturats addicionals.

### Tipografia
- Primària: `Inter Variable` — pesos 300, 400, 510, 590
- Monospace: `Berkeley Mono` — només per codi i dades tècniques
- Letter-spacing: `--tracking-body` (-0.13px), `--tracking-heading` (-0.22px)

### Espaiat
- Unitat base: 4px | Card padding: 12px | Element gap: 8px | Section gap: 24px

### Border Radius
- Cards, inputs, botons: 6px | Tags: 2px | Badges: 4px | Pill: 9999px

### Superfícies (elevació)
1. Pitch Black Canvas (#08090a) — base
2. Graphite Card (#0f1011) — cards
3. Deep Slate Elevated (#161718) — cards destacades
4. Charcoal Grey (#23252a) — borders i overlays

### Ombres
- Default card: `rgba(0,0,0,0.4) 0px 2px 4px 0px`
- Inset: `rgb(35,37,42) 0px 0px 0px 1px inset`
- XL: `rgba(8,9,10,0.6) 0px 4px 32px 0px`

## Components Reference
- Base: `src/components/ui/` (ShadcnUI)
- Layout: `src/components/layout/`
- Admin: `src/components/admin/`
- Landing: `src/components/landing/`
- Animacions: `src/components/animations/`

## Errors a Evitar
- Introduir colors fora de la paleta definida
- Usar white backgrounds o light theme
- Ombres difuses genèriques — usar les definides
- Border radius genèrics — usar 6px / 2px / 4px
- Fonts fora d'Inter Variable i Berkeley Mono
- Massa espai en blanc — disseny compacte