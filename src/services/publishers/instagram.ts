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
  static async publish(content: string, link?: string, mediaUrl?: string) {
    if (!mediaUrl) throw new Error("Instagram necessita obligatòriament una imatge o vídeo.");

    console.log(`📸 INSTAGRAM PUBLISHER REBUT URL:`, mediaUrl);

    // FIX: Variables d'entorn
    let instagramUserId: string | undefined | null = process.env.INSTAGRAM_BUSINESS_ID; // Nou al .env
    let accessToken: string | undefined | null = process.env.FACEBOOK_ACCESS_TOKEN; // FB Token serveix per Insta

    // 1️⃣ ESTRATÈGIA HÍBRIDA
    if (!instagramUserId || !accessToken) {
        console.log("⚠️ No hi ha credencials INSTAGRAM al .env, buscant a Supabase...");
        
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("❌ CRÍTIC: No hi ha usuari loguejat.");

        // Obtenim TOTS els perfils
        const { data: profiles } = await supabase.from('profiles')
            .select('organization_id')
            .eq('id', user.id); 
        
        if (!profiles || profiles.length === 0) throw new Error(`❌ L'usuari ${user.id} no té perfils.`);

        const orgIds = profiles.map(p => p.organization_id);

        // Busquem connexió FB (Insta està dins de FB)
        const { data: creds } = await supabase.from('social_connections')
            .select('*')
            .in('organization_id', orgIds)
            .eq('provider', 'facebook') // Instagram via Facebook
            .maybeSingle();
        
        if (!creds || !creds.provider_page_id) throw new Error("No hi ha connexió amb Facebook/Instagram a la DB.");

        // Busquem l'ID d'Instagram Business associat a la pàgina
        console.log("🔍 Buscant compte d'Instagram vinculat a la pàgina de Facebook...");
        const igAccountRes = await fetch(`https://graph.facebook.com/v19.0/${creds.provider_page_id}?fields=instagram_business_account&access_token=${creds.access_token}`);
        const igData = await igAccountRes.json();
        
        instagramUserId = igData.instagram_business_account?.id;
        accessToken = creds.access_token;
    }

    if (!instagramUserId || !accessToken) throw new Error("No s'ha pogut obtenir l'ID d'Instagram.");

    console.log(`✅ ID Instagram: ${instagramUserId}`);
    const mediaType = getMediaType(mediaUrl);

    // --- TEXT FINAL ---
    const finalCaption = link ? `${content}\n\n🔗 Link a la Bio o copia aquí:\n${link}` : content;

    // --- PAS 1: Crear Contenidor ---
    const createMediaUrl = `https://graph.facebook.com/v19.0/${instagramUserId}/media`;
    
    const containerBody: InstaContainerPayload = {
      caption: finalCaption, 
      access_token: accessToken,
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

      const statusUrl = `https://graph.facebook.com/v19.0/${creationId}?fields=status_code&access_token=${accessToken}`;
      const statusRes = await fetch(statusUrl);
      const statusData = await statusRes.json();

      if (statusData.status_code === 'FINISHED') isReady = true;
      else if (statusData.status_code === 'ERROR') throw new Error("Instagram ha fallat al processar.");
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
        access_token: accessToken
      })
    });
    
    const publishData = await publishRes.json();
    if (publishData.error) throw new Error(`Error Insta Publish: ${publishData.error.message}`);

    return publishData.id;
  }
}