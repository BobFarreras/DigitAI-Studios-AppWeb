/**
 * @file src/app/api/oauth/callback/route.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/api/oauth/callback/route.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NextRequest, NextResponse } from 'next/server';
import { resolveSocialOauthCallback } from '@/actions/social-oauth-callback';

export async function GET(request: NextRequest) {
    const redirectUrl = await resolveSocialOauthCallback(request.url);
    return NextResponse.redirect(redirectUrl);
}

