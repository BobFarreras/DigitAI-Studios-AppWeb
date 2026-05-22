# Guia d'Agents — Creació de Contingut Educatiu

## @file docs/learning-agents/README.md
## @updated 2026-05-21
## @summary Guia mestre per agents IA que creuen contingut educatiu
## @scope Regles, estructura i flux de treball per generar cursos, mòduls, lliçons i exercicis

---

## 1. Principis Fundamentals

### 1.1 Prioritat: Qualitat sobre Quantitat
- **NO** generis centenars de lliçons automàticament.
- Cada lliçó ha de tenir valor educatiu real.
- Millor 5 lliçons excel·lents que 50 mediocres.

### 1.2 Estructura Pedagògica Obligatòria
Tota lliçó ha de seguir aquesta seqüència:
```
1. Introducció (contextualització)
2. Concepte (explicació clara)
3. Exemple visual/pràctic (cas real)
4. Exercici interactiu (pràctica)
5. Validació de coneixement (reforç)
6. Resum final (consolidació)
7. Següent pas (transició)
```

### 1.3 Qualitat vs. Contingut Genèric

**PROHIBIT:**
- Preguntes tipus "Quina és la capital de França?" en un curs de programació.
- Respostes del tipus "Totes les anteriors" o "Cap de les anteriors".
- Explicacions copiades de Wikipedia sense context pràctic.
- Exercicis que no requereixen comprensió, només memòria.

**OBLIGATORI:**
- Exercicis basats en situacions reals del món laboral.
- Explicacions amb analogies comprensibles.
- Feedback que expliqui per què una resposta és correcta o incorrecta.
- Progressió gradual: concepte simple → aplicació → cas complex.

---

## 2. Estructura de Nivells

### 2.1 Jerarquia de Contingut
```
Track (Camí formatiu)
  └── Mòdul (Unitat temàtica)
        └── Lliçó (Sessió d'aprenentatge)
              └── Steps (Pantalles interactives)
                    └── Questions/Preguntes
```

### 2.2 Relació amb la Base de Dades
| Nivell | Taula | Descripció |
|--------|-------|------------|
| Track | `learning_tracks` | Camí formatiu complet (ex: "Iniciació Digital") |
| Mòdul | `learning_modules` | Bloc dins un track (ex: "Navegació Segura") |
| Lliçó | `learning_lessons` | Sessió individual (ex: "Gestió de Contrasenyes") |
| Step | `learning_steps` | Pantalla interactiva dins la lliçó |
| Attempt | `learning_attempts` | Intent de l'usuari |
| Answer | `learning_step_answers` | Resposta específica |
| Progress | `learning_progress` | Progrés de l'usuari |

---

## 3. Flux de Treball de l'Agent

### 3.1 Abans de Crear Res
1. **Consulta el pla mestre** (`docs/learning-agents/COURSE-ROADMAP.md`)
2. **Verifica prerequisits** — què ha de saber l'alumne abans?
3. **Defineix objectius** — què serà capaç de fer després?
4. **Escull tipus de step** — veure `CONTENT-SCHEMA.md`

### 3.2 Creant Contingut
1. Genera primer la **lliçó** (títol, objectiu, XP)
2. Després els **steps** (pantalles interactives)
3. Per cada step, defineix:
   - Tipus d'interacció
   - Prompt (pregunta/contingut)
   - Config (resposta correcta, opcions)
   - Explicació (feedback educatiu)
4. **Revisa qualitat** — compleix els criteris de `PEDAGOGY.md`?
5. **Tradueix** — genera ca, es, en, it simultàniament

### 3.3 Desant a la Base de Dades
- Utilitza el MCP de Supabase.
- Segueix la seqüència: Track → Mòdul → Lliçó → Steps.
- Valida amb Zod abans d'inserir.
- Marca com `draft` fins a revisió humana.

---

## 4. Prompt Engineering per a Agents

### 4.1 Context Mínim Eficient
Per reduir tokens, l'agent rep només:
```
- Taula destí (learning_steps)
- Tipus de step (multiple_choice, scenario, etc.)
- Nivell de dificultat
- Objectiu educatiu
- Exemple de format (veure TEMPLATES.md)
```

### 4.2 Exemple de Prompt per a Agent
```
Crea un step de tipus "scenario" per a nivell "basic".

Objectiu: L'alumne identificarà un intent de phishing.

Context: L'alumne ha completat la lliçó sobre contrasenyes.

Format requerit:
- Prompt: Situació realista (3-4 frases)
- 4 opcions de resposta (només 1 correcta)
- Explicació: Per què és correcta i per què les altres no
- Config: { correctAnswer: "A", options: [...] }

Restriccions:
- NO preguntes genèriques del tipus "Què és el phishing?"
- SÍ situacions reals que requereixin anàlisi
- L'explicació ha d'ensenyar, no només dir "correcte"
```

---

## 5. Sistema de Plantilles

Les plantilles estan a `docs/learning-agents/TEMPLATES.md`.

Tipus disponibles:
- `multiple_choice` — Una resposta correcta
- `multi_select` — Múltiples correctes
- `true_false` — Cert/Fals amb justificació
- `order_steps` — Ordenar procediments
- `match_pairs` — Relacionar conceptes
- `fill_blank` — Completar codi/comandes
- `code_choice` — Triar snippet correcte
- `scenario` — Casos reals de ciberseguretat/IA
- `terminal_simulation` — Comandes de terminal
- `network_diagram` — Diagnòstic de xarxa
- `code_editor` — Escriure/debuggar codi
- `ai_prompt_review` — Avaluar prompts d'IA
- `security_triage` — Prioritzar incidents

---

## 6. Integritat i Consistència

### 6.1 Validacions Automàtiques
- Tots els slugs han de ser únics dins el seu nivell.
- `order_index` ha de ser seqüencial (0, 1, 2...).
- `estimated_minutes` ha de reflectir el temps real (~3-7 min per lliçó).
- `xp_reward` proporcial a la dificultat (10-50 XP).

### 6.2 Dependències entre Lliçons
```
Lliçó A (completable) → desbloqueja → Lliçó B
```
- La lliçó B ha de referenciar A com a prerequisit.
- El repositori valida que l'alumne tingui A completada.

---

## 7. Versions i Millores

### 7.1 Versionat de Contingut
Quan es millora una lliçó existent:
1. Crea nova versió amb `version: 2` al camp `config`.
2. Conserva l'anterior per historial.
3. Actualitza `updated_at`.

### 7.2 Regeneració Selectiva
- Es pot regenerar un sol step sense tocar la lliçó sencera.
- Es pot actualitzar traduccions sense modificar el contingut original.
- El sistema manté `best_score` i no descompleta lliçons ja superades.

---

## 8. Checklist de Qualitat (Abans de Commit)

```
□ Cada step té feedback educatiu (no només "correcte/incorrecte")
□ Les respostes incorrectes són plausibles (no absurdes)
□ Hi ha almenys un exemple pràctic per lliçó
□ La progressió és gradual (no salta de simple a impossible)
□ Les traduccions mantenen el mateix nivell de detall
□ No hi ha contingut genèric ni preguntes de tipus quiz absurd
□ El temps estimat és realista
□ L'XP reward reflecteix la dificultat real
```

---

## 9. Contacte i Suport

Si un agent troba:
- **Error tècnic** → Consulta `DATABASE-REFERENCE.md`
- **Dubte pedagògic** → Consulta `PEDAGOGY.md`
- **Problema de traducció** → Segueix la plantilla de `TEMPLATES.md`
- **Bug de sistema** → Reporta a Engram amb `type: bugfix`
