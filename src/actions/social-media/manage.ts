'use server';
/**
 * @file src/actions/social-media/manage.ts
 * @updated 2026-05-09
 * @summary Accions de manteniment de posts socials (update/media/status).
 * @scope Edició de contingut, upload/remove de media i canvi d'estat.
 */

import { revalidatePath } from 'next/cache';
import { type Database } from '@/types/database.types';
import { extractSocialMediaPath, getAuthedSupabase } from './shared';

type SocialPostUpdate = Database['public']['Tables']['social_posts']['Update'];

export async function updateSocialPostContentImpl(socialId: string, newContent: string, mediaUrl?: string) {
  const { supabase } = await getAuthedSupabase();
  const updateData: SocialPostUpdate = {
    content: newContent,
    status: 'approved',
    updated_at: new Date().toISOString(),
  };
  if (mediaUrl !== undefined) updateData.media_url = mediaUrl === '' ? null : mediaUrl;

  const { error } = await supabase.from('social_posts').update(updateData).eq('id', socialId);
  if (error) throw new Error('Error actualitzant el post');
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function uploadSocialMediaImpl(socialId: string, file: File, previousMediaUrl?: string | null) {
  const { supabase } = await getAuthedSupabase();
  if (!file) throw new Error('No file provided');

  const previousPath = extractSocialMediaPath(previousMediaUrl || null);
  if (previousPath) await supabase.storage.from('social-media').remove([previousPath]);

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${socialId}-${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('social-media').upload(fileName, file);
  if (uploadError) throw new Error('Error pujant arxiu');

  const {
    data: { publicUrl },
  } = supabase.storage.from('social-media').getPublicUrl(fileName);
  return { success: true, publicUrl };
}

export async function removeSocialMediaImpl(mediaUrl: string) {
  const { supabase } = await getAuthedSupabase();
  const path = extractSocialMediaPath(mediaUrl);
  if (path) await supabase.storage.from('social-media').remove([path]);
  return { success: true };
}

export async function changeSocialStatusImpl(socialId: string, newStatus: 'draft' | 'approved' | 'published' | 'failed') {
  const { supabase } = await getAuthedSupabase();
  const { error } = await supabase.from('social_posts').update({ status: newStatus }).eq('id', socialId);
  if (error) throw new Error("Error canviant l'estat");
  revalidatePath('/admin/blog');
  return { success: true };
}
