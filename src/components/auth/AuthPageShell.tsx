/**
 * @file src/components/auth/AuthPageShell.tsx
 * @updated 2026-05-15
 * @summary Shared responsive shell for auth pages.
 * @scope Visual layout only; auth logic stays inside feature forms.
 */
import type { ReactNode } from 'react';
import { Link } from '@/routing';
import { ArrowLeft } from 'lucide-react';
import { HeroAmbientBackground } from '@/components/landing/v2/HeroAmbientBackground';
import { CustomCursor } from '@/components/ui/CustomCursor';

type Props = {
  badge: string;
  title: string;
  description: string;
  backLabel: string;
  children: ReactNode;
  highlights?: string[];
};

export function AuthPageShell({ title, description, backLabel, children, highlights = [] }: Props) {
  return (
    <main className="auth-scope linear-shell relative isolate min-h-dvh overflow-hidden px-3 py-3 text-[#08090a] dark:text-[#f7f8f8] sm:px-6 sm:py-5">
      <CustomCursor />
      <HeroAmbientBackground className="fixed inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(8,9,10,0.78),transparent)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-24px)] w-full max-w-7xl flex-col sm:min-h-[calc(100dvh-40px)]">
        <header className="flex items-center justify-between py-2">
          <Link href="/" className="auth-build-brand text-lg font-bold tracking-tight sm:text-xl">
            DigitAI <span className="gradient-text">Studios</span>
          </Link>
          <Link href="/" className="auth-build-back inline-flex items-center gap-1.5 text-xs font-semibold text-[#62666d] transition-colors hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]">
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-2 sm:py-10">
          <div className="w-full max-w-[500px]">
            <div className="mb-3 text-center sm:mb-5">
              <h1 className="auth-build-title text-balance text-[clamp(28px,7.2vw,44px)] font-[590] leading-[1.04] tracking-normal text-[#08090a] dark:text-[#f7f8f8]">
                {title}
              </h1>
              <p className="auth-build-description mx-auto mt-2 max-w-[480px] text-sm leading-relaxed text-[#62666d] dark:text-[#8a8f98] sm:mt-3 sm:text-[15px]">
                {description}
              </p>
              {highlights.length > 0 && (
                <div className="mx-auto mt-3 flex max-w-[480px] flex-wrap justify-center gap-2 sm:mt-4">
                  {highlights.map((item, index) => (
                    <span
                      key={item}
                      className="auth-float-chip rounded-[6px] border border-[#d0d6e0] bg-white/66 px-2.5 py-1 text-[11px] font-[590] text-[#62666d] backdrop-blur-sm dark:border-[#323334] dark:bg-[#161718]/72 dark:text-[#8a8f98]"
                      style={{ animationDelay: `${index * 110}ms` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="auth-build-card rounded-[8px] border border-[#d0d6e0] bg-white/78 p-4 shadow-[0_18px_60px_rgba(8,9,10,0.08)] backdrop-blur-md dark:border-[#23252a] dark:bg-[#0d0f12]/86 dark:shadow-[0_18px_70px_rgba(0,0,0,0.35)] sm:p-6">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
