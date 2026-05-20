# Skill: Performance

## Quan carregar
Qualsevol task que impliqui optimització, rendiment, lazy loading, caching, bundle size, o Core Web Vitals.

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
- Importar només el que s'usa (`import { X } from 'lib'` no `import * as lib`)
- Tree-shaking: verificar bundle amb `next build`
- Lazy load components pesats (recharts, react-pdf, etc.)
- Evitar dependencies innecessàries

### Caching
- Next.js Data Cache: `fetch` amb `next: { revalidate: 60 }`
- Full Route Cache per pàgines estàtiques
- Router Cache: 5 min per dynamic renders (default)
- Invalidació: `revalidatePath()` i `revalidateTag()`

## Mètriques Objectiu (Core Web Vitals)
- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **INP** < 200ms (Interaction to Next Paint)

## Patrons

### Imatges
```tsx
import Image from \"next/image\"
<Image src={...} alt={...} width={800} height={600} sizes=\"(max-width: 768px) 100vw, 50vw\" />
```

### Dynamic Import
```tsx
const HeavyChart = dynamic(() => import(\"./chart\"), { loading: () => <Skeleton /> })
```

### Parallel Fetching
```tsx
// ✅ Paral·lel
const [data1, data2] = await Promise.all([fetchA(), fetchB()])
// ❌ Seqüencial
const data1 = await fetchA()
const data2 = await fetchB()
```

## Errors a Evitar
- ❌ `"use client"` quan Server Component basta
- ❌ Fetch seqüencial quan es pot paral·lelitzar
- ❌ Imatges sense `next/image`
- ❌ Importar llibreries senceres
- ❌ No especificar `sizes` en imatges responsives
- ❌ Massa JS al client (bundle bloat)

## Checklist
1. És Server Component per defecte?
2. Components pesats tenen dynamic import?
3. Imatges usen `next/image`?
4. Fetches paral·lels quan possible?
5. LCP, FID, CLS dins objectius?