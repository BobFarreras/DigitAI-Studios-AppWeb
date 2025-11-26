// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/routing'; 
import { Inter } from 'next/font/google'; // Importem la font aquí
import { ThemeProvider } from "@/components/theme-provider"; // 👈 Importa el nou provider
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
    // ⚠️ CRÍTIC: suppressHydrationWarning és necessari per a next-themes
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground overflow-x-hidden transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
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