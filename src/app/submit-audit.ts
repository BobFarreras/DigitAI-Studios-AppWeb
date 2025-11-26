'use server'

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Schema amb missatges d'error personalitzats
const AuditSchema = z.object({
  url: z.string().url({ message: "La URL no és vàlida (ha de tenir http/https)" }),
  email: z.string().email({ message: "L'email no és vàlid" })
});

export type FormState = {
  message: string;
  errors?: {
    url?: string[];
    email?: string[];
  };
  success?: boolean;
}

export async function submitAuditAction(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  
  // 1. Validació
  const rawData = {
    url: formData.get('url') as string,
    email: formData.get('email') as string,
  };

  const validation = AuditSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Revisa els errors al formulari.",
      errors: validation.error.flatten().fieldErrors
    };
  }

  // 2. Lògica de DB
  try {
    const supabase = await createClient();
    
    // Inserim a la taula 'leads'.
    // NOTA: Assegura't que tens una política RLS que permeti INSERT públic però SELECT privat.
    const { error } = await supabase
      .from('leads')
      .insert({
        url: validation.data.url,
        email: validation.data.email,
        created_at: new Date().toISOString(),
        status: 'pending' // Estat inicial
      });

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, message: "Error connectant amb la base de dades." };
    }

  } catch (e) {
    console.error("Unexpected Error:", e);
    return { success: false, message: "Error inesperat al servidor." };
  }

  // 3. Redirecció (Només si tot ha anat bé)
  // IMPORTANT: redirect() llança un error intern de Next.js, per això ha d'estar fora del try/catch
  // o ser l'última instrucció.
  redirect('/ca/dashboard/audit-pending');
}