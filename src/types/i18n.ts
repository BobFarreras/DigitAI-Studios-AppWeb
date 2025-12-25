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
  // 👇 AFEGEIX AIXÒ NOU
  products?: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
       name: string; // O title
       price?: string;
       image?: string;
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
  // 👇 Assegura't que el generador crea això, o fes-ho opcional (?)
  cta_banner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonLink?: string;
  };
  // 👇 Idem amb FAQ
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