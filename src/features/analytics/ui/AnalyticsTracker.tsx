'use client';

import { useEffect } from 'react'; // Treiem useRef
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { trackEventAction } from '../actions';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // ✅ CORRECCIÓ: Hem eliminat isFirstRender per netejar l'error

  useEffect(() => {
    // 1. Gestió de Sessió
    let sessionId = localStorage.getItem('digitai_session');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('digitai_session', sessionId);
    }

    // 2. Preparar URL
    const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    // 3. Enviar event (amb un petit timeout per no bloquejar render)
    const timeoutId = setTimeout(() => {
        trackEventAction({
            event_name: 'page_view',
            path: fullUrl,
            session_id: sessionId!,
            meta: {
                referrer: document.referrer,
                screen: `${window.innerWidth}x${window.innerHeight}`
            }
        });
    }, 1000);

    return () => clearTimeout(timeoutId);

  }, [pathname, searchParams]);

  return null;
}