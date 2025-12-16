import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

export class FacebookPublisher {
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
      .eq('provider', 'facebook')
      .single();

    if (!creds) throw new Error("Facebook no està connectat.");

    // 1. EL TRUC: L'enllaç és només text. Mai un paràmetre d'API.
    const finalMessage = link ? `${content}\n\n🔗 ${link}` : content;
    const pageId = creds.provider_page_id;
    const accessToken = creds.access_token;

    console.log(`🚀 Publicant a Facebook...`);

    // --- CAS A: MULTIMÈDIA (Foto/Vídeo) ---
    if (mediaUrl) {
      const type = getMediaType(mediaUrl);

      // Si és VÍDEO -> Endpoint /videos
      if (type === 'VIDEO') {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/videos`;
        // Vídeos funcionen bé amb JSON
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken,
            file_url: mediaUrl,
            description: finalMessage, // Text + Link aquí
          }),
        });
        return handleResponse(response);
      }
      
      // Si és FOTO -> Endpoint /photos amb Query Params (Mètode infal·lible)
      else {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
        
        const params = new URLSearchParams();
        params.append('url', mediaUrl);         // LA FOTO
        params.append('caption', finalMessage); // EL TEXT + LINK
        params.append('access_token', accessToken);
        params.append('published', 'true');

        // Enviem sense body, tot a la URL
        const response = await fetch(`${endpoint}?${params.toString()}`, {
          method: 'POST',
        });
        return handleResponse(response);
      }
    } 
    
    // --- CAS B: NOMÉS TEXT (Sense foto) ---
    else {
      // Aquí sí que si vols podem deixar que FB faci preview, o només text.
      // Si vols ser consistent: Només text.
      const endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          message: finalMessage,
          // link: link // <-- DESCOMENTA NOMÉS SI VOLS LINK PREVIEW QUAN NO HI HA FOTO
        }),
      });
      return handleResponse(response);
    }
  }
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (data.error) {
    console.error('❌ Facebook Error:', data.error);
    throw new Error(`Error FB: ${data.error.message}`);
  }
  return data.id || data.post_id;
}