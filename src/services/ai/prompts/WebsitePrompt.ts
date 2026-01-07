import { SectorConfig } from "@/types/sectors";

export class WebsitePrompt {
    /**
     * Genera el prompt mestre per a la creació de contingut web.
     * Centralitza tota l'enginyeria de prompts en un sol lloc.
     */
    static build(name: string, desc: string, config: SectorConfig): string {
        return `
      ACTUA COM: Un Copywriter sènior especialitzat en Branding i Vendes.
      OBJECTIU: Crear els textos per a la nova web del negoci "${name}".
      IDIOMA: CATALÀ Natiu (persuasiu, natural, sense faltes).

      CONTEXT DEL NEGOCI:
      - Nom: "${name}"
      - Descripció Original: "${desc}"
      - Sector: ${config.key}
      - Personalitat de Marca: ${config.aiPersona}

      🛑 REGLES D'OR (STRICT MODE):
      1. PROHIBIT fer servir clixés buits.
      2. SIGUES ESPECÍFIC: Inventa detalls plausibles basats en el sector.
      3. BENEFICIS > CARACTERÍSTIQUES.

      INSTRUCCIONS PER SECCIÓ:

      1. HERO: Title (ganxo fort), Subtitle (proposta valor), Image Prompt (English).
      2. ABOUT: Badge, Title, Description (storytelling), Stats (mètriques creatives, NO "anys/clients").
      3. SERVICES: 3-4 serveis clau. icon_name en anglès.
      
      4. FEATURED_PRODUCTS (NOU):
         - Title: Ex: "Els nostres Top Vendes" o "La Selecció del Xef".
         - Subtitle: Una frase que inciti a comprar.
         - Limit: 4.

      5. TESTIMONIALS: 3 ressenyes realistes.
      6. FAQ: 4 preguntes reals amb respostes útils.
      
      7. MAP (NOU):
         - Title: Ex: "Visita'ns al cor de l'Empordà".
         - Subtitle: Instrucció clara per arribar-hi.

      8. CTA_BANNER i CONTACT: Textos finals de tancament.

      OUTPUT: Retorna el JSON complet seguint l'esquema estrictament.
    `;
    }

   /**
     * 🧠 PROMPT INTEL·LIGENT D'ANÀLISI DE NEGOCI
     * Inclou lògica negativa per evitar suggerir coses que la web ja té.
     */
    static buildBusinessAnalysis(url: string, pageText: string, isVip: boolean): string {
        
        let prompt = `
        ACTUA COM: Un Consultor d'Estratègia Digital expert en creixement de negocis B2B.
        OBJECTIU: Analitzar el text d'una web i detectar 3 OPORTUNITATS DE NEGOCI que faltin.
        
        CONTEXT DE LA WEB:
        - URL: "${url}"
        - CONTINGUT EXTRÈT (HTML TEXT): 
        """
        ${pageText.substring(0, 8000)} 
        """
        `;

        // INJECCIÓ VIP (Si és un dels teus clients top)
        if (isVip) {
            prompt += `
            🚨 NOTA IMPORTANT (CLIENT VIP - CAS D'ÈXIT): 
            Aquesta web ja és un referent tecnològic. 
            NO suggereixis millores bàsiques com "fer la web responsive" o "millorar velocitat".
            Centra't en estratègies avançades: Fidelització, IA, Automatització de processos interns o Expansió internacional.
            `;
        }

        // 🛡️ LÒGICA ANTI-REDUNDÀNCIA (El Detectiu)
        prompt += `
        🛑 FASE 1: DETECCIÓ (CRÍTIC):
        Abans de generar cap suggeriment, analitza el text proporcionat per veure què JA EXISTEIX.
        
        REGLES D'EXCLUSIÓ (Si trobes aquestes paraules, NO suggereixis la funcionalitat):
        - Paraules: "cistella", "preu", "comprar", "shop", "cart" -> LA WEB JA TÉ E-COMMERCE. NO suggereixis "Crear Botiga Online".
        - Paraules: "opinions", "clients diuen", "ressenyas", "stars", "testimonials" -> LA WEB JA TÉ TESTIMONIS. NO suggereixis "Afegir Testimonis".
        - Paraules: "reservar", "cita", "calendari", "booking", "demanar hora" -> LA WEB JA TÉ RESERVES. NO suggereixis "Sistema de Reserves".
        - Paraules: "subscriu-te", "newsletter", "butlletí" -> LA WEB JA TÉ CAPTACIÓ DE LEADS.
        - Paraules: "accés clients", "àrea privada", "login" -> LA WEB JA TÉ ÀREA D'USUARI.

        🛑 FASE 2: GENERACIÓ:
        Genera 3 suggeriments de valor que NO estiguin a la llista d'exclusions que has detectat.
        
        Si la web sembla molt completa, suggereix opcions avançades com: 
        1. "Assistent Virtual amb IA (Chatbot)"
        2. "Programa de Punts i Fidelització"
        3. "Estratègia de SEO Local Avançat"

        FORMAT DE RESPOSTA (JSON Array pur):
        [
          {
            "title": "Títol curt i persuasiu",
            "description": "Per què això farà guanyar més diners al negoci. Sigues directe.",
            "icon": "Tria una: 'calendar', 'shop', 'user', 'chart', 'settings', 'message'",
            "impact": "high"
          }
        ]
        `;

        return prompt;
    }
}