/**
 * @file src/features/auth/ui/ForgotPasswordForm.tsx
 * @updated 2026-05-08
 * @summary Feature module: src/features/auth/ui/ForgotPasswordForm.tsx
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
// =================== FILE: src/features/auth/ui/ForgotPasswordForm.tsx ===================

'use client'

import { useActionState } from 'react';
import { requestPasswordReset } from '../actions/reset-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/routing';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ForgotPasswordForm() {
  const t = useTranslations('Auth');
  const [state, action, isPending] = useActionState(requestPasswordReset, {
    message: '',
    errors: {}
  });

  if (state.success) {
    return (
      <div className="space-y-4 rounded-[8px] border border-green-200 bg-green-50 p-5 text-center dark:border-green-900/60 dark:bg-green-950/25">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 dark:text-green-400" />
        <p className="font-medium text-green-900 dark:text-green-100">{state.message}</p>
        <p className="text-sm text-green-700 dark:text-green-300">{t('reset_success_hint')}</p>
      </div>
    );
  }

  return (
    <div className="auth-build space-y-4">
    <form action={action} className="space-y-4">
      <div className="auth-build-item auth-build-from-left space-y-2">
        <label htmlFor="email" className="ml-1 text-sm font-medium">{t('label_email')}</label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder={t('email_placeholder')}
          className={state.errors?.email ? "border-red-500" : ""}
        />
        {state.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      {state.message && !state.success && (
        <p className="auth-build-item auth-build-from-right rounded-[6px] bg-red-50 p-2 text-center text-sm text-red-600 dark:bg-red-950/25 dark:text-red-300">{state.message}</p>
      )}

      <Button
        type="submit"
        className="auth-build-item auth-build-from-left group relative h-11 w-full overflow-hidden rounded-[6px] border border-[#d0d6e0] bg-[#08090a] font-bold text-[#f7f8f8] transition-colors hover:border-[#8b5cf6]/40 disabled:bg-[#f7f8f8] disabled:text-[#8a8f98] dark:border-[#323334] dark:bg-[#f7f8f8] dark:text-[#08090a] dark:disabled:bg-[#161718] dark:disabled:text-[#62666d]"
        disabled={isPending}
      >
        <span className="absolute inset-0 bg-[linear-gradient(110deg,#a855f7_0%,#8b5cf6_42%,#6366f1_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0" />
        <span className="relative z-10 inline-flex items-center justify-center">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t('reset_submit')}
        </span>
      </Button>
    </form>
    <p className="auth-build-item auth-build-from-right text-center text-sm text-muted-foreground">
      <Link href="/auth/login" className="font-medium text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">
        {t('back_login')}
      </Link>
    </p>
    </div>
  );
}
