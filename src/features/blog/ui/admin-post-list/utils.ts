/**
 * @file src/features/blog/ui/admin-post-list/utils.ts
 * @updated 2026-05-09
 * @summary Helpers de presentacio per la llista d'articles admin.
 * @scope Calcul d'estat social i format curt de data.
 */

import { BlogPostDTO } from '@/types/models';
import { SocialStatus } from './types';

export function getSocialStatus(socials: BlogPostDTO['social_posts']): SocialStatus {
  if (!socials || socials.length === 0) return 'none';
  const hasPublished = socials.some((item) => item.status === 'published' || item.status === 'scheduled');
  return hasPublished ? 'published' : 'draft';
}

export function formatPostDate(date: Date | string | null) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}
