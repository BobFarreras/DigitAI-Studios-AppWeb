# Index de Documentacio d'Agents — Learning Content

## @file docs/learning-agents/INDEX.md
## @updated 2026-05-21
## @summary Index de tots els documents per a agents generadors de contingut educatiu
## @scope Punt d'entrada per a agents que necessitin orientacio

---

## Documents d'Arquitectura

| Document | Proposit | Quan consultar |
|----------|----------|----------------|
| `README.md` | Guia mestre, flux de treball, checklist | Primer document a llegir |
| `CONTENT-SCHEMA.md` | Esquemes de dades, formats JSON, Zod | Quan s'ha de definir un nou tipus de step |
| `TEMPLATES.md` | Plantilles JSON completes per copiar | Quan s'ha de crear una llico nova |
| `PEDAGOGY.md` | Criteris de qualitat, estructura pedagogica | Quan es dubta de la qualitat del contingut |
| `DATABASE-REFERENCE.md` | Esquema de taules, exemples d'INSERT | Quan s'ha de guardar a Supabase |
| `COURSE-ROADMAP.md` | Pla mestre de tracks i moduls | Per saber quin contingut crear i en quin ordre |

---

## Ordre Recomanat de Lectura

1. **README.md** — Entendre el sistema (10 min)
2. **COURSE-ROADMAP.md** — Saber quin contingut toca (5 min)
3. **PEDAGOGY.md** — Saber com ha de ser el contingut (10 min)
4. **CONTENT-SCHEMA.md** — Saber com estructurar les dades (10 min)
5. **TEMPLATES.md** — Copiar plantilles per crear (5 min)
6. **DATABASE-REFERENCE.md** — Saber on guardar (5 min)

**Total: ~45 minuts per entendre l'arquitectura completa.**

---

## Quick Reference

```
Agent vol crear una llico nova:
  1. Llegeix COURSE-ROADMAP.md → Quin track/modul?
  2. Llegeix PEDAGOGY.md → Quin nivell i estructura?
  3. Copia plantilla de TEMPLATES.md
  4. Omple amb contingut segons PEDAGOGY.md
  5. Valida amb Zod (CONTENT-SCHEMA.md)
  6. INSERT a Supabase (DATABASE-REFERENCE.md)
  7. Marca com 'draft' fins validacio humana
```

---

## Versions

| Versio | Data | Canvis |
|--------|------|--------|
| 1.0.0 | 2026-05-21 | Estructura inicial de l'arquitectura d'agents |
