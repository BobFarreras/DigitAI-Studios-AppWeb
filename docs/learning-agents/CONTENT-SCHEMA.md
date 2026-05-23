# Content Schema — Esquema de Contingut per Agents

## @file docs/learning-agents/CONTENT-SCHEMA.md
## @updated 2026-05-21
## @summary Esquemes Zod i definicions de tipus per a contingut educatiu
## @scope Contracte de dades entre agents i base de dades

---

## 1. Tipus de Step (Interaccions)

```typescript
export type LearningStepType =
  | 'content'              // Contingut educatiu visual (markdown enriquit)
  | 'multiple_choice'      // Una resposta correcta entre 4 opcions
  | 'multi_select'         // Múltiples respostes correctes
  | 'true_false'          // Cert/Fals amb justificació
  | 'order_steps'          // Ordenar procediments cronològicament
  | 'match_pairs'          // Relacionar conceptes de dues columnes
  | 'fill_blank'           // Completar buits en codi o text
  | 'code_choice'          // Triar el snippet de codi correcte
  | 'scenario'             // Cas real que requereix anàlisi i decisió
  | 'terminal_simulation'  // Escriure comandes de terminal
  | 'network_diagram'      // Diagnosticar problemes de xarxa
  | 'code_editor'          // Escriure/debuggar codi
  | 'ai_prompt_review'     // Avaluar i millorar prompts d'IA
  | 'security_triage';     // Prioritzar incidents de seguretat
```

---

## 1.1 Tipus `content` — Contingut Educatiu Visual

El tipus `content` renderitza text enriquit amb suport per markdown, placeholders d'imatge/vídeo, i enllaços externs. **No requereix resposta de l'usuari** — botó "Següent" avança automàticament.

### Sintaxi suportada al camp `prompt`:

| Sintaxi | Descripció | Exemple |
|---------|-----------|---------|
| `## Títol` | Encapçalament de secció (verd, icona Zap) | `## Windows 11: Introducció` |
| `**text**` | Negreta (verd `#58cc02`) | `**important**` |
| `*text*` | Cursiva (blau `#1cb0f6`) | `*nota*` |
| `` `codi` `` | Codi inline (fons fosc) | `` `tpm.msc` `` |
| `[text](url)` | Enllaç extern amb icona | `[Microsoft](https://microsoft.com)` |
| `1. text` | Llista numerada amb animació | `1. Primer pas` |
| `- text` | Llista amb vinyetes | `- Element` |
| `! text` | Avís/alerta (fons groc, icona ⚠️) | `! Sense TPM no funciona` |
| `? text` | Tip/consell (fons blau, icona 💡) | `? Per instal·lacions massives usa MDT` |
| `> text` | Drecera de teclat (fons negre, icona ⌨️) | `> Win + R: Executar` |
| `$ text` | Terminal/CMD (fons negre, text verd) | `$ ipconfig /all` |
| `!{descripció}` | Placeholder d'imatge (requadre puntejat) | `!{Captura de l'escriptori W11}` |
| `!v{descripció}` | Placeholder de vídeo (requadre puntejat) | `!v{Tutorial d'instal·lació}` |
| `@ [{...}]` | Diagrama de flux interactiu (JSON) | `@ [{"title":"Pas 1",...}]` |

### Config:
```json
{}
```
(El tipus `content` no requereix config — el contingut va íntegrament al `prompt`.)

### Media (opcional):
```json
{
  "type": "image",
  "url": "https://example.com/imatge.png",
  "alt": "Descripció de la imatge"
}
```
O per vídeo:
```json
{
  "type": "video",
  "url": "https://example.com/video.mp4",
  "poster": "https://example.com/thumbnail.jpg",
  "alt": "Descripció del vídeo"
}
```

### Exemple de prompt complet:
```
## Instal·lació de Windows 11

Segueix aquests passos per instal·lar Windows 11:

1. Descarrega la ISO des del [web oficial](https://microsoft.com)
2. Crea un USB amb [Rufus](https://rufus.ie)
3. Configura la BIOS per arrencar des de USB

! Sense TPM 2.0 no podràs continuar

!{Esquema del procés d'instal·lació}

$ diskpart
$ list disk
$ convert gpt

? Per instal·lacions massives, considera usar MDT.
```

### Estructura recomanada per lliçó:
```
Lliçó:
  Step 0: content — Introducció i conceptes
  Step 1: content — Detall tècnic (versions, requisits, passos)
  Step 2: content — Guia pràctica pas a pas
  Step 3: exercici — Validació de comprensió
  Step 4: exercici — Aplicació pràctica
  Step 5: exercici — Reforç addicional
```

---

## 2. Estructura Config per Tipus

### 2.1 multiple_choice
```json
{
  "options": [
    { "id": "A", "text": "Text de l'opció A" },
    { "id": "B", "text": "Text de l'opció B" },
    { "id": "C", "text": "Text de l'opció C" },
    { "id": "D", "text": "Text de l'opció D" }
  ],
  "correctAnswer": "A",
  "randomizeOptions": true  // Opcional: barrejar ordre
}
```

### 2.2 multi_select
```json
{
  "options": [
    { "id": "A", "text": "Opció A" },
    { "id": "B", "text": "Opció B" },
    { "id": "C", "text": "Opció C" },
    { "id": "D", "text": "Opció D" }
  ],
  "correctAnswers": ["A", "C"],
  "minSelections": 1,
  "maxSelections": 3
}
```

### 2.3 true_false
```json
{
  "statement": "Afirmació a avaluar",
  "isCorrect": false,
  "explanationIfTrue": "Per què és cert...",
  "explanationIfFalse": "Per què és fals..."
}
```

### 2.4 order_steps
```json
{
  "items": [
    { "id": "1", "text": "Primer pas" },
    { "id": "2", "text": "Segon pas" },
    { "id": "3", "text": "Tercer pas" },
    { "id": "4", "text": "Quart pas" }
  ],
  "correctOrder": ["1", "2", "3", "4"]
}
```

### 2.5 match_pairs
```json
{
  "leftItems": [
    { "id": "1", "text": "Concepte A" },
    { "id": "2", "text": "Concepte B" },
    { "id": "3", "text": "Concepte C" }
  ],
  "rightItems": [
    { "id": "a", "text": "Definició A" },
    { "id": "b", "text": "Definició B" },
    { "id": "c", "text": "Definició C" }
  ],
  "correctPairs": [
    { "leftId": "1", "rightId": "a" },
    { "leftId": "2", "rightId": "b" },
    { "leftId": "3", "rightId": "c" }
  ]
}
```

### 2.6 fill_blank
```json
{
  "template": "La funció {blank1} serveix per {blank2} en JavaScript.",
  "blanks": [
    { "id": "blank1", "correctAnswer": "map", "acceptVariations": ["Map", "MAP"] },
    { "id": "blank2", "correctAnswer": "transformar arrays", "acceptVariations": ["transformar", "modificar arrays"] }
  ],
  "caseSensitive": false,
  "allowPartialCredit": true
}
```

### 2.7 code_choice
```json
{
  "codeSnippets": [
    { "id": "A", "code": "const x = 1; console.log(x);" },
    { "id": "B", "code": "let x = 1; console.log(x);" },
    { "id": "C", "code": "var x = 1; console.log(x);" }
  ],
  "correctAnswer": "B",
  "question": "Quin snippet usa la declaració més moderna i segura?"
}
```

### 2.8 scenario
```json
{
  "situation": "Reps un email del teu banc demanant que actualitzis la contrasenya...",
  "question": "Què hauries de fer?",
  "options": [
    { "id": "A", "text": "Clicar l'enllaç i actualitzar la contrasenya" },
    { "id": "B", "text": "Trucar al banc directament pel telèfon oficial" },
    { "id": "C", "text": "Respondre l'email demanant més informació" },
    { "id": "D", "text": "Reenviar l'email al teu gestor de confiança" }
  ],
  "correctAnswer": "B",
  "difficulty": "basic",
  "category": "phishing",
  "hints": ["Fixa't en l'adreça del remitent", "Els bancs mai demanen contrasenyes per email"]
}
```

### 2.9 terminal_simulation
```json
{
  "scenario": "Necessites llistar tots els fitxers d'un directori incloent els ocults.",
  "expectedCommand": "ls -la",
  "acceptVariations": ["ls -a -l", "ls -al"],
  "workingDirectory": "/home/user",
  "availableCommands": ["ls", "cd", "pwd"],
  "caseSensitive": false
}
```

### 2.10 network_diagram
```json
{
  "topology": "3-machines",
  "machines": [
    { "id": "A", "name": "Client", "ip": "192.168.1.10" },
    { "id": "B", "name": "Router", "ip": "192.168.1.1" },
    { "id": "C", "name": "Servidor", "ip": "192.168.1.20" }
  ],
  "problem": "El Client no pot arribar al Servidor",
  "symptoms": ["Ping a B funciona", "Ping a C falla"],
  "correctDiagnosis": "El Router B no encamina correctament cap a C"
}
```

### 2.11 code_editor
```json
{
  "language": "javascript",
  "initialCode": "function suma(a, b) {\n  // Completa aquí\n}",
  "expectedOutput": "La funció ha de retornar a + b",
  "testCases": [
    { "input": "suma(2, 3)", "expected": "5" },
    { "input": "suma(-1, 1)", "expected": "0" }
  ],
  "allowedLanguages": ["javascript", "typescript", "python"]
}
```

### 2.12 ai_prompt_review
```json
{
  "userPrompt": "Escriu un email professional demanant vacances",
  "evaluationCriteria": [
    { "id": "clarity", "weight": 0.3, "description": "El prompt és clar i específic" },
    { "id": "context", "weight": 0.3, "description": "Inclou context necessari" },
    { "id": "format", "weight": 0.2, "description": "Especifica format de sortida" },
    { "id": "tone", "weight": 0.2, "description": "Menciona to desitjat" }
  ],
  "improvedVersion": "Escriu un email professional (300 paraules) al meu cap demanant 5 dies de vacances del 15 al 19 de juliol. Tono respectuós però directe. Inclou un pla de cobertura de les meves tasques."
}
```

### 2.13 security_triage
```json
{
  "incidents": [
    { "id": "INC-001", "severity": "critical", "type": "ransomware", "affectedSystems": ["DB-PROD", "FILE-SERVER"], "description": "Xifrat de bases de dades producció" },
    { "id": "INC-002", "severity": "medium", "type": "phishing", "affectedSystems": ["EMAIL"], "description": "Campanya de phishing massiu detectada" },
    { "id": "INC-003", "severity": "low", "type": "policy_violation", "affectedSystems": ["VPN"], "description": "Accés VPN fora d'horari habitual" }
  ],
  "correctOrder": ["INC-001", "INC-002", "INC-003"],
  "justificationRequired": true
}
```

---

## 3. Esquema Zod per Validació

```typescript
import { z } from 'zod';

export const LearningStepConfigSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('multiple_choice'),
    options: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
    correctAnswer: z.string(),
    randomizeOptions: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('scenario'),
    situation: z.string().min(20),
    question: z.string(),
    options: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
    correctAnswer: z.string(),
    difficulty: z.enum(['initiation', 'basic', 'intermediate', 'advanced']),
    category: z.string(),
    hints: z.array(z.string()).optional(),
  }),
  // ... altres tipus
]);

export const LearningLessonSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3).max(100),
  objective: z.string().min(10).max(500),
  estimatedMinutes: z.number().int().min(1).max(60),
  xpReward: z.number().int().min(5).max(100),
  orderIndex: z.number().int().min(0),
  steps: z.array(LearningStepConfigSchema).min(1),
});
```

---

## 4. Metadades per Lliçó

Cada lliçó ha de tenir aquestes metadades:

```typescript
export type LessonMetadata = {
  // Identificació
  id: string;                    // UUID generat per Supabase
  slug: string;                  // URL-friendly (ex: "gestio-contrasenyes")
  
  // Jerarquia
  trackId: string;               // ID del track pare
  moduleId: string;              // ID del mòdul pare
  orderIndex: number;            // Posició dins el mòdul (0, 1, 2...)
  
  // Contingut
  title: string;                // Títol principal
  objective: string;            // Què aprendrà l'alumne (SMART)
  
  // Gamificació
  estimatedMinutes: number;     // Temps estimat (realista!)
  xpReward: number;            // XP al completar (proporcional a dificultat)
  
  // Dificultat i prerequisits
  difficulty: 'initiation' | 'basic' | 'intermediate' | 'advanced';
  prerequisites: string[];      // Array de lesson_slugs necessaris
  
  // Estat
  publicationStatus: 'draft' | 'published';
  active: boolean;
  
  // Traduccions
  title_ca: string;
  title_es: string;
  title_en: string;
  title_it: string;
  objective_ca: string;
  objective_es: string;
  objective_en: string;
  objective_it: string;
};
```

---

## 5. Criteris de Dificultat

| Nivell | Característiques | XP Base | Temps Estimat |
|--------|-----------------|---------|---------------|
| `initiation` | Concepte nou, molta guia, exemples visuals simples | 5-10 | 2-4 min |
| `basic` | Aplicació directa, 1 concepte per step | 10-20 | 3-5 min |
| `intermediate` | Combinació de conceptes, requereix raonament | 20-35 | 5-8 min |
| `advanced` | Problemes oberts, múltiples solucions possibles | 35-50 | 8-12 min |

---

## 6. Exemple Complet d'una Lliçó

Veure `TEMPLATES.md` per a plantilles completes de cada tipus.
