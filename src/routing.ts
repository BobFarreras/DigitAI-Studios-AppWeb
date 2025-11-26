import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ca', 'es', 'en'],
  defaultLocale: 'ca',
  localePrefix: 'as-needed' // Opcional: per si vols /ca o no
});

// Exportem tipus per a reutilitzar
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);