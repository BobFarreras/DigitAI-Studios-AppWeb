import createMiddleware from 'next-intl/middleware';
import { routing } from '@/routing'; // 👈 IMPORTEM CONFIG
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing); // 👈 LI PASSEM LA CONFIG

export async function proxy(request: NextRequest) {
  // 1. Next-intl fa la feina de routing (idiomes)
  const response = intlMiddleware(request);

  // 2. Supabase fa la feina de sessió
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};