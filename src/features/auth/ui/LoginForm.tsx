'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LogIn, Github } from 'lucide-react';
import { useRouter } from '@/routing'; // Import del teu routing i18n
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.refresh();
      router.push('/dashboard');
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    // Simplement mostrem el missatge i parem
    setError("🚧 El login social està en manteniment. Utilitza el teu email i contrasenya.");
    return;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Benvingut de nou</h1>
        <p className="text-muted-foreground">Entra al teu panell de control digital.</p>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 gap-4">
        <Button variant="outline" onClick={() => handleOAuth('github')} className="w-full h-12 border-border bg-card hover:bg-muted text-foreground gap-2">
          <Github className="w-5 h-5" /> Continuar amb GitHub
        </Button>
        {/* Pots afegir Google aquí */}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O amb email</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Email</label>
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
            <label className="text-sm font-medium text-foreground ml-1">Contrasenya</label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Has oblidat la contrasenya?
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

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12 gradient-bg text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> Entrar</>}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Encara no tens compte?{' '}
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          Registra't gratis
        </Link>
      </p>
    </div>
  );
}