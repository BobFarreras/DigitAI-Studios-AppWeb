export interface I18nSchema {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    image_prompt: string;
    image?: string;
  };
  about: {
    badge: string;
    title: string;
    description: string;
    image_prompt: string;
    image?: string;
    // Permetem flexibilitat en stats (objecte o array)
    stats: {
      label1: string; value1: string;
      label2: string; value2: string;
      label3: string; value3: string;
    } | Array<{ label: string; value: string }>;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon_name?: string;
    }>;
  };
  
  // ✅ CORRECCIÓ 1: Renomenat a 'featured_products' per coincidir amb el config
  // ✅ CORRECCIÓ 2: Afegit 'limit' (el component el fa servir per tallar l'array de DB)
  featured_products?: {
    badge?: string;
    title: string;
    subtitle: string;
    limit?: number; 
  };

  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    reviews: Array<{
      author: string;
      role: string;
      text: string;
      avatar_gender?: string; // Opcional
      avatar?: string;
    }>;
  };

  cta_banner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonLink?: string;
  };

  // ✅ CORRECCIÓ 3: Afegit MAP (necessari pel fallback d'actions.ts)
  map?: {
    title: string;
    subtitle: string;
  };

  faq: {
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  
  contact: {
    title: string;
    description: string;
    button: string;
  };
}