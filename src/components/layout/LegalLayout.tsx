'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Scale, Shield, Cookie, FileText } from "lucide-react";
// Si tens un hook d'autenticació o context, pots obtenir l'usuari aquí. 
// Si no, pots passar user={null} a la Navbar com a placeholder.
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from "react";
import type { User } from '@supabase/supabase-js';

const LEGAL_NAV = [
  { name: 'Avís Legal', href: '/legal/avis-legal', icon: Scale },
  { name: 'Política de Privacitat', href: '/legal/privacitat', icon: Shield },
  { name: 'Política de Cookies', href: '/legal/cookies', icon: Cookie },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  
  // Opcional: Recuperar usuari per pintar bé la Navbar (si vols que surti l'avatar)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // 🧹 LÒGICA CLAU: Netegem l'idioma de la ruta (ex: /ca/legal -> /legal)
  // Això assegura que la comparació funcioni en qualsevol idioma
  const cleanPath = pathname.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Passem l'usuari a la Navbar perquè es vegi consistent */}
      <Navbar user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* SIDEBAR NAVEGACIÓ (Sticky) */}
          <aside className="lg:col-span-1 hidden lg:block">
             <div className="sticky top-32 space-y-4">
                <div className="px-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                        <FileText className="w-5 h-5 text-primary" /> 
                        Centre Legal
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Documentació oficial i normatives.
                    </p>
                </div>

                <nav className="flex flex-col space-y-1">
                   {LEGAL_NAV.map((item) => {
                      // Comprovem si la ruta neta coincideix o si comença per ella
                      const isActive = cleanPath === item.href || pathname.endsWith(item.href);

                      return (
                        <Link 
                           key={item.href} 
                           href={item.href}
                           className={cn(
                             "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                             isActive 
                               ? "bg-primary/10 text-primary border border-primary/20 shadow-sm font-bold" 
                               : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                           )}
                        >
                           <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                           {item.name}
                        </Link>
                      )
                   })}
                </nav>
             </div>
          </aside>

          {/* MENU MÒBIL (Horitzontal, només visible en pantalles petites) */}
          <div className="lg:hidden col-span-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
             <div className="flex gap-2 w-max">
                {LEGAL_NAV.map((item) => {
                    const isActive = cleanPath === item.href || pathname.endsWith(item.href);
                    return (
                        <Link 
                           key={item.href} 
                           href={item.href}
                           className={cn(
                             "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
                             isActive 
                               ? "bg-primary text-primary-foreground border-primary" 
                               : "bg-background border-border text-muted-foreground"
                           )}
                        >
                           <item.icon className="w-4 h-4" />
                           {item.name}
                        </Link>
                    )
                })}
             </div>
          </div>

          {/* CONTINGUT PRINCIPAL */}
          <div className="lg:col-span-3">
             <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl">
                   {children}
                </article>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}