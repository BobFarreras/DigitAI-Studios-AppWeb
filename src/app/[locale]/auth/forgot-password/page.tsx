/**
 * @file src/app/[locale]/auth/forgot-password/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/auth/forgot-password/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/features/auth/ui/ForgotPasswordForm';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('AuthPages.forgot_password');

  return (
    <AuthPageShell
      badge={t('badge')}
      title={t('title')}
      description={t('subtitle')}
      backLabel={t('back_home')}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
