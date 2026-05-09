/**
 * @file src/actions/social-media.ts
 * @updated 2026-05-09
 * @summary Façana pública d'accions de social media.
 * @scope Manté API estable i delega la lògica als mòduls especialitzats.
 */
'use server';

import { generateSocialsForPostImpl } from './social-media/generate';
import { changeSocialStatusImpl, removeSocialMediaImpl, updateSocialPostContentImpl, uploadSocialMediaImpl } from './social-media/manage';
import { publishSocialPostImpl } from './social-media/publish';

export async function generateSocialsForPost(postId: string) {
  return generateSocialsForPostImpl(postId);
}

export async function updateSocialPostContent(socialId: string, newContent: string, mediaUrl?: string) {
  return updateSocialPostContentImpl(socialId, newContent, mediaUrl);
}

export async function uploadSocialMedia(socialId: string, file: File, previousMediaUrl?: string | null) {
  return uploadSocialMediaImpl(socialId, file, previousMediaUrl);
}

export async function removeSocialMedia(mediaUrl: string) {
  return removeSocialMediaImpl(mediaUrl);
}

export async function changeSocialStatus(socialId: string, newStatus: 'draft' | 'approved' | 'published' | 'failed') {
  return changeSocialStatusImpl(socialId, newStatus);
}

export async function publishSocialPost(socialId: string, mediaUrlOverride?: string) {
  return publishSocialPostImpl(socialId, mediaUrlOverride);
}
