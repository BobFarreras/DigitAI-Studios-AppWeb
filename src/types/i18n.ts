export interface I18nSchema {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    image_prompt: string;
    image?: string; // Opcional perquè l'afegim després amb ImageService
  };
  about: {
    badge: string; // 👈 Això arregla l'error 1
    title: string;
    description: string;
    image_prompt: string;
    image?: string;
    stats: {
      label1: string; value1: string;
      label2: string; value2: string;
      label3: string; value3: string;
    } | Array<{ label: string; value: string }>; // Acceptem els dos formats
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
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    reviews: Array<{
      author: string;
      role: string;
      text: string;
      avatar_gender: string;
      avatar?: string;
    }>;
  };
  cta_banner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonLink?: string;
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
    description: string; // 👈 Això arregla l'error 2 (abans potser tenies subtitle)
    button: string;
  };
}