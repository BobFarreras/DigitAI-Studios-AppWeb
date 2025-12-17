import { LinkedInPublisher } from './publishers/linkedin';
import { FacebookPublisher } from './publishers/facebook';
import { InstagramPublisher } from './publishers/instagram';

type PublishPayload = {
    platform: 'linkedin' | 'facebook' | 'instagram';
    content: string;
    mediaUrl?: string | null;
    link?: string;
};

export class SocialPublisherService {
    static async publish(payload: PublishPayload) {
        console.log(`🚀 SocialService: Enrutant cap a ${payload.platform}...`);
        console.log(`📦 Payload Media: ${payload.mediaUrl ? payload.mediaUrl : 'CAP'}`);

        let externalId = '';

        try {
            switch (payload.platform) {
                case 'linkedin':
                    // ⚠️ CORRECCIÓ: Passem el 3r argument (mediaUrl)
                    externalId = await LinkedInPublisher.publish(
                        payload.content,
                        payload.link,
                        payload.mediaUrl || undefined
                    );
                    break;

                case 'facebook':
                    // ⚠️ CORRECCIÓ CRÍTICA: Aquí faltava passar payload.mediaUrl !!
                    externalId = await FacebookPublisher.publish(
                        payload.content,
                        payload.link,
                        payload.mediaUrl || undefined // <--- AQUESTA ERA LA PEÇA QUE FALTAVA
                    );
                    break;

                case 'instagram':
                    if (!payload.mediaUrl) throw new Error("Instagram requereix imatge.");

                    // ABANS: externalId = await InstagramPublisher.publish(payload.content, payload.mediaUrl);

                    // ARA: Li passem també el link
                    externalId = await InstagramPublisher.publish(
                        payload.content,
                        payload.link,
                        payload.mediaUrl
                    );
                    break;

                default:
                    throw new Error(`Plataforma ${payload.platform} no suportada.`);
            }

            return { success: true, externalId };

        } catch (error: unknown) {
            console.error(`❌ Error al servei ${payload.platform}:`, error);
            throw error;
        }
    }
}