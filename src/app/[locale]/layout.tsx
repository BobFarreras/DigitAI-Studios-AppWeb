import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing'; 
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css"; 
import type { Metadata, Viewport } from 'next';

// 👇 1. IMPORTACIONS NOVES
import { Suspense } from 'react'; 
import { AnalyticsTracker } from '@/features/analytics/ui/AnalyticsTracker';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

// 1. CONFIGURACIÓ DEL VIEWPORT
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. METADADES GLOBALS
export const metadata: Metadata = {
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
    locale: 'ca_ES',
    url: 'https://digitaistudios.com',
    title: 'DigitAI Studios | Innovació Digital',
    description: 'Apps, Webs i Automatització IA per a empreses modernes.',
    siteName: 'DigitAI Studios',
    images: [
      {
        url: '/images/og-image.jpg', // Nota: Millor ruta pública directa que '@/assets'
        width: 1200,
        height: 630,
        alt: 'DigitAI Studios Cover',
      },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
            {/* 👇 2. AQUÍ ESTÀ LA MÀGIA: SUSPENSE + TRACKER */}
            {/* Suspense evita que el layout es bloquegi esperant paràmetres de URL */}
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>

            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}