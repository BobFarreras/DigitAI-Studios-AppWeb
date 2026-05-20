---
name: testing
description: Use when writing tests, fixing bugs, or refactoring existing code. Triggers on test files, Vitest, Testing Library, TDD workflows, and regression testing.
---

# Skill: Testing

## Stack de Testing
- **Vitest** — unit i integration tests
- **Testing Library** — `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`
- **jsdom** — entorn DOM simulat
- **Comanda:** `pnpm test -- --run`

## Filosofia: TDD
1. **RED:** Escriure test que falli primer
2. **GREEN:** Implementar mínim codi per passar
3. **REFACTOR:** Millorar sense trencar

## Estructura
```
tests/
  unit/           → tests unitaris (services, repositories, utils)
  integration/    → tests d'integració (actions + services)
  components/     → tests de components React
```

## Patrons

### Server Actions
```typescript
// Testar el flux complet: validació → service → resposta
// Mock del service, testar l'action
```

### Components React
```typescript
// Testing Library: render, screen, userEvent
// Testar comportament visible, NO implementació
```

### Services
```typescript
// Mock del repository, testar lògica de negoci
// Verificar que el service crida el repository correcte
```

## Regles
- Bugfix → crear test de regressió ABANS del fix
- Refactor → preservar tests existents
- Mínim: testar camí feliç i un cas d'error
- No mock internals — mock boundaries (repositories, APIs)

## Errors a Evitar
- Testar implementació (state intern, mètodes privats)
- Mock excessiu (>2 mocks per test = massa)
- Tests fràgils que depenen de CSS o estructura DOM
- Saltar tests per pressió
- No testar edge cases