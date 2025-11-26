import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
// Ara utilitzem @/routing gràcies al canvi del tsconfig
import { routing, type Locale } from '@/routing'; 

// ✅ SOLUCIÓ DEFINITIVA: Import absolut
// Això buscarà sempre a src/app/globals.css, sense importar on moguis aquest fitxer
import "@/app/globals.css"; 

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}