import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

export class FacebookPublisher {
  static async publish(content: string, link?: string, mediaUrl?: string) {
    console.log("🔍 FACEBOOK PUBLISHER REBUT URL:", mediaUrl);

    let pageId: string | undefined | null = process.env.FACEBOOK_PAGE_ID;
    let accessToken: string | undefined | null = process.env.FACEBOOK_ACCESS_TOKEN;

    // 1️⃣ ESTRATÈGIA HÍBRIDA (BUSCAR A LA DB SI EL ENV FALLA)
    if (!pageId || !accessToken) {
        console.log("⚠️ No hi ha credencials al .env, buscant a Supabase...");
        
        const supabase = await createClient();
        
        // A. Obtenim l'usuari actual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("❌ CRÍTIC: No hi ha usuari loguejat.");

        // B. 👇 CANVI CLAU: Obtenim TOTS els perfils (totes les teves organitzacions)
        const { data: profiles } = await supabase.from('profiles')
            .select('organization_id')
            .eq('id', user.id); // Sense .single() perquè pots tenir-ne molts!
        
        if (!profiles || profiles.length === 0) {
            throw new Error(`❌ L'usuari ${user.id} no pertany a cap organització.`);
        }

        // Extraiem la llista d'IDs (ex: ['org_1', 'org_2'])
        const orgIds = profiles.map(p => p.organization_id);
        console.log(`🏢 L'usuari pertany a ${orgIds.length} organitzacions. Buscant Facebook...`);

        // C. 👇 Busquem quina d'aquestes organitzacions té Facebook connectat
        const { data: creds } = await supabase.from('social_connections')
            .select('*')
            .in('organization_id', orgIds) // Busquem DINS de la llista d'orgs
            .eq('provider', 'facebook')
            .maybeSingle(); // Agafem la primera que trobem que tingui FB
        
        if (!creds) throw new Error("Cap de les teves organitzacions té Facebook connectat a la DB.");

        console.log(`✅ Connexió trobada a l'organització: ${creds.organization_id}`);

        pageId = creds.provider_page_id;
        accessToken = creds.access_token;
    } else {
        console.log("✅ Usant credencials de FACEBOOK del fitxer .env");
    }

    // Comprovació final
    if (!pageId || !accessToken) {
        throw new Error("No s'han pogut resoldre les credencials de Facebook.");
    }

    // ---------------------------------------------------------
    // 🚀 LÒGICA DE PUBLICACIÓ (Això es manté igual)
    // ---------------------------------------------------------
    const finalMessage = link ? `${content}\n\n—\n🚀 Vols saber-ne més? Llegeix l'article complet aquí:\n👉 ${link}` : content;

    if (mediaUrl) {
      console.log(`📥 Baixant imatge...`);
      const imgRes = await fetch(mediaUrl).catch(err => { throw new Error(`Error network: ${err.message}`) });
      
      if (!imgRes.ok) throw new Error(`Error descarregant imatge (${imgRes.status})`);
      const imgBlob = await imgRes.blob();
      console.log(`⚖️ Mida imatge: ${imgBlob.size} bytes`);

      const formData = new FormData();
      formData.append('access_token', accessToken!); 

      const type = getMediaType(mediaUrl);

      if (type === 'VIDEO') {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/videos`;
        formData.append('description', finalMessage);
        formData.append('file', imgBlob, 'video.mp4');
        
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        return handleResponse(res);

      } else {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
        formData.append('caption', finalMessage);
        formData.append('source', imgBlob, 'image.jpg');
        formData.append('published', 'true');

        const res = await fetch(endpoint, { method: 'POST', body: formData });
        return handleResponse(res);
      }
    } else {
      console.log("📝 Publicant només text...");
      const endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, message: finalMessage }),
      });
      return handleResponse(res);
    }
  }
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (data.error) throw new Error(`FB Error: ${data.error.message}`);
  return data.id || data.post_id;
}