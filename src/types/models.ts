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


// 1. DTO (Data Transfer Object): Com la teva UI vol veure les dades (camelCase, net)
export type BlogPostDTO = {
  slug: string;
  title: string;
  date: string | null;     // Mapejat des de published_at
  description: string | null;
  content: string | null;  // Mapejat des de content_mdx
  tags: string[];
  coverImage: string | null; // Mapejat des de cover_image
};