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
     * Genera el prompt per detectar oportunitats de negoci en una web existent.
     */
    static buildBusinessAnalysis(url: string, text: string): string {
        return `
      ACTUA COM: Un Consultor de Transformació Digital expert en Vendes B2B.
      OBJECTIU: Analitzar el contingut d'una web i proposar 3 funcionalitats tecnològiques per augmentar la facturació.

      DADES DE LA WEB:
      - URL: "${url}"
      - CONTINGUT EXTRET: "${text.substring(0, 5000)}" (Pot contenir brutícia HTML, ignora-la).

      TASCA:
      1. Identifica el sector del negoci (ex: Reformes, Advocats, Botiga, Restaurant).
      2. Detecta QUÈ LI FALTA a nivell digital que la competència moderna sí que té.
      3. Proposa 3 mòduls concrets.

      EXEMPLES DE SUGGERIMENTS (Icones vàlides: 'calendar', 'shop', 'user', 'chart', 'settings'):
      - Si venen serveis (advocat/metge) -> "Reserva de Cita Online" (calendar).
      - Si fan obres/reformes -> "Calculadora de Pressupostos" (chart) o "Galeria Abans/Després" (settings).
      - Si venen productes físics -> "Botiga Online / Click&Collect" (shop).
      - Si tenen clients recurrents -> "Àrea Privada de Clients" (user).

      FORMAT DE RESPOSTA (JSON Array estricte):
      [
        {
          "title": "Títol Comercial (ex: Automatitza les cites)",
          "description": "Explicació del benefici econòmic (ex: Deixa de perdre trucades fora d'horari).",
          "icon": "calendar",
          "impact": "high"
        }
      ]
    `;
    }

}