'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
// JA NO IMPORTEM SUPABASE CLIENT
import { trackEventAction } from '../actions'; 

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Utilitzem un ref per evitar dobles enviaments en React 18 Strict Mode
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // 1. Gestió de l'ID de sessió (persistent al navegador)
    let sessionId = localStorage.getItem('digitai_session_id');
    if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
        localStorage.setItem('digitai_session_id', sessionId);
    }

    // 2. Neteja de la ruta
    const rawPath = pathname || '/';
    // Evitem trackejar dues vegades la mateixa ruta consecutiva (fix React Strict Mode)
    if (lastTrackedPath.current === rawPath) return;
    lastTrackedPath.current = rawPath;

    // 3. Execució via Server Action (Segura)
    const track = async () => {
      await trackEventAction({
        event_name: 'page_view',
        path: rawPath,
        session_id: sessionId as string,
        referrer: document.referrer,
        meta: {
           screen_width: window.innerWidth,
           language: navigator.language
        }
      });
    };

    // Petit retard per no bloquejar el renderitzat inicial
    const timeout = setTimeout(track, 1000);
    return () => clearTimeout(timeout);

  }, [pathname, searchParams]); // S'executa quan canvia la ruta

  return null;
}