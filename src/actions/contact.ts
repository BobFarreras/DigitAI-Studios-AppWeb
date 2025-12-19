'use server';

import { ContactFormSchema, FormState } from '@/lib/validations/contact';
import { ContactService } from '@/services/ContactService';
import { SupabaseContactRepository } from '@/repositories/supabase/SupabaseContactRepository';
import { NodemailerAdapter } from '@/adapters/nodemailer/NodemailerAdapter';



// 2. Instanciem el servei (Dependency Injection)
// Això es crea una vegada al servidor
const repository = new SupabaseContactRepository();
const mailer = new NodemailerAdapter();
const contactService = new ContactService(repository, mailer);

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convertim FormData a Objecte simple
  const rawData = Object.fromEntries(formData.entries());

  // 👇 CORRECCIÓ: Fem servir "ContactFormSchema"
  const validated = ContactFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 4. Deleguem tota la feina "bruta" al servei
    await contactService.processContactForm(validated.data);

    return {
      success: true,
      message: "Missatge enviat correctament! Et contactarem aviat."
    };

  } catch (error) {
    // Si el Repositori llança error, el capturem aquí
    console.error("Error en processar contacte:", error);
    return {
      success: false,
      message: "Hi ha hagut un error tècnic. Torna-ho a provar."
    };
  }
}