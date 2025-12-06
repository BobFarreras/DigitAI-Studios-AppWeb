'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client'; // ✅ Client de navegador
import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from '@/routing';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GoogleIcon } from '@/components/icons/GoogleIcon'; // 👈 Importem la icona
import { toast } from 'sonner';

export function LoginForm() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Estat separat per Google
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
      toast.error(error.message); // Usem toast que queda millor
      setIsLoading(false);
    } else {
      router.refresh();
      router.push('/dashboard');
    }
  };

  // ✅ LÒGICA GOOGLE REAL
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirigim al callback amb un paràmetre 'next' si calgués
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
        toast.error(error.message);
        setIsGoogleLoading(false);
    }
    // Si no hi ha error, Supabase redirigeix automàticament a Google
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
          className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-3 font-medium transition-transform active:scale-[0.98]"
        >
          {isGoogleLoading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <GoogleIcon className="w-5 h-5" />
          )}
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
            placeholder="nom@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full h-12 gradient-bg text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20">
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