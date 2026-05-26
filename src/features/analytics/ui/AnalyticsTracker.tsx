/**
 * @file src/features/analytics/ui/AnalyticsTracker.tsx
 * @updated 2026-05-08
 * @summary Feature module: src/features/analytics/ui/AnalyticsTracker.tsx
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEventAction, updateSessionDurationAction } from '../actions';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // ✅ SOLUCIÓ 1: Inicialitzem a 0 per evitar l'error "Impure function"
  const startTime = useRef<number>(0); 
  const currentEventId = useRef<number | null>(null);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // 1. Gestió Sessió
    let sessionId = localStorage.getItem('digitai_session_id');
    if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
        localStorage.setItem('digitai_session_id', sessionId);
    }

    const rawPath = pathname || '/';
    
    // Evitem duplicats en React Strict Mode
    if (lastPath.current === rawPath) return;
    
    // 🛑 SORTIDA DE PÀGINA ANTERIOR
    if (currentEventId.current && startTime.current > 0) {
        const duration = Math.round((Date.now() - startTime.current) / 1000);
        updateSessionDurationAction(currentEventId.current, duration);
    }

    // 🚀 ENTRADA A NOVA PÀGINA
    lastPath.current = rawPath;
    startTime.current = Date.now(); // ✅ Aquí és segur cridar Date.now() (dins useEffect)
    
    const track = async () => {
      const response = await trackEventAction({
        event_name: 'page_view',
        path: rawPath,
        session_id: sessionId as string,
        referrer: document.referrer,
        meta: {
           screen_width: window.innerWidth,
           language: navigator.language
        }
      });

      // ✅ SOLUCIÓ 2: TypeScript ja no es queixarà perquè hem tipat l'acció al pas següent
      if (response.success && response.eventId) {
        currentEventId.current = response.eventId;
      }
    };

    track();

    // 🧹 NETEJA FINAL (Tancar pestanya)
    return () => {
      if (currentEventId.current && startTime.current > 0) {
        const duration = Math.round((Date.now() - startTime.current) / 1000);
        updateSessionDurationAction(currentEventId.current, duration);
      }
    };

  }, [pathname, searchParams]);

  return null;
}
