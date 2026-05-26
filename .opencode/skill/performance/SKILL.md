---
name: performance
description: Use when optimizing performance, lazy loading, caching, bundle size, Core Web Vitals, or rendering strategy. Triggers on optimization, next/dynamic, next/image, caching, revalidation, and server components decisions.
---

# Skill: Performance

## Rendiment a Next.js 16

### Server Components (per defecte)
- Minimitzar `"use client"` — només quan cal state/events/browser
- Preferir composició de Server Components
- Data fetching a server → menys JS al client

### Codi Splitting
- `next/dynamic` per components pesats (charts, editors, maps)
- `next/image` per totes les imatges amb `sizes` i `priority`
- `next/font` per fonts (Inter Variable ja configurat)

### Data Fetching
- React `cache()` per deduplicar requests en server
- `revalidate` amb Next.js cache (ISR quan apliqui)
- Evitar waterfalls: paral·lelitzar fetches independents
- Preferir Server Actions sobre API routes

### Bundle Size
- Importar només el que s'usa (`import { X } from 'lib'`)
- Tree-shaking: verificar bundle amb `next build`
- Lazy load components pesats (recharts, react-pdf, etc.)
- Evitar dependencies innecessàries

### Caching
- Next.js Data Cache: `fetch` amb `next: { revalidate: 60 }`
- Full Route Cache per pàgines estàtiques
- Router Cache: 5 min per dynamic renders (default)
- Invalidació: `revalidatePath()` i `revalidateTag()`

## Mètriques Objectiu (Core Web Vitals)
- **LCP** < 2.5s | **FID** < 100ms | **CLS** < 0.1 | **INP** < 200ms

## Patrons

### Imatges
```tsx
import Image from "next/image"
<Image src={...} alt={...} width={800} height={600} sizes="(max-width: 768px) 100vw, 50vw" />
```

### Dynamic Import
```tsx
const HeavyChart = dynamic(() => import("./chart"), { loading: () => <Skeleton /> })
```

### Parallel Fetching
```tsx
const [data1, data2] = await Promise.all([fetchA(), fetchB()])
```

## Errors a Evitar
- `"use client"` quan Server Component basta
- Fetch seqüencial quan es pot paral·lelitzar
- Imatges sense `next/image`
- Importar llibreries senceres
- No especificar `sizes` en imatges responsives
- Massa JS al client (bundle bloat)