// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing'; 
import { Inter } from 'next/font/google'; // Importem la font aquí

// ✅ IMPORT ABSOLUT DELS ESTILS TAILWIND V4
import "@/app/globals.css"; 

// Configurem la font
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'DigitAI Studios - Automatització i IA',
  description: 'Transforma el teu negoci amb solucions d\'intel·ligència artificial.',
};

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
    // Injectem l'idioma correcte al tag HTML
    <html lang={locale} className={inter.variable}>
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}