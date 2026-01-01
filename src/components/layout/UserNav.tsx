'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, ShieldAlert, Loader2 } from 'lucide-react';
import { signOutAction } from '@/features/auth/actions/auth';
import type { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserNavProps {
  user: User | null;
}

export function UserNav({ user }: UserNavProps) {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Comprovació d'admin (Idealment això vindria del perfil a la DB, però per UI ràpida serveix)
  const isAdmin = user?.email === 'digitaistudios.developer@gmail.com' || user?.user_metadata?.role === 'admin';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutAction();
    router.refresh();
    router.push('/auth/login');
  };

  // CAS 1: USUARI AUTENTICAT
  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Enllaç Admin (Només visible en Desktop si és admin) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden sm:flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
            title="Panell d'Administrador"
          >
            <ShieldAlert className="w-5 h-5" strokeWidth={2} />
          </Link>
        )}

        {/* Botó Dashboard Principal */}
        <Link href="/dashboard">
          <Button className="gradient-bg text-white border-0 shadow-lg shadow-primary/20 h-9 px-3 sm:px-4 sm:h-10 transition-transform hover:scale-105">
            <LayoutDashboard className="w-4 h-4 mr-2" /> 
            <span className="hidden sm:inline">{t('dashboard')}</span>
            <span className="sm:hidden">Dash</span>
          </Button>
        </Link>

        {/* Avatar + Logout (Simplificat) */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
            <Avatar className="h-8 w-8 border border-border hidden sm:block">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                disabled={isSigningOut}
                title={t('logout')}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"
            >
            {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            </Button>
        </div>
      </div>
    );
  }

  // CAS 2: USUARI CONVIDAT (Guest)
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href="/auth/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-2 hidden sm:block">
        {t('login')}
      </Link>
      <Link href="/auth/register">
        <Button className="gradient-bg text-white border-0 shadow-md shadow-primary/10 h-9 px-4 sm:h-10 rounded-full">
          {t('register')}
        </Button>
      </Link>
    </div>
  );
}