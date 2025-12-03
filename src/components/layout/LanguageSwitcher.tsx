'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/routing'; // 👈 IMPORTANT: Importar del teu routing tipat
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'; // Assumint que tens shadcn/ui, sinó un <select> natiu
import { Globe } from 'lucide-react';
import { startTransition } from 'react';

export function LanguageSwitcher() {
  const t = useTranslations('Common.languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: 'ca' | 'es' | 'en') => {
    startTransition(() => {
      // Això substitueix el segment d'idioma de la URL actual
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <span className="sr-only">Canviar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ca')}
          className={locale === 'ca' ? 'bg-primary/10 font-bold' : ''}
        >
          🇦🇩 {t('ca')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')}
          className={locale === 'es' ? 'bg-primary/10 font-bold' : ''}
        >
          🇪🇸 {t('es')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={locale === 'en' ? 'bg-primary/10 font-bold' : ''}
        >
          🇺🇸 {t('en')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}