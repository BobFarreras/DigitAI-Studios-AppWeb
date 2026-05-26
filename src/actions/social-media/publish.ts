'use server';
/**
 * @file src/actions/social-media/publish.ts
 * @updated 2026-05-09
 * @summary Publicació real de posts socials a proveïdors externs.
 * @scope Preparació payload, crida al publisher i sincronització d'estat.
 */

import { revalidatePath } from 'next/cache';
import { SocialPublisherService } from '@/services/social-publisher';
import { extractSocialMediaPath, getAuthedSupabase } from './shared';

export async function publishSocialPostImpl(socialId: string, mediaUrlOverride?: string) {
  const { supabase } = await getAuthedSupabase();

  const { data: socialPost, error } = await supabase
    .from('social_posts')
    .select(`*, posts ( slug )`)
    .eq('id', socialId)
    .single();

  if (error || !socialPost) throw new Error("No s'ha trobat el post social.");
  if (socialPost.status === 'published') throw new Error('Ja està publicat!');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const postSlug = socialPost.posts?.slug;
    const publicUrl = postSlug ? `${baseUrl}/blog/${postSlug}` : baseUrl;
    const finalMediaUrl = mediaUrlOverride || socialPost.media_url;

    const result = await SocialPublisherService.publish({
      platform: socialPost.platform,
      content: socialPost.content,
      mediaUrl: finalMediaUrl,
      link: publicUrl,
    });

    await supabase
      .from('social_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        external_id: result.externalId,
        media_url: null,
      })
      .eq('id', socialId);

    const mediaPath = extractSocialMediaPath(finalMediaUrl);
    if (mediaPath) {
      try {
        await supabase.storage.from('social-media').remove([mediaPath]);
      } catch (e) {
        console.error('Error netejant storage:', e);
      }
    }

    revalidatePath('/admin/blog');
    return { success: true, message: 'Publicat correctament!' };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error publicant';
    await supabase.from('social_posts').update({ error_message: msg, status: 'failed' }).eq('id', socialId);
    return { success: false, message: msg };
  }
}
