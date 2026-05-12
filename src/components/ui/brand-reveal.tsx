/**
 * @file src/components/ui/brand-reveal.tsx
 * @updated 2026-05-12
 * @summary Text i botons amb revelat radial del gradient de marca.
 * @scope Decoracio interactiva reutilitzable sense logica de negoci.
 */
'use client';

import { useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';

type PointerStyle = { '--x': string; '--y': string } & CSSProperties;

function usePointerReveal() {
  const [style, setStyle] = useState<PointerStyle>({ '--x': '50%', '--y': '50%' });

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setStyle({
      '--x': `${event.clientX - rect.left}px`,
      '--y': `${event.clientY - rect.top}px`,
    });
  };

  return { style, onMouseMove };
}

export function BrandRevealText({ children, className }: { children: ReactNode; className?: string }) {
  const reveal = usePointerReveal();

  return (
    <span className={cn('brand-reveal-text', className)} style={reveal.style} onMouseMove={reveal.onMouseMove}>
      <span className="brand-reveal-text__base">{children}</span>
      <span aria-hidden className="brand-reveal-text__color">{children}</span>
    </span>
  );
}

export function BrandRevealLink({ href, label, active, onClick }: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const reveal = usePointerReveal();

  return (
    <Link
      href={href}
      onClick={(event) => onClick?.(event, href)}
      onMouseMove={reveal.onMouseMove}
      style={reveal.style}
      className={cn('brand-reveal-link rounded-[6px] px-3 py-2 text-[15px] font-[560]', active && 'is-active')}
    >
      <span>{label}</span>
      <span aria-hidden className="brand-reveal-link__color">{label}</span>
    </Link>
  );
}

export function BrandRevealButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="brand-reveal-button h-9 rounded-[6px] px-4 text-[14px] font-[590]"
    >
      <span>{label}</span>
      <span aria-hidden className="brand-reveal-button__color">{label}</span>
    </Link>
  );
}
