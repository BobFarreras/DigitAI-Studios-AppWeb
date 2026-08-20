/**
 * @file src/components/landing/v2/ContactSectionV2.tsx
 * @updated 2026-08-19
 * @summary Seccio final de contacte: promesa clara a l'esquerra i formulari a la dreta.
 * @scope Composicio visual de seccio; l'enviament viu a ContactForm.
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionIntro } from "./SectionIntro";
import { ContactForm } from "./ContactForm";
import { CursorSpotlight } from "./fx/CursorSpotlight";

export function ContactSectionV2() {
  const t = useTranslations("LandingV2.contact");

  return (
    <section
      id="contacte"
      className="relative z-10 overflow-hidden bg-transparent px-4 py-[clamp(96px,12vh,140px)] sm:px-6 lg:px-8"
    >
      <CursorSpotlight size={700} color="rgba(128,82,255,0.12)" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <SectionIntro
            index="05"
            eyebrow={t("eyebrow")}
            title={t("titleStrong")}
            description={t("lead")}
          />

          <div
            className="relative mt-6 h-[clamp(260px,38vh,390px)]"
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
