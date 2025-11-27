
'use server'


import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
// Només necessitem el servei, ja no cridem al repositori directament des d'aquí
import { auditService } from '@/services/container';
import { createClient } from '@/lib/supabase/server';

const AuditSchema = z.object({
  url: z.string().url({ message: "La URL ha de ser vàlida (https://...)" }),
  email: z.string().email({ message: "L'email no és correcte" }),
});

export type FormState = {
  message?: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
};

export async function processWebAudit(prevState: FormState, formData: FormData): Promise<FormState> {
  const locale = await getLocale();

  const rawData = {
    url: formData.get('url'),
    email: formData.get('email'),
  };

  const validation = AuditSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Revisa les dades del formulari.",
    };
  }

  try {
    // ❌ LÍNIA ELIMINADA: await auditRepository.createAudit(...)

    // ✅ CORRECTE: Cridem al servei que orquestra tot el procés (Crear + Escanejar)
    await auditService.performFullAudit(validation.data.url, validation.data.email);

    console.log("AUDITORIA INICIADA:", validation.data);
  } catch (err) {
    console.error(err);
    return { message: "Error durant l'anàlisi. Verifica la URL o prova més tard." };
  }

  // Redirecció
  redirect(`/${locale}/auth/register?email=${encodeURIComponent(validation.data.email)}`);
}

// Schema simple
const UrlSchema = z.string().url();

// MOCK DATA GENERATOR (Per simular un anàlisi real)
function generateMockReport(url: string) {
  const score = Math.floor(Math.random() * (98 - 60) + 60); // Random entre 60 i 98
  return {
    seo_score: score,
    performance_score: Math.floor(Math.random() * (100 - 50) + 50),
    report_data: {
      summary: `Anàlisi completa realitzada per a ${url}`,
      issues: [
        { type: 'warning', text: 'Falten etiquetes Meta Description', impact: 'Mitjà' },
        { type: 'success', text: 'Certificat SSL correcte', impact: 'Bo' },
        { type: 'error', text: 'Imatges no optimitzades (>2MB)', impact: 'Alt' }
      ]
    }
  };
}

// ⚠️ CANVI IMPORTANT: Ja no cal passar userId com argument, l'agafem de la sessió
export async function createAuditAction(url: string) {
  // 1. Validació URL
  const validation = UrlSchema.safeParse(url);
  if (!validation.success) {
    return { success: false, message: 'URL invàlida. Assegura\'t de posar https://' };
  }

  const supabase = await createClient();

  // 2. 🔐 SEGURETAT: Obtenim l'usuari DINS del servidor
  // Això garanteix que auth.uid() coincideixi amb la política RLS
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'No estàs autenticat.' };
  }

  try {
    const mockResults = generateMockReport(url);

    // 3. Inserció
    const { data, error } = await supabase
      .from('web_audits')
      .insert({
        user_id: user.id, // 👈 Usem l'ID de la sessió segura
        url: url,
        email: user.email, // 👈 AFEGEIX AQUESTA LÍNIA CLAU!
        status: 'completed',
        seo_score: mockResults.seo_score,
        performance_score: mockResults.performance_score,
        report_data: mockResults.report_data
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error); // Això et sortirà a la terminal si falla
      return { success: false, message: `Error DB: ${error.message}` };
    }

    return { success: true, auditId: data.id };

  } catch (e) {
    console.error(e);
    return { success: false, message: 'Error del servidor.' };
  }
}