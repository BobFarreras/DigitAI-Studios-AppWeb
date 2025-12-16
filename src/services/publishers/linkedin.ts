import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

// --- DEFINICIÓ DE TIPUS PER A L'API DE LINKEDIN ---

interface LinkedInVisibility {
  'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS';
}

interface LinkedInMediaItem {
  status: 'READY';
  description?: { text: string };
  originalUrl: string;
  title?: { text: string };
}

interface LinkedInShareContent {
  shareCommentary: {
    text: string;
  };
  shareMediaCategory: 'NONE' | 'ARTICLE' | 'IMAGE' | 'VIDEO';
  media?: LinkedInMediaItem[];
}

interface LinkedInSpecificContent {
  'com.linkedin.ugc.ShareContent': LinkedInShareContent;
}

interface LinkedInRequestBody {
  author: string;
  lifecycleState: 'PUBLISHED' | 'DRAFT';
  specificContent: LinkedInSpecificContent;
  visibility: LinkedInVisibility;
}

// --------------------------------------------------

export class LinkedInPublisher {
  static async publish(content: string, link?: string, mediaUrl?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user");

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!profile) throw new Error("Perfil no trobat");

    const { data: creds } = await supabase
      .from('social_connections')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('provider', 'linkedin')
      .single();

    if (!creds) throw new Error("LinkedIn no està connectat.");

    // 1. Preparem el text: L'enllaç passa a ser part del text per evitar Link Preview cards
    const finalContent = link ? `${content}\n\n👇 Llegeix més aquí:\n${link}` : content;

    // 2. Determinem l'URN de l'autor
    // Si l'ID és numèric, assumim que és Organization, si no, Person.
    const isOrg = creds.provider_page_id && !isNaN(Number(creds.provider_page_id));
    const authorUrn = `urn:li:${isOrg ? 'organization' : 'person'}:${creds.provider_page_id || creds.provider_account_id}`;

    // 3. Configurem el cos de la petició amb els tipus correctes
    const requestBody: LinkedInRequestBody = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: finalContent,
          },
          shareMediaCategory: 'NONE', // Valor inicial
          media: undefined
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // 4. SI HI HA FOTO -> Canviem l'estratègia a 'IMAGE'
    if (mediaUrl) {
        // Obtenim el tipus (per si en el futur volem suportar vídeo natiu)
        const mediaType = getMediaType(mediaUrl);
        
        // Només si és IMATGE ho pugem com a natiu. 
        // Si és vídeo, de moment ho tractem com a text+link perquè l'API de vídeo de LinkedIn és molt complexa (3 passos).
        if (mediaType === 'IMAGE') {
            requestBody.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
            requestBody.specificContent['com.linkedin.ugc.ShareContent'].media = [
                {
                    status: 'READY',
                    description: { text: 'Imatge del post' },
                    originalUrl: mediaUrl,
                }
            ];
        } else {
             console.warn("⚠️ Vídeo a LinkedIn: Es publicarà com a text amb enllaç per evitar errors de format.");
        }
    }

    console.log("🚀 Publicant a LinkedIn...");

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LinkedIn API Error:', errorData);
      throw new Error(`Error LinkedIn: ${errorData.message}`);
    }

    const data = await response.json();
    return data.id; 
  }
}