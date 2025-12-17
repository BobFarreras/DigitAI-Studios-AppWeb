import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

interface InstaContainerPayload {
  access_token: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO';
  image_url?: string;
  video_url?: string;
}

export class InstagramPublisher {
  // 1. AFEGIT paràmetre 'link' (opcional) perquè coincideixi amb els altres publishers
  static async publish(content: string, link?: string, mediaUrl?: string) {
    
    // Check de seguretat (Instagram sempre vol media)
    if (!mediaUrl) throw new Error("Instagram necessita obligatòriament una imatge o vídeo.");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user");

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!profile) throw new Error("Perfil no trobat");
    
    const orgId = profile.organization_id;

    const { data: creds } = await supabase
      .from('social_connections')
      .select('*')
      .eq('organization_id', orgId)
      .eq('provider', 'facebook')
      .single();

    if (!creds || !creds.provider_page_id) throw new Error("No hi ha connexió amb Facebook/Instagram.");

    // Busquem l'ID d'Instagram Business
    const igAccountRes = await fetch(`https://graph.facebook.com/v19.0/${creds.provider_page_id}?fields=instagram_business_account&access_token=${creds.access_token}`);
    const igData = await igAccountRes.json();
    
    const instagramUserId = igData.instagram_business_account?.id;
    if (!instagramUserId) throw new Error("La pàgina de Facebook no té un compte d'Instagram Business vinculat.");

    const mediaType = getMediaType(mediaUrl);
    console.log(`📸 Preparant Instagram (${mediaType})...`);

    // --- PREPARAR TEXT FINAL ---
    // Instagram no permet links clicables, però el podem escriure o indicar la BIO.
    const finalCaption = link 
      ? `${content}\n\n🔗 Link a la Bio o copia aquí:\n${link}` 
      : content;

    // --- PAS 1: Crear Contenidor ---
    const createMediaUrl = `https://graph.facebook.com/v19.0/${instagramUserId}/media`;
    
    const containerBody: InstaContainerPayload = {
      caption: finalCaption, // Usem el text amb l'enllaç afegit
      access_token: creds.access_token,
      media_type: mediaType 
    };

    if (mediaType === 'VIDEO') {
      containerBody.video_url = mediaUrl;
    } else {
      containerBody.image_url = mediaUrl;
    }
    
    const containerRes = await fetch(createMediaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerBody)
    });

    const containerData = await containerRes.json();
    if (containerData.error) throw new Error(`Error Insta Container: ${containerData.error.message}`);
    
    const creationId = containerData.id;

    // --- PAS 1.5: POLLING ---
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 20;

    while (!isReady && attempts < maxAttempts) {
      attempts++;
      console.log(`⏳ Processant media Instagram (${attempts}/${maxAttempts})...`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusUrl = `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${creds.access_token}`;
      const statusRes = await fetch(statusUrl);
      const statusData = await statusRes.json();

      if (statusData.status_code === 'FINISHED') {
        isReady = true;
      } else if (statusData.status_code === 'ERROR') {
        throw new Error("Instagram ha fallat al processar la imatge/vídeo.");
      }
    }

    if (!isReady) throw new Error("Timeout: Instagram ha trigat massa.");

    // --- PAS 2: Publicar ---
    console.log("🚀 Publicant post definitiu...");
    const publishUrl = `https://graph.facebook.com/v19.0/${instagramUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: creds.access_token
      })
    });
    
    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(`Error Insta Publish: ${publishData.error.message}`);

    return publishData.id;
  }
}