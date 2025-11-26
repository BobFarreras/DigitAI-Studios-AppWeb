'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/routing'; // 👈 Important: Fem servir el router de next-intl
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function RegisterForm({ prefilledEmail }: { prefilledEmail: string }) {
  const t = useTranslations('Auth');
  const router = useRouter(); // Per redirigir
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Com que has desactivat "Confirm Email" a Supabase,
    // això retorna una sessió vàlida immediatament!
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // ✅ ÈXIT: Redirigim directament al Dashboard
      // Refresquem el router per actualitzar les cookies de sessió al servidor
      router.refresh(); 
      router.push('/dashboard'); 
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('cta_register')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}