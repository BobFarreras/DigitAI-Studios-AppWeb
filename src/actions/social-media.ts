'use server'

import { createClient } from '@/lib/supabase/server'; // ⚠️ Comprova la teva ruta del client Supabase (pot ser @/lib/supabase/server)
import { SocialGeneratorService } from '@/services/social-generator';
import { SocialPublisherService } from '@/services/social-publisher';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';
type SocialPostUpdate = Database['public']['Tables']['social_posts']['Update'];
/**
 * Server Action per generar i guardar els esborranys socials
 */
export async function generateSocialsForPost(postId: string) {
  const supabase = await createClient();

  try {
    // 1. Verificació de Seguretat (Auth & Admin)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Usuari no autenticat");

    // Opcional: Verificar si és admin (depèn de la teva lògica de rols)
    // const isAdmin = ... check role ...
    // if (!isAdmin) throw new Error("No tens permisos");

    // 2. Recuperar el Post original (Blog)
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('title, content_mdx, slug') // ⚠️ Assegura't que el camp de contingut es diu 'content' o 'content_mdx' segons el teu esquema
      .eq('id', postId)
      .single();

    if (postError || !post) throw new Error("No s'ha trobat el post original.");

    // Si el contingut està buit, no podem generar res
    const contentToProcess = post.content_mdx || post.title;

    // 3. Generar contingut amb IA (El servei que ja hem testejat)
    console.log(`🤖 Generant socials per al post: ${post.title}...`);
    const generated = await SocialGeneratorService.generateFromPost(post.title, contentToProcess);

    // 4. Preparar les dades per inserir a la DB
    // Creem un array amb les 3 plataformes per fer una inserció neta
    const socialPostsToInsert = [
      {
        post_id: postId,
        platform: 'linkedin' as const,
        content: generated.linkedin.content,
        status: 'draft' as const,
        // Guardem hashtags extra com a metadades si calgués, o dins el content
      },
      {
        post_id: postId,
        platform: 'facebook' as const,
        content: generated.facebook.content,
        status: 'draft' as const,
      },
      {
        post_id: postId,
        platform: 'instagram' as const,
        content: generated.instagram.content,
        // Si tenim prompt d'imatge, el podríem guardar en un camp 'media_url' temporalment o un camp 'metadata'
        // Per simplicitat ara ho posem al content o ho ignorem fins que tinguis generació d'imatges real
        status: 'draft' as const,
      }
    ];

    // 5. Guardar a Supabase
    const { error: insertError } = await supabase
      .from('social_posts')
      .insert(socialPostsToInsert);

    if (insertError) {
      console.error("Error guardant a DB:", insertError);
      throw new Error("Error guardant els esborranys a la base de dades.");
    }

    // 6. Actualitzar la UI
    // Això farà que quan tornis a carregar la pàgina, apareguin els nous posts sense refrescar
    revalidatePath(`/admin/posts/${postId}`);
    revalidatePath('/admin/socials');

    return { success: true, message: "Esborranys generats i guardats correctament!" };

  } catch (error: unknown) {
    console.error("❌ Error a generateSocialsForPost:", error);
    const message = error instanceof Error ? error.message : "Error desconegut";
    return { success: false, message };
  }
} // Dins de src/actions/social-media.ts

export async function updateSocialPostContent(
  socialId: string,
  newContent: string,
  mediaUrl?: string // 👈 Nou paràmetre opcional
) {
  const supabase = await createClient();

  // Auth check simple
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Preparem l'objecte d'actualització
  const updateData: SocialPostUpdate = {
    content: newContent,
    status: 'approved',
    updated_at: new Date().toISOString()
  };

  // Només actualitzem media_url si ens arriba un valor (o string buit per esborrar)
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

// 1. Canvia la definició de la funció per acceptar mediaUrlOverride
export async function publishSocialPost(socialId: string, mediaUrlOverride?: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: socialPost, error } = await supabase
    .from('social_posts')
    .select(`*, posts ( slug )`)
    .eq('id', socialId)
    .single();

  if (error || !socialPost) throw new Error("No s'ha trobat el post.");
  if (socialPost.status === 'published') throw new Error("Ja està publicat!");

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const postSlug = socialPost.posts?.slug;
    const publicUrl = postSlug ? `${baseUrl}/blog/${postSlug}` : baseUrl;

    // 🔥 CLAU MÀGICA: Si li passem una URL "en mà", utilitza aquesta. Si no, la de la DB.
    const finalMediaUrl = mediaUrlOverride || socialPost.media_url;

    console.log("📢 PUBLICANT AMB MEDIA:", finalMediaUrl ? finalMediaUrl : "CAP (Text Only)");

    const result = await SocialPublisherService.publish({
      platform: socialPost.platform,
      content: socialPost.content,
      mediaUrl: finalMediaUrl, // Usem la variable decidida
      link: publicUrl
    });

    // Actualitzar DB
    await supabase.from('social_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        external_id: result.externalId,
        media_url: null // Netejem referència
      })
      .eq('id', socialId);

    // Neteja Storage (Si n'hi havia)
    if (finalMediaUrl) {
      try {
        const urlParts = finalMediaUrl.split('/social-media/');
        if (urlParts.length > 1) {
          await supabase.storage.from('social-media').remove([urlParts[1]]);
        }
      } catch (e) { console.error(e); }
    }

    revalidatePath('/admin/blog');
    return { success: true, message: "Publicat!" };

  } catch (error: unknown) {
    // ... gestió errors igual ...
    const msg = error instanceof Error ? error.message : "Error";
    await supabase.from('social_posts').update({ error_message: msg, status: 'failed' }).eq('id', socialId);
    return { success: false, message: msg };
  }
}
// A src/actions/social-media.ts

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