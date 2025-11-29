// =================== FILE: src/app/[locale]/auth/reset-password/page.tsx ===================

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/features/auth/ui/ResetPasswordForm';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si l'usuari no té sessió, vol dir que l'enllaç ha caducat o és invàlid.
  // El redirigim a "forgot-password" de nou.
  if (!user) {
    // Nota: Aquí hauries de posar el locale dinàmicament
    // Per simplicitat poso 'ca', però pots usar `params.locale`
    redirect('/ca/auth/forgot-password'); 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Nova Contrasenya</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escriu la teva nova contrasenya segura.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}