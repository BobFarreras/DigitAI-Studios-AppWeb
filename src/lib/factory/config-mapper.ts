// src/services/factory/config-mapper.ts

import { MasterConfig, ConfigLandingSection, SectionType } from '@/types/config';
import { AiGeneratedConfig, AiSectionObj } from '@/types/ai-response';

export function mapAiJsonToMasterConfig(aiData: AiGeneratedConfig, organizationId: string): MasterConfig {
  
  // 1. Normalització de les Seccions de la Landing
  // Utilitzem un Type Guard simple per saber si és string o objecte
  const landingSections: ConfigLandingSection[] = (aiData.landing?.sections || []).map((section): ConfigLandingSection => {
    if (typeof section === 'string') {
      return { id: section, type: section as SectionType }; 
    }
    // Si és objecte, sabem que compleix AiSectionObj
    const s = section as AiSectionObj;
    return { id: s.id, type: s.type as SectionType };
  });

  // 2. Transformació d'Stats (d'Objecte pla a Array)
  const aboutStats = aiData.about?.stats 
    ? [
        { label: aiData.about.stats.label1 || "", value: aiData.about.stats.value1 || "" },
        { label: aiData.about.stats.label2 || "", value: aiData.about.stats.value2 || "" },
        { label: aiData.about.stats.label3 || "", value: aiData.about.stats.value3 || "" }
      ].filter(stat => stat.label !== "" && stat.value !== "") // Netegem buits
    : [];

  // 3. Construcció de l'objecte Mestre
  const config: MasterConfig = {
    organizationId: organizationId,

    identity: {
      name: aiData.name || "Projecte Sense Nom",
      description: aiData.description || "Descripció pendent",
      logoUrl: "/images/logo-placeholder.png",
      faviconUrl: "/favicon.ico",
      contactEmail: aiData.contact?.email || "info@example.com",
      address: aiData.contact?.address
    },

    branding: {
      colors: {
        primary: aiData.theme?.primary || "#000000",
        secondary: aiData.theme?.secondary || "#333333",
        background: "#ffffff",
        foreground: "#09090b"
      },
      radius: 0.5
    },

    modules: {
      layout: {
        variant: aiData.theme?.layout || 'modern',
        stickyHeader: true
      },
      landing: {
        active: true,
        sections: landingSections
      },
      auth: {
        active: true,
        allowPublicRegistration: false,
        redirects: {
          admin: "/admin",
          client: "/dashboard"
        }
      },
      dashboard: true,
      booking: aiData.features?.booking ?? false,
      ecommerce: aiData.features?.ecommerce ?? false,
      blog: aiData.features?.blog ?? true,
      inventory: false,
      accessControl: true,
      chatbot: aiData.features?.faq ?? false
    },

    i18n: {
      locales: ["ca", "es"],
      defaultLocale: "ca"
    },

    footer: {
      bottomText: aiData.Footer?.description || `© ${new Date().getFullYear()} ${aiData.name}.`,
      columns: [
        {
          title: "Legal",
          links: [
            { label: aiData.Footer?.legal?.privacy || "Privacitat", href: "/legal/privacy" },
            { label: aiData.Footer?.legal?.cookies || "Cookies", href: "/legal/cookies" },
            { label: aiData.Footer?.legal?.terms || "Termes", href: "/legal/terms" }
          ]
        }
      ],
      socials: aiData.contact?.socials as Record<string, string> || {}
    },

    content: {
      hero: aiData.hero ? {
        title: aiData.hero.title,
        subtitle: aiData.hero.subtitle,
        cta: aiData.hero.cta
      } : undefined,
      
      about: aiData.about ? {
        title: aiData.about.title,
        description: aiData.about.description,
        image_url: aiData.about.image,
        stats: aboutStats
      } : undefined
    }
  };

  return config;
}