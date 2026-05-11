/**
 * @file src/app/api/oauth/init/route.ts
 * @updated 2026-05-10
 * @summary Route module: src/app/api/oauth/init/route.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const OAUTH_STATE_COOKIE = 'oauth_state';
const OAUTH_PROVIDER_COOKIE = 'oauth_provider';
const OAUTH_COOKIE_TTL_SECONDS = 60 * 10;

function createOauthState() {
  return randomBytes(32).toString('hex');
}

function setOauthCookies(response: NextResponse, state: string, provider: 'linkedin' | 'facebook') {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: OAUTH_COOKIE_TTL_SECONDS,
  });
  response.cookies.set(OAUTH_PROVIDER_COOKIE, provider, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: OAUTH_COOKIE_TTL_SECONDS,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider'); // 'linkedin' o 'facebook'
  const state = createOauthState();

  // URL on tornarem després que l'usuari accepti
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

  // ---------------------------------------------------------
  // 1. LINKEDIN
  // ---------------------------------------------------------
  if (provider === 'linkedin') {
    const scope = encodeURIComponent('openid profile email w_member_social'); // Permisos necessaris

    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scope}`;
    const response = NextResponse.redirect(url);
    setOauthCookies(response, state, 'linkedin');
    return response;
  }

  // ---------------------------------------------------------
  // 2. FACEBOOK (Meta)
  // ---------------------------------------------------------
  if (provider === 'facebook') {
    // Permisos: 'pages_manage_posts' i 'pages_read_engagement' són claus per publicar com a pàgina
    const scope = encodeURIComponent('public_profile,email,pages_manage_posts,pages_read_engagement,pages_show_list');

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=${scope}`;
    const response = NextResponse.redirect(url);
    setOauthCookies(response, state, 'facebook');
    return response;
  }

  return NextResponse.json({ error: 'Proveïdor no suportat' }, { status: 400 });
}
