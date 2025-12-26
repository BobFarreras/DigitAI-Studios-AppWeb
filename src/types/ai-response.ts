// src/types/ai-response.ts

// 1. Sub-estructures per evitar 'any'
export interface AiHero {
  title?: string;
  subtitle?: string;
  cta?: string;
  image?: string;
  image_prompt?: string;
}

export interface AiStatsObj {
  label1?: string;
  value1?: string;
  label2?: string;
  value2?: string;
  label3?: string;
  value3?: string;
}

export interface AiAbout {
  title?: string;
  description?: string;
  stats?: AiStatsObj; // La IA ho torna com objecte pla
  image?: string;
  badge?: string;
}

export interface AiSocials {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface AiContact {
  email?: string;
  phone?: string;
  address?: string;
  socials?: AiSocials;
}

export interface AiTheme {
  primary?: string;
  secondary?: string;
  layout?: 'modern' | 'shop';
}

export interface AiNavbar {
  links?: Record<string, string>;
  cta?: string;
}

export interface AiFooterLegal {
  privacy?: string;
  cookies?: string;
  terms?: string;
}

export interface AiFooter {
  description?: string;
  legal?: AiFooterLegal;
}

export interface AiFeatures {
  booking?: boolean;
  ecommerce?: boolean;
  blog?: boolean;
  gallery?: boolean;
  faq?: boolean;
}

export interface AiSectionObj {
  id: string;
  type: string;
}

// 2. L'objecte PRINCIPAL que retorna Gemini
export interface AiGeneratedConfig {
  name: string;
  description: string;
  sector?: string;
  
  theme?: AiTheme;
  Navbar?: AiNavbar;
  Footer?: AiFooter;
  contact?: AiContact;
  features?: AiFeatures;

  // La landing pot ser strings ("hero") o objectes ({id: "hero" ...})
  landing?: {
    sections?: Array<string | AiSectionObj>;
  };

  // Seccions de contingut específic
  hero?: AiHero;
  about?: AiAbout;
  
  // Si en el futur hi ha més seccions, s'han de tipar aquí, MAI posar [key: string]: any
}