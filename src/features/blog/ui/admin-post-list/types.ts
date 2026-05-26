/**
 * @file src/features/blog/ui/admin-post-list/types.ts
 * @updated 2026-05-09
 * @summary Tipus compartits per la llista d'articles admin.
 * @scope Contractes UI per files i paginacio de taula.
 */

import { BlogPostDTO } from '@/types/models';

export interface AdminPostListProps {
  posts: BlogPostDTO[];
  currentPage: number;
  totalPages: number;
}

export type SocialStatus = 'none' | 'draft' | 'published';
