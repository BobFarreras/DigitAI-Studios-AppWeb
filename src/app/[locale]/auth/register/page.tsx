import { getTranslations } from 'next-intl/server'; // 👈 Canvi clau: importem del server
import { Link } from '@/routing';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  // 1. Fem servir await getTranslations en lloc del hook
  const t = await getTranslations('Auth');
  
  // 2. Resolem els paràmetres (Next.js 16)
  const params = await searchParams;
  const emailParam = typeof params.email === 'string' ? params.email : '';

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('register_title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('register_subtitle')}
          </p>
        </div>

        <RegisterForm prefilledEmail={emailParam} />

        <p className="text-center text-sm text-muted-foreground">
          {t('already_have_account')}{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            {t('login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}