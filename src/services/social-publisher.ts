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
        console.log(`🚀 Publicant a ${payload.platform} via OAuth...`);

        let externalId = '';

        try {
            switch (payload.platform) {
                case 'linkedin':
                    externalId = await LinkedInPublisher.publish(payload.content, payload.link);
                    break;

                case 'facebook':
                    externalId = await FacebookPublisher.publish(payload.content, payload.link);
                    break;

                case 'instagram':
                    // Ara sí que tenim mediaUrl gràcies a l'upload
                    externalId = await InstagramPublisher.publish(payload.content, payload.mediaUrl!);
                    break;

                default:
                    throw new Error(`Plataforma ${payload.platform} no suportada.`);
            }

            return { success: true, externalId };

        } catch (error: unknown) {
            console.error(`❌ Error publicant a ${payload.platform}:`, error);
            // Rellancem l'error perquè la Server Action el guardi a la DB com a 'failed'
            throw error;
        }
    }
}
