import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

interface LinkedInRegisterRequest {
  registerUploadRequest: {
    recipes: string[];
    owner: string;
    serviceRelationships: { relationshipType: "OWNER"; identifier: "urn:li:userGeneratedContent" }[];
  };
}

interface LinkedInRegisterResponse {
  value: {
    asset: string;
    uploadMechanism: {
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": {
        uploadUrl: string;
        headers: Record<string, string>;
      };
    };
  };
}

export class LinkedInPublisher {
  static async publish(content: string, link?: string, mediaUrl?: string) {
    console.log("🚀 Iniciant LinkedIn Publisher...");

    // FIX: Variables d'entorn
    let accessToken: string | undefined | null = process.env.LINKEDIN_ACCESS_TOKEN;
    let authorUrn: string | undefined | null = process.env.LINKEDIN_PERSON_URN; // ex: urn:li:person:12345

    // 1️⃣ ESTRATÈGIA HÍBRIDA
    if (!accessToken || !authorUrn) {
        console.log("⚠️ No hi ha credencials LINKEDIN al .env, buscant a Supabase...");
        
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user");

        const { data: profiles } = await supabase.from('profiles').select('organization_id').eq('id', user.id);
        if (!profiles || profiles.length === 0) throw new Error("Perfil no trobat");

        const orgIds = profiles.map(p => p.organization_id);

        const { data: creds } = await supabase
            .from('social_connections')
            .select('*')
            .in('organization_id', orgIds)
            .eq('provider', 'linkedin')
            .maybeSingle();

        if (!creds) throw new Error("LinkedIn no està connectat a la DB.");

        accessToken = creds.access_token;
        const isOrg = creds.provider_page_id && !isNaN(Number(creds.provider_page_id));
        authorUrn = `urn:li:${isOrg ? 'organization' : 'person'}:${creds.provider_page_id || creds.provider_account_id}`;
    }

    if (!accessToken || !authorUrn) throw new Error("No s'ha pogut obtenir accés a LinkedIn.");

    console.log(`✅ Publicant com a: ${authorUrn}`);

    // --- CONTINGUT ---
    const finalContent = link ? `${content}\n\n—\n🚀 Vols saber-ne més? Llegeix l'article complet aquí:\n👉 ${link}` : content;

    let assetUrn: string | undefined = undefined;

    // --- PAS 1: PUJADA D'IMATGE (ASSET) ---
    if (mediaUrl && getMediaType(mediaUrl) === 'IMAGE') {
        console.log("📥 Descarregant imatge...");
        const imageRes = await fetch(mediaUrl);
        if (!imageRes.ok) throw new Error("Error baixant imatge");
        const imageBlob = await imageRes.blob();

        // 1. Registrar
        console.log("1️⃣ Registrant Upload...");
        const registerBody: LinkedInRegisterRequest = {
            registerUploadRequest: {
                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                owner: authorUrn,
                serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }]
            }
        };

        const regRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(registerBody)
        });

        const regData: LinkedInRegisterResponse = await regRes.json();
        if (!regData.value) throw new Error("Error registrant asset a LinkedIn");
        
        const uploadUrl = regData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        assetUrn = regData.value.asset;

        // 2. Pujar Binari
        console.log("2️⃣ Pujant bytes...");
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/octet-stream' },
            body: imageBlob
        });

        // 3. ESPERAR QUE ESTIGUI LLESTA (POLLING)
        let isReady = false;
        let attempts = 0;
        console.log("⏳ Esperant processament de LinkedIn...");
        
        while (!isReady && attempts < 10) { 
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            
            const statusRes = await fetch(`https://api.linkedin.com/v2/assets/${assetUrn}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const statusData = await statusRes.json();
            
            if (statusData.recipes?.[0]?.status === 'AVAILABLE') {
                isReady = true;
                console.log("✅ Imatge processada i llesta!");
            }
        }
    }

    // --- PAS 2: CREAR POST ---
    console.log("3️⃣ Publicant Post...");

    const requestBody = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: finalContent },
          shareMediaCategory: assetUrn ? 'IMAGE' : 'NONE',
          media: assetUrn ? [{
            status: 'READY',
            description: { text: 'Image' },
            media: assetUrn, 
            title: { text: 'Image' }
          }] : undefined
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const err = await response.json();
        if (response.status === 400 && JSON.stringify(err).includes("duplicate")) {
            console.warn("⚠️ Post duplicat, ignorant error.");
            return "DUPLICATE_IGNORED";
        }
        throw new Error(`LinkedIn Error: ${err.message}`);
    }

    const data = await response.json();
    return data.id; 
  }
}