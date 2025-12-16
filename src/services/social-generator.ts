import OpenAI from 'openai';
import { SocialDraftsSchema, type SocialDrafts } from '@/lib/schemas/social-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class SocialGeneratorService {
  /**
   * Genera esborranys per xarxes socials basats en un post.
   */
  static async generateFromPost(
    title: string, 
    content: string, 
    language: string = 'Catalan'
  ): Promise<SocialDrafts> {
    
    const cleanContent = content.substring(0, 15000);

    const systemPrompt = `
      Ets un Expert Social Media Manager per a 'DigitAI Studios'.
      Genera 3 peces de contingut (LinkedIn, Facebook, Instagram) basades en l'article proporcionat.
      
      IMPORTANT: Retorna NOMÉS un objecte JSON vàlid que compleixi aquesta estructura:
      {
        "linkedin": { "content": "...", "suggested_hashtags": ["..."] },
        "facebook": { "content": "..." },
        "instagram": { "content": "...", "image_prompt": "..." }
      }
      
      L'idioma de sortida ha de ser: ${language}.
    `;

    try {
      // 1. Cridem l'API estàndard amb mode JSON
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo", // O "gpt-4o"
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Títol: ${title}\n\nContingut:\n${cleanContent}` },
        ],
        response_format: { type: "json_object" }, // Forcem JSON
        temperature: 0.7,
      });

      const rawContent = completion.choices[0].message.content;

      if (!rawContent) {
        throw new Error("La IA ha retornat un contingut buit.");
      }

      // 2. Parsejem el JSON string a objecte
      const jsonObject = JSON.parse(rawContent);

      // 3. Validem amb Zod (Això garanteix que l'estructura és correcta)
      // Si la IA s'ha deixat algun camp, això llançarà un error controlat.
      const result = SocialDraftsSchema.parse(jsonObject);

      return result;

    } catch (error) {
      console.error("❌ Error al SocialGeneratorService:", error);
      // Opcional: Podem rellançar l'error o retornar un null segons com vulguis gestionar-ho
      throw error;
    }
  }
}