/**
 * @file src/actions/social-oauth-callback.ts
 * @updated 2026-05-20
 * @summary Handles social OAuth callback and persists connection to tenant.
 * @scope OAuth resolution + token exchange + data persistence via repository.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';
import { SupabaseSocialConnectionRepository } from '@/repositories/supabase/SupabaseSocialConnectionRepository';

interface ConnectionData {
  provider: 'linkedin' | 'facebook';
  accessToken: string;
  providerAccountId: string;
  providerPageId: string;
  providerPageName: string;
  providerAvatar?: string;
  expiresIn?: number;
}

export async function resolveSocialOauthCallback(
  requestUrl: string,
  provider: 'linkedin' | 'facebook'
) {
  const { searchParams } = new URL(requestUrl);
  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectOnSuccess = `${origin}/admin/blog?connected=true`;

  if (oauthError || !code) {
    return `${origin}/admin/blog?error=auth_failed`;
  }

  const supabase = await createClient();

  const saveConnection = async (data: ConnectionData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found in session');

    const profileRepo = new SupabaseProfileRepository();
    const profile = await profileRepo.findById(user.id);

    if (!profile) {
      throw new Error(`Perfil incomplet. Falta el registre a la taula 'profiles' per l'ID ${user.id}`);
    }

    const connectionRepo = new SupabaseSocialConnectionRepository();
    await connectionRepo.upsert({
      organization_id: profile.organization_id,
      user_id: user.id,
      provider: data.provider,
      access_token: data.accessToken,
      provider_account_id: data.providerAccountId,
      provider_page_id: data.providerPageId,
      provider_page_name: data.providerPageName,
      provider_avatar_url: data.providerAvatar,
      expires_at: data.expiresIn ? Date.now() + data.expiresIn * 1000 : null,
      updated_at: new Date().toISOString(),
    });
  };

  try {
    if (provider === 'linkedin') {
      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${origin}/api/oauth/callback`,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Error obtenint token LinkedIn');

      const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (!userRes.ok) throw new Error('Error obtenint perfil LinkedIn');
      const userData = await userRes.json();

      await saveConnection({
        provider: 'linkedin',
        accessToken: tokenData.access_token,
        providerAccountId: userData.sub,
        providerPageId: userData.sub,
        providerPageName: userData.name || 'LinkedIn User',
        providerAvatar: userData.picture,
        expiresIn: tokenData.expires_in,
      });
    } else {
      const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${origin}/api/oauth/callback&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;
      const tokenRes = await fetch(tokenUrl);
      const tokenData = await tokenRes.json();
      if (tokenData.error) throw new Error(tokenData.error.message);

      const pagesRes = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${tokenData.access_token}`
      );
      const pagesData = await pagesRes.json();
      if (!pagesData.data || pagesData.data.length === 0) {
        return `${origin}/admin/blog?error=no_pages_found`;
      }

      const page = pagesData.data[0];
      await saveConnection({
        provider: 'facebook',
        accessToken: page.access_token,
        providerAccountId: page.id,
        providerPageId: page.id,
        providerPageName: page.name,
        providerAvatar: `https://graph.facebook.com/${page.id}/picture`,
        expiresIn: tokenData.expires_in,
      });
    }

    return redirectOnSuccess;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Auth Error';
    return `${origin}/admin/blog?error=${encodeURIComponent(errorMessage)}`;
  }
}
