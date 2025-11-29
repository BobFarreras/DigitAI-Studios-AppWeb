// =================== FILE: src/app/[locale]/auth/forgot-password/page.tsx ===================

import { getTranslations } from 'next-intl/server';
import { Link } from '@/routing';
import { ForgotPasswordForm } from '@/features/auth/ui/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Recuperar compte</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Introdueix el teu email i t'enviarem les instruccions.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            ← Tornar al login
          </Link>
        </div>
      </div>
    </div>
  );
}