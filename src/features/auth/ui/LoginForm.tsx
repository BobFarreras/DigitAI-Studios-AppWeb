'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from '@/routing';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { toast } from 'sonner';

// Props tipats
interface LoginFormProps {
  prefilledEmail?: string;
}

export function LoginForm({ prefilledEmail }: LoginFormProps) {
  const t = useTranslations('Auth');
  // Inicialitzem l'estat amb la prop si existeix
  const [email, setEmail] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      router.refresh();
      // Si venim d'una auditoria, potser voldríem anar al dashboard directament
      // (Supabase gestionarà la sessió)
      router.push('/dashboard');
    }
  };

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

      {/* Social Login */}
      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline" 
          onClick={handleGoogleLogin} 
          disabled={isGoogleLoading || isLoading}
          className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-3 font-medium"
        >
          {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
          {t('social_google', { defaultMessage: 'Continuar amb Google' })}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t('or_email')}</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">{t('label_email')}</label>
          <Input
            type="email"
            name="email"
            placeholder="nom@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
            // Si ja tenim email, no cal autofocus aquí
            autoFocus={!prefilledEmail}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-foreground ml-1">{t('label_password')}</label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              {t('forgot_password')}
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
            // Si tenim email, posem el focus directament al password per escriure ràpid
            autoFocus={!!prefilledEmail}
          />
        </div>

        <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full h-12 gradient-bg text-white font-bold rounded-lg hover:opacity-90 shadow-lg">
          {isLoading 
            ? <Loader2 className="animate-spin" /> 
            : <><LogIn className="w-4 h-4 mr-2" /> {t('cta_login')}</>
          }
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('no_account_prefix')}{' '}
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          {t('register_link')}
        </Link>
      </p>
    </div>
  );
}