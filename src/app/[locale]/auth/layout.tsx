/**
 * @file src/app/[locale]/auth/layout.tsx
 * @updated 2026-05-15
 * @summary Shared metadata boundary for public auth routes.
 * @scope Mark auth screens as noindex while preserving their UI.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
