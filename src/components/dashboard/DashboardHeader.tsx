'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function DashboardHeader({ userEmail }: { userEmail?: string }) {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
       
       {/* SEARCH BAR (S'adapta o s'amaga en mòbil molt petit) */}
       <div className="flex items-center w-full max-w-xs md:max-w-md mr-4">
          <div className="relative w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
                placeholder="Cercar..." 
                className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all h-9 rounded-full"
             />
          </div>
       </div>

       {/* ACTIONS & PROFILE */}
       <div className="flex items-center gap-2 md:gap-4 shrink-0">
          
          {/* Botó de Tema (Clar/Fosc) */}
          <ThemeToggle />

          {/* Notificacions */}
          <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
          </Button>
          
          {/* Separador */}
          <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

          {/* Perfil */}
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground leading-none">Compte</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{userEmail}</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-background">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
             </div>
          </div>
       </div>
    </header>
  );
}