import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

// ✅ CORRECCIÓ: L'API v19+ exigeix 'REELS' (plural) per a vídeo.
interface InstaContainerPayload {
  access_token: string;
  caption: string;
  media_type: 'IMAGE' | 'REELS'; 
  image_url?: string;
  video_url?: string;
}

export class InstagramPublisher {
  // Utilitzem v19.0 que és l'estable actual
  private static API_VERSION = 'v19.0';

  static async publish(content: string, link?: string, mediaUrl?: string) {
    if (!mediaUrl) throw new Error("Instagram necessita obligatòriament una imatge o vídeo.");

    console.log(`📸 INSTAGRAM PUBLISHER REBUT URL:`, mediaUrl);

    // ---------------------------------------------------------
    // 1️⃣ AUTENTICACIÓ (Idèntica a FacebookPublisher)
    // ---------------------------------------------------------
    let instagramUserId: string | undefined | null = process.env.INSTAGRAM_BUSINESS_ID;
    let accessToken: string | undefined | null = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!instagramUserId || !accessToken) {
        console.log("⚠️ No hi ha credencials INSTAGRAM al .env, buscant a Supabase...");
        
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("❌ CRÍTIC: No hi ha usuari loguejat.");

        const { data: profiles } = await supabase.from('profiles')
            .select('organization_id')
            .eq('id', user.id); 
        
        if (!profiles || profiles.length === 0) throw new Error(`❌ L'usuari ${user.id} no té perfils.`);

        const orgIds = profiles.map(p => p.organization_id);

        const { data: creds } = await supabase.from('social_connections')
            .select('*')
            .in('organization_id', orgIds)
            .eq('provider', 'facebook')
            .maybeSingle();
        
        if (!creds || !creds.provider_page_id) throw new Error("No hi ha connexió amb Facebook/Instagram a la DB.");

        console.log(`🔍 Buscant compte d'Instagram vinculat a la pàgina FB ${creds.provider_page_id}...`);
        
        const igAccountRes = await fetch(`https://graph.facebook.com/${this.API_VERSION}/${creds.provider_page_id}?fields=instagram_business_account&access_token=${creds.access_token}`);
        const igData = await igAccountRes.json();
        
        if (!igData.instagram_business_account?.id) {
            throw new Error("⚠️ Aquesta pàgina de Facebook no té un compte d'Instagram Business vinculat.");
        }

        instagramUserId = igData.instagram_business_account.id;
        accessToken = creds.access_token;
    }

    if (!instagramUserId || !accessToken) throw new Error("No s'ha pogut obtenir l'ID d'Instagram.");

    // ---------------------------------------------------------
    // 2️⃣ PREPARACIÓ DEL PAYLOAD
    // ---------------------------------------------------------
    
    const detectedType = getMediaType(mediaUrl); // 'IMAGE' | 'VIDEO'
    const isVideo = detectedType === 'VIDEO';

    const finalCaption = link 
        ? `${content}\n\n🔗 Link a la Bio o:\n${link}` 
        : content;

    const endpointContainer = `https://graph.facebook.com/${this.API_VERSION}/${instagramUserId}/media`;
    
    // ✅ CANVI CRÍTIC: 'REELS' (plural).
    // Si és vídeo, posem REELS. Si és imatge, IMAGE.
    const containerBody: InstaContainerPayload = {
      caption: finalCaption, 
      access_token: accessToken,
      media_type: isVideo ? 'REELS' : 'IMAGE'
    };

    if (isVideo) {
        containerBody.video_url = mediaUrl;
        // Opcional: share_to_feed ajuda a que aparegui al grid principal
        // (encara que 'REELS' ja ho sol fer per defecte, no està de més saber-ho, 
        // però de moment no ho posem per evitar errors de paràmetres extra)
    } else {
        containerBody.image_url = mediaUrl;
    }
    
    // ---------------------------------------------------------
    // 3️⃣ CREAR CONTAINER
    // ---------------------------------------------------------
    console.log(`📤 Creant Container (${isVideo ? 'REELS' : 'IMAGE'})...`);
    
    const containerRes = await fetch(endpointContainer, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerBody)
    });

    const containerData = await containerRes.json();
    
    if (containerData.error) {
        console.error("❌ Error Instagram Container API:", containerData);
        // Mostrem missatge més net
        throw new Error(`Error Insta Container: ${containerData.error.error_user_msg || containerData.error.message}`);
    }
    
    const creationId = containerData.id;
    console.log(`📦 Container Creat ID: ${creationId}`);

    // ---------------------------------------------------------
    // 4️⃣ POLLING (IMPRESCINDIBLE PER VÍDEOS)
    // ---------------------------------------------------------
    if (isVideo) {
        console.log("⏳ El vídeo requereix processament. Esperant...");
        let isReady = false;
        let attempts = 0;
        const maxAttempts = 20; // 60 segons max

        while (!isReady && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3s

            const statusUrl = `https://graph.facebook.com/${this.API_VERSION}/${creationId}?fields=status_code,status&access_token=${accessToken}`;
            const statusRes = await fetch(statusUrl);
            const statusData = await statusRes.json();

            console.log(`🔄 Estat processament (${attempts}/20): ${statusData.status_code}`);

            if (statusData.status_code === 'FINISHED') {
                isReady = true;
            } else if (statusData.status_code === 'ERROR') {
                throw new Error("Instagram ha fallat al processar el vídeo (Error intern de FB).");
            }
        }
        
        if (!isReady) throw new Error("Timeout: El vídeo ha trigat massa a processar-se.");
    }

    // ---------------------------------------------------------
    // 5️⃣ PUBLICAR (Media Publish)
    // ---------------------------------------------------------
    console.log("🚀 Publicant post definitiu...");
    
    const publishUrl = `https://graph.facebook.com/${this.API_VERSION}/${instagramUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken
      })
    });
    
    const publishData = await publishRes.json();
    
    if (publishData.error) {
        throw new Error(`Error Insta Publish: ${publishData.error.message}`);
    }

    console.log(`✅ PUBLICAT A INSTAGRAM! ID: ${publishData.id}`);
    return publishData.id;
  }
}