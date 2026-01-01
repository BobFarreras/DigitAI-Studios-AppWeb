'use client';

import { LogOut, Loader2 } from 'lucide-react'; // Afegim Loader2
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { signOutAction } from '@/features/auth/actions/auth';
import { cn } from '@/lib/utils'; // Important per fusionar classes
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LogoutButtonProps {
  minimal?: boolean;   // Si és true, només mostra icona
  className?: string;  // Per sobreescriure estils (flex-col vs flex-row)
}

export function LogoutButton({ minimal = false, className }: LogoutButtonProps) {
  const t = useTranslations('Sidebar'); // O 'Navbar', segons on tinguis les traduccions de logout
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOutAction();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button 
          className={cn(
            // Estils base per defecte (Sidebar)
            "flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors",
            "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10",
            // Si passem una className des de fora (Mòbil), aquesta guanya
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <LogOut className={cn("w-5 h-5", minimal && "w-6 h-6" /* Icona una mica més gran al mòbil */)} strokeWidth={2} />
          )}
          
          {/* Només mostrem el text si NO és minimal */}
          {!minimal && (
            <span>{t('logout')}</span>
          )}
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('logout_confirm_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('logout_confirm_desc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? '...' : t('logout_action')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}