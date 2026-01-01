import { Project } from '@/types/models';

// --- IMATGES EXISTENTS ---
import ribotFlowImg from '@/assets/images/ribotflowPresentacio.jpg';
import salutFlowImgDark from '@/assets/images/getsalutflowIntroDark.jpg';
import salutFlowImgLight from '@/assets/images/getsalutflowIntroLight.jpg';
import salutFlowImgDarkCA from '@/assets/images/getsalutflowDarkCA.jpg';
import salutFlowImgLightCA from '@/assets/images/getsalutflowLightCA.jpg';

// --- ✅ NOVES IMATGES TRIATU (Assegura't que els fitxers existeixen) ---
import triaTuImgCA from '@/assets/images/triatu_ca.jpg'; 
import triaTuImgES from '@/assets/images/triatu_es.jpg'; 
import triaTuImgEN from '@/assets/images/triatu_en.jpg'; 

export const PROJECTS: Project[] = [
  {
    id: 'ribotflow',
    title: 'RibotFlow',
    tagline: 'El Sistema Operatiu Integral',
    description: '...', 
    stats: ['CRM + Facturació', 'Automatització IA', 'Control Financer'],
    tags: ['ERP', 'Business', 'IA', 'Supabase'],
    color: 'from-purple-500 to-pink-500',
    image: ribotFlowImg,
    imageAlt: "Panell de control fosc de RibotFlow",
    link: 'https://ribotflow.com'
  },
  {
    id: 'salutflow',
    title: 'SalutFlow',
    tagline: 'El teu Centre Esportiu, Digitalitzat',
    description: '...',
    stats: ['App PWA', 'Pagaments Stripe', "Llistes d'Espera"],
    tags: ['SaaS', 'Sport', 'PWA', 'Stripe'],
    color: 'from-cyan-400 to-blue-600',
    link: 'https://getsalutflow.com',
    imageAlt: "App mòbil SalutFlow",
    
    image: salutFlowImgDark,

    adaptiveImages: {
      ca: {
        light: salutFlowImgLightCA,
        dark: salutFlowImgDarkCA
      },
      default: { // Per defecte (EN/ES) si no hi ha específica
        light: salutFlowImgLight,
        dark: salutFlowImgDark
      }
    }
  },
  // ✨ NOU PROJECTE TRIATU
  {
    id: 'triatu',
    title: 'TriaTu',
    tagline: 'El teu Xef Personal amb IA', // Fallback, el real ve del JSON
    description: '...', 
    stats: ['Receptes Generatives', 'Gestió de Rebost', 'Cuina d\'Aprofitament'], // Fallback
    tags: ['FoodTech', 'AI', 'Next.js', 'Gamification'],
    color: 'from-emerald-500 to-teal-600', 
    
    // Imatge per defecte (si falla la lògica d'idioma)
    image: triaTuImgEN, 
    imageAlt: "Interfície de l'assistent de cuina TriaTu",
    link: 'https://triatu.com',

    // ✅ Lògica d'imatges per idioma
    adaptiveImages: {
      ca: {
        light: triaTuImgCA,
        dark: triaTuImgCA // Utilitzem la mateixa si no tens versió fosca específica
      },
      es: {
        light: triaTuImgES,
        dark: triaTuImgES
      },
      en: {
        light: triaTuImgEN,
        dark: triaTuImgEN
      },
      default: {
        light: triaTuImgEN,
        dark: triaTuImgEN
      }
    }
  }
];