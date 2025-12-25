import { GoogleGenAI } from "@google/genai";

interface SocialContent {
  linkedin: { content: string };
  facebook: { content: string };
  instagram: { content: string };
}

export class SocialGeneratorService {
  static async generateFromPost(title: string, postContent: string): Promise<SocialContent> {
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Manca la GEMINI_API_KEY al fitxer .env");

    // 1. Inicialitzem amb la NOVA llibreria (igual que AIService)
    const genAI = new GoogleGenAI({ apiKey });
    
    // Model que sabem que funciona bé amb JSON
    const modelName = "gemini-2.5-flash"; 

    const prompt = `
      Ets un Expert en Copywriting persuasiu.
      Objectiu: Aconseguir CLICS cap al blog. No expliquis tot l'article, crea intriga.

      TÍTOL: "${title}"
      RESUM: "${postContent.substring(0, 4000)}"

      🛑 REGLES D'OR (BREVETAT I MISTERI):
      1. MÀXIM 3-4 FRASES per post. Sigues concís.
      2. No donis la solució final, només planteja el problema i promet la solució al link.
      3. Comença amb una pregunta o dada xocant.
      4. Idioma: CATALÀ.
      5. NO posis el link (s'afegeix automàticament després).

      🎯 ESTRATÈGIA PER PLATAFORMA:
      - LinkedIn: Professional però intrigant.
      - Facebook: Curiositat pura.
      - Instagram: Frase curta + Emojis + Hashtags.

      OUTPUT: Retorna JSON pur seguint l'esquema.
    `;

    // 2. Definim l'esquema estricte (Així evitem errors de parseig)
    const schema = {
        type: "OBJECT",
        properties: {
            linkedin: { type: "OBJECT", properties: { content: { type: "STRING" } } },
            facebook: { type: "OBJECT", properties: { content: { type: "STRING" } } },
            instagram: { type: "OBJECT", properties: { content: { type: "STRING" } } }
        },
        required: ["linkedin", "facebook", "instagram"]
    };

    try {
        console.log(`🤖 Generant Social Media amb ${modelName}...`);

        // 3. Crida a l'API amb la sintaxi nova
        const response = await genAI.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7
            }
        });

        const text = response.text;
        if (!text) throw new Error("Resposta buida de Gemini");

        // 4. Retornem el JSON parsejat (ja validat per l'esquema)
        return JSON.parse(text) as SocialContent;

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`⚠️ Error generant Social Content: ${errorMessage}`);
        
        // Fallback d'emergència
        return {
            linkedin: { content: `Nou article disponible: ${title}. Llegeix-lo ara!` },
            facebook: { content: `No us perdeu el nostre nou post: ${title}.` },
            instagram: { content: `Nou post! 🚀 ${title} #blog #novetat` }
        };
    }
  }
}