/**
 * @file src/components/layout/MobileHeaderMenu.tsx
 * @updated 2026-05-14
 * @summary Desplegable superior per navegacio publica en mobil.
 * @scope Mostrar links V2 i accessos auth sense afectar la navegacio desktop.
 */
'use client';

import type { MouseEvent } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LogIn, Menu, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  user: SupabaseUser | null;
  onSectionClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function MobileHeaderMenu({ user, onSectionClick }: Props) {
  const t = useTranslations('Navbar');
  const links = [
    { href: '/#automatitzacions', label: t('automation') },
    { href: '/#software-a-mida', label: t('software') },
    { href: '/#formacio', label: t('training') },
    { href: '/#contacte', label: t('contact') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t('solutions')} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#8a8f98] outline-none transition-colors hover:bg-muted hover:text-[#08090a] active:bg-muted dark:hover:text-[#f7f8f8]">
        <Menu className="h-5 w-5" strokeWidth={2.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60] mt-2 w-60 rounded-xl border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} onClick={(event) => onSectionClick(event, link.href)} className="block w-full cursor-pointer rounded-lg px-2 py-2.5 text-sm font-medium focus:bg-primary/10 active:bg-primary/10">
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        {!user ? <AuthLinks t={t} /> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthLinks({ t }: { t: ReturnType<typeof useTranslations<'Navbar'>> }) {
  return (
    <>
      <DropdownMenuItem asChild>
        <Link href="/auth/login" className="block w-full cursor-pointer rounded-lg px-2 py-2.5 text-sm font-medium focus:bg-primary/10 active:bg-primary/10">
          <LogIn className="mr-2 inline h-4 w-4" />{t('login')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/auth/register" className="block w-full cursor-pointer rounded-lg px-2 py-2.5 text-sm font-medium focus:bg-primary/10 active:bg-primary/10">
          <UserPlus className="mr-2 inline h-4 w-4" />{t('register')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
