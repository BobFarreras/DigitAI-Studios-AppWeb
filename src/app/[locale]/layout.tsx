// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing'; 
import { Inter } from 'next/font/google'; // Importem la font aquí
import { ThemeProvider } from "@/components/theme-provider"; // 👈 Importa el nou provider
// ✅ IMPORT ABSOLUT DELS ESTILS TAILWIND V4
import "@/app/globals.css"; 
import { AnalyticsTracker } from '@/features/analytics/ui/AnalyticsTracker'; // 👈 Importa l'espia d'analytics
import { Metadata } from 'next';

// 👇 1. DEFINICIÓ MESTRA DE METADADES
export const metadata: Metadata = {
  title: {
    template: '%s | DigitAI Studios', // %s se substitueix pel títol de cada pàgina
    default: 'DigitAI Studios - Automatització i IA per a Empreses',
  },
  description: 'Transformem negocis amb Intel·ligència Artificial, Automatitzacions n8n i Desenvolupament Web Modern. Demana la teva auditoria gratuïta.',
  keywords: ['IA', 'Automatització', 'n8n', 'Desenvolupament Web', 'SaaS', 'SEO'],
  authors: [{ name: 'DigitAI Team' }],
  creator: 'DigitAI Studios',
  
  // Com es veu a Facebook/LinkedIn/WhatsApp
  openGraph: {
    type: 'website',
    locale: 'ca_ES',
    url: 'https://digitai.studios', // Posa el teu domini real quan el tinguis
    siteName: 'DigitAI Studios',
    images: [
      {
        url: '/images/og-default.jpg', // Has de posar una imatge a public/images/
        width: 1200,
        height: 630,
        alt: 'DigitAI Studios Hero Image',
      },
    ],
  },
  
  // Com es veu a Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'DigitAI Studios - Automatització IA',
    description: 'Estalvia temps i diners automatitzant el teu negoci.',
    images: ['/images/og-default.jpg'], 
  },
  
  // Icones (Favicon)
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
// Configurem la font
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. Validar que l'idioma existeix (seguretat)
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 2. Obtenir els textos de traducció
  const messages = await getMessages();

 return (
    // ⚠️ CRÍTIC: suppressHydrationWarning és necessari per a next-themes
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          {/* 👇 AQUI INJECTEM L'ESPIA */}
          <AnalyticsTracker />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}