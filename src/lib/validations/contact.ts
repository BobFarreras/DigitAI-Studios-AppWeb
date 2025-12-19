import { z } from 'zod';

// 1. Canviem el nom a ContactFormSchema perquè coincideixi amb l'import
export const ContactFormSchema = z.object({
  fullName: z.string().min(2, "Nom massa curt"),
  email: z.string().email("Email invàlid"),
  service: z.string().min(1, "Selecciona un servei"),
  message: z.string().min(10, "Explica'ns una mica més"),
  
  // 2. SOLUCIÓ ZOD: En lloc de z.literal amb params, usem refine
  // Això accepta l'string "on" i dóna el missatge correcte si falla
  privacy: z.string().refine((val) => val === "on", {
    message: "Has d'acceptar la política de privacitat"
  }),
});
// 1. Definició del tipus d'estat (UI)
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
export type ContactFormData = z.infer<typeof ContactFormSchema>;