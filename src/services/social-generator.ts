import { GoogleGenerativeAI } from "@google/generative-ai";

interface SocialContent {
  linkedin: { content: string };
  facebook: { content: string };
  instagram: { content: string };
}

export class SocialGeneratorService {
  static async generateFromPost(title: string, postContent: string): Promise<SocialContent> {
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Manca la GEMINI_API_KEY al fitxer .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const modelsToTry = [
        
        "gemini-flash-latest"        
    ];

    const prompt = `
      Ets un Expert en Copywriting persuasiu.
      Objectiu: Aconseguir CLICS cap al blog. No expliquis tot l'article, crea intriga.

      TÍTOL: "${title}"
      RESUM: "${postContent.substring(0, 4000)}"

      🛑 REGLES D'OR (BREVETAT I MISTERI):
      1. MÀXIM 3-4 FRASES per post. Sigues concís.
      2. No donis la solució final, només planteja el problema i promet la solució al link.
      3. Comença amb una pregunta o dada xocant.
      4. Idioma: Català natiu.
      5. NO posis el link (s'afegeix automàtic).

      🎯 ESTRATÈGIA PER PLATAFORMA:
      - LinkedIn: Professional però intrigant. "Estàs cometent aquest error?... T'expliquem com solucionar-ho."
      - Facebook: Curiositat pura. "No us creureu el que hem descobert sobre..."
      - Instagram: Frase curta i directa + Emojis + Hashtags.

      Retorna NOMÉS JSON:
      {
        "linkedin": { "content": "..." },
        "facebook": { "content": "..." },
        "instagram": { "content": "..." }
      }
    `;

    let lastError: unknown = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🤖 Intentant generar amb model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse: SocialContent = JSON.parse(text);
            return jsonResponse; 

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`⚠️ Model ${modelName} fallit: ${errorMessage}`);
            lastError = error;
        }
    }

    return {
        linkedin: { content: `⚠️ Error IA. Article: ${title}.` },
        facebook: { content: `⚠️ Error generació.` },
        instagram: { content: `⚠️ Error IA.\n\n${title}` }
    };
  }
}