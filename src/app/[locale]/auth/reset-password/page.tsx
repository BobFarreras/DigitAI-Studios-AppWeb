import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { ResetPasswordForm } from '@/features/auth/ui/ResetPasswordForm';
import { hasAuthenticatedSession } from '@/actions/auth-session';

export default async function ResetPasswordPage() {
  const session = await hasAuthenticatedSession();
  const t = await getTranslations('AuthPages.reset_password');
  const locale = await getLocale();

  // Si l'usuari no té sessió, vol dir que l'enllaç ha caducat o és invàlid.
  if (!session.hasSession) {
    redirect(`/${locale}/auth/forgot-password`); 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
