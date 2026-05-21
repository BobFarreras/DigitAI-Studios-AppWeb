# Pla Mestre de Cursos — Roadmap Pedagogic

## @file docs/learning-agents/COURSE-ROADMAP.md
## @updated 2026-05-21
## @summary Estructura completa de tracks, moduls i objectius d'aprenentatge
## @scope Pla validable per humans abans de generar contingut massiu

---

## Track 1: Iniciacio Digital

**Objectiu general**: Adquirir competencies digitals basiques per navegar amb seguretat i eficiencia.

**Habilitats adquirides**:
- Identificar i evitar amenaces digitals comunes
- Gestiona identitats i contrasenyes de forma segura
- Navegar per internet de forma critica
- Configurar dispositius amb seguretat basica

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 1.1 | Navegacio Segura | initiation | Entendre riscos de navegacio i protegir-se | Cap | 3 |
| 1.2 | Gestio de Contrasenyes | basic | Crear i gestionar contrasenyes robustes | 1.1 | 3 |
| 1.3 | Identitat Digital | basic | Comprendre rastre digital i privacitat | 1.2 | 2 |
| 1.4 | Comunicacio Segura | basic | Usar email i missatgeria de forma segura | 1.3 | 3 |

---

## Track 2: Sistemes Informatics

**Objectiu general**: Entendre components basics de sistemes i xarxes.

**Habilitats adquirides**:
- Diagnosticar problemes basics de hardware
- Entendre arquitectura client-servidor
- Fer diagnostic de xarxa basic
- Gestionar fitxers i permisos

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 2.1 | Hardware Basic | initiation | Identificar components principals | Cap | 3 |
| 2.2 | Sistemes Operatius | basic | Navegar i configurar SO | 2.1 | 4 |
| 2.3 | Xarxes: Fonaments | basic | Entendre IP, DNS, router | 2.2 | 4 |
| 2.4 | Terminal Inicial | basic | Usar comandes basiques | 2.3 | 3 |

---

## Track 3: Programacio

**Objectiu general**: Escriure codi funcional i entendre logica de programacio.

**Habilitats adquirides**:
- Escriure funcions i condicionals
- Manipular dades (JSON, arrays)
- Debuggar errors basics
- Entendre APIs i crides HTTP

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 3.1 | Variables i Tipus | initiation | Entendre dades i variables | Cap | 3 |
| 3.2 | Condicionals | basic | Prendre decisions amb codi | 3.1 | 3 |
| 3.3 | Funcions | basic | Reutilitzar codi amb funcions | 3.2 | 3 |
| 3.4 | Arrays i Objectes | intermediate | Manipular colleccions de dades | 3.3 | 3 |
| 3.5 | APIs i JSON | intermediate | Consumir serveis externs | 3.4 | 2 |

---

## Track 4: IA Aplicada

**Objectiu general**: Utilitzar IA de forma efectiva i etica.

**Habilitats adquirides**:
- Escriure prompts que generin respostes utils
- Avaluar respostes d'IA (fact-checking)
- Automatitzar tasques repetitives amb IA
- Entendre limits i biaixos de l'IA

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 4.1 | Que es un LLM | initiation | Entendre funcionament basic | Cap | 2 |
| 4.2 | Prompts Efectius | basic | Escriure prompts clars i especifics | 4.1 | 3 |
| 4.3 | Verificacio i Fets | basic | Validar informacio generada per IA | 4.2 | 2 |
| 4.4 | Automatitzacio amb IA | intermediate | Crear fluxos de treball amb IA | 4.3 | 3 |

---

## Track 5: Automatitzacions

**Objectiu general**: Connectar serveis i automatitzar processos.

**Habilitats adquirides**:
- Crear triggers i actions
- Configurar webhooks
- Integrar CRM/email/WhatsApp
- Diagnosticar errors en automatitzacions

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 5.1 | Conceptes d'Automatitzacio | initiation | Entendre triggers i actions | Cap | 2 |
| 5.2 | Webhooks | basic | Connectar serveis amb webhooks | 5.1 | 3 |
| 5.3 | Integracions CRM/Email | intermediate | Sincronitzar dades entre plataformes | 5.2 | 3 |
| 5.4 | Errors i Logs | intermediate | Diagnosticar i solucionar problemes | 5.3 | 2 |

---

## Track 6: Ciberseguretat

**Objectiu general**: Protegir persones i sistemes de amenaces digitals.

**Habilitats adquirides**:
- Identificar i classificar amenaces
- Aplicar mesures de proteccio basiques
- Respondre a incidents de seguretat
- Entendre principis de minim privilegi

| # | Modul | Nivell | Objectiu | Prerequisits | Llicons Estimades |
|---|-------|--------|----------|--------------|-------------------|
| 6.1 | Amenaces Comunes | basic | Identificar malware, phishing, etc. | Cap | 3 |
| 6.2 | Atacs i Defenses | intermediate | Entendre vectors d'atac i proteccions | 6.1 | 4 |
| 6.3 | Resposta a Incidents | intermediate | Actuar davant una brecha de seguretat | 6.2 | 3 |
| 6.4 | Seguretat Avancada | advanced | Implementar defenses multicapa | 6.3 | 3 |

---

## Estructura de Cada Llico (Plantilla)

Titol: [Accio] + [Objectiu]
  Ex: "Detectar Emails de Phishing"
  
Objectiu SMART:
  "Seras capaç de [accio] en [condicio] amb [criteri]"
  Ex: "Seras capaç d'identificar 5 indicis de phishing en qualsevol email en menys de 30 segons"
  
Steps (3-7 per llico):
  1. Introduccio: Situacio real que contextualitza
  2. Concepte: Explicacio clara amb analogia
  3. Exemple: Captura/cas real
  4. Exercici: Practica interactiva
  5. Validacio: Reforç amb variacio
  6. Resum: Idea clau a recordar
  7. Seguent pas: Transicio a seguent llico
  
XP: [5-50 segons dificultat]
Temps: [3-12 minuts realistes]
Dificultat: [initiation|basic|intermediate|advanced]

---

## Progres Acumulatiu

| Track | Moduls | Llicons Est. | XP Total Est. | Temps Total Est. |
|-------|--------|--------------|---------------|------------------|
| Iniciacio Digital | 4 | 11 | 110 | ~55 min |
| Sistemes Informatics | 4 | 14 | 180 | ~75 min |
| Programacio | 5 | 14 | 280 | ~90 min |
| IA Aplicada | 4 | 10 | 200 | ~65 min |
| Automatitzacions | 4 | 10 | 220 | ~65 min |
| Ciberseguretat | 4 | 13 | 350 | ~100 min |
| **TOTAL** | **25** | **72** | **~1340 XP** | **~7.5 hores** |

---

## Nivell de l'Alumne per XP Acumulat

| Nivell | XP Necessari | Icona | Color |
|--------|-------------|-------|-------|
| 1 | 0-100 | [planta petita] | #22C55E |
| 2 | 100-300 | [planta] | #16A34A |
| 3 | 300-600 | [arbre] | #15803D |
| 4 | 600-1000 | [foc] | #EA580C |
| 5 | 1000-1500 | [estrella] | #CA8A04 |
| 6 | 1500-2000 | [trofeu] | #A16207 |
| 7 | 2000+ | [corona] | #7C2D12 |

---

## Validacio Humana Requerida

Abans de generar contingut massiu, validar:

- [ ] Ordre dels tracks es logic (dificultat creixent)
- [ ] Prerequisits formen un graf aciclic (DAG)
- [ ] Cada modul te entre 2-5 llicons (ni massa poc ni massa)
- [ ] XP totals son coherents amb temps estimat
- [ ] Tots els noms son clarificadors (no generics)
- [ ] Objectius son SMART (especifics, mesurables)
- [ ] Existeix progressio de initiation -> advanced dins cada track
- [ ] No hi ha solapament excessive entre tracks

---

## Flux de Validacio

1. **Fase 1 — Estructura**: Validar aquest roadmap (COURSE-ROADMAP.md)
2. **Fase 2 — Prototip**: Crear 1 llico completa de cada track (6 total)
3. **Fase 3 — Prova**: Usuaris reals fan les 6 llicons i donen feedback
4. **Fase 4 — Ajust**: Corregir estructura i plantilles basat en feedback
5. **Fase 5 — Generacio**: Agents generen contingut massiu amb les plantilles validades

**IMPORTANT**: No passar a Fase 5 fins que Fase 1-4 estiguin completades i aprovades.
