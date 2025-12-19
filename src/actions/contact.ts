'use server';

import { ContactFormSchema, FormState } from '@/lib/validations/contact';
import { ContactService } from '@/services/ContactService';
import { SupabaseContactRepository } from '@/repositories/supabase/SupabaseContactRepository';
import { NodemailerAdapter } from '@/adapters/nodemailer/NodemailerAdapter';

// Instanciem dependències
const repository = new SupabaseContactRepository();
const mailer = new NodemailerAdapter();
const contactService = new ContactService(repository, mailer);

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convertim FormData a Objecte
  const rawData = Object.fromEntries(formData.entries());

  // 1. Validació Zod
  const validated = ContactFormSchema.safeParse(rawData);

  if (!validated.success) {
    // Retornem els errors de validació
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Revisa els camps marcats en vermell.",
    };
  }

  try {
    // 2. Lògica de negoci
    await contactService.processContactForm(validated.data);

    return {
      success: true,
      message: "Missatge enviat correctament! Et respondrem aviat.",
      // Netegem errors si n'hi havia
      errors: undefined 
    };

  } catch (error) {
    console.error("Error en submitContactForm:", error);
    return {
      success: false,
      message: "Hi ha hagut un error tècnic. Torna-ho a provar més tard.",
    };
  }
}