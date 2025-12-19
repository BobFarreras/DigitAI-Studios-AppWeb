import { Project } from '@/types/models';

// Importa les teves imatges reals aquí
import ribotFlowImg from '@/assets/images/ribotflowPresentacio.jpg';
import salutFlowImgDark from '@/assets/images/getsalutflowIntroDark.jpg';
import salutFlowImgLight from '@/assets/images/getsalutflowIntroLight.jpg';
import salutFlowImgDarkCA from '@/assets/images/getsalutflowDarkCA.jpg';
import salutFlowImgLightCA from '@/assets/images/getsalutflowLightCA.jpg';

export const PROJECTS: Project[] = [
  {
    id: 'ribotflow',
    title: 'RibotFlow',
    tagline: 'El Sistema Operatiu Integral',
    description: '...', // Recorda que els textos reals venen del JSON de traducció
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
    
    // Imatge Fallback (per si falla alguna cosa)
    image: salutFlowImgDark,

    // Lògica Adaptativa
    adaptiveImages: {
      // Si l'usuari està en Català
      ca: {
        light: salutFlowImgDarkCA,
        dark: salutFlowImgLightCA
      },
      // Per qualsevol altre idioma (en, es, fr...)
      default: {
        light: salutFlowImgDark,
        dark: salutFlowImgLight
      }
    }
  }
];