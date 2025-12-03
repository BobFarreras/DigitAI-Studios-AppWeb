'use server';

import { FactoryService } from '@/services/FactoryService';
import { AIService } from '@/services/AIService';
import { MasterConfig } from '@/types/config';
import { createClient } from '@/lib/supabase/server'; // Assegura't que tens aquest helper a la web principal també
import { ActionResult } from '@/types/actions';

// Instanciem serveis
const factory = new FactoryService();
const ai = new AIService();

export async function createProjectAction(prevState: unknown, formData: FormData): Promise<ActionResult> {
  try {
    // 1. Recollida de dades
    const businessName = formData.get('businessName') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const primaryColor = formData.get('primaryColor') as string;
    const logoFile = formData.get('logo') as File;

    if (!businessName || !slug) return { error: "Falten dades." };

    // 2. IA: Generar Contingut
    console.log(`🤖 [IA] Generant textos per: ${businessName}`);
    const aiContent = await ai.generateSiteContent(businessName, description);

    // 3. GITHUB: Crear Repo
    console.log(`🏗️ [Factory] Creant repo: ${slug}`);
    const repoData = await factory.createRepository(slug, `Web de ${businessName}`);

    // Petit retard per assegurar que GitHub té el repo llest
    await new Promise(r => setTimeout(r, 2000));

    // 4. GITHUB: Pujar Logo
    await factory.uploadLogo(slug, logoFile);

    // 5. PREPARAR CONFIG
    const config: MasterConfig = {
      identity: {
        name: businessName,
        description: aiContent.hero.subtitle || description,
        logoUrl: "/branding/logo.png",
        faviconUrl: "/favicon.ico",
        contactEmail: "info@client.com"
      },
      branding: {
        colors: {
          primary: primaryColor,
          secondary: "#10b981", 
          background: "#ffffff",
          foreground: "#0f172a"
        },
        radius: 0.5
      },
      modules: {
        landing: { active: true, sections: ['hero', 'services', 'contact'] },
        auth: true,
        dashboard: true,
        booking: formData.get('module_booking') === 'on',
        blog: formData.get('module_blog') === 'on',
        inventory: formData.get('module_inventory') === 'on',
        ecommerce: false,
        accessControl: false
      },
      i18n: { locales: ['ca', 'es'], defaultLocale: 'ca' }
    };

    // 6. GITHUB: Injectar Config
    await factory.injectConfiguration(slug, config);

    // 7. DB LOCAL: Guardar projecte a la teva agència
    const supabase = await createClient();
    await supabase.from('projects').insert({
        client_id: formData.get('client_id') as string, // Ensure client_id is provided in the formData
        name: businessName,
        domain: slug, 
        repository_url: repoData.html_url,
        status: 'pending'
    });

    return { success: true, repoUrl: repoData.html_url };

  } catch (error: unknown) {
    console.error("❌ FACTORY ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: errorMessage };
  }
}