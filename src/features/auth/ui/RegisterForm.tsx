'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { Loader2, UserPlus, Github, Info } from 'lucide-react';

export function RegisterForm({ prefilledEmail }: { prefilledEmail: string }) {
  const t = useTranslations('Auth');
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Estat del Checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validació Checkbox
    if (!termsAccepted) {
        setError("Has d'acceptar la política de privacitat per crear el compte.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Registre a Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // Redirecció si tot va bé
    router.refresh();
    router.push('/dashboard');
  };

  const handleOAuth = async (provider: 'github') => {
    // Validació Checkbox també per Social Login
    if (!termsAccepted) {
        setError("Si us plau, accepta els termes i la privacitat abans de continuar amb GitHub.");
        return;
    }

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('register_title', { defaultMessage: "Crea el teu compte" })}</h1>
        <p className="text-muted-foreground">{t('register_subtitle', { defaultMessage: "Comença a automatitzar el teu negoci avui." })}</p>
      </div>

      {/* Social Register */}
      <div className="grid grid-cols-1 gap-4">
        <Button 
            variant="outline" 
            onClick={() => handleOAuth('github')} 
            className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-2"
        >
          <Github className="w-5 h-5" /> Registre amb GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O amb email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Nom Complet</label>
          <Input 
            id="fullName"
            type="text" 
            placeholder="Joan Garcia" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Email</label>
          <Input 
            id="email"
            type="email" 
            placeholder="nom@empresa.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Contrasenya</label>
          <Input 
            id="password"
            type="password" 
            placeholder="Crear contrasenya" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card border-border text-foreground h-12 focus:border-primary"
            required
            minLength={6}
          />
        </div>

        {/* Checkbox Legal */}
        <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
                id="privacy" 
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean);
                    if(checked) setError(null); // Netegem l'error visual si l'usuari marca la casella
                }}
                className="mt-1 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
            />
            <div className="grid gap-1.5 leading-none">
                <label 
                    htmlFor="privacy" 
                    className="text-sm text-muted-foreground leading-snug cursor-pointer select-none"
                >
                    He llegit i accepto la <Link href="/legal/privacitat" target="_blank" className="underline hover:text-primary transition-colors">política de privacitat</Link> i les <Link href="/legal/avis-legal" target="_blank" className="underline hover:text-primary transition-colors">condicions d'ús</Link>.
                </label>
            </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Info className="w-4 h-4 shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        <Button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full h-12 font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${
                termsAccepted 
                ? 'gradient-bg text-white hover:opacity-90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
            }`}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="w-4 h-4" /> Crear Compte</>}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('already_have_account', { defaultMessage: "Ja tens compte?" })}{' '}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          {t('login_link', { defaultMessage: "Inicia sessió" })}
        </Link>
      </p>
    </div>
  );
}