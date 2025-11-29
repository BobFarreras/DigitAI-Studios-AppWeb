'use server';

import { createClient } from '@/lib/supabase/server';

type AnalyticsPayload = {
  event_name: string;
  path: string;
  session_id: string;
  referrer?: string;
  duration?: number;
  meta?: Record<string, unknown>;
};

export async function trackEventAction(data: AnalyticsPayload) {
  // LOG SERVER 1: Confirmem que la petició arriba al backend
  console.log("SERVER ACTION: Rebuda petició per:", data.path);

  try {
    const supabase = await createClient();

    // Comprovem si tenim usuari (opcional, només per info)
    const { data: { user } } = await supabase.auth.getUser();

    // LOG SERVER 2: Intentant inserir
    console.log("SERVER ACTION: Intentant inserir a Supabase...");

    const { error, data: insertedData } = await supabase.from('analytics_events').insert({
      event_name: data.event_name,
      path: data.path,
      session_id: data.session_id,
      user_id: user?.id || null,
      meta: {
        ...data.meta,
        referrer: data.referrer,
        duration: data.duration
      }
    })
    .select(); // Afegim select per veure si retorna alguna cosa

    // LOG SERVER 3: Resultat
    if (error) {
      console.error("❌❌ SUPABASE ERROR (CRÍTIC):", error);
      console.error("Detalls:", error.message, error.details, error.hint);
      return { success: false, error: error.message };
    }

    console.log("✅✅ SUPABASE ÈXIT. ID inserit:", insertedData?.[0]?.id || 'Desconegut');
    return { success: true };

  } catch (err) {
    console.error("💥💥 ERROR INTERN NO CONTROLAT:", err);
    return { success: false, error: 'Internal Server Error' };
  }
}