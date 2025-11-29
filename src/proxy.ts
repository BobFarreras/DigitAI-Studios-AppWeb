// =================== FILE: src/proxy.ts ===================

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // 👇 HE AFEGIT 'webmanifest' i 'mp4' A L'EXCEPCIÓ DEL REGEX
    // Això diu: "Executa el middleware a tot ARREU EXCEPTE api, next, imatges, manifest i videos"
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest|mp4)$).*)',
  ],
};