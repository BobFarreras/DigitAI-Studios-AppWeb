/**
 * @file src/app/[locale]/auth/callback/route.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/auth/callback/route.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NextResponse } from 'next/server';
import { resolveLocaleAuthCallback } from '@/actions/auth-callback';

export async function GET(request: Request) {
  const redirectUrl = await resolveLocaleAuthCallback(request.url);
  return NextResponse.redirect(redirectUrl);
}

