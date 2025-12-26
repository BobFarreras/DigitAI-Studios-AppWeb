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
    return { success: false, message: "Error de configuració: Manca ORG_ID" };
  }

  const t = await getTranslations('Auth');
  
  // Cridem al servei
  const result = await authService.register(formData, MAIN_ORG_ID);

  if (!result.success) {
    // CAS ESPECIAL: L'usuari ja existeix globalment a Supabase
    if (result.redirectToLogin) {
       return { 
         success: false, 
         message: t(result.error), // "Ja tens compte, fes login..."
         shouldRedirectToLogin: true 
       };
    }

    return { 
      success: false, 
      message: t(result.error!) 
    };
  }

  // Si el registre és correcte, normalment Supabase fa auto-login o envia email de confirmació.
  // Redirigim a una pàgina d'espera o al dashboard directament.
  redirect('/dashboard'); 
}