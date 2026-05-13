/**
 * @file src/actions/social-media/shared.ts
 * @updated 2026-05-13
 * @summary Helpers compartits per accions de social media.
 * @scope Auth d'usuari i utilitats de gestió d'URLs/bucket.
 */

import { createClient } from '@/lib/supabase/server';

export async function getAuthedSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return { supabase, user };
}

export function extractSocialMediaPath(mediaUrl: string | null | undefined) {
  if (!mediaUrl) return null;
  const parts = mediaUrl.split('/social-media/');
  if (parts.length <= 1) return null;
  return parts[1];
}
