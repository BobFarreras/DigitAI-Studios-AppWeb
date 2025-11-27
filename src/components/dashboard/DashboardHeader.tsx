'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DashboardHeader({ userEmail }: { userEmail?: string }) {
  return (
    <header className="h-16 border-b border-white/5 bg-[#0f111a]/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
       
       {/* SEARCH BAR (Opcional) */}
       <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <Input 
                placeholder="Cercar projectes..." 
                className="pl-10 bg-white/5 border-white/10 text-sm text-white focus:border-primary h-9 w-64 transition-all focus:w-full"
             />
          </div>
       </div>

       {/* ACTIONS & PROFILE */}
       <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f111a]"></span>
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>

          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">El Teu Compte</p>
                <p className="text-xs text-slate-500">{userEmail}</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/10">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
             </div>
          </div>
       </div>
    </header>
  );
}