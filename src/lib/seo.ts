/**
 * @file src/lib/seo.ts
 * @updated 2026-05-15
 * @summary Helpers for localized SEO URLs and alternates.
 * @scope URL construction only; no page copy or business logic.
 */
import type { Metadata } from 'next';
import { routing, type Locale } from '@/routing';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaistudios.com';

export const SEO_LOCALES = routing.locales;

export function getLocalizedPath(locale: Locale | string, path = '') {
  const normalizedPath = path === '/' ? '' : path;

  if (locale === routing.defaultLocale) {
    return normalizedPath || '/';
  }

  return `/${locale}${normalizedPath}`;
}

export function getLocalizedUrl(locale: Locale | string, path = '') {
  const localizedPath = getLocalizedPath(locale, path);
  return localizedPath === '/' ? BASE_URL : `${BASE_URL}${localizedPath}`;
}

export function getLocalizedAlternates(locale: Locale | string, path = ''): Metadata['alternates'] {
  const languages: Record<string, string> = {};

  for (const supportedLocale of SEO_LOCALES) {
    languages[supportedLocale] = getLocalizedUrl(supportedLocale, path);
  }

  return {
    canonical: getLocalizedUrl(locale, path),
    languages,
  };
}
