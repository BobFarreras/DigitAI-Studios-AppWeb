import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing'; // 👈 IMPORTEM DE LA FONT ÚNICA

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Ara validem contra la configuració centralitzada
  // Així no hem de mantenir dues llistes d'idiomes
  if (!locale || !routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});