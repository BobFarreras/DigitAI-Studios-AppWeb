// PROJECTE: Master Template
// FITXER: src/types/config.ts

// ==========================================
// 1. Definicions de Seccions Permeses
// ==========================================

// 👇 AQUEST ÉS EL TIPUS CLAU QUE NECESSITES EXPORTAR
export type ConfigLandingSection = 
  | 'hero' 
  | 'features' 
  | 'services' 
  | 'contact' 
  | 'testimonials' 
  | 'map' 
  | 'stats' 
  | 'faq' 
  | 'cta_banner' 
  | 'featured_products' 
  | 'about';

// ==========================================
// 2. Configuració de Contingut Estàtic (Inputs del Config)
// ==========================================

export interface AboutConfigInput {
  title?: string;
  description?: string;
  image_url?: string;
  stats?: Array<{ label: string; value: string }>;
}

export interface HeroConfigInput {
  title?: string;
  subtitle?: string;
  cta?: string;
}
// 👇 AFEGIM AIXÒ: Estructura per guardar items generats per IA
export interface AIItem {
  title: string;
  description: string;
  icon?: string; // Opcional, per si la IA suggereix icona
}
// 👇 AFEGEIX AIXÒ (Recuperem l'estructura perduda)
export interface ServicesIntroConfigInput {
  title: string;
  subtitle: string;
  items?: AIItem[]; // 👈 Llista de serveis generats
}

// 👇 MODIFICA AIXÒ
export interface StaticContentConfig {
  hero?: HeroConfigInput;
  about?: AboutConfigInput;
  services_intro?: ServicesIntroConfigInput;
  // ✅ NOU CAMP
  testimonials?: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
}
// ==========================================
// 3. Estructures Auxiliars
// ==========================================
export type ModuleStatus = boolean;

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SiteFooterConfig {
  columns: FooterColumn[];
  socials?: Record<string, string>;
  bottomText: string;
}

export interface SiteIdentity {
  name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  address?: string;
}

export interface SiteBranding {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  radius: number;
}

// ==========================================
// 4. Configuració de Mòduls
// ==========================================
export interface SiteModules {
  layout: {
    variant: 'modern' | 'shop';
    stickyHeader: boolean;
  };

  landing: {
    active: boolean;
    // 👇 AQUI UTILITZEM EL TIPUS STRICTE
    sections: ConfigLandingSection[];
  };

  auth: {
    active: boolean;
    allowPublicRegistration: boolean;
    redirects: {
      admin: string;
      client: string;
    };
  };

  dashboard: ModuleStatus;
  booking: ModuleStatus;
  ecommerce: ModuleStatus;
  blog: ModuleStatus;
  inventory: ModuleStatus;
  accessControl: ModuleStatus;
  chatbot: ModuleStatus;
}

export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}
// 👇 AFEGEIX AIXÒ
export interface TestimonialItem {
  text: string;
  author: string;
  role: string; // Ex: "Client habitual" o "Crític gastronòmic"
  rating: number;
}
// ==========================================
// 🧠 CONFIGURACIÓ MESTRA (MASTER CONFIG)
// ==========================================
export interface MasterConfig {
  organizationId?: string;
  identity: SiteIdentity;
  branding: SiteBranding;
  modules: SiteModules;
  i18n: I18nConfig;
  footer: SiteFooterConfig;
  
  // Contingut opcional definit al config
  content?: StaticContentConfig;
}