/**
 * @file src/components/layout/NavbarV2.tsx
 * @updated 2026-05-12
 * @summary Navbar Linear per a la landing v2 amb logo monocrom i hover de marca.
 * @scope Navegacio publica, controls globals i acces d'usuari.
 */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LogOut, Loader2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/routing';
import { signOutAction } from '@/features/auth/actions/auth';
import logo from '@/assets/images/digitai-logo.png';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BrandRevealButton, BrandRevealLink } from '@/components/ui/brand-reveal';
import { MobileHeaderMenu } from './MobileHeaderMenu';

type Props = { user: User | null };

const sectionLinks = [
  { href: '/#automatitzacions', key: 'automation' },
  { href: '/#software-a-mida', key: 'software' },
  { href: '/#formacio', key: 'training' },
  { href: '/#contacte', key: 'contact' },
] as const;
const sectionScrollOffsets: Record<string, number> = { automatitzacions: 0, 'software-a-mida': 56, formacio: -88, contacte: -88 };

export function NavbarV2({ user }: Props) {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('/');

  const isHomePath = pathname === '/' || /^\/(ca|es|en|it)$/.test(pathname);

  useEffect(() => {
    const syncState = () => {
      setIsScrolled(window.scrollY > 16);
      setActiveHref(window.location.hash ? `/${window.location.hash}` : '/');
    };

    syncState();
    window.addEventListener('scroll', syncState, { passive: true });
    window.addEventListener('hashchange', syncState);

    return () => {
      window.removeEventListener('scroll', syncState);
      window.removeEventListener('hashchange', syncState);
    };
  }, []);

  const handleAnchor = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePath || !href.includes('#')) return;

    event.preventDefault();
    const sectionId = href.split('#')[1];
    const element = document.getElementById(sectionId);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY + (sectionScrollOffsets[sectionId] ?? -88);
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.pushState(null, '', href);
    setActiveHref(href);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutAction();
    router.refresh();
    router.push('/auth/login');
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 px-4 transition-[background,box-shadow,backdrop-filter] duration-300 sm:px-6 lg:px-8',
        isScrolled
          ? 'bg-white/72 shadow-[0_10px_34px_rgba(8,9,10,0.08)] backdrop-blur-xl dark:bg-[#08090a]/68 dark:shadow-[0_10px_34px_rgba(0,0,0,0.26)]'
          : 'bg-transparent shadow-none',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="group flex items-center" aria-label="DigitAI Studios">
          <div className="relative h-8 w-28 transition-transform duration-300 group-hover:scale-[1.04] sm:w-32">
            <Image
              src={logo}
              alt="DigitAI Studios"
              fill
              priority
              className="object-contain object-left opacity-80 grayscale brightness-0 transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 dark:invert dark:group-hover:invert-0"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <BrandRevealLink href="/" label={t('home')} active={isHomePath && activeHref === '/'} />
          {sectionLinks.map((item) => (
            <BrandRevealLink
              key={item.href}
              href={item.href}
              label={t(item.key)}
              active={isHomePath && activeHref === item.href}
              onClick={handleAnchor}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 border-r border-[#d0d6e0] pr-2 dark:border-[#23252a] md:flex">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-1 md:hidden"><ThemeToggle /><LanguageSwitcher /><MobileHeaderMenu user={user} onSectionClick={handleAnchor} /></div>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <BrandRevealButton href="/dashboard" label={t('dashboard')} />
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#d0d6e0] text-[#62666d] transition-colors hover:text-[#08090a] dark:border-[#23252a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"
                aria-label={t('logout')}
              >
                {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/auth/login" className="px-2 text-[14px] font-[590] text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">{t('login')}</Link>
              <BrandRevealButton href="/auth/register" label={t('register')} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
