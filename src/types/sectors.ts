export type SectorType = 'restaurant' | 'legal' | 'medical' | 'real_estate' | 'general';

export interface SectorConfig {
  key: SectorType;
  aiPersona: string; // La "personalitat" del bot
  keywords: {
    services: string; // Pistes per generar serveis      
    cta: string;      // Pista per al botó d'acció     
  };
  // ✅ NOVA SECCIÓ: Mòduls funcionals
  features: {
    booking: boolean;      // Sistema de reserves
    ecommerce: boolean;    // Venda de productes
    blog: boolean;         // Notícies/Articles
    gallery: boolean;      // Galeria de fotos complexa
    faq: boolean;          // Preguntes freqüents
  };
}

export const SECTOR_REGISTRY: Record<SectorType, SectorConfig> = {
  restaurant: {
    key: 'restaurant',
    aiPersona: "Ets un expert en màrqueting gastronòmic i copywriting culinari. Utilitza un llenguatge sensorial (gust, olfacte), apetitiu, acollidor i visual. Centra't en l'experiència de compartir taula.",
    keywords: {
      services: "Plats Estrella, Menú Degustació, Maridatge de Vins, Esdeveniments Privats",
      cta: "Reserva la teva Taula"
    },
    features: { booking: true, ecommerce: false, blog: false, gallery: true, faq: false }
  },
  legal: {
    key: 'legal',
    aiPersona: "Ets un advocat sènior expert en comunicació corporativa. Utilitza un to professional, autoritari, seriós, discret i que transmeti màxima confiança i seguretat jurídica.",
    keywords: {
      services: "Dret Civil, Dret Penal, Assessorament Mercantil, Divorcis i Herències",
      cta: "Sol·licita Consulta Prèvia"
    },
    features: { booking: false, ecommerce: false, blog: true, gallery: false, faq: true }
  },
  medical: {
    key: 'medical',
    aiPersona: "Ets un director mèdic d'una clínica de prestigi. Utilitza un to empàtic, científic, tranquil·litzador i proper. La prioritat és la salut, la tecnologia puntera i el benestar del pacient.",
    keywords: {
      services: "Diagnòstic Avançat, Tractaments Personalitzats, Medicina Preventiva, Urgències 24h",
      cta: "Demanar Cita Mèdica"
    },
    features: { booking: true, ecommerce: false, blog: true, gallery: false, faq: true }
  },
  real_estate: {
    key: 'real_estate',
    aiPersona: "Ets un agent immobiliari de luxe. Utilitza un to aspiracional, elegant i exclusiu. Ven l'estil de vida, els espais oberts i la llum, no només les parets.",
    keywords: {
      services: "Compra-Venda, Lloguer de Luxe, Taxacions Immobiliàries, Gestió Patrimonial",
      cta: "Veure Propietats Exclusives"
    },
    features: { booking: true, ecommerce: false, blog: false, gallery: true, faq: true }
  },
  general: {
    key: 'general',
    aiPersona: "Ets un consultor de negocis versàtil i modern. Utilitza un to corporatiu orientat a resultats, eficiència i innovació.",
    keywords: {
      services: "Consultoria Estratègica, Desenvolupament de Projectes, Suport Integral",
      cta: "Contactar Ara"
    }, features: { booking: false, ecommerce: false, blog: true, gallery: false, faq: false }
  }
};

// Funció helper per normalitzar l'entrada
export function getSectorConfig(input: string): SectorConfig {
  const key = input.toLowerCase().trim() as SectorType;
  return SECTOR_REGISTRY[key] || SECTOR_REGISTRY.general;
}