/**
 * @file src/proxy.ts
 * @updated 2026-05-21
 * @summary Middleware: i18n routing + rate limiting + security headers.
 * @scope All public requests. Blocks abusive IPs, adds security headers, handles locale routing.
 */
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { rateLimit } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? request.headers.get('x-real-ip')
    ?? '127.0.0.1';

  const { allowed, remaining, resetAt } = rateLimit(ip);

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(resetAt),
        },
      }
    );
  }

  const response = intlMiddleware(request);
  const enriched = await updateSession(request, response);

  enriched.headers.set('X-RateLimit-Limit', '60');
  enriched.headers.set('X-RateLimit-Remaining', String(remaining));
  enriched.headers.set('X-RateLimit-Reset', String(resetAt));

  enriched.headers.set('X-Frame-Options', 'DENY');
  enriched.headers.set('X-Content-Type-Options', 'nosniff');
  enriched.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  enriched.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (request.headers.get('x-forwarded-proto') === 'http') {
    enriched.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return enriched;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|..*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest|mp4)$).*)',
  ],
};