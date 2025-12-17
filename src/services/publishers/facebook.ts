import { createClient } from '@/lib/supabase/server';
import { getMediaType } from '@/lib/utils/media';

export class FacebookPublisher {
  static async publish(content: string, link?: string, mediaUrl?: string) {
    console.log("🔍 FACEBOOK PUBLISHER REBUT URL:", mediaUrl);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user");

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
    if (!profile) throw new Error("Perfil no trobat");

    const { data: creds } = await supabase.from('social_connections').select('*').eq('organization_id', profile.organization_id).eq('provider', 'facebook').single();
    if (!creds) throw new Error("Facebook no està connectat.");

    const pageId = creds.provider_page_id;
    const accessToken = creds.access_token;

    // ✅ RECUPEREM EL LINK: Ara que pugem la foto com a arxiu, podem posar el link al text sense por.
    const finalMessage = link ? `${content}\n\n—\n🚀 Vols saber-ne més? Llegeix l'article complet aquí:\n👉 ${link}` : content;

    if (mediaUrl) {
      console.log(`📥 Baixant imatge per Upload Binari...`);
      const imgRes = await fetch(mediaUrl);
      if (!imgRes.ok) throw new Error(`Error descarregant imatge (${imgRes.status})`);
      const imgBlob = await imgRes.blob();
      console.log(`⚖️ Mida imatge: ${imgBlob.size} bytes`);

      const formData = new FormData();
      formData.append('access_token', accessToken);

      const type = getMediaType(mediaUrl);

      if (type === 'VIDEO') {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/videos`;
        formData.append('description', finalMessage);
        formData.append('file', imgBlob, 'video.mp4');

        console.log("📹 Pujant vídeo binari...");
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        return handleResponse(res);

      } else {
        const endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
        formData.append('caption', finalMessage); // Aquí va el text + link
        formData.append('source', imgBlob, 'image.jpg'); // CLAU CRÍTICA PER FOTOS
        formData.append('published', 'true');

        console.log("📸 Pujant foto binària...");
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        return handleResponse(res);
      }
    } else {
      // Cas només text
      console.log("📝 Publicant només text (sense imatge)...");
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