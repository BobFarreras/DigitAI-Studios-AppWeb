// src/lib/schemas/social-ai.ts
import { z } from 'zod';

// Definim l'estructura exacta que volem que la IA ens retorni
export const SocialDraftsSchema = z.object({
  linkedin: z.object({
    content: z.string().describe("Text professional, amb salts de línia, emojis sobris i hashtags al final."),
    suggested_hashtags: z.array(z.string()).describe("5-7 hashtags rellevants per LinkedIn"),
  }),
  facebook: z.object({
    content: z.string().describe("Text atractiu, una mica més casual però informatiu. Crida a l'acció clara."),
  }),
  instagram: z.object({
    content: z.string().describe("Caption visual, curta i amb ganxo. Molts emojis i hashtags."),
    image_prompt: z.string().describe("Un prompt detallat per generar una imatge amb IA (DALL-E 3) si no es vol fer servir la foto del post."),
  }),
});

export type SocialDrafts = z.infer<typeof SocialDraftsSchema>;