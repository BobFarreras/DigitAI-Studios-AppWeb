# Plantilles de Contingut — Templates per Agents

## @file docs/learning-agents/TEMPLATES.md
## @updated 2026-05-21
## @summary Plantilles JSON completes per cada tipus de step interactiu
## @scope Agents poden copiar, adaptar i reutilitzar aquestes plantilles

---

## Com usar aquest document

1. **Tria el tipus de step** que necessites.
2. **Copia la plantilla JSON**.
3. **Substitueix els valors** entre `[corchetes]`.
4. **Valida amb Zod** abans d'inserir a la BD.

---

## Plantilla: content (Contingut Visual)

```json
{
  "type": "content",
  "prompt": "## [Títol de la secció]\n\nText introductori amb **conceptes clau en negreta** i *detalls en cursiva*.\n\n1. Primer pas del procediment\n2. Segon pas amb [enllaç extern](https://example.com)\n3. Tercer pas\n\n- Punt clau a recordar\n- Altre punt important\n\n! Avís o advertència important\n\n? Consell o tip professional\n\n$ comandament terminal\n\n!{Descripció de la imatge que aniria aquí}\n\n!v{Descripció del vídeo que aniria aquí}",
  
  "prompt_ca": "[Versió catalana]",
  "prompt_es": "[Versió espanyola]",
  "prompt_en": "[Versió anglesa]",
  "prompt_it": "[Versió italiana]",
  
  "explanation": null,
  "explanation_ca": null,
  "explanation_es": null,
  "explanation_en": null,
  "explanation_it": null,
  
  "config": {},
  
  "media": {
    "type": "image",
    "url": "https://example.com/imatge.png",
    "alt": "Descripció de la imatge"
  }
}
```

> **Nota:** El tipus `content` no requereix resposta. El botó mostra "Següent" i avança automàticament. Usa `!{desc}` i `!v{desc}` com a placeholders per quan tinguis imatges/vídeos reals, i `[text](url)` per enllaços externs.

---

## Plantilla: multiple_choice (Concepte Simple)

```json
{
  "type": "multiple_choice",
  "prompt": "[Situació breu i realista. Màxim 3 frases. Contextualitza el problema.]",
  "prompt_ca": "[Versió catalana]",
  "prompt_es": "[Versió espanyola]",
  "prompt_en": "[Versió anglesa]",
  "prompt_it": "[Versió italiana]",
  
  "explanation": "[Explicació del concepte clau. 2-3 frases. Per què importa?]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "options": [
      { "id": "A", "text": "[Opció correcta — requereix comprensió]" },
      { "id": "B", "text": "[Distractor plausible — error comú]" },
      { "id": "C", "text": "[Distractor — confusió parcial]" },
      { "id": "D", "text": "[Distractor — temptador però incorrecte]" }
    ],
    "correctAnswer": "A",
    "randomizeOptions": true
  },
  
  "media": {
    "type": "none",
    "url": null
  }
}
```

---

## Plantilla: scenario (Cas Real de Decisió)

```json
{
  "type": "scenario",
  "prompt": "[Context: Qui ets, on ets, què ha passat. 3-4 frases. Sensació d'urgència o rellevància.]\n\n[Pregunta: Què fas? Opcions de resposta.]",
  "prompt_ca": "[Versió catalana]",
  "prompt_es": "[Versió espanyola]",
  "prompt_en": "[Versió anglesa]",
  "prompt_it": "[Versió italiana]",
  
  "explanation": "[Per què la correcta és correcta: raonament pas a pas.]\n\n[Per què cada incorrecta és incorrecta: error específic que es comet.]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "situation": "[Resum de la situació per al codi]",
    "question": "[Pregunta clara]",
    "options": [
      { "id": "A", "text": "[Resposta correcta]" },
      { "id": "B", "text": "[Distractor: acció temptadora però perillosa]" },
      { "id": "C", "text": "[Distractor: acció parcialment correcta però incompleta]" },
      { "id": "D", "text": "[Distractor: acció que empitjora el problema]" }
    ],
    "correctAnswer": "A",
    "difficulty": "[basic|intermediate|advanced]",
    "category": "[phishing|malware|social_engineering|passwords|networking|etc]",
    "hints": [
      "[Pista 1: Orienta sense donar la resposta]",
      "[Pista 2: Més específica si la primera no ajuda]"
    ]
  }
}
```

---

## Plantilla: fill_blank (Completar Codi/Comandes)

```json
{
  "type": "fill_blank",
  "prompt": "Completa el següent [llenguatge] per [objectiu concret].",
  "prompt_ca": "Completa el següent [llenguatge] per [objectiu concret].",
  "prompt_es": "Completa el siguiente [lenguaje] para [objetivo concreto].",
  "prompt_en": "Complete the following [language] to [specific objective].",
  "prompt_it": "Completa il seguente [linguaggio] per [obiettivo specifico].",
  
  "explanation": "[Explicació de per què cada blank és el que és. Concepte clau.]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "template": "[Text amb {blank1}, {blank2}...]",
    "blanks": [
      {
        "id": "blank1",
        "correctAnswer": "[resposta exacta]",
        "acceptVariations": ["[variació 1]", "[variació 2]"]
      }
    ],
    "caseSensitive": false,
    "allowPartialCredit": true
  },
  
  "media": {
    "type": "code_block",
    "language": "[javascript|python|bash|sql|etc]"
  }
}
```

---

## Plantilla: order_steps (Procediment)

```json
{
  "type": "order_steps",
  "prompt": "[Context: Quin procediment seguim?] Ordena els següents passos per [objectiu].",
  "prompt_ca": "[Context] Ordena els següents passos per [objectiu].",
  "prompt_es": "[Context] Ordena los siguientes pasos para [objetivo].",
  "prompt_en": "[Context] Order the following steps to [objective].",
  "prompt_it": "[Context] Ordina i seguenti passi per [obiettivo].",
  
  "explanation": "[Per què aquest ordre és l'únic correcte. Conseqüències de fer-ho malament.]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "items": [
      { "id": "1", "text": "[Primer pas lògic]" },
      { "id": "2", "text": "[Segon pas lògic]" },
      { "id": "3", "text": "[Tercer pas lògic]" },
      { "id": "4", "text": "[Quart pas lògic]" }
    ],
    "correctOrder": ["1", "2", "3", "4"]
  }
}
```

---

## Plantilla: terminal_simulation (Comandes)

```json
{
  "type": "terminal_simulation",
  "prompt": "[Situació: Què necessites fer? Escriu la comanda.]",
  "prompt_ca": "[Situació] Escriu la comanda.",
  "prompt_es": "[Situación] Escribe el comando.",
  "prompt_en": "[Situation] Type the command.",
  "prompt_it": "[Situazione] Scrivi il comando.",
  
  "explanation": "[Per què aquesta comanda. Què fa cada flag/paràmetre.]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "scenario": "[Descripció tècnica del problema]",
    "expectedCommand": "[comanda - esperada]",
    "acceptVariations": ["[variació 1]", "[variació 2]"],
    "workingDirectory": "/[directori]",
    "availableCommands": ["[comanda1]", "[comanda2]"],
    "caseSensitive": false
  }
}
```

---

## Plantilla: security_triage (Prioritzar Incidents)

```json
{
  "type": "security_triage",
  "prompt": "[Context: Ets l'encarregat de seguretat. Ha arribat aquestes incidències.] Classifica-les per ordre de prioritat d'actuació.",
  "prompt_ca": "[Context] Classifica per prioritat.",
  "prompt_es": "[Context] Clasifica por prioridad.",
  "prompt_en": "[Context] Classify by priority.",
  "prompt_it": "[Context] Classifica per priorità.",
  
  "explanation": "[Per què aquest ordre. Criteris: impacte, urgència, propagació.]",
  "explanation_ca": "[Versió catalana]",
  "explanation_es": "[Versió espanyola]",
  "explanation_en": "[Versió anglesa]",
  "explanation_it": "[Versió italiana]",
  
  "config": {
    "incidents": [
      {
        "id": "INC-001",
        "severity": "[critical|high|medium|low]",
        "type": "[ransomware|phishing|data_breach|dos|etc]",
        "affectedSystems": ["[sistema1]", "[sistema2]"],
        "description": "[Descripció breu]"
      }
    ],
    "correctOrder": ["INC-001", "INC-002"],
    "justificationRequired": true
  }
}
```

---

## Plantilla Complet: Lliçó Exemple

```json
{
  "lesson": {
    "slug": "deteccio-phishing-email",
    "title": "Detectar Phishing en Emails",
    "title_ca": "Detectar Phishing en Emails",
    "title_es": "Detectar Phishing en Emails",
    "title_en": "Detect Phishing in Emails",
    "title_it": "Rilevare Phishing nelle Email",
    
    "objective": "Ser capaç d'identificar 5 indicis d'un email de phishing en menys de 30 segons.",
    "objective_ca": "Ser capaç d'identificar 5 indicis d'un email de phishing en menys de 30 segons.",
    "objective_es": "Ser capaz de identificar 5 indicios de un email de phishing en menos de 30 segundos.",
    "objective_en": "Be able to identify 5 signs of a phishing email in under 30 seconds.",
    "objective_it": "Essere in grado di identificare 5 segnali di phishing in meno di 30 secondi.",
    
    "estimatedMinutes": 5,
    "xpReward": 15,
    "difficulty": "basic",
    "prerequisites": ["contrasenyes-segures"]
  },
  
  "steps": [
    {
      "orderIndex": 0,
      "type": "multiple_choice",
      "prompt": "Acabes de rebre un email del teu banc. L'assumpte diu 'URGENT: Actualitza la teva contrasenya ara'. Quin és el primer indici que et fa sospitar?",
      "explanation": "Els bancs legítims mai et demanaran actualitzar la contrasenya per email. Aquesta urgència artificial és una tècnica psicològica per fer-te actuar sense pensar.",
      "config": {
        "options": [
          { "id": "A", "text": "L'email demana actualitzar la contrasenya" },
          { "id": "B", "text": "L'assumpte diu 'URGENT' en majúscules" },
          { "id": "C", "text": "Ve del teu banc habitual" },
          { "id": "D", "text": "Té el logo del banc" }
        ],
        "correctAnswer": "A"
      }
    },
    {
      "orderIndex": 1,
      "type": "scenario",
      "prompt": "Mires l'adreça del remitent: 'seguretat@banc-nacional.com'. Sembla oficial. Però quan passes el ratolí per l'enllaç 'Actualitzar Contrasenya', veus que apunta a 'banc-secure-update.net'.\n\nQuè fas?",
      "explanation": "L'adreça del remitent es pot falsificar (spoofing). L'enllaç real és l'únic indic fiable. Si l'URL no coincideix amb el domini oficial del banc, és phishing.",
      "config": {
        "situation": "Email de banc amb enllaç sospitós",
        "question": "Què fas davant aquesta situació?",
        "options": [
          { "id": "A", "text": "Clicar l'enllaç perquè el remitent sembla oficial" },
          { "id": "B", "text": "Trucar al banc pel telèfon de la targeta (revers)" },
          { "id": "C", "text": "Respondre l'email demanant confirmació" },
          { "id": "D", "text": "Reenviar l'email a un amic perquè opini" }
        ],
        "correctAnswer": "B",
        "difficulty": "basic",
        "category": "phishing"
      }
    }
  ]
}
```

---

## Consells per a l'Adaptació de Plantilles

1. **Mantén l'estructura JSON** — els camps són obligatoris per al sistema.
2. **Personalitza el contingut** — adapta a la teva matèria específica.
3. **Tradueix simultàniament** — genera ca/es/en/it alhora per consistència.
4. **Prova la lògica** — assegura't que la resposta correcta realment és l'única vàlida.
5. **Revisa els distractors** — han de ser temptadors però clarament incorrectes sota anàlisi.
