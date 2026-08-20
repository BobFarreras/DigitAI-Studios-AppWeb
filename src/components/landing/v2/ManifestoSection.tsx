/**
 * @file src/components/landing/v2/ManifestoSection.tsx
 * @updated 2026-08-19
 * @summary Declaracio central: text gegant que s'il·lumina paraula a paraula amb l'scroll.
 * @scope Seccio narrativa de la landing; sense logica de negoci.
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollRevealText } from "./ScrollRevealText";
const benefits = ["pain1", "pain2", "pain3", "pain4"] as const;

export function ManifestoSection() {
  const t = useTranslations("LandingV2.pain");

  return (
    <section
      id="impacte"
      className="relative z-10 min-h-[125svh] px-4 pb-16 pt-[48svh] sm:px-6 lg:min-h-[110svh] lg:px-8 lg:py-[clamp(120px,18vh,210px)]"
    >
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.88fr_1.12fr]">
        <div className="hidden lg:block" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, x: 42, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] bg-[var(--dala-panel)] p-4 backdrop-blur-md sm:p-7 lg:p-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-6 flex items-center gap-3 lg:mb-12 lg:gap-4"
          >
            <span className="h-px w-10 bg-[#ffb829]/50" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#ffb829] sm:text-[12px]">
              {t("badge")}
            </span>
          </motion.div>

          <ScrollRevealText
            as="h2"
            size="heading-lg"
            weight={400}
            color="var(--dala-text)"
          >
            {t("title")}
          </ScrollRevealText>
          <ScrollRevealText
            as="p"
            size="body"
            weight={200}
            color="var(--dala-muted)"
            delay={0.2}
            className="mt-4 max-w-xl lg:mt-8"
          >
            {t("description")}
          </ScrollRevealText>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-16 lg:gap-x-8 lg:gap-y-10">
            {benefits.map((benefit, index) => (
              <motion.p
                key={benefit}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative min-h-36 rounded-[14px] bg-[var(--dala-panel-soft)] p-4 text-[13px] font-light leading-[1.45] text-[var(--dala-muted)] backdrop-blur-sm sm:text-[14px] lg:min-h-44 lg:rounded-[18px] lg:p-6 lg:text-[17px] lg:font-extralight lg:leading-relaxed"
              >
                <span className="absolute inset-x-4 top-0 h-px origin-left bg-[var(--dala-border)] transition-transform duration-700 group-hover:scale-x-50 lg:inset-x-6" />
                <span className="mb-4 block text-[32px] font-normal leading-none tracking-[-0.04em] text-[var(--dala-faint)] transition-colors duration-500 group-hover:text-[#8052ff] lg:mb-8 lg:text-[clamp(44px,6vw,78px)]">
                  0{index + 1}
                </span>
                <span className="block max-w-xs">{t(benefit)}</span>
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
