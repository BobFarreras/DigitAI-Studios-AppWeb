// ==========================================
// MODELS DEL MASTER TEMPLATE (Còpia per compatibilitat)
// ==========================================

// 1. Landing Sections (IA & Visuals)
export type SectionType = 
  | 'hero' | 'services' | 'contact' | 'stats' | 'testimonials' 
  | 'map' | 'faq' | 'cta_banner' | 'featured_products' | 'about';

export interface BaseSectionContent {
  title?: string;
  subtitle?: string;
}

export interface HeroContent extends BaseSectionContent {
  ctaText?: string;
  companyName: string;
}

export interface ServiceContent extends BaseSectionContent {
  headlinePrefix?: string;
  headlineHighlight?: string;
  emptyState?: { title: string; text: string };
  // ✅ CORREGIT: Tipat correcte per als items de la IA
  items?: Array<{ title: string; description: string }>;      
}

export interface AboutContent extends BaseSectionContent {
  badge?: string;
  description: string;
  imageUrl?: string; 
  features?: string[];
  stats?: Array<{ label: string; value: string }>;
  card?: { title: string; subtitle: string };
}

export interface StatsContent {
  items: Array<{ value: string; label: string }>;
}

export interface TestimonialsContent extends BaseSectionContent {
  reviews: Array<{
    author: string;
    role: string;
    text: string;
    rating: number;
  }>;
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

// 3. Booking & Serveis (Client)
export interface ServiceDTO {
  id: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  image_url?: string;
  // ✅ UNIFICAT: Fem servir sempre duration_minutes
  duration_minutes?: number; 
}
// Alias
export type Service = ServiceDTO;

export interface Booking {
  id: string;
  organization_id: string;
  service_id: string;
  user_id: string | null;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  // Relació opcional
  services?: { title: string; duration_minutes?: number } | null;
}

// 4. Blog (Client)
export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogPostDTO {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  coverImage: string | null; // CamelCase per UI
  tags: string[];
  date: string | null;
  
  // Camps Admin
  published: boolean;
  reviewed: boolean;
  status?: PostStatus; 
  
  social_posts?: {
    id: string;
    platform: string;
    status: string;
    scheduledFor: string | null;
  }[];

  totalReactions?: number;
}