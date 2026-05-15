'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/routing';
import { AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';
import { loginAction, type AuthFormState } from '@/features/auth/actions/auth';

interface LoginFormProps {
  prefilledEmail?: string;
  showHeader?: boolean;
}

const initialState: AuthFormState = {
  success: false,
  message: '',
  errors: {}
};

export function LoginForm({ prefilledEmail, showHeader = true }: LoginFormProps) {
  const t = useTranslations('Auth');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t('error.technical'), { description: error.message });
      } else {
        toast.error(t('error.technical'));
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-build w-full space-y-4 sm:space-y-5">
      {showHeader && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('login_title')}</h1>
          <p className="text-muted-foreground">{t('login_subtitle')}</p>
        </div>
      )}
      <div className="auth-build-item auth-build-from-left grid gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isPending}
          type="button"
          className="h-11 w-full gap-3 rounded-[6px] bg-background font-semibold"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          {t('social_google')}
        </Button>
      </div>

      <div className="auth-build-item auth-build-from-right relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('or_email')}
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.message && !state.success && (
          <div className="auth-build-item auth-build-from-left flex items-center gap-2 rounded-[6px] bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <div className="auth-build-item auth-build-from-left space-y-2">
          <label className="text-sm font-medium ml-1" htmlFor="email">{t('label_email')}</label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder={t('email_placeholder')}
            defaultValue={prefilledEmail}
            className={state?.errors?.email ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="auth-build-item auth-build-from-right space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium ml-1" htmlFor="password">{t('label_password')}</label>
            <Link href="/auth/forgot-password" className="text-xs font-medium text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">
              {t('forgot_password')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || isGoogleLoading}
          className="auth-build-item auth-build-from-left group relative h-11 w-full overflow-hidden rounded-[6px] border border-[#d0d6e0] bg-[#08090a] font-bold text-[#f7f8f8] transition-colors hover:border-[#8b5cf6]/40 disabled:bg-[#f7f8f8] disabled:text-[#8a8f98] dark:border-[#323334] dark:bg-[#f7f8f8] dark:text-[#08090a] dark:disabled:bg-[#161718] dark:disabled:text-[#62666d]"
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,#a855f7_0%,#8b5cf6_42%,#6366f1_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0" />
          <span className="relative z-10 inline-flex items-center justify-center">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            {t('cta_login')}
          </span>
        </Button>

      </form>

      <div className="auth-build-item auth-build-from-right mt-5 text-center text-sm text-muted-foreground">
        {t('no_account_prefix')} <Link href="/auth/register" className="font-medium text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">{t('register_link')}</Link>
      </div>
    </div>
  );
}
