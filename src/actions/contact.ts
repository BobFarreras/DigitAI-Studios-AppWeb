'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
// 1. Definim el tipus per al 'prevState' per evitar l'error d'ESLint


export type FormState = {
  success: boolean;
  message?: string;
  errors?: {
    fullName?: string[];
    email?: string[];
    service?: string[];
    message?: string[];
    privacy?: string[];
  };
};

// 2. Corregim l'schema de Zod
const ContactSchema = z.object({
  fullName: z.string().min(2, "Nom massa curt"),
  email: z.string().email("Email invàlid"),
  service: z.string().min(1, "Selecciona un servei"),
  message: z.string().min(10, "Explica'ns una mica més"),
  // SOLUCIÓ ZOD: Usem errorMap aquí o simplement 'message'
  privacy: z.literal("on", { 
    message: "Has d'acceptar la política de privacitat" 
  }),
});

export async function submitContactForm(
  prevState: FormState, // Tipatge correcte
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  
  // Validar dades
  const validated = ContactSchema.safeParse(rawData);
  if (!validated.success) {
    return { 
      success: false, 
      errors: validated.error.flatten().fieldErrors 
    };
  }

  try {
   // 1. Creem el client tipat
  const supabase = await createClient(); 
  
  // 2. Inserció TIPADA i CORRECTA
  // NO facis: .from('contact_leads' as ContactLead) <- Això dóna l'error que tenies
  // Has de fer servir l'string literal tal qual:
  const { error } = await supabase
    .from('contact_leads') 
    .insert({
      full_name: validated.data.fullName,
      email: validated.data.email,
      service: validated.data.service,
      message: validated.data.message,
      source: 'landing_contact_form'
    });

  if (error) {
    console.error("Error saving lead:", error);
    return { success: false, message: "Error tècnic. Torna-ho a provar." };
  }

  return { success: true, message: "Missatge enviat! Et contactarem aviat." };
}
catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Error inesperat. Torna-ho a provar." };
    }
  }