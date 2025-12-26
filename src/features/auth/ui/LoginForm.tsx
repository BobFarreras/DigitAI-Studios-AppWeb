'use client';

import { useState } from 'react';
// 👇 CANVIAT de 'react-dom' a 'react' i reanomenat
import { useActionState } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LogIn, Info } from 'lucide-react';
import { Link } from '@/routing';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';

// Importem la Server Action que hem creat abans
// ⚠️ Ajusta la ruta si el vas guardar a src/auth/actions/auth.ts
import { loginAction } from '@/features/auth/actions/auth'; 

interface LoginFormProps {
  prefilledEmail?: string;
}

export function LoginForm({ prefilledEmail }: LoginFormProps) {
  const t = useTranslations('Auth');
  
  // 👇 CANVIAT: useActionState ens dona isPending directament!
  const [state, formAction, isPending] = useActionState(loginAction, { 
    success: false, 
    message: '' 
  });

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
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

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('login_title')}</h1>
        <p className="text-muted-foreground">{t('login_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline" 
          onClick={handleGoogleLogin} 
          disabled={isGoogleLoading || isPending}
          className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-3 font-medium"
        >
          {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
          {t('social_google')}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">{t('or_email')}</span></div>
      </div>

      <form action={formAction} className="space-y-4">
        
        {state?.message && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">{t('label_email')}</label>
          <Input type="email" name="email" defaultValue={prefilledEmail} required autoFocus={!prefilledEmail} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-foreground ml-1">{t('label_password')}</label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">{t('forgot_password')}</Link>
          </div>
          <Input type="password" name="password" required autoFocus={!!prefilledEmail} />
        </div>

        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full h-12 gradient-bg text-white font-bold"
        >
           {isPending ? <Loader2 className="animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> {t('cta_login')}</>}
        </Button>

      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('no_account_prefix')} <Link href="/auth/register" className="text-primary hover:underline font-medium">{t('register_link')}</Link>
      </p>
    </div>
  );
}