// src/types/config.ts

// 1. Tipus bàsics
export type ModuleStatus = boolean;

// 🆕 1.1 DEFINICIÓ DE CONTINGUT (Això és el que et faltava)
export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
  };
  services_intro: {
    title: string;
    subtitle: string;
  };
}

// 2. Sub-interfícies (Footer)
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

// 3. Identitat
export interface SiteIdentity {
  name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  address?: string;
}

// 4. Branding
export interface SiteBranding {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  radius: number;
}

// 5. Mòduls
export interface SiteModules {
  layout: {
    variant: 'modern' | 'shop';
    stickyHeader: boolean;
  };

  landing: {
    active: boolean;
    sections: string[]; 
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
}

export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}

// 🧠 CONFIGURACIÓ MESTRA
export interface MasterConfig {
  organizationId?: string; // Vital per multitenancy
  identity: SiteIdentity;
  branding: SiteBranding;
  
  // ✅ Ara TypeScript ja sabrà què és SiteContent perquè està definit a dalt
  content?: SiteContent; 
  
  modules: SiteModules;
  i18n: I18nConfig;
  footer: SiteFooterConfig;
}