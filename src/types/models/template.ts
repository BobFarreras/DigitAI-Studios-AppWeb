// ==========================================
// MODELS ACTIUS
// ==========================================

export type AuditDTO = {
  id: string;
  url: string;
  email: string | null;
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
  updateStatus(
    id: string,
    status: AuditDTO['status'],
    results?: { seoScore?: number; performanceScore?: number; reportData?: Record<string, unknown> }
  ): Promise<void>;
}

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
