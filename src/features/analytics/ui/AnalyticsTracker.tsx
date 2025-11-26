'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { trackEventAction } from '../actions';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef<number>(0);

  useEffect(() => {
    // ---------------------------------------------------------
    // 1. SISTEMA D'IMMUNITAT (CAPA D'INVISIBILITAT)
    // ---------------------------------------------------------
    
    // A) Si estem entrant a la zona admin, ens marquem com a "VIP" per sempre
    if (pathname?.startsWith('/admin')) {
      localStorage.setItem('digitai_is_admin', 'true');
      return; // No trackegem res a dins de l'admin
    }

    // B) Si tenim la marca de VIP, sortim immediatament. 
    // Així, quan visitis la Home, tampoc et comptarà.
    const isAdminBrowser = localStorage.getItem('digitai_is_admin');
    if (isAdminBrowser === 'true') {
      return;
    }

    // ---------------------------------------------------------
    // 2. GESTIÓ DE SESSIÓ I UTMS
    // ---------------------------------------------------------
    let sessionId = localStorage.getItem('digitai_session');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('digitai_session', sessionId);
    }

    // Guardem les UTMs a la sessió per no perdre-les si l'usuari navega
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    if (utmSource) localStorage.setItem('utm_source', utmSource);
    if (utmMedium) localStorage.setItem('utm_medium', utmMedium);
    if (utmCampaign) localStorage.setItem('utm_campaign', utmCampaign);

    // ---------------------------------------------------------
    // 3. PREPARAR DADES
    // ---------------------------------------------------------
    const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    // Recuperem les UTMs (de la URL actual o de la memòria si ve d'una altra pàgina)
    const activeSource = utmSource || localStorage.getItem('utm_source');
    const activeMedium = utmMedium || localStorage.getItem('utm_medium');
    const activeCampaign = utmCampaign || localStorage.getItem('utm_campaign');

    // Construïm l'objecte meta
    const metaData: Record<string, string | number> = {
        screen: `${window.innerWidth}x${window.innerHeight}`,
    };

    if (activeSource) metaData.utm_source = activeSource;
    if (activeMedium) metaData.utm_medium = activeMedium;
    if (activeCampaign) metaData.utm_campaign = activeCampaign;

    // ---------------------------------------------------------
    // 4. ENVIAR PAGE VIEW
    // ---------------------------------------------------------
    trackEventAction({
      event_name: 'page_view',
      path: fullUrl,
      session_id: sessionId!,
      referrer: document.referrer || 'direct', // Si és buit, posem 'direct'
      meta: metaData as Record<string, unknown>
    });

    // Resetegem cronòmetre
    startTime.current = Date.now();

    // ---------------------------------------------------------
    // 5. PAGE LEAVE (SORTIDA)
    // ---------------------------------------------------------
    return () => {
      if (startTime.current === 0) return;
      
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      
      if (duration > 0) {
        trackEventAction({
          event_name: 'page_leave',
          path: pathname,
          session_id: sessionId!,
          meta: { 
              scroll: window.scrollY,
              duration: duration 
          } as Record<string, unknown>,
          duration: duration
        });
      }
    };
  }, [pathname, searchParams]);

  return null;
}