'use client';

import { useState } from 'react';
// 👇 CANVI CLAU: Importem useActionState de 'react'
import { useActionState } from 'react'; 
import { useTranslations } from 'next-intl';

import { Link } from '@/routing'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { Loader2, UserPlus, Info } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';

import { registerAction } from '@/features/auth/actions/auth'; 


export function RegisterForm({ prefilledEmail }: { prefilledEmail: string }) {
  const t = useTranslations('Auth');
  
  // 👇 CANVI CLAU: useActionState substitueix useFormState
  // Retorna: [estat, acció, pendent]
  const [state, formAction, isPending] = useActionState(registerAction, { 
    success: false, 
    message: '' 
  });

  const [fullName, setFullName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleRegister = async () => {
    if (!termsAccepted) {
      toast.error("Accepta la política de privacitat primer.");
      return;
    }
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('register_title')}</h1>
        <p className="text-muted-foreground">{t('register_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading || isPending}
          className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-3 font-medium"
        >
          {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
          {t('social_google_register')}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O amb email</span></div>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.message && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
            {state.shouldRedirectToLogin && <Link href="/auth/login" className="underline font-bold ml-1">Anar al Login</Link>}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Nom Complet</label>
          <Input name="full_name" type="text" placeholder="Joan Garcia" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Email</label>
          <Input name="email" type="email" defaultValue={prefilledEmail} readOnly={isEmailLocked} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Contrasenya</label>
          <Input name="password" type="password" required minLength={6} />
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox id="privacy" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c as boolean)} />
          <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
            He llegit i accepto la <Link href="/legal/privacitat" target="_blank" className="underline">política de privacitat</Link>.
          </label>
        </div>

        {/* 👇 Ara podem usar el botó directament perquè isPending ve del hook principal */}
        <Button 
          type="submit" 
          disabled={isPending || !termsAccepted} 
          className="w-full h-12 gradient-bg text-white font-bold"
        >
          {isPending ? <Loader2 className="animate-spin" /> : <><UserPlus className="w-4 h-4 mr-2" /> Crear Compte</>}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('already_have_account')} <Link href="/auth/login" className="text-primary hover:underline font-medium">{t('login_link')}</Link>
      </p>
    </div>
  );
}