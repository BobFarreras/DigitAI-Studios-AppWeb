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

export function RegisterForm({ prefilledEmail }: { prefilledEmail?: string }) {
  // Carreguem el namespace 'Auth' segons el teu JSON
  const t = useTranslations('Auth');
  
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleRegister = async () => {
    if (!termsAccepted) {
      toast.error("Has d'acceptar la política de privacitat."); // Text fix perquè no tenim clau d'error al JSON per això
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
    <div className="w-full max-w-md mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="text-center space-y-2 lg:text-left">
        <h1 className="text-3xl font-bold">{t('register_title')}</h1>
        <p className="text-muted-foreground">{t('register_subtitle')}</p>
      </div>

      {/* GOOGLE */}
      <div className="grid gap-4">
        <Button
          variant="outline"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading || isPending}
          type="button"
          className="w-full h-12 gap-3 font-medium"
        >
          {isGoogleLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <GoogleIcon className="w-5 h-5" />}
          {t('social_google_register')}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{t('or_email')}</span></div>
      </div>

      {/* FORMULARI */}
      <form action={formAction} className="space-y-4">
        
        {/* Errors Globals */}
        {state?.message && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
            {state.shouldRedirectToLogin && (
               <Link href="/auth/login" className="underline font-bold ml-1">{t('login_link')}</Link>
            )}
          </div>
        )}

        {/* Nom Complet (Text fix perquè no està al JSON) */}
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">Nom complet</label>
          <Input 
            name="full_name" 
            type="text" 
            placeholder="Ex: Joan Garcia" 
            disabled={isPending}
            required 
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">{t('label_email')}</label>
          <Input 
            name="email" 
            type="email" 
            defaultValue={prefilledEmail} 
            readOnly={isEmailLocked} 
            className={isEmailLocked ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''}
            required 
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium ml-1">{t('label_password')}</label>
          <Input 
            name="password" 
            type="password" 
            disabled={isPending}
            required 
            minLength={6} 
          />
          {state?.errors?.password && (
            <p className="text-xs text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Privacitat (Text fix perquè no està al JSON) */}
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="privacy" 
            checked={termsAccepted} 
            onCheckedChange={(c) => setTermsAccepted(c as boolean)} 
          />
          <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer leading-tight">
             Accepto la <Link href="/legal/privacitat" className="underline">política de privacitat</Link>.
          </label>
        </div>

        {/* Botó Submit (Reutilitzo register_title "Crea el teu compte" ja que no hi ha cta_register) */}
        <Button 
          type="submit" 
          disabled={isPending || !termsAccepted} 
          className="w-full h-12 font-bold bg-primary text-primary-foreground"
        >
          {isPending ? (
            <Loader2 className="animate-spin w-4 h-4" /> 
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" /> 
              {/* Si vols pots posar "Crear Compte" fix, o reutilitzar el títol */}
              {t('register_title')} 
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-4">
        {t('already_have_account')} <Link href="/auth/login" className="text-primary hover:underline font-medium">{t('login_link')}</Link>
      </p>
    </div>
  );
}