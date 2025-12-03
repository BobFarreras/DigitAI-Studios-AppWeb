import { StaticImageData } from 'next/image';
// Importa les teves imatges reals aquí
import ribotFlowImg from '@/assets/images/pantalla-ribotflow.jpg'; 
import salutFlowImg from '@/assets/images/pantalla-salutflow.jpg';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stats: string[];
  tags: string[];
  color: string;
  image: StaticImageData | null;
  link: string;
  imageAlt: string; // 👈 NOU CAMP AFEGIT
}

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
    // 👇 DESCRIU LA IMATGE REALMENT
    imageAlt: "Panell de control fosc de RibotFlow mostrant gràfiques de rendiment i llistat de clients", 
    link: 'https://ribotflow.com'
  },
  {
    id: 'salutflow',
    title: 'SalutFlow',
    tagline: 'El teu Centre Esportiu, Digitalitzat',
    description: '...',
    stats: ['App PWA', 'Pagaments Stripe', 'Llistes d\'Espera'],
    tags: ['SaaS', 'Sport', 'PWA', 'Stripe'],
    color: 'from-cyan-400 to-blue-600',
    image: salutFlowImg,
    // 👇 DESCRIU LA IMATGE REALMENT
    imageAlt: "Captura de l'aplicació mòbil SalutFlow amb el calendari de reserves de classes",
    link: 'https://getsalutflow.com'
  }
];