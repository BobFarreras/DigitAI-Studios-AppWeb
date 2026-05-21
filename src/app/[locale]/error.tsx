/**
 * @file src/app/[locale]/error.tsx
 * @updated 2026-05-21
 * @summary Error boundary for locale-scoped routes. Preserves locale layout shell.
 * @scope Client Component. Shows error UI with retry, keeps sidebar/header intact.
 */
'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error('[LocaleError]', error.digest ?? error.message, error.stack);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
      <p className="text-muted-foreground mb-6">{t('message')}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {t('retry')}
      </button>
    </div>
  );
}