// FITXER: src/lib/data.ts

import { StaticImageData } from 'next/image';

// Imatges reals (Assegura't que els fitxers existeixen a aquesta ruta)
import garatgeImg from '@/assets/images/testimoni-garatgeestacio.jpg';
import salutFlowImg from '@/assets/images/salutflow.png';
import dataflow from '@/assets/images/cap-dataflow.jpg';



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
    id: 'garatge-estacio',
    name: "Vado",
    company: "Garatge Estació",
    // ✅ Text específic sobre el nou disseny i les reserves d'autocaravanes
    text: "Estem molt contents amb el nou disseny. El sistema de reserves online per a cites de taller i la zona d'autocaravanes ens ha facilitat moltíssim la gestió.",
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://garatgeestacio.com',
    image: garatgeImg
  },
  {
    id: 'guirigall',
    name: "Adriana",
    company: "Guirigall",
    // ✅ Text específic sobre automatització de RRSS
    text: "L'automatització de les xarxes socials ha estat un canvi clau. Ara tenim presència constant sense haver d'estar pendents del mòbil cada dia.",
    rating: 5,
    projectType: 'automation'
  },
  {
    id: 'inspira',
    name: "Santi Serralvo",
    company: "Inspira Esport i Salut",
    text: "L'App Salut Flow ha professionalitzat la relació amb els nostres usuaris. Una eina intuïtiva que ens ajuda a créixer.",
    rating: 5,
    projectType: 'app',
    image: salutFlowImg
  },
  {
    id: 'aquabalance',
    name: "Marta Puig",
    company: "Aquabalance",
    text: "Necessitàvem una web que transmetés pau i professionalitat. El resultat ha superat les expectatives amb una imatge neta i moderna.",
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://aquabalance.com',
    image: salutFlowImg
  },
  {
    id: 'rsc',
    name: "Raul Solà",
    company: "RSC Instal·lacions",
    text: "Una web ràpida i directa. Ara els clients poden veure clarament els nostres serveis d'instal·lació i contactar-nos fàcilment.",
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://rscinstallacions.com/',
    image: salutFlowImg
  },
  {
    id: 'analytic',
    name: "Ignasi Farreras",
    company: "Ocaso",
    text: "L'appWeb ens permet visualitzar grafiques i estadistiques arxius exel que ens permet ser mes aguils i eficients.",
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://analytics-pwa.vercel.app/',
    image: dataflow
  }
];