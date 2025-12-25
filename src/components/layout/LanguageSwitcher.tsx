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
import { Languages } from 'lucide-react';
import { startTransition } from 'react';

// --- COMPONENTS SVG FLAGS (Disseny consistent 36x24) ---

function CatalanFlag({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className={className} preserveAspectRatio="none">
      <rect width="36" height="24" fill="#FACC15" /> 
      <rect y="3" width="36" height="3" fill="#EF4444" />
      <rect y="9" width="36" height="3" fill="#EF4444" />
      <rect y="15" width="36" height="3" fill="#EF4444" />
      <rect y="21" width="36" height="3" fill="#EF4444" />
    </svg>
  );
}

function SpanishFlag({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className={className} preserveAspectRatio="none">
      {/* Vermell Superior */}
      <rect width="36" height="6" fill="#AD1519" />
      {/* Groc Central */}
      <rect y="6" width="36" height="12" fill="#FABD00" />
      {/* Vermell Inferior */}
      <rect y="18" width="36" height="6" fill="#AD1519" />
    </svg>
  );
}

function EnglishFlag({ className }: { className?: string }) {
  // Versió simplificada USA per icones petites
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className={className} preserveAspectRatio="none">
      <rect width="36" height="24" fill="#B22234" />
      <rect y="2.18" width="36" height="2.18" fill="white" />
      <rect y="6.54" width="36" height="2.18" fill="white" />
      <rect y="10.9" width="36" height="2.18" fill="white" />
      <rect y="15.26" width="36" height="2.18" fill="white" />
      <rect y="19.62" width="36" height="2.18" fill="white" />
      {/* Cantó Blau */}
      <rect width="14.4" height="12.9" fill="#3C3B6E" />
      {/* Estrelles simplificades (punts blancs) */}
      <circle cx="2.5" cy="2.5" r="1" fill="white" />
      <circle cx="7" cy="6" r="1" fill="white" />
      <circle cx="11.5" cy="10" r="1" fill="white" />
    </svg>
  );
}

function ItalianFlag({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className={className} preserveAspectRatio="none">
      <rect width="12" height="24" fill="#008C45" /> 
      <rect x="12" width="12" height="24" fill="#FFFFFF" /> 
      <rect x="24" width="12" height="24" fill="#CD212A" /> 
    </svg>
  );
}

// --- CONFIGURACIÓ ---
// Mapeig de Locale -> Component Bandera
// Això permet afegir idiomes fàcilment en el futur
const LANGUAGE_CONFIG = {
  ca: { Flag: CatalanFlag, labelKey: 'ca' },
  es: { Flag: SpanishFlag, labelKey: 'es' },
  en: { Flag: EnglishFlag, labelKey: 'en' },
  it: { Flag: ItalianFlag, labelKey: 'it' },
} as const;

type SupportedLocale = keyof typeof LANGUAGE_CONFIG;

// --- COMPONENT PRINCIPAL ---

export function LanguageSwitcher() {
  const t = useTranslations('Common.languages');
  const locale = useLocale() as SupportedLocale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: SupportedLocale) => {
    startTransition(() => {
    
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted w-9 h-9">
          <Languages className="w-5 h-5 text-muted-foreground" />
          <span className="sr-only">Canviar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => {
          const langKey = key as SupportedLocale;
          const { Flag } = config;
          const isActive = locale === langKey;

          return (
            <DropdownMenuItem 
              key={langKey}
              onClick={() => handleLanguageChange(langKey)}
              className={`gap-3 cursor-pointer ${isActive ? 'bg-primary/10 font-bold text-primary' : ''}`}
            >
              <Flag className="w-6 h-4 rounded-[2px] shadow-sm object-cover border border-black/10" /> 
              <span className="leading-none text-sm">{t(key)}</span>
              
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}