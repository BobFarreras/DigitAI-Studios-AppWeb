import { I18nSchema } from "@/types/i18n";

export class ImageService {
  
  /**
   * Recorre tot l'objecte JSON i enriqueix les propietats 'image' i 'avatar'
   * utilitzant els prompts generats per la IA.
   */
  public enrichWithImages(data: I18nSchema): I18nSchema {
    console.log("🎨 [ImageService] Generant URLs visuals...");

    // 1. Hero Section
    if (data.hero.image_prompt) {
      data.hero.image = this.generateImageUrl(data.hero.image_prompt, "1920", "1080");
    }

    // 2. About Section
    if (data.about.image_prompt) {
      data.about.image = this.generateImageUrl(data.about.image_prompt, "800", "600");
    }

    // 3. Testimonials (Avatars)
    if (data.testimonials && Array.isArray(data.testimonials.reviews)) {
      data.testimonials.reviews.forEach((review, index) => {
          // Normalitzem el gènere
          const gender = review.avatar_gender === 'female' ? 'women' : 'men';
          // ID determinista perquè no canviï a cada render en el futur
          const id = 20 + index; 
          
          // Assignació segura (gràcies a l'update de I18nSchema)
          review.avatar = `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
      });
    }

    return data;
  }

  /**
   * Genera una URL d'imatge sintètica o d'estoc basada en keywords.
   * Utilitza Pollinations.ai (molt ràpid i estable per a demos/MVP).
   */
  private generateImageUrl(prompt: string, width: string, height: string): string {
    // Netegem el prompt per fer-lo segur a la URL
    const safePrompt = encodeURIComponent(prompt.trim());
    
    // Retornem la URL llesta per consumir
    return `https://image.pollinations.ai/prompt/${safePrompt}?width=${width}&height=${height}&nologo=true&model=flux`;
  }
}