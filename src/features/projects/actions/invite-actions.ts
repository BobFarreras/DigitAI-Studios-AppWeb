/**
 * @file src/features/projects/actions/invite-actions.ts
 * @updated 2026-05-08
 * @summary Feature module: src/features/projects/actions/invite-actions.ts
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod'; 

// 1. Tipus d'estat
export type InviteState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

// 2. Schema de validació
const inviteSchema = z.object({
  email: z.string().email("L'email no és vàlid."),
  projectId: z.string().uuid("L'ID del projecte no és vàlid."),
  orgId: z.string().min(1, "Falta l'ID de l'organització.")
});

export async function inviteClientAction(prevState: InviteState, formData: FormData): Promise<InviteState> {
  const email = formData.get('email') as string;
  const projectId = formData.get('projectId') as string;
  const orgId = formData.get('orgId') as string;

  // ✅ CORRECCIÓ ZOD: safeParse retorna un objecte on l'error té la propietat 'issues'
  const validatedFields = inviteSchema.safeParse({ email, projectId, orgId });

  if (!validatedFields.success) {
    // 👇 AQUI ESTAVA L'ERROR: Usem .issues[0].message en lloc de .errors
    return { 
        success: false, 
        error: validatedFields.error.issues[0].message, 
        message: null 
    };
  }

  try {
    const supabase = await createClient();

    // A. Comprovar sessió
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sessió caducada.", message: null };

    // B. Lògica d'Invitació (Supabase Admin)
    // ⚠️ NOTA: Per fer servir 'admin.inviteUserByEmail', el teu client de supabase
    // ha de tenir permisos d'administrador o fer servir la 'SERVICE_ROLE_KEY'.
    // Si això falla amb "Forbidden", haurem de crear un client admin específic.
    
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { 
          organization_id: orgId, 
          project_id: projectId,
          role: 'client' // Opcional: marca'l com a client a les metadades
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` // Opcional: on va quan accepta
    });

    if (inviteError) {
        console.error("❌ Error Supabase Invite:", inviteError);
        // Gestionem errors comuns de manera amigable
        if (inviteError.message.includes("already")) {
             return { success: false, error: "Aquest usuari ja està registrat.", message: null };
        }
        throw new Error("No s'ha pogut enviar la invitació.");
    }

    // C. Revalidar
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, error: null, message: `Invitació enviada a ${email}` };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconegut";
    return { success: false, error: msg, message: null };
  }
}
