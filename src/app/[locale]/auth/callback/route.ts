import { NextResponse } from 'next/server';
import { resolveLocaleAuthCallback } from '@/actions/auth-callback';

export async function GET(request: Request) {
  const redirectUrl = await resolveLocaleAuthCallback(request.url);
  return NextResponse.redirect(redirectUrl);
}
