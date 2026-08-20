/**
 * @file src/components/landing/v2/LazySections.tsx
 * @updated 2026-08-20
 * @summary Carrega diferidament nomes el tancament comercial de la landing.
 * @scope Optimitzacio de la seccio de contacte.
 */
"use client";

import dynamic from "next/dynamic";

const ContactSectionV2 = dynamic(
  () =>
    import("./ContactSectionV2").then((module) => ({
      default: module.ContactSectionV2,
    })),
  { ssr: false },
);

export function LazySections() {
  return <ContactSectionV2 />;
}
