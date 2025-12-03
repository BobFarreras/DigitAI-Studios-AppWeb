import { getTranslations } from 'next-intl/server';
import { Link } from '@/routing';
import { ForgotPasswordForm } from '@/features/auth/ui/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('AuthPages.forgot_password');

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            ← {t('back_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}