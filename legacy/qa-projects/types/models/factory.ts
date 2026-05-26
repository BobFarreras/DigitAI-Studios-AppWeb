import { StaticImageData } from 'next/image';

// ==========================================
// 1. AUDITORIA SEO/PERFORMANCE
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
  updateStatus(id: string, status: AuditDTO['status'], results?: { seoScore?: number; performanceScore?: number; reportData?: Record<string, unknown> }): Promise<void>;
}

// ==========================================
// 2. TESTING CAMPAIGNS (QA Intern)
// ==========================================
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

// ==========================================
// 3. ANALYTICS INTERN
// ==========================================
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

// ==========================================
// 4. PORTFOLIO FACTORY
// ==========================================
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
  logo: StaticImageData; // ✅ Logo obligatori
  imageAlt: string;
  image: StaticImageData;
  adaptiveImages?: Record<string, ThemeImageSet>; 
}