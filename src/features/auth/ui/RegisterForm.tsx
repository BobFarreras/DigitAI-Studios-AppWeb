'use client';

import { useState, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { Loader2, UserPlus, Info } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';
import { registerAction, type AuthFormState } from '@/features/auth/actions/auth'; 

const initialState: AuthFormState = {
  success: false,
  message: '',
  errors: {}
};

export function RegisterForm({ prefilledEmail, showHeader = true }: { prefilledEmail?: string; showHeader?: boolean }) {
  const t = useTranslations('Auth');
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();
  const canSubmit = termsAccepted && !isPending;

  const handleGoogleRegister = async () => {
    if (!termsAccepted) {
      toast.error(t('privacy_required'));
      return;
    }
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  };

  const isEmailLocked = !!prefilledEmail;

  return (
    <div className="auth-build w-full space-y-4 sm:space-y-5">
      {showHeader && (
        <div className="text-center space-y-2 lg:text-left">
          <h1 className="text-2xl font-bold tracking-tight">{t('register_title')}</h1>
          <p className="text-muted-foreground">{t('register_subtitle')}</p>
        </div>
      )}
      <div className="auth-build-item auth-build-from-left grid gap-3">
        <Button
          variant="outline"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading || isPending}
          type="button"
          className="h-11 w-full gap-3 rounded-[6px] font-semibold"
        >
          {isGoogleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
          {t('social_google_register')}
        </Button>
      </div>

      <div className="auth-build-item auth-build-from-right relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t('or_email')}</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.message && (
          <div className="auth-build-item auth-build-from-left flex items-center gap-2 rounded-[6px] bg-destructive/10 p-3 text-sm text-destructive">
            <Info className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
            {state.shouldRedirectToLogin && (
              <Link href="/auth/login" className="ml-1 font-bold underline">{t('login_link')}</Link>
            )}
          </div>
        )}

        <div className="auth-build-item auth-build-from-left space-y-2">
          <label className="ml-1 text-sm font-medium">{t('label_full_name')}</label>
          <Input name="full_name" type="text" placeholder={t('placeholder_full_name')} disabled={isPending} required />
        </div>

        <div className="auth-build-item auth-build-from-right space-y-2">
          <label className="ml-1 text-sm font-medium">{t('label_email')}</label>
          <Input 
            name="email" 
            type="email" 
            defaultValue={prefilledEmail} 
            readOnly={isEmailLocked} 
            className={isEmailLocked ? 'cursor-not-allowed bg-muted text-muted-foreground' : ''}
            required 
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="auth-build-item auth-build-from-left space-y-2">
          <label className="ml-1 text-sm font-medium">{t('label_password')}</label>
          <Input name="password" type="password" disabled={isPending} required minLength={6} />
          {state?.errors?.password && (
            <p className="text-xs text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="auth-build-item auth-build-from-right flex items-start space-x-3 pt-2">
          <Checkbox id="privacy" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c as boolean)} />
          <label htmlFor="privacy" className="cursor-pointer text-sm leading-tight text-muted-foreground">
            {t('privacy_accept')} <Link href="/legal/privacitat" className="font-medium text-[#62666d] underline transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">{t('privacy_link')}</Link>.
          </label>
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="auth-build-item auth-build-from-left group relative h-11 w-full overflow-hidden rounded-[6px] border border-[#d0d6e0] bg-[#08090a] font-bold text-[#f7f8f8] transition-colors hover:border-[#8b5cf6]/40 disabled:bg-[#f7f8f8] disabled:text-[#8a8f98] dark:border-[#323334] dark:bg-[#f7f8f8] dark:text-[#08090a] dark:disabled:bg-[#161718] dark:disabled:text-[#62666d]"
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,#a855f7_0%,#8b5cf6_42%,#6366f1_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0" />
          <span className="relative z-10 inline-flex items-center justify-center">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('cta_register')}
            </>
          )}
          </span>
        </Button>
      </form>

      <p className="auth-build-item auth-build-from-right pt-4 text-center text-sm text-muted-foreground">
        {t('already_have_account')} <Link href="/auth/login" className="font-medium text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">{t('login_link')}</Link>
      </p>
    </div>
  );
}
