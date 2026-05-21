# Guia Pedagògica — Qualitat del Contingut Educatiu

## @file docs/learning-agents/PEDAGOGY.md
## @updated 2026-05-21
## @summary Criteris de qualitat i estructura pedagògica per agents generadors de contingut
## @scope Assegurar que tot el contingut educatiu sigui útil, pràctic i ben estructurat

---

## 1. Estructura de la Lliçó (7 Passos)

### 1.1 Introducció (10-15% del temps)
- **Objectiu**: Enganxar l'atenció i contextualitzar.
- **Format**: Situació real breu, problema quotidià, o pregunta provocadora.
- **Exemple bò**:
  > "Aquest matí has rebut un email del teu banc demanant que actualitzis la contrasenya. Sembla urgent. Què fas?"
- **Exemple dolent**:
  > "Avui aprendrem sobre seguretat informàtica. La seguretat informàtica és important."

### 1.2 Concepte (20-25% del temps)
- **Objectiu**: Explicar el concepte de forma clara i simple.
- **Regles**:
  - Màxim 1 concepte nou per step.
  - Usar analogies del món real (mai tècniques sense context).
  - Definir termes complexos amb paraules quotidianes.
- **Exemple bò**:
  > "Un atac de phishing és com un lladre que es disfressa de policia per entrar a casa teva. Sembla legítim, però vol robar-te informació."
- **Exemple dolent**:
  > "El phishing és una tècnica d'enginyeria social que utilitza comunicacions electròniques fraudulentes per obtenir informació confidencial."

### 1.3 Exemple Visual/Pràctic (15-20% del temps)
- **Objectiu**: Mostrar com funciona en la realitat.
- **Regles**:
  - Captures de pantalla reals quan sigui possible.
  - Casos reals (no ficticis genèrics).
  - Mostrar tant l'èxit com l'error.
- **Exemple bò**:
  > [Screenshot d'un email de phishing real] "Fixa't: l'adreça és 'banc-securs.com', no 'banc.com'. La 's' de 'secure' està mal escrita."
- **Exemple dolent**:
  > "Un email de phishing pot tenir errors ortogràfics."

### 1.4 Exercici Interactiu (25-30% del temps)
- **Objectiu**: Practicar el concepte immediatament.
- **Regles**:
  - Situació realista i rellevant.
  - Respostes incorrectes plausibles (no absurdes).
  - Feedback que expliqui el "per què".
- **Exemple bò**:
  > "Reps aquest email. Selecciona tots els indicis que et fan sospitar: [opcions amb indicis reals]"
- **Exemple dolent**:
  > "Què és el phishing? A) Un peix B) Un atac informàtic C) Un virus D) Un firewall"

### 1.5 Validació de Coneixement (10-15% del temps)
- **Objectiu**: Reforçar i detectar falles.
- **Regles**:
  - Pregunta similar però amb variació.
  - Si falla, mostrar pista específica (no repetir explicació sencera).
- **Exemple bò**:
  > "Ara reps un SMS en comptes d'un email. El teu banc et demana que cliquis un enllaç. És diferent del email? Per què?"
- **Exemple dolent**:
  > "Pregunta 2: El phishing és... (mateixa pregunta que abans)"

### 1.6 Resum Final (5-10% del temps)
- **Objectiu**: Consolidar el concepte clau.
- **Regles**:
  - 1-2 frases amb la idea principal.
  - Acció concreta que l'alumne pot aplicar avui.
- **Exemple bò**:
  > "Recorda: Abans de clicar cap enllaç d'un email, verifica sempre l'adreça del remitent i quan dubtis, truca al banc directament."
- **Exemple dolent**:
  > "Resum: Hem après sobre phishing."

### 1.7 Següent Pas (5% del temps)
- **Objectiu**: Connectar amb la següent lliçó.
- **Regles**:
  - Previsualitzar què veurà a continuació.
  - Generar curiositat.
- **Exemple bò**:
  > "Ara ja saps detectar emails falsos. Però què passa si has clicat l'enllaç sense voler? A la següent lliçó aprendràs com reaccionar."
- **Exemple dolent**:
  > "La següent lliçó és sobre seguretat informàtica avançada."

---

## 2. Checklist de Qualitat per Step

### 2.1 Pregunta/Prompt
```
□ És una situació real o molt propera a la realitat?
□ Requereix pensar/analitzar (no només recordar)?
□ És clara i concisa (màxim 4 frases)?
□ No conté spoilers de la resposta?
□ Està adaptada al nivell de dificultat?
```

### 2.2 Opcions de Resposta
```
□ Totes les opcions són plausibles (ningú és obviament absurda)?
□ La resposta correcta requereix comprensió, no sort?
□ Les distractors reflecteixen errors reals que els alumnes cometen?
□ Evitar "Totes les anteriors" / "Cap de les anteriors"?
□ Nombre d'opcions: 3-4 (mai 2)?
```

### 2.3 Feedback/Explicació
```
□ Explica PER QUÉ la correcta és correcta?
□ Explica PER QUÉ cada incorrecta és incorrecta?
□ Dóna una acció concreta que l'alumne pot fer?
□ Manté to positiu ("Prova..." en comptes de "No facis...")?
□ Longitud: 1-3 frases per feedback?
```

---

## 3. Exemples de Transformació

### 3.1 De Dolent a Bo

**Dolent (multiple_choice genèric):**
```
Pregunta: "Què és una VPN?"
A) Un virus
B) Una xarxa privada virtual
C) Un tipus de firewall
D) Un antivirus

Feedback correcta: "Correcte!"
Feedback incorrecta: "Incorrecte."
```

**Bo (scenario pràctic):**
```
Situació: "Treballes des de casa i has de connectar-te al servidor de l'empresa per accedir a arxius confidencials. La teva xarxa Wi-Fi és pública."

Pregunta: "Què hauries de fer abans d'accedir als arxius?"

A) "Connectar-me directament, la xarxa de casa és segura"
   → Incorrecte: Una xarxa pública permet que altres vegin el teu tràfic. És com parlar secrets en una cafeteria plena de gent.

B) "Activar una VPN per xifrar la connexió"
   → Correcte: Una VPN crea un "túnel" xifrat entre tu i l'empresa. És com parlar per un telèfon amb línia segura en comptes de cridar a la cafeteria.

C) "Canviar la contrasenya del Wi-Fi del veí"
   → Incorrecte: Això no soluciona el problema i és il·legal. La seguretat comença per la teva connexió, no la dels altres.

D) "Desactivar el firewall temporalment perquè no interfereixi"
   → Incorrecte: Això deixa el teu ordinador encara més vulnerable. El firewall és com una porta de seguretat: mai no la deixes oberta.
```

### 3.2 De Genèric a Pràctic

**Dolent:**
> "Els passwords han de tenir majúscules, minúscules i números."

**Bo:**
> "Pensa en una frase que recordis fàcilment: 'El meu gos es diu Rocky i té 3 anys'. Agafa la primera lletra de cada paraula i els números: EmgdeRi3a. Resultat: una contrasenya forta que pots recordar sense escriure-la enlloc."

---

## 4. Nivells de Dificultat Detallats

### 4.1 Initiation (Descoberta)
- **Objectiu**: Familiaritzar-se amb el concepte.
- **Step types preferits**: `multiple_choice`, `true_false`
- **Feedback**: Molt guiat, explicacions llargues.
- **Metàfora**: "Et mostro un nou instrument."

### 4.2 Basic (Aplicació)
- **Objectiu**: Aplicar el concepte en situacions directes.
- **Step types preferits**: `multiple_choice`, `scenario`, `fill_blank`
- **Feedback**: Guia la raonament pas a pas.
- **Metàfora**: "Toca les primeres notes d'una cançó simple."

### 4.3 Intermediate (Anàlisi)
- **Objectiu**: Combinar conceptes i raonar.
- **Step types preferits**: `scenario`, `order_steps`, `match_pairs`, `code_choice`
- **Feedback**: Indica on està l'error, però deixa trobar la solució.
- **Metàfora**: "Interpreta una cançó amb acords."

### 4.4 Advanced (Síntesi)
- **Objectiu**: Resoldre problemes oberts.
- **Step types preferits**: `scenario`, `terminal_simulation`, `code_editor`, `security_triage`
- **Feedback**: Minimalista, només verifica resultats.
- **Metàfora**: "Improvisa amb l'estil que has après."

---

## 5. Regles d'Or

1. **Una lliçó = Un concepte clau** (mai barrejant 3 conceptes diferents).
2. **Exemple primer, teoria després** (mai a l'inrevés).
3. **Feedback immediat** (l'alumne sap si va bé abans de continuar).
4. **Errors que ensenyen** (cada resposta incorrecta és una oportunitat d'aprenentatge).
5. **Context sempre** (mai preguntes abstractes sense situació real).

---

## 6. Anti-Patrons (Prohibits)

### 6.1 Preguntes Tipus Quiz Absurd
```
❌ "Quin any va néixer Alan Turing? 1912, 1920, 1930, 1940"
   ✅ "Alan Turing va trencar el codi Enigma durant la WWII. Quina habilitat clau va usar?"
```

### 6.2 Opcions Obviament Dolentes
```
❌ A) "Clicar l'enllaç" B) "Clicar l'enllaç però amb compte" C) "No clicar l'enllaç i trucar al banc" D) "Ignorar l'email i esperar"
   ✅ A) "Clicar l'enllaç" B) "Trucar al banc pel telèfon de la targeta" C) "Reenviar a l'email a un amic" D) "Crear una nova contrasenya però canviar només una lletra"
```

### 6.3 Explicacions Bucles
```
❌ "Incorrecte perquè no és correcte."
   ✅ "Incorrecte perquè els bancs mai demanen contrasenyes per email. Si ho fessin, qualsevol podria robar la teva identitat amb un simple email fals."
```

### 6.4 Contingut Genèric
```
❌ "La seguretat informàtica és important per protegir les dades."
   ✅ "Si uses la mateixa contrasenya per a Facebook i el teu banc, un hacker que aconsegueixi la de Facebook pot buidar el teu compte. Avui aprendràs a crear contrasenyes úniques sense haver-les de memoritzar totes."
```

---

## 7. Guia d'Estil per a Agents

### 7.1 Tons
- **Casual però professional**: "Veuràs que..." en comptes de "L'alumne observarà que..."
- **Directe**: "Fes això" en comptes de "Es recomana fer això"
- **Positiu**: "Prova..." en comptes de "No facis..."

### 7.2 Longituds
- **Prompt/Pregunta**: 20-80 paraules.
- **Explicació**: 30-100 paraules.
- **Feedback**: 15-50 paraules.
- **Resum**: 10-25 paraules.

### 7.3 Format
- Usar **negreta** per conceptes clau (primera vegada que apareixen).
- Usar llistes numerades per procediments.
- Usar llistes amb vinyetes per exemples.
- Evitar paràgrafs de més de 5 línies.
