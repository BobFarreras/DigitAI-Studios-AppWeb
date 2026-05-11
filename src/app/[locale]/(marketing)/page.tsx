/**
 * @file src/app/[locale]/(marketing)/page.tsx
 * @updated 2026-05-11
 * @summary Route module: src/app/[locale]/(marketing)/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { LandingV2 } from '@/components/landing/v2/LandingV2';

export default async function MarketingPage() {
  return <LandingV2 />;
}
