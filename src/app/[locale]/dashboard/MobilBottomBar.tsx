'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter, Link } from '@/routing'; 
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  ShieldAlert, 
  LogOut, 
  Home, 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { signOutAction } from '@/features/auth/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MobileBottomBarProps {
  userRole: 'admin' | 'client' | 'lead';
}

export function MobileBottomBar({ userRole }: MobileBottomBarProps) {
  const t = useTranslations('Dashboard.mobile_nav'); // Namespace específic per mòbil (labels curts)
  const tCommon = useTranslations('Dashboard.sidebar'); // Reutilitzem textos del sidebar/logout
  const pathname = usePathname();
  const router = useRouter();
  
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Neteja del path per saber on som
  const cleanPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOutAction();
    // No cal router.push aquí perquè el server action ja fa redirect, 
    // però per si de cas a client:
    router.refresh(); 
  };

  const MENU_ITEMS = [
    { icon: LayoutDashboard, label: t('summary'), href: '/dashboard' },
    // Nota: Si '/dashboard/audits' no existeix encara, redirigeix o canvia-ho
    { icon: FileText, label: t('audits'), href: '/dashboard/audits' }, 
    { icon: FolderKanban, label: t('projects'), href: '/dashboard/projects' },
  ];

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      // Opcional: Toast en lloc d'alert
      alert(`${label} ${t('coming_soon')}`); 
    }
  };

  return (
    <>
      {/* --- BARRA INFERIOR --- */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-colors duration-300 md:hidden">
          <div className="flex justify-around items-center h-16 px-2">
              
              {/* 1. ELEMENTS DEL DASHBOARD */}
              {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  let isActive = false;
                  
                  if (!item.href.startsWith('#')) {
                     if (item.href === '/dashboard') {
                        isActive = cleanPath === '/dashboard';
                     } else {
                        isActive = cleanPath.startsWith(item.href);
                     }
                  }

                  return (
                      <Link 
                          key={item.label} 
                          href={item.href}
                          onClick={(e) => handleClick(e, item.href, item.label)}
                          className={cn(
                              "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                              isActive 
                                  ? "text-primary" 
                                  : "text-muted-foreground hover:text-foreground"
                          )}
                      >
                          <Icon 
                              className={cn("w-5 h-5 transition-all", isActive && "fill-current/20 scale-110")} 
                              strokeWidth={isActive ? 2.5 : 2} 
                          />
                          <span className={cn("text-[10px] font-medium truncate max-w-15", isActive ? "font-bold" : "")}>
                              {item.label}
                          </span>
                      </Link>
                  );
              })}

              {/* 2. ADMIN (Condicional) */}
              {userRole === 'admin' && (
                  <Link 
                      href="/admin"
                      className={cn(
                          "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                          cleanPath.startsWith('/admin') ? "text-purple-500" : "text-muted-foreground hover:text-purple-500"
                      )}
                  >
                      <ShieldAlert className="w-5 h-5" strokeWidth={2} />
                      <span className="text-[10px] font-medium font-mono text-purple-500/80">ADMIN</span>
                  </Link>
              )}

              {/* SEPARADOR VERTICAL PETIT */}
              <div className="h-8 w-px bg-border/50 mx-1"></div>

              {/* 3. HOME (WEB PÚBLICA)  */}
              <Link
                  href="/"
                  className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-muted-foreground hover:text-foreground"
              >
                  <Home className="w-5 h-5" strokeWidth={2} />
                  <span className="text-[10px] font-medium">{t('web')}</span>
              </Link>

              {/* 4. BOTÓ LOGOUT (Obre Modal)  */}
              <button
                  onClick={() => setShowExitDialog(true)}
                  className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform text-red-400 hover:text-red-500"
              >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                  <span className="text-[10px] font-medium">{t('logout_short')}</span>
              </button>

          </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓ (LOGOUT) --- */}
      <AnimatePresence>
        {showExitDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
            
            {/* Backdrop fosc */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Targeta del Diàleg */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              {/* Botó tancar */}
              <button 
                onClick={() => setShowExitDialog(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-2">
                  <LogOut className="w-6 h-6 ml-1" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-foreground">{tCommon('logout_confirm_title')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tCommon('logout_confirm_desc')}
                  </p>
                </div>

                <div className="flex gap-3 w-full pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExitDialog(false)}
                    className="flex-1 rounded-xl h-11"
                  >
                    {tCommon('cancel')}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="flex-1 rounded-xl h-11 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                  >
                    {isSigningOut ? '...' : tCommon('logout_action')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}