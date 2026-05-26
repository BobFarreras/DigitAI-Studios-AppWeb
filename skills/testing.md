# Skill: Testing

## Quan carregar
Qualsevol task que impliqui escriure tests, corregir bugs, o refactoritzar codi existent.

## Stack de Testing
- **Vitest** — unit i integration tests
- **Testing Library** — `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`
- **jsdom** — entorn DOM simulat
- **Comanda:** `pnpm test -- --run`

## Filosofia: TDD
1. **RED:** Escriure test que falli primer
2. **GREEN:** Implementar mínim codi per passar
3. **REFACTOR:** Millorar sense trencar

## Patrons de Testing

### Estructura
```
tests/
  unit/           → tests unitaris (services, repositories, utils)
  integration/    → tests d'integració (actions + services)
  components/     → tests de components React
```

### Server Actions
```typescript
// Testar el flux complet: validació → service → resposta
import { describe, it, expect } from \"vitest\"
// Mock del service, testar l'action
```

### Components React
```typescript
// Usar Testing Library: render, screen, userEvent
// Testar comportament visible, NO implementació
import { render, screen } from \"@testing-library/react\"
import userEvent from \"@testing-library/user-event\"

// ❌ No testar state intern
// ✅ Testar que l'usuari veu X i pot fer Y
```

### Services
```typescript
// Mock del repository, testar lògica de negoci
// Verificar que el service crida el repository correcte
```

## Regles
- Bugfix → crear test de regressió ABANS del fix
- Refactor → preservar tests existents
- Mínim: testar el camí feliç i un cas d'error
- No mock internals — mock boundaries (repositories, APIs)

## Errors a Evitar
- ❌ Testar implementació (state intern, mètodes privats)
- ❌ Mock excessiu (>2 mocks per test = massa)
- ❌ Tests fràgils que depenen de CSS o estructura DOM
- ❌ Saltar tests per pressió
- ❌ No testar edge cases

## Checklist
1. Segueixo TDD (test primer)?
2. Testo comportament, no implementació?
3. Cobrisc camí feliç i error?
4. Màx 2 mocks per test?