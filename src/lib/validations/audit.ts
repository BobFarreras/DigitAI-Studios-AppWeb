import { z } from "zod";

export const auditSchema = z.object({
  url: z.string()
    .min(3, "La URL és massa curta")
    .transform((val) => {
      // 1. Neteja bàsica
      const clean = val.trim().toLowerCase();
      
      // 2. Elimina protocol o www manual si l'usuari l'ha posat
      const domain = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // 3. Força sempre https://
      return `https://${domain}`;
    })
    // 4. Valida que el resultat sigui una URL real
    .pipe(z.string().url("Introdueix un domini vàlid (ex: digitaistudios.com)")),
  
  // Accepta string buit o email vàlid
  email: z.string().email("Si us plau, introdueix un email vàlid").optional().or(z.literal('')),
});

export type AuditSchema = z.infer<typeof auditSchema>;