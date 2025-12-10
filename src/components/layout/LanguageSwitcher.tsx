// =================== FILE: src/components/layout/LanguageSwitcher.tsx ===================

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/routing'; 
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'; 
import { Globe } from 'lucide-react';
import { startTransition } from 'react';

// 1. Creem un petit component SVG per la Senyera
function CatalanFlag({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 36 24" 
      className={className}
      preserveAspectRatio="none"
    >
      {/* Fons Groc */}
      <rect width="36" height="24" fill="#FACC15" /> 
      {/* 4 Barres Vermelles */}
      <rect y="3" width="36" height="3" fill="#EF4444" />
      <rect y="9" width="36" height="3" fill="#EF4444" />
      <rect y="15" width="36" height="3" fill="#EF4444" />
      <rect y="21" width="36" height="3" fill="#EF4444" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const t = useTranslations('Common.languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: 'ca' | 'es' | 'en' | 'it') => {
    startTransition(() => {
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
        
        {/* CATALÀ */}
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ca')}
          className={`gap-2 ${locale === 'ca' ? 'bg-primary/10 font-bold' : ''}`}
        >
          {/* Usem el component SVG amb una mida similar a un emoji */}
          <CatalanFlag className="w-5 h-3.5 rounded-[2px] shadow-sm object-cover" /> 
          {t('ca')}
        </DropdownMenuItem>

        {/* CASTELLÀ */}
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')}
          className={`gap-2 ${locale === 'es' ? 'bg-primary/10 font-bold' : ''}`}
        >
          <span className="text-lg leading-none">🇪🇸</span> 
          {t('es')}
        </DropdownMenuItem>

        {/* ANGLÈS */}
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`gap-2 ${locale === 'en' ? 'bg-primary/10 font-bold' : ''}`}
        >
          <span className="text-lg leading-none">🇺🇸</span> 
          {t('en')}
        </DropdownMenuItem>

        
        {/* ANGLÈS */}
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('it')}
          className={`gap-2 ${locale === 'it' ? 'bg-primary/10 font-bold' : ''}`}
        >
          <span className="text-lg leading-none">it</span> 
          {t('it')}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}