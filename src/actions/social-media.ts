/**
 * @file src/actions/social-media.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/social-media.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server'

import { createClient } from '@/lib/supabase/server';
import { SocialGeneratorService } from '@/services/social-generator';
import { SocialPublisherService } from '@/services/social-publisher';
import { revalidatePath } from 'next/cache';
import { type Database } from '@/types/database.types'; // Assegura't que aquesta ruta és correcta

type SocialPostUpdate = Database['public']['Tables']['social_posts']['Update'];

/**
 * Genera (o regenera) els textos per a xarxes socials fent servir IA (Gemini).
 * Si ja existeixen esborranys, els actualitza. Si no, els crea.
 */
export async function generateSocialsForPost(postId: string) {
  const supabase = await createClient();

  try {
    // 1. Verificació
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuari no autenticat");

    // 2. Recuperar el Post original
    const { data: post } = await supabase
      .from('posts')
      .select('title, content_mdx, slug')
      .eq('id', postId)
      .single();

    if (!post) throw new Error("No s'ha trobat el post original.");

    // 3. Generar contingut amb Gemini
    console.log(`🤖 Generant socials per al post: ${post.title}...`);
    const generated = await SocialGeneratorService.generateFromPost(post.title, post.content_mdx || post.title);

    // 4. Definim les plataformes a gestionar
    const platforms = [
        { name: 'linkedin', content: generated.linkedin.content },
        { name: 'facebook', content: generated.facebook.content },
        { name: 'instagram', content: generated.instagram.content }
    ] as const;

    // 5. Bucle "Upsert" (Actualitzar o Inserir)
    for (const p of platforms) {
        // Busquem si ja existeix un esborrany per aquest post i plataforma
        const { data: existingPost } = await supabase
            .from('social_posts')
            .select('id')
            .eq('post_id', postId)
            .eq('platform', p.name)
            .maybeSingle();

        if (existingPost) {
            // ✅ EXISTEIX -> ACTUALITZEM (Sobreescriure text vell)
            await supabase.from('social_posts')
                .update({ 
                    content: p.content,
                    status: 'draft', // Tornem a draft per si estava 'failed' o 'published'
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingPost.id);
        } else {
            // ✅ NO EXISTEIX -> CREEM NOU
            await supabase.from('social_posts').insert({
                post_id: postId,
                platform: p.name,
                content: p.content,
                status: 'draft'
            });
        }
    }

    // 6. Refrescar la UI
    revalidatePath(`/admin/posts/${postId}`);
    revalidatePath('/admin/blog');
    
    return { success: true, message: "Esborranys generats correctament!" };

  } catch (error: unknown) {
    console.error("❌ Error a generateSocialsForPost:", error);
    const message = error instanceof Error ? error.message : "Error desconegut";
    return { success: false, message };
  }
}

/**
 * Actualitza manualment el contingut o la imatge d'un post social des de la targeta.
 */
export async function updateSocialPostContent(
  socialId: string,
  newContent: string,
  mediaUrl?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const updateData: SocialPostUpdate = {
    content: newContent,
    status: 'approved', // Si l'usuari el toca, assumim que l'aprova
    updated_at: new Date().toISOString()
  };

  if (mediaUrl !== undefined) {
    updateData.media_url = mediaUrl === '' ? null : mediaUrl;
  }

  const { error } = await supabase
    .from('social_posts')
    .update(updateData)
    .eq('id', socialId);

  if (error) throw new Error("Error actualitzant el post");

  revalidatePath('/admin/blog');
  return { success: true };
}

/**
 * Puja un fitxer multimèdia al bucket social-media i retorna la URL pública.
 * També elimina la imatge anterior si es proporciona.
 */
export async function uploadSocialMedia(
  socialId: string,
  file: File,
  previousMediaUrl?: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!file) throw new Error("No file provided");

  if (previousMediaUrl) {
    const previousParts = previousMediaUrl.split('/social-media/');
    if (previousParts.length > 1) {
      await supabase.storage.from('social-media').remove([previousParts[1]]);
    }
  }

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${socialId}-${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage.from('social-media').upload(fileName, file);
  if (uploadError) throw new Error("Error pujant arxiu");

  const { data: { publicUrl } } = supabase.storage.from('social-media').getPublicUrl(fileName);
  return { success: true, publicUrl };
}

/**
 * Elimina un fitxer del bucket social-media a partir de la URL pública.
 */
export async function removeSocialMedia(mediaUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!mediaUrl) return { success: true };

  const urlParts = mediaUrl.split('/social-media/');
  if (urlParts.length > 1) {
    await supabase.storage.from('social-media').remove([urlParts[1]]);
  }

  return { success: true };
}

/**
 * Canvia l'estat manualment (Draft <-> Approved <-> Published)
 */
export async function changeSocialStatus(socialId: string, newStatus: 'draft' | 'approved' | 'published' | 'failed') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('social_posts')
    .update({ status: newStatus })
    .eq('id', socialId);

  if (error) throw new Error("Error canviant l'estat");

  revalidatePath('/admin/blog');
  return { success: true };
}

/**
 * Publica el post a la xarxa social real.
 * Accepta 'mediaUrlOverride' per rebre la imatge directament des del client i evitar errors de latència.
 */
export async function publishSocialPost(socialId: string, mediaUrlOverride?: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Recuperem el post social I el slug del post original
  const { data: socialPost, error } = await supabase
    .from('social_posts')
    .select(`*, posts ( slug )`)
    .eq('id', socialId)
    .single();

  if (error || !socialPost) throw new Error("No s'ha trobat el post social.");
  if (socialPost.status === 'published') throw new Error("Ja està publicat!");

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
  
    const postSlug = socialPost.posts?.slug;
    const publicUrl = postSlug ? `${baseUrl}/blog/${postSlug}` : baseUrl;

    // 🔥 DECISIÓ CRÍTICA: Prioritzem la URL que ens arriba "en mà" (override)
    // perquè la DB potser encara no s'ha actualitzat.
    const finalMediaUrl = mediaUrlOverride || socialPost.media_url;

    console.log(`📢 PUBLICANT a ${socialPost.platform.toUpperCase()}`);
    console.log(`🔗 Link: ${publicUrl}`);
    console.log(`📸 Media: ${finalMediaUrl ? finalMediaUrl : "CAP"}`);

    // Cridem al servei de publicació
    const result = await SocialPublisherService.publish({
      platform: socialPost.platform,
      content: socialPost.content,
      mediaUrl: finalMediaUrl, // Passem la URL decidida
      link: publicUrl
    });

    // Actualitzar DB després de l'èxit
    await supabase.from('social_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        external_id: result.externalId,
        media_url: null // Netejem la referència perquè l'arxiu s'esborrarà
      })
      .eq('id', socialId);

    // Neteja del Storage (Opcional però recomanat per estalviar espai)
    if (finalMediaUrl) {
      try {
        const urlParts = finalMediaUrl.split('/social-media/');
        if (urlParts.length > 1) {
          await supabase.storage.from('social-media').remove([urlParts[1]]);
        }
      } catch (e) { console.error("Error netejant storage:", e); }
    }

    revalidatePath('/admin/blog');
    return { success: true, message: "Publicat correctament!" };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error publicant";
    
    // Si falla, guardem l'error a la DB
    await supabase
      .from('social_posts')
      .update({ error_message: msg, status: 'failed' })
      .eq('id', socialId);

    return { success: false, message: msg };
  }
}

