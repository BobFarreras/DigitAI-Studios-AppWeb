'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server'; // 👈 Per traduir errors al servidor
import { AuthService } from '@/services/AuthService';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';

// 1️⃣ INSTANCIACIÓ DE DEPENDÈNCIES
// (Idealment això vindria d'un container.ts, però aquí també està bé)
const profileRepo = new SupabaseProfileRepository();
const authService = new AuthService(profileRepo);

const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

// Definim el tipus de l'estat del formulari per a TypeScript
export type AuthFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  shouldRedirectToLogin?: boolean;
};

// ==========================================
// 🚪 SIGN OUT (La teva acció existent)
// ==========================================
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

// ==========================================
// 🔑 LOGIN ACTION (Amb filtre d'Organització)
// ==========================================
export async function loginAction(
  prevState: AuthFormState, 
  formData: FormData
): Promise<AuthFormState> {
  
  if (!MAIN_ORG_ID) {
    return { success: false, message: "Error de configuració: Manca ORG_ID" };
  }

  const t = await getTranslations('Auth'); // Carreguem traduccions
  
  // Cridem al nostre servei intel·ligent
  const result = await authService.login(formData, MAIN_ORG_ID);

  if (!result.success) {
    return { 
      success: false, 
      // Traduïm el codi d'error (ex: 'auth.error.not_in_org')
      message: t(result.error!) 
    };
  }

  // Si tot va bé, redirigim
  redirect('/dashboard');
}

// ==========================================
// 📝 REGISTER ACTION (Amb control Multitenancy)
// ==========================================
export async function registerAction(
  prevState: AuthFormState, 
  formData: FormData
): Promise<AuthFormState> {
  
  if (!MAIN_ORG_ID) {
    return { success: false, message: "Configuration Error: Missing ORG_ID" };
  }

  const t = await getTranslations('Auth');
  
  // Extraiem dades addicionals
  const fullName = formData.get('full_name') as string;
  
  // Opcional: Validar que el nom no estigui buit aquí també
  if (!fullName || fullName.length < 2) {
    return { success: false, message: t('error_name_required') };
  }

  // Passem el fullName al servei (assegura't que el teu AuthService accepti metadata)
  // Si el teu AuthService només passa formData, hauràs de modificar-lo per extreure 'full_name' 
  // i passar-lo a supabase.auth.signUp({ options: { data: { full_name: ... } } })
  const result = await authService.register(formData, MAIN_ORG_ID);

  if (!result.success) {
    if (result.redirectToLogin) {
       return { 
         success: false, 
         message: t(result.error), 
         shouldRedirectToLogin: true 
       };
    }
    return { success: false, message: t(result.error!) };
  }

  redirect('/dashboard'); 
}