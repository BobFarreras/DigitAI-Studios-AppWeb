# Root Cleanup Inventory

Data: 2026-05-08

## Objectiu
Reduir soroll a l'arrel del projecte i deixar només arxius actius de producte, arquitectura i runtime.

## Ja eliminats
- `merge.js`
- `codi_i_estructura_digitAIStudios.txt`

## Arxius arrel que s'han de mantenir
- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `vitest.config.ts`

## Candidats a arxiu o eliminació (pendent validació funcional)
- `Models-de-produccio.md`
- `base_coneixement_seo.md`
- `GUIA-FACTORY.md`
- `instruccions_agent_qa.md`
- `manual-estil-digitai.md`
- `auditoria.json`
- `test-ca-full.json`

## Criteri de decisió
- Si no participa en build, tests, runtime ni onboarding real, s'arxiva a `docs/archive/`.
- Si és duplicat, incomplet o no aplicable al scope actual, s'elimina.
