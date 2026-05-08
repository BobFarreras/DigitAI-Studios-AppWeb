import { NextRequest, NextResponse } from 'next/server';
import { resolveSocialOauthCallback } from '@/actions/social-oauth-callback';

export async function GET(request: NextRequest) {
    const redirectUrl = await resolveSocialOauthCallback(request.url);
    return NextResponse.redirect(redirectUrl);
}
