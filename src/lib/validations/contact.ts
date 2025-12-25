import { z } from 'zod';

// Definim els valors com a constants per evitar errors de tipus
const SERVICE_VALUES = ['ia_automation', 'web_app'] as const;

export const ContactFormSchema = z.object({
  fullName: z.string().min(2, { message: "El nom és obligatori i ha de tenir almenys 2 lletres." }),
  
  email: z.string().email({ message: "L'email no sembla vàlid." }),
  
  // Fem servir 'message' directe, que és el que demanava el teu TypeScript
  service: z.enum(SERVICE_VALUES, {
    message: "Has de seleccionar un servei de la llista."
  }),
  
  message: z.string().min(10, { message: "Explica'ns una mica més (mínim 10 caràcters)." }),
  
  privacy: z.literal('on', {
    message: "Has d'acceptar la política de privacitat."
  }),
});

// Tipus inferits
export type ContactFormData = z.infer<typeof ContactFormSchema>;

export type FormState = {
  success: boolean;
  message: string;
  errors?: {
    fullName?: string[];
    email?: string[];
    service?: string[];
    message?: string[];
    privacy?: string[];
  };
};