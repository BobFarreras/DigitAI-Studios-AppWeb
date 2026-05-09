/**
 * @file src/components/admin/socials/social-post-card/types.ts
 * @updated 2026-05-09
 * @summary Tipus compartits del component SocialPostCard.
 * @scope Contractes de props i estats de publicació social.
 */

import { type Database } from '@/types/database.types';

export type SocialPost = Database['public']['Tables']['social_posts']['Row'];
export type PostStatus = 'draft' | 'approved' | 'published' | 'failed';

export interface SocialPostCardProps {
  post: SocialPost;
  onSave: (id: string, content: string, mediaUrl?: string) => void;
  isSaving: boolean;
}
