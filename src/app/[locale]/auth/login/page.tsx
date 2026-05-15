/**
 * @file src/app/[locale]/auth/login/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/auth/login/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { getTranslations } from 'next-intl/server'; 

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const t = await getTranslations('AuthPages.login');
  const params = await searchParams;
  const emailParam = typeof params.email === 'string' ? params.email : undefined;

  return (
    <AuthPageShell
      badge={t('marketing_badge')}
      title={t('marketing_title')}
      description={t('marketing_subtitle')}
      backLabel={t('back_home')}
    >
      <LoginForm prefilledEmail={emailParam} showHeader={false} />
    </AuthPageShell>
  );
}
