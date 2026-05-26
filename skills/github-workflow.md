# Skill: GitHub Workflow

## Quan carregar
Qualsevol task que impliqui commits, PRs, merges, branching o CI/CD.

## Branching Strategy
- `main` → producció
- `feat/nom-feature` → noves funcionalitats
- `fix/nom-fix` → correccions
- `refactor/nom-refactor` → refactoritzacions
- `docs/nom-doc` → documentació
- `chore/nom-chore` → tasques de manteniment

## Conventional Commits
```
feat: descripció curta
fix: descripció curta
refactor: descripció curta
docs: descripció curta
chore: descripció curta
```
- Idioma: català o anglès
- Una responsabilitat per commit
- Cos del commit pot describir context i decisions

## Pull Requests
- Títol: `feat: descripció` (conventional commit)
- Una responsabilitat per PR
- Rebase sobre `main` abans de merge
- Checks obligatoris:
  ```
  pnpm lint
  pnpm test -- --run
  pnpm check
  ```
- Descripció: què canvia, per què, impacte

## CI/CD (GitHub Actions + Vercel)
- Deploy automàtic de `main` a Vercel
- PRs generen preview deployment
- No fer merge si checks fallen

## Errors a Evitar
- ❌ Commit directe a `main`
- ❌ PR amb múltiples responsabilitats
- ❌ Merge sense rebase prévi
- ❌ Saltar-se els checks de qualitat
- ❌ Commit secrets o .env

## Checklist
1. Branch segueix la convenció `tipus/nom`?
2. Commit message és conventional?
3. PR té una sola responsabilitat?
4. Checklist de qualitat passa?