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

const proofs = ["response", "privacy", "next"] as const;

export function ContactSectionV2() {
  const t = useTranslations("LandingV2.contact");

  return (
    <section
      id="contacte"
      className="relative z-10 overflow-hidden bg-[var(--dala-bg)] px-4 py-[clamp(96px,12vh,140px)] transition-colors duration-500 sm:px-6 lg:px-8"
    >
      <CursorSpotlight size={700} color="rgba(128,82,255,0.12)" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
        <div>
          <SectionIntro
            index="05"
            eyebrow={t("eyebrow")}
            title={t("titleStrong")}
            description={t("lead")}
          />

          <dl className="mt-14 border-t border-[var(--dala-border)]">
            {proofs.map((proof, index) => (
              <motion.div
                key={proof}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-baseline justify-between gap-6 border-b border-[var(--dala-border)] py-5"
              >
                <dt className="text-[11px] uppercase tracking-[0.22em] text-[var(--dala-muted)]">
                  {t(`proof.${proof}`)}
                </dt>
                <dd className="text-right text-[15px] font-light text-[var(--dala-text)]">
                  {t(`proof.${proof}Value`)}
                </dd>
              </motion.div>
            ))}
          </dl>
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
