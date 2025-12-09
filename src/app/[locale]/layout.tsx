import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { Suspense } from 'react';
import { AnalyticsTracker } from '@/features/analytics/ui/AnalyticsTracker';

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
  
  // Defineix la URL base (Hardcoded com a fallback segur per evitar localhost en producció)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitaistudios.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'DigitAI Studios | Desenvolupament Web & IA',
      template: '%s | DigitAI Studios'
    },
    description: 'Transformem negocis amb AppWebs, Apps Natives i Automatització IA. Solucions digitals 360°.',
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
    openGraph: {
      type: 'website',
      locale: locale === 'ca' ? 'ca_ES' : locale === 'es' ? 'es_ES' : 'en_US',
      url: `${baseUrl}/${locale}`,
      title: 'DigitAI Studios | Innovació Digital',
      description: 'Apps, Webs i Automatització IA per a empreses modernes.',
      siteName: 'DigitAI Studios',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'DigitAI Studios Cover',
        },
      ],
    },
    // 👇 AQUESTA ÉS LA CLAU PER ARREGLAR GSC i IDIOMES:
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'ca': `${baseUrl}/ca`,
        'es': `${baseUrl}/es`,
        'en': `${baseUrl}/en`,
        // 'x-default': `${baseUrl}/ca` // Opcional: Si vols forçar el català com a default
      },
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
      <body className="antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
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