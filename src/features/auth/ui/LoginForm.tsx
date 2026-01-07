'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';
// Assegura't d'importar el tipus també per coherència
import { loginAction, type AuthFormState } from '@/features/auth/actions/auth';

interface LoginFormProps {
  prefilledEmail?: string;
}

const initialState: AuthFormState = {
  success: false,
  message: '',
  errors: {}
};

export function LoginForm({ prefilledEmail }: LoginFormProps) {
  // ✅ CORRECCIÓ: Usem el namespace 'Auth' que coincideix amb el teu JSON
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
        toast.error(t('error.technical') || 'Error amb Google', { description: error.message });
      } else {
        toast.error('Error desconegut al connectar amb Google');
      }
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">

      {/* Header Mobile Only */}
      <div className="lg:hidden text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">{t('login_title')}</h1>
        <p className="text-muted-foreground">{t('login_subtitle')}</p>
      </div>

      {/* Botó Google */}
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isPending}
          type="button"
          className="w-full h-12 gap-3 font-medium bg-background"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          {t('social_google')}
        </Button>
      </div>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('or_email')}
          </span>
        </div>
      </div>

      {/* Formulari */}
      <form action={formAction} className="space-y-4">

        {/* Gestió d'errors generals */}
        {state?.message && !state.success && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          {/* ✅ CORRECCIÓ: Usem t('label_email') */}
          <label className="text-sm font-medium ml-1" htmlFor="email">{t('label_email')}</label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="nom@empresa.com"
            defaultValue={prefilledEmail}
            className={state?.errors?.email ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             {/* ✅ CORRECCIÓ: Usem t('label_password') */}
            <label className="text-sm font-medium ml-1" htmlFor="password">{t('label_password')}</label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending || isGoogleLoading}
          className="w-full h-12 font-bold bg-primary hover:bg-primary/90 transition-all"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <LogIn className="w-4 h-4 mr-2" />
          )}
          {/* ✅ CORRECCIÓ: Usem t('cta_login') */}
          {t('cta_login')}
        </Button>

      </form>

      <div className="text-center text-sm text-muted-foreground mt-6">
        {/* ✅ CORRECCIÓ: Usem t('no_account_prefix') i t('register_link') */}
        {t('no_account_prefix')} <Link href="/auth/register" className="text-primary hover:underline font-medium">{t('register_link')}</Link>
      </div>
    </div>
  );
}