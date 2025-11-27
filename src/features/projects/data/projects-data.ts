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
}

export const PROJECTS: Project[] = [
  {
    id: 'ribotflow',
    title: 'RibotFlow',
    tagline: 'El Sistema Operatiu Integral',
    description: 'Plataforma de gestió "Tot en Un" que unifica CRM, facturació i xarxes socials. Elimina el caos de tenir la informació dispersa i utilitza IA per redactar correus i gestionar oportunitats.',
    stats: ['CRM + Facturació', 'Automatització IA', 'Control Financer'],
    tags: ['ERP', 'Business', 'IA', 'Supabase'],
    color: 'from-purple-500 to-pink-500',
    image: ribotFlowImg, 
    link: 'https://ribotflow.com'
  },
  {
    id: 'salutflow',
    title: 'SalutFlow',
    tagline: 'El teu Centre Esportiu, Digitalitzat',
    description: 'Crea la teva pròpia App Web (PWA) en minuts sense programar. Gestiona reserves, pagaments recurrents (Stripe) i aforaments automàticament. Ideal per gimnasos i estudis.',
    stats: ['App PWA', 'Pagaments Stripe', 'Llistes d\'Espera'],
    tags: ['SaaS', 'Sport', 'PWA', 'Stripe'],
    color: 'from-cyan-400 to-blue-600',
    image: salutFlowImg,
    link: 'https://getsalutflow.com'
  }
];