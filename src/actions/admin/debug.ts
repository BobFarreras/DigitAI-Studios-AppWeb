'use server';

import { createClient } from '@/lib/supabase/server';

type DebugConnectionResult = {
  success: boolean;
  count?: number | null;
  error?: string;
};

/**
 * Comprova la connexió de lectura a analytics_events des del servidor.
 * Responsabilitat: executar la consulta i retornar un resultat normalitzat.
 */
export async function testAnalyticsConnectionAction(): Promise<DebugConnectionResult> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('analytics_events')
      .select('count', { count: 'exact', head: true });

    if (error) return { success: false, error: error.message };
    return { success: true, count };
  } catch (error: unknown) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: 'Error desconegut comprovant la connexió.' };
  }
}
