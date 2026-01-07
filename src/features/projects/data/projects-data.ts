
// 1️⃣ IMPORTA EL TIPUS ORIGINAL (No el re-defineixis aquí)
import { Project } from '@/types/models'; 

// --- IMATGES I LOGOS ---
import ribotFlowImg from '@/assets/images/ribotflowPresentacio.jpg';
import salutFlowImgDark from '@/assets/images/getsalutflowIntroDark.jpg';
import salutFlowImgLight from '@/assets/images/getsalutflowIntroLight.jpg';
import salutFlowImgDarkCA from '@/assets/images/getsalutflowDarkCA.jpg';
import salutFlowImgLightCA from '@/assets/images/getsalutflowLightCA.jpg';
import triaTuImgCA from '@/assets/images/triatu_ca.jpg';
import triaTuImgES from '@/assets/images/triatu_es.jpg';
import triaTuImgEN from '@/assets/images/triatu_en.jpg';

import logoRibotFlow from '@/assets/images/logoRibotflow.png';
import logoSalutFlow from '@/assets/images/logoSalutflow.png';
import logoTriaTu from '@/assets/images/logoTriaTu.png';

// 2️⃣ ESBORRA LES INTERFÍCIES QUE TENIES AQUÍ (Project, ThemeImageSet...)
// Ja les estem important de '@/types/models'

// --- DADES ---
// Ara 'PROJECTS' utilitza el tipus oficial, així que serà compatible amb ProjectCard
export const PROJECTS: Project[] = [
    {
        id: 'ribotflow',
        title: 'RibotFlow',
        tagline: 'El Sistema Operatiu Integral',
        description: 'Gestió empresarial tot en un.',
        stats: ['CRM', 'IA', 'ERP'],
        tags: ['ERP', 'Business', 'IA'],
        color: 'from-purple-500 to-pink-500',
        image: ribotFlowImg,
        imageAlt: "Panell de control RibotFlow",
        link: 'https://ribotflow.com',
        logo: logoRibotFlow,
    },
    {
        id: 'salutflow',
        title: 'SalutFlow',
        tagline: 'Gestió Esportiva Digital',
        description: 'Digitalització de centres esportius.',
        stats: ['App', 'Stripe', 'Gestió'],
        tags: ['SaaS', 'Sport', 'PWA'],
        color: 'from-cyan-400 to-blue-600',
        link: 'https://getsalutflow.com',
        imageAlt: "App SalutFlow",
        logo: logoSalutFlow,
        image: salutFlowImgDark,
        adaptiveImages: {
            ca: { light: salutFlowImgLightCA, dark: salutFlowImgDarkCA },
            default: { light: salutFlowImgLight, dark: salutFlowImgDark }
        }
    },
    {
        id: 'triatu',
        title: 'TriaTu',
        tagline: 'Xef Personal amb IA',
        description: 'Cuina intel·ligent i saludable.',
        stats: ['Receptes', 'Rebost', 'IA'],
        tags: ['FoodTech', 'AI', 'App'],
        color: 'from-emerald-500 to-teal-600',
        image: triaTuImgEN,
        imageAlt: "App TriaTu",
        link: 'https://triatu.vercel.app',
        logo: logoTriaTu,
        adaptiveImages: {
            ca: { light: triaTuImgCA, dark: triaTuImgCA },
            es: { light: triaTuImgES, dark: triaTuImgES },
            en: { light: triaTuImgEN, dark: triaTuImgEN },
            default: { light: triaTuImgEN, dark: triaTuImgEN }
        }
    }
];