'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Assegura't que tens aquest fitxer client

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Aquest log T'HA DE SORTIR a la consola del navegador
    console.log("👀 AnalyticsTracker iniciat a:", pathname);

    const trackView = async () => {
      // 1. Netejem la URL (treiem l'idioma)
      const rawPath = pathname || '/';
      // Expressió regular per treure /ca, /es, /en del principi
      const cleanPath = rawPath.replace(/^\/(ca|es|en)(\/|$)/, '$2') || '/';
      
      // Si ha quedat buit (era només /ca), posem /
      const finalPath = cleanPath === '' ? '/' : cleanPath;
      // Si no comença per /, li posem (per coherència estètica)
      const pathStored = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;

      console.log(`📡 Enviant dades... Path Original: ${rawPath} -> Guardat: ${pathStored}`);

      const { error } = await supabase.from('analytics_events').insert({
        event_name: 'page_view',
        path: pathStored,
        // Generem ID sessió ràpid si no en tenim (per test)
        session_id: localStorage.getItem('digitai_session') || 'session-' + Math.random().toString(36).slice(2),
        meta: {
          raw_url: window.location.href,
          referrer: document.referrer
        }
      });

      if (error) console.error("❌ Error Supabase:", error.message);
      else console.log("✅ DADA GUARDADA!");
    };

    // Petit retard per no bloquejar la navegació visual
    const timeout = setTimeout(trackView, 500);
    return () => clearTimeout(timeout);

  }, [pathname, searchParams, supabase]);

  return null;
}