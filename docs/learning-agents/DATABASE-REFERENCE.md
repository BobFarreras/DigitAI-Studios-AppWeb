# Referència de Base de Dades — Guia per Agents

## @file docs/learning-agents/DATABASE-REFERENCE.md
## @updated 2026-05-21
## @summary Estructura de taules, relacions i flux de dades per agents generadors
## @scope Com interactuar amb Supabase per persistir contingut educatiu

---

## 1. Visió General del Model

```
learning_tracks (Cami formatiu)
  └── learning_modules (Mòdul)
        └── learning_lessons (Lliçó)
              └── learning_steps (Step interactiu)

learning_attempts (Intent de l'usuari)
  └── learning_step_answers (Resposta específica)

learning_progress (Progrés de l'usuari)
learning_xp_events (Historial d'XP)
learning_streaks (Ratxes diàries)
```

---

## 2. Taula: learning_tracks

**Propòsit**: Camins formatius de nivell superior (ex: "Iniciació Digital", "Programació").

| Camp | Tipus | Descripció | Regles |
|------|-------|------------|--------|
| id | uuid | PK autogenerat | No tocar |
| slug | text | URL-friendly | Únic, `[a-z0-9-]+`, màx 50 chars |
| title | text | Títol principal | Màx 100 chars, clar i atractiu |
| description | text | Resum del track | Màx 300 chars, què aprendrà l'alumne |
| icon | text | Nom de la icona (Lucide) | Ex: "Shield", "Code", "Brain" |
| color | text | Color tema (hex) | Ex: "#3B82F6" |
| order_index | int | Ordre de visualització | 0, 1, 2... seqüencial |
| active | bool | Visible als alumnes | false = ocult però no esborrat |
| publication_status | text | draft / published | Sempre 'draft' fins revisió humana |
| title_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |
| description_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |

**Exemple d'INSERT**:
```sql
INSERT INTO learning_tracks (slug, title, title_ca, title_es, title_en, title_it, description, description_ca, order_index)
VALUES ('ciberseguretat-basica', 'Ciberseguretat Bàsica', 'Ciberseguretat Bàsica', 'Ciberseguridad Básica', 'Basic Cybersecurity', 'Sicurezza Informatica di Base', 'Aprèn a protegir-te de les amenaces digitals més comunes.', 'Aprèn a protegir-te de les amenaces digitals més comunes.', 3);
```

---

## 3. Taula: learning_modules

**Propòsit**: Blocs temàtics dins un track (ex: "Gestió de Contrasenyes").

| Camp | Tipus | Descripció | Regles |
|------|-------|------------|--------|
| id | uuid | PK autogenerat | No tocar |
| track_id | uuid | FK → learning_tracks.id | Ha d'existir |
| slug | text | URL-friendly | Únic dins el track, `[a-z0-9-]+` |
| title | text | Títol del mòdul | Màx 80 chars |
| description | text | Resum | Màx 250 chars |
| level | text | initiation/basic/intermediate/advanced | Veure PEDAGOGY.md |
| order_index | int | Ordre dins el track | 0, 1, 2... |
| active | bool | Visible | default true |
| publication_status | text | draft / published | default 'draft' per agents |
| title_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |
| description_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |

**Restricció**: Unique(track_id, slug) — no poden haver-hi dos mòduls amb el mateix slug dins un track.

---

## 4. Taula: learning_lessons

**Propòsit**: Sessió individual d'aprenentatge (ex: "Com Crear Contrasenyes Fortes").

| Camp | Tipus | Descripció | Regles |
|------|-------|------------|--------|
| id | uuid | PK autogenerat | No tocar |
| module_id | uuid | FK → learning_modules.id | Ha d'existir |
| slug | text | URL-friendly | Únic dins el mòdul |
| title | text | Títol de la lliçó | Màx 80 chars, acció + objectiu |
| objective | text | Què aprendrà l'alumne | Màx 200 chars, format: "Seràs capaç de..." |
| estimated_minutes | int | Temps estimat | 3-12 minuts (realista!) |
| xp_reward | int | XP al completar | 5-50, proporcional a dificultat |
| order_index | int | Ordre dins el mòdul | 0, 1, 2... |
| active | bool | Visible | default true |
| publication_status | text | draft / published | default 'draft' per agents |
| title_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |
| objective_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |

**Restricció**: Unique(module_id, slug)

**Exemple**:
```sql
INSERT INTO learning_lessons (module_id, slug, title, title_ca, title_es, title_en, title_it, objective, objective_ca, estimated_minutes, xp_reward, order_index)
VALUES (
  '[module_uuid]', 
  'contrasenyes-fortes', 
  'Crear Contrasenyes Fortes', 
  'Crear Contrasenyes Fortes',
  'Crear Contraseñas Fuertes',
  'Create Strong Passwords',
  'Creare Password Forti',
  'Seràs capaç de crear contrasenyes que resisteixin atacs automatitzats sense necessitat de memoritzar-les totes.',
  'Seràs capaç de crear contrasenyes que resisteixin atacs automatitzats sense necessitat de memoritzar-les totes.',
  5, 15, 0
);
```

---

## 5. Taula: learning_steps

**Propòsit**: Pantalla interactiva dins una lliçó (pregunta, exercici, simulació).

| Camp | Tipus | Descripció | Regles |
|------|-------|------------|--------|
| id | uuid | PK autogenerat | No tocar |
| lesson_id | uuid | FK → learning_lessons.id | Ha d'existir |
| type | text | Tipus d'interacció | Veure CONTENT-SCHEMA.md per la llista completa |
| prompt | text | Pregunta o situació | Màx 500 chars (cada idioma) |
| explanation | text | Feedback educatiu | Màx 500 chars (cada idioma) |
| media | jsonb | Recursos visuals | `{ type: 'image'|'video'|'code', url: '...' }` |
| config | jsonb | Configuració tècnica | **Esquema depèn del type** — veure CONTENT-SCHEMA.md |
| order_index | int | Ordre dins la lliçó | 0, 1, 2... |
| publication_status | text | draft / published | default 'draft' |
| prompt_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |
| explanation_ca/es/en/it | text | Traduccions | Sempre omplir les 4 |

**Restricció**: Unique(lesson_id, order_index) — no poden haver-hi dos steps amb el mateix ordre.

**Exemple de config (multiple_choice)**:
```json
{
  "options": [
    { "id": "A", "text": "Usar la mateixa per tot" },
    { "id": "B", "text": "Una frase memorable transformada" },
    { "id": "C", "text": "El teu nom i data de naixement" },
    { "id": "D", "text": "Password123" }
  ],
  "correctAnswer": "B",
  "randomizeOptions": true
}
```

---

## 6. Taules d'Usuari (Només Lectura per Agents)

### learning_attempts
- **No modificar directament** — es crea automàticament quan l'alumne inicia una lliçó.
- Estat: started → completed / needs_review / abandoned.

### learning_step_answers
- **No modificar directament** — es crea quan l'alumne respon un step.
- Conté: answer (jsonb), is_correct (bool), hint_used (bool).

### learning_progress
- **No modificar directament** — actualitzat per triggers/serveis.
- PK compost: (user_id, lesson_id).

### learning_xp_events
- **No modificar directament** — creat per servei de gamificació.

---

## 7. Flux de Treball amb Supabase MCP

### 7.1 Crear Track Nou

```sql
-- 1. Inserir track
INSERT INTO learning_tracks (slug, title, title_ca, title_es, title_en, title_it, description, description_ca, order_index, active, publication_status)
VALUES ('[slug]', '[títol]', '[títol_ca]', '[títol_es]', '[títol_en]', '[títol_it]', '[desc]', '[desc_ca]', [order], true, 'draft')
RETURNING id;

-- 2. Guardar UUID retornat per usar en mòduls
```

### 7.2 Crear Mòdul dins Track

```sql
INSERT INTO learning_modules (track_id, slug, title, title_ca, title_es, title_en, title_it, description, description_ca, level, order_index, active, publication_status)
VALUES ('[track_uuid]', '[slug]', ...)
RETURNING id;
```

### 7.3 Crear Lliçó dins Mòdul

```sql
INSERT INTO learning_lessons (module_id, slug, title, title_ca, title_es, title_en, title_it, objective, objective_ca, objective_es, objective_en, objective_it, estimated_minutes, xp_reward, order_index, active, publication_status)
VALUES ('[module_uuid]', '[slug]', ...)
RETURNING id;
```

### 7.4 Crear Steps dins Lliçó

```sql
INSERT INTO learning_steps (lesson_id, type, prompt, prompt_ca, prompt_es, prompt_en, prompt_it, explanation, explanation_ca, explanation_es, explanation_en, explanation_it, config, media, order_index, publication_status)
VALUES (
  '[lesson_uuid]',
  'multiple_choice',
  '[prompt]', '[prompt_ca]', '[prompt_es]', '[prompt_en]', '[prompt_it]',
  '[explanation]', '[explanation_ca]', '[explanation_es]', '[explanation_en]', '[explanation_it]',
  '{"options": [...], "correctAnswer": "..."}'::jsonb,
  null,
  0,
  'draft'
);
```

---

## 8. Validacions amb Zod (Abans d'INSERT)

Sempre validar amb Zod abans d'enviar a Supabase:

```typescript
import { z } from 'zod';

const StepInsertSchema = z.object({
  lesson_id: z.string().uuid(),
  type: z.enum(['content', 'multiple_choice', 'scenario', 'fill_blank', /* ... */]),
  prompt: z.string().min(10).max(5000),
  config: z.object({
    // Depèn del type — veure CONTENT-SCHEMA.md
  }).optional(),
  order_index: z.number().int().min(0),
});

// Validar
const result = StepInsertSchema.safeParse(data);
if (!result.success) {
  console.error(result.error.errors);
  throw new Error('Invalid step data');
}
```

---

## 9. Consells per a Agents

### 9.1 Reducció de Tokens
- **No** enviïs tot el README cada cop. Usa aquest format curt:
  ```
  Taula: learning_steps
  Tipus: scenario
  Nivell: basic
  Objective: Detectar phishing
  ```
- El sistema coneix ja l'esquema. Només envia el que canvia.

### 9.2 Consistència entre Cursos
- Reutilitza els mateixos termes (no "hacker" en un lloc i "atacant" en un altre).
- Mantén la mateixa profunditat de dificultat per nivell.
- Si un concepte apareix a 2 cursos, copia la mateixa explicació (DRY).

### 9.3 Traduccions Automàtiques
- Genera les 4 traduccions en el mateix prompt per consistència.
- Si un terme tècnic no té traducció (ex: "phishing"), manten-lo en anglès a tots els idiomes.
- Revisa que la longitud sigui similar entre idiomes (evita que una versió sigui 3x més llarga).

### 9.4 Errors Comuns a Evitar
```
❌ No posar publication_status = 'published' directament
   → Sempre 'draft' fins revisió humana

❌ Deixar traduccions buides (null)
   → Omplir amb '' com a mínim, millor amb text real

❌ order_index duplicats
   → Verificar abans d'INSERT

❌ config JSON mal format
   → Validar amb Zod sempre

❌ Referenciar lesson_id que no existeix
   → Usar RETURNING id del pas anterior
```

---

## 10. Estat del Sistema (per Agents)

| Taula | Files | Estat |
|-------|-------|-------|
| learning_tracks | 6 | Actiu (seeds inicials) |
| learning_modules | 7 | Actiu |
| learning_lessons | 9 | Actiu |
| learning_steps | 30 | Actiu |
| learning_attempts | 9 | Dades d'usuaris (no tocar) |

**Límit actual**: Cap. Es pot escalar il·limitadament.
