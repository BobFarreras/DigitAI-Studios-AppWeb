// =================== FILE: src/features/auth/actions/reset-password.ts ===================

'use server'

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/routing'; // Usem el teu routing tipat

// Esquema per sol·licitar el reset
const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "L'email no és vàlid." }),
});

// Esquema per actualitzar la contrasenya
const ResetPasswordSchema = z.object({
  password: z.string().min(6, { message: "La contrasenya ha de tenir mínim 6 caràcters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les contrasenyes no coincideixen",
  path: ["confirmPassword"],
});

export type AuthState = {
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
};

/**
 * 1. L'usuari demana restablir la contrasenya via email
 */
export async function requestPasswordReset(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const locale = await getLocale();

  const validated = ForgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  
  // Aquest URL és on anirà l'usuari després de fer clic al correu.
  // IMPORTANT: Redirigim al callback, que intercanviarà el codi per sessió,
  // i després el callback redirigirà a /auth/reset-password
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/auth/callback?next=/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    // Per seguretat, a vegades és millor no dir si l'email existeix o no, 
    // però per UX aquí mostrem l'error si és genèric.
    return { message: error.message, success: false };
  }

  return { 
    success: true, 
    message: "Si l'email existeix, rebràs un enllaç per restablir la contrasenya." 
  };
}

/**
 * 2. L'usuari (ja autenticat via link màgic) posa la nova contrasenya
 */
export async function updatePassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validated = ResetPasswordSchema.safeParse({ password, confirmPassword });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password
  });

  if (error) {
    return { message: "Error actualitzant la contrasenya.", success: false };
  }

  // Si tot va bé, redirigim al dashboard
  const locale = await getLocale();
  redirect({ href: '/dashboard', locale });
  return { success: true }; // Codi mort per la redirecció, però necessari per TS
}