// 1. DTO - Així és com la nostra UI vol veure una auditoria (Tipatge net)
export type AuditDTO = {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  seoScore: number | null; // CamelCase per JS
  performanceScore: number | null;
  createdAt: Date; // Objecte Date real, no string
  reportData: Record<string, unknown> | null;
};


export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  
  updateStatus(
    id: string, 
    status: AuditDTO['status'], 
    results?: { 
      seoScore?: number; 
      performanceScore?: number; 
      // ✅ Coherència de tipus
      reportData?: Record<string, unknown> 
    }
  ): Promise<void>;
}


// src/types/models.ts

export type BlogPostDTO = {
  id: string;
  slug: string;
  title: string;
  date: string | null;
  description: string | null;
  content: string | null;
  tags: string[];
  coverImage: string | null;
  published: boolean;
  reviewed: boolean;
  totalReactions?: number;
  
  // 👇 Relació amb Socials
  social_posts?: {
    id: string;
    platform: 'twitter' | 'linkedin' | 'instagram' | string; // O el teu enum
    status: 'draft' | 'scheduled' | 'published' | 'failed' | string;
    scheduledFor: string | null; // 👈 En JS li diem 'scheduledFor', encara que a la DB sigui 'scheduled_at'
  }[];
};


// PROJECTE: digitAIStudios
// FITXER: src/types/config.ts

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

export interface MasterConfig {
  identity: SiteIdentity;
  branding: SiteBranding;
  modules: SiteModules;
  i18n: I18nConfig;
}

export type TestCampaignDTO = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  instructions: string | null;
  status: string;
  createdAt: Date;
};

export type TestTaskDTO = {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  orderIndex: number;
};

export type TestResultDTO = {
  id: string;
  taskId: string;
  userId: string;
  status: 'pass' | 'fail' | 'blocked';
  comment: string | null;
  updatedAt: Date;
};

// Tipus per al retorn combinat del repositori
export type CampaignContext = {
  campaign: TestCampaignDTO | null;
  tasks: TestTaskDTO[];
  results: TestResultDTO[];
};

export type TesterProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type AnalyticsEventDTO = {
  event_name: string;
  path: string;
  session_id: string;
  duration?: number;
  referrer?: string;
  
  // Metadades tècniques (JSON pur)
  meta?: Record<string, unknown>;
  
  // Dades processades (Columnes reals a DB)
  geo?: {
    country: string | null;
    city: string | null;
  };
  device?: {
    type: string;    // 'mobile', 'tablet', 'desktop'
    browser: string; // 'Chrome', 'Safari'
    os: string;      // 'iOS', 'Windows'
  };
};
