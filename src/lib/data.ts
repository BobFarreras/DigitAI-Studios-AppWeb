// src/lib/data.ts
import { StaticImageData } from 'next/image'; // 👈 Necessari pel tipatge

import bioshopImg from '@/assets/images/testimoni-garatgeestacio.jpg';
import salutFlow from '@/assets/images/salutflow.png';

export type Testimonial = {
  id: number | string;
  name: string;
  company: string;
  text: string;
  rating: number;
  projectType: 'web' | 'app' | 'automation';
  projectUrl?: string;
  image?: string | StaticImageData;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marc Vila",
    company: "Gestoria Vila",
    text: "Hem estalviat 20h setmanals gràcies al bot de WhatsApp.",
    rating: 5,
    projectType: 'automation'
  },
  {
    id: 2,
    name: "Anna Soler",
    company: "Garatge Estació", // He vist el nom al fitxer jpg
    text: "La web carrega instantàniament. Les vendes han pujat un 40%.",
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://garatgeestacio.com',
    // ✅ 3. USEM LA VARIABLE IMPORTADA
    image: bioshopImg
  },
  {
    id: 3,
    name: "Jordi P.",
    company: "Tech Solutions",
    text: "Han entès la nostra idea d'App a la primera.",
    rating: 5,
    projectType: 'app',
    image: salutFlow
  },

  // Nous exemples per al carrousel
  {
    id: 4,
    name: "Laura M.",
    company: "Clínica Dental",
    text: "El sistema de cites prèvies ha eliminat les trucades perdudes.",
    rating: 5,
    projectType: 'web'
  },
  {
    id: 5,
    name: "Pere Roig",
    company: "Logística Ràpida",
    text: "L'App per als repartidors funciona fins i tot sense cobertura.",
    rating: 5,
    projectType: 'app'
  }
];