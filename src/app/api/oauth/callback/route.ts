/**
 * @file src/app/api/oauth/callback/route.ts
 * @updated 2026-05-10
 * @summary Route module: src/app/api/oauth/callback/route.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NextRequest, NextResponse } from 'next/server';
import { resolveSocialOauthCallback } from '@/actions/social-oauth-callback';

const OAUTH_STATE_COOKIE = 'oauth_state';
const OAUTH_PROVIDER_COOKIE = 'oauth_provider';

function clearOauthCookies(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set(OAUTH_PROVIDER_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  const oauthError = url.searchParams.get('error');
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const provider = request.cookies.get(OAUTH_PROVIDER_COOKIE)?.value;

  if (oauthError || !code) {
    const response = NextResponse.redirect(`${origin}/admin/blog?error=auth_failed`);
    clearOauthCookies(response);
    return response;
  }

  if (!state || !cookieState || state !== cookieState) {
    const response = NextResponse.redirect(`${origin}/admin/blog?error=invalid_state`);
    clearOauthCookies(response);
    return response;
  }

  if (provider !== 'linkedin' && provider !== 'facebook') {
    const response = NextResponse.redirect(`${origin}/admin/blog?error=invalid_provider`);
    clearOauthCookies(response);
    return response;
  }

  const redirectUrl = await resolveSocialOauthCallback(request.url, provider);
  const response = NextResponse.redirect(redirectUrl);
  clearOauthCookies(response);
  return response;
}

