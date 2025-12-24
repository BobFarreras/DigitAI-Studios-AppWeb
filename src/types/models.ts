// PROJECTE: DIGITAI FACTORY
// FITXER: src/types/models.ts

import { StaticImageData } from 'next/image';

// ######################################################################
// BLOC A: MODEL INTERN DE LA FACTORY (Eines pròpies)
// ######################################################################

// 1. Auditoria SEO/Performance
export type AuditDTO = {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  seoScore: number | null;
  performanceScore: number | null;
  createdAt: Date;
  reportData: Record<string, unknown> | null;
};

export interface IAuditRepository {
  getAuditsByUserEmail(email: string): Promise<AuditDTO[]>;
  getAuditById(id: string): Promise<AuditDTO | null>;
  createAudit(url: string, email: string): Promise<AuditDTO>;
  updateStatus(id: string, status: AuditDTO['status'], results?: { seoScore?: number; performanceScore?: number; reportData?: Record<string, unknown> }): Promise<void>;
}

// 2. Testing Campaigns (Per a QA intern)
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

// 3. Analytics Intern
export type AnalyticsEventDTO = {
  event_name: string;
  path: string;
  session_id: string;
  duration?: number;
  referrer?: string;
  meta?: Record<string, unknown>;
  geo?: { country: string | null; city: string | null };
  device?: { type: string; browser: string; os: string };
};

// 4. Portfolio de la Factory (Projectes fets)
export type ThemeImageSet = {
  light: StaticImageData;
  dark: StaticImageData;
};

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stats: string[];
  tags: string[];
  color: string;
  link: string;
  imageAlt: string;
  image: StaticImageData;
  adaptiveImages?: Record<string, ThemeImageSet>; 
}


// ######################################################################
// BLOC B: MODELS DEL MASTER TEMPLATE (Còpia per compatibilitat)
// ######################################################################
// Aquests tipus són necessaris si la Factory ha de manipular dades
// de les webs dels clients (seeds, previews, CMS).

// 1. Landing Sections
export type SectionType = 
  | 'hero' | 'services' | 'contact' | 'stats' | 'testimonials' 
  | 'map' | 'faq' | 'cta_banner' | 'featured_products' | 'about';

export interface ServiceContent {
  title: string;
  subtitle: string;
  headlinePrefix?: string;
  headlineHighlight?: string;
  emptyState?: { title: string; text: string };
  items?: unknown[];      
}

export interface AboutContent {
  badge?: string;
  title: string;
  description: string;
  imageUrl?: string; 
  features?: string[];
  stats?: Array<{ label: string; value: string }>;
  card?: { title: string; subtitle: string };
}

// 2. E-commerce (Client)
export interface Product {
  id: string;
  organization_id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  images: string[];
  category_id?: string;
  created_at?: Date;
}

export interface CartItem {
  id: string;
  organization_id: string;
  name: string;
  price: number;
  stock: number;
  slug: string;
  image?: string;
  quantity: number;
}

// 3. Booking (Client)
export interface Service {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  active: boolean;
  created_at: Date;
}

export interface Booking {
  id: string;
  organization_id: string;
  service_id: string;
  user_id: string | null;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  services?: { title: string; duration_minutes?: number } | null;
}


export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogPostDTO {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  coverImage: string | null;
  tags: string[];
  date: string | null;
  
  // ✅ AFEGITS PERQUÈ EL REPOSITORI NO PETI
  published: boolean;
  reviewed: boolean;
  status?: PostStatus; 
  
  // Opcional: per social media
  social_posts?: {
    id: string;
    platform: string;
    status: string;
    scheduledFor: string | null;
  }[];

  totalReactions?: number;
}

// Aquest és el model de Base de Dades (si el necessites per separat)
export interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content_mdx: string | null;
  cover_image: string | null; // 👈 A la DB es diu així
  published_at: Date | null;
  tags: string[];
}