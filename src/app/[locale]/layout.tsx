/**
 * @file src/app/[locale]/layout.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/layout.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import { AnalyticsTracker } from '@/features/analytics/ui/AnalyticsTracker';
import { getLocalizedAlternates } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// 1. CONFIGURACIÓ DEL VIEWPORT (Estàtica)
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. METADADES DINÀMIQUES (SEO + Hreflang + Canonical)
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Seo.home' });
  const alternates = getLocalizedAlternates(locale);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaistudios.com'),
    title: {
      default: t('title'),
      template: '%s | DigitAI Studios'
    },
    description: t('description'),
    keywords: ['Desenvolupament Web', 'App', 'React Native', 'Next.js', 'IA', 'Automatització', 'Girona'],
    authors: [{ name: 'DigitAI Studios' }],
    creator: 'DigitAI Studios',
    manifest: '/manifest.webmanifest',
    icons: {
      icon: '/icons/icon-192.png',
      shortcut: '/icons/icon-192.png',
      apple: '/icons/apple-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/icons/apple-icon.png',
      },
    },

    alternates,
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: alternates?.canonical?.toString(),
      siteName: 'DigitAI Studios',
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

// 3. LAYOUT PRINCIPAL
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validació de seguretat de l'idioma
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            defaultTheme="system"
            enableSystem
          >
            {/* Analítica sense bloquejar la càrrega */}
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>

            {/* Notificacions Toast */}
            <Toaster richColors closeButton />

            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
