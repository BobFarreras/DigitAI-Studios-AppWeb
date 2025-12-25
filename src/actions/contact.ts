'use server';

// Importem els tipus del fitxer que acabem d'arreglar
import { ContactFormSchema, type FormState } from '@/lib/validations/contact';

// Si tens els serveis configurats, els mantenim. 
// Si et donen error els imports de serveis, comenta'ls temporalment per provar.
import { ContactService } from '@/services/ContactService';
import { SupabaseContactRepository } from '@/repositories/supabase/SupabaseContactRepository';
import { NodemailerAdapter } from '@/adapters/nodemailer/NodemailerAdapter';

// Instanciem dependències (Comenta-ho si no tens aquests fitxers encara)
const repository = new SupabaseContactRepository();
const mailer = new NodemailerAdapter();
const contactService = new ContactService(repository, mailer);

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  // Convertim FormData a Objecte
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message'),
    privacy: formData.get('privacy'),
  };

  // 1. Validació Zod
  const validated = ContactFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Revisa els camps marcats en vermell.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 2. Lògica de negoci
    // Si 'contactService' espera 'name' en comptes de 'fullName', 
    // potser has de fer: { ...validated.data, name: validated.data.fullName }
    await contactService.processContactForm(validated.data);

    return {
      success: true,
      message: "Missatge enviat correctament! Et respondrem aviat.",
      errors: {} // Important passar objecte buit, no undefined, per evitar problemes al client
    };

  } catch (error) {
    console.error("Error en submitContactForm:", error);
    return {
      success: false,
      message: "Hi ha hagut un error tècnic. Torna-ho a provar més tard.",
      errors: {}
    };
  }
}