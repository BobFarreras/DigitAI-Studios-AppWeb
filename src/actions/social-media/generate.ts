'use server';
/**
 * @file src/actions/social-media/generate.ts
 * @updated 2026-05-09
 * @summary Generació i upsert de contingut social via IA.
 * @scope Crear/actualitzar esborranys social_posts per plataforma.
 */

import { revalidatePath } from 'next/cache';
import { SocialGeneratorService } from '@/services/social-generator';
import { getAuthedSupabase } from './shared';

export async function generateSocialsForPostImpl(postId: string) {
  const { supabase } = await getAuthedSupabase();
  try {
    const { data: post } = await supabase.from('posts').select('title, content_mdx, slug').eq('id', postId).single();
    if (!post) throw new Error("No s'ha trobat el post original.");

    const generated = await SocialGeneratorService.generateFromPost(post.title, post.content_mdx || post.title);
    const platforms = [
      { name: 'linkedin', content: generated.linkedin.content },
      { name: 'facebook', content: generated.facebook.content },
      { name: 'instagram', content: generated.instagram.content },
    ] as const;

    for (const platform of platforms) {
      const { data: existingPost } = await supabase
        .from('social_posts')
        .select('id')
        .eq('post_id', postId)
        .eq('platform', platform.name)
        .maybeSingle();

      if (existingPost) {
        await supabase
          .from('social_posts')
          .update({ content: platform.content, status: 'draft', updated_at: new Date().toISOString() })
          .eq('id', existingPost.id);
      } else {
        await supabase.from('social_posts').insert({
          post_id: postId,
          platform: platform.name,
          content: platform.content,
          status: 'draft',
        });
      }
    }

    revalidatePath(`/admin/posts/${postId}`);
    revalidatePath('/admin/blog');
    return { success: true, message: 'Esborranys generats correctament!' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconegut';
    return { success: false, message };
  }
}
