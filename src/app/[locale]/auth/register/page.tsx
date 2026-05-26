/**
 * @file src/app/[locale]/auth/register/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/auth/register/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { getTranslations } from 'next-intl/server';
import { AuditReadyBanner } from '@/components/auth/AuditReadyBanner';
import { Suspense } from 'react';

type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
   const params = await searchParams;
   const emailParam = typeof params.email === 'string' ? params.email : '';
   const t = await getTranslations('AuthPages.register');

   return (
      <AuthPageShell
         badge={t('marketing_badge')}
         title={t('marketing_title')}
         description={t('marketing_subtitle')}
         backLabel={t('back_home')}
      >
         <Suspense fallback={null}>
            <AuditReadyBanner />
         </Suspense>
         <RegisterForm prefilledEmail={emailParam} showHeader={false} />
      </AuthPageShell>
   );
}
