# BASE DE CONEIXEMENT: AUDITOR SEO I EXPERT EN GOOGLE SEARCH CONSOLE

Aquest document defineix els principis, estratègies i explicacions tècniques que ha d'utilitzar l'agent per actuar com un Auditor SEO expert.

---

## 1. PRINCIPIS FONAMENTALS (EL "PERQUÈ")

### Com funciona Google (Simplificat)
1.  **Rastreig (Crawling):** El robot de Google (Googlebot) descobreix la URL. *Analogia: Google troba el llibre a la biblioteca.*
2.  **Indexació (Indexing):** Google analitza el contingut i decideix si val la pena guardar-lo a la seva base de dades. *Analogia: Google decideix posar el llibre a la prestatgeria.*
3.  **Rànquing (Ranking):** Quan algú cerca, Google ordena els resultats segons la rellevància i autoritat. *Analogia: El bibliotecari recomana el millor llibre per a una pregunta específica.*

### Filosofia White Hat (Ètica)
* **Usuari primer:** No optimitzem per a robots, optimitzem per a persones. Si a l'usuari li agrada, a Google li acabarà agradant.
* **E-E-A-T:** Google valora l'Experiència, Expertise (Coneixement), Autoritat i Trust (Confiança).
* **El "Perquè" de les coses:** Tot canvi SEO ha de tenir una justificació lògica basada en millorar la comprensió del contingut per part de Google o l'experiència de l'usuari.

---

## 2. DOMINANT GOOGLE SEARCH CONSOLE (GSC)

### Informe de Rendiment (Performance)
* **Impressions:** Quantes vegades ha aparegut la teva web als resultats. Si tens moltes impressions però pocs clics, el teu títol no és atractiu.
* **Clics:** Quanta gent ha entrat.
* **CTR (Click Through Rate):** Percentatge de gent que clica (Clics / Impressions). Un CTR baix en posicions alte (Top 3) indica un problema greu de Copywriting (Títol/Descripció).
* **Posició Mitjana:** On surts als resultats.

### Estats d'Indexació (Errors Comuns i Solucions)
* **"Rastrejada: actualment sense indexar":**
    * *El problema:* Google ha vist la pàgina però ha decidit no incloure-la.
    * *La causa habitual:* Contingut de baixa qualitat, contingut duplicat, o la web és massa nova i no té autoritat.
    * *Solució:* Millorar el contingut, afegir enllaços interns cap a aquesta pàgina.
* **"Descoberta: actualment sense indexar":**
    * *El problema:* Google sap que la pàgina existeix però no ha tingut temps (o pressupost de rastreig) per entrar-hi.
    * *La causa habitual:* Problemes de servidor o web gegant amb poc "Crawl Budget".
    * *Solució:* Millorar velocitat de càrrega i assegurar que la pàgina està al Sitemap.
* **Error 404 (Not Found):** La pàgina ja no existeix. Si té trànsit, s'ha de fer una redirecció 301. Si no en té, es pot deixar com està (o fer un 410).

---

## 3. ESTRATÈGIES D'AUDITORIA I CREIXEMENT (ESCALAR POSICIONS)

### Tàctica 1: Els "Quick Wins" (Distància de tir)
* **Què buscar:** Paraules clau on la web està posicionada entre la posició 11 i 20 (Pàgina 2 de Google).
* **Per què:** Google ja considera la web rellevant, però no prou per ser Top 10.
* **Acció:** Ampliar el contingut d'aquella pàgina, afegir un vídeo, millorar la llegibilitat, i aconseguir 1-2 enllaços interns des d'altres articles de la mateixa web.

### Tàctica 2: Optimització de CTR
* **Què buscar:** Pàgines en Top 5 amb un CTR inferior a la mitjana (ex: posició 1 amb menys del 20% de CTR).
* **Per què:** Estem perdent trànsit gratuït que ja tenim "guanyat".
* **Acció:** Reesciure el `Title Tag` (Títol SEO) per fer-lo més cridaner (usar números, preguntes, dates actuals) i la `Meta Description` com una crida a l'acció.

### Tàctica 3: Canibalització de Paraules Clau
* **Què buscar:** Dues URL diferents de la teva web que apareixen per a la mateixa paraula clau a GSC.
* **Per què és dolent:** Les teves pàgines competeixen entre elles i divideixen l'autoritat. Google no sap quina mostrar i sovint les baixa totes dues.
* **Acció:** Triar la millor pàgina i fer una redirecció 301 de la "dolenta" a la "bona", o fusionar els continguts.

### Tàctica 4: Contingut "Zombi" o Decadent
* **Què buscar:** Pàgines que fa 6 mesos tenien trànsit i ara tenen tendència a la baixa.
* **Acció:** Actualitzar la data, afegir informació nova (l'any actual), revisar que els enllaços funcionin i tornar a demanar la indexació a GSC.

---

## 4. BONES PRÀCTIQUES ON-PAGE (ESTRUCTURA)

### Títols i Encapçalaments (H1, H2, H3)
* **H1:** Només un per pàgina. Ha de contenir la paraula clau principal. Explica a Google "de què va això".
* **H2 i H3:** Serveixen per estructurar la lectura. Els usuaris escanegen, no llegeixen. Google utilitza els H2 per entendre els subtemes.

### Enllaçat Intern (Internal Linking)
* **Concepte:** Connectar les pàgines de la teva web entre elles.
* **Per què:** Transfereix autoritat (Link Juice) de les pàgines fortes (Home) a les febles (Articles nous). Ajuda al robot a rastrejar la web.
* **Anchor Text:** El text de l'enllaç ha de ser descriptiu (ex: "veure sabates esportives" és millor que "clica aquí").

### Intenció de Cerca (Search Intent)
Abans de crear o corregir res, pregunta: **Què vol l'usuari?**
1.  **Informacional:** Vol saber coses (Ex: "Com netejar sabates"). Necessita un article guia.
2.  **Transaccional:** Vol comprar (Ex: "Comprar Nike Air"). Necessita una fitxa de producte o categoria.
*Error comú:* Intentar posicionar una botiga quan l'usuari busca informació.

---

## 5. RECOMANACIONS TÈCNIQUES BÀSIQUES

* **Sitemaps:** L'arxiu `sitemap.xml` és el mapa que donem a Google. Ha d'estar net (només URLs que volem indexar, sense errors 404 ni redireccions).
* **Velocitat (Core Web Vitals):** Una web lenta frustra l'usuari. Si l'usuari marxa ràpid (rebost), Google entén que la web no agrada i la baixa de posició.
* **Mobile First:** Google rastreja la versió mòbil de la teva web. Si es veu malament al mòbil, no posicionaràs bé, encara que a l'ordinador sigui preciosa.