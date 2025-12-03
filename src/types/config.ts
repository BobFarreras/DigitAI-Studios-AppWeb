// Tipus bàsics
export type ModuleStatus = boolean;

export interface SiteIdentity {
  name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
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

export interface SiteModules {
  landing: {
    active: boolean;
    sections: ('hero' | 'features' | 'services' | 'contact' | 'testimonials')[];
  };
  auth: ModuleStatus;
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
  identity: SiteIdentity;
  branding: SiteBranding;
  modules: SiteModules;
  i18n: I18nConfig;
}