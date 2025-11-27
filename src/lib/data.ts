// src/lib/data.ts

export type Testimonial = {
  id: number | string;
  name: string;
  company: string;
  text: string;
  rating: number;
  projectType: 'web' | 'app' | 'automation';
  projectUrl?: string;
  image?: string; // 👈 AQUI POSAREM LA RUTA DE LA CAPTURA (Ex: /images/projects/web-gestoria.jpg)
};

export const TESTIMONIALS: Testimonial[] = [
  { 
    id: 1, 
    name: "Marc Vila", 
    company: "Gestoria Vila", 
    text: "Hem estalviat 20h setmanals gràcies al bot de WhatsApp.", 
    rating: 5,
    projectType: 'automation' 
    // No posem imatge, sortirà el flux de nodes abstracte (molt professional per backend)
  },
  { 
    id: 2, 
    name: "Anna Soler", 
    company: "BioShop", 
    text: "La web carrega instantàniament. Les vendes han pujat un 40%.", 
    rating: 5,
    projectType: 'web',
    projectUrl: 'https://bioshop-exemple.com',
    image: '@/assets/images/testimoni-garatgeestacio.jpg' // 📸 Captura de la web real
  },
  { 
    id: 3, 
    name: "Jordi P.", 
    company: "Tech Solutions", 
    text: "Han entès la nostra idea d'App a la primera.", 
    rating: 5,
    projectType: 'app',
    image: '@/assets/images/salutflow.png' // 📱 Captura de l'app real
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