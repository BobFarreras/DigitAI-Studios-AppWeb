/**
 * @file src/components/landing/v2/HeroV2.tsx
 * @updated 2026-08-19
 * @summary Hero de la landing: tipografia gegant emmascarada, constel·lacio 3D i parallax d'scroll.
 * @scope Composicio visual de la seccio inicial; sense logica de negoci.
 */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollRevealText } from "./ScrollRevealText";
import { Magnetic } from "./fx/Magnetic";
import { CursorSpotlight } from "./fx/CursorSpotlight";

export function HeroV2() {
  const t = useTranslations("LandingV2.hero");

  return (
    <section
      id="inici"
      className="relative isolate flex h-[100svh] items-start px-4 pb-8 pt-24 sm:px-6 md:items-center md:pt-20 lg:px-8 lg:pb-12 lg:pt-24"
    >
      <CursorSpotlight />

      <motion.div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <ScrollRevealText
              as="h1"
              size="display"
              weight={400}
              color="var(--dala-text)"
              stagger={0.055}
              className="max-w-[94vw] sm:max-w-3xl md:max-w-3xl"
            >
              {t("titleStrong")}
            </ScrollRevealText>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
            >
              <Magnetic radius={170} strength={0.28}>
                <a
                  href="#contacte"
                  className="group relative inline-flex h-[52px] items-center overflow-hidden rounded-[26px] bg-[#8052ff] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-white sm:px-8 sm:text-[13px] sm:tracking-[0.16em]"
                >
                  <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-[#08090a]">
                    {t("cta")}
                  </span>
                </a>
              </Magnetic>

              <a
                href="#serveis"
                className="group inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.16em] text-[var(--dala-muted)] transition-colors hover:text-[var(--dala-text)]"
              >
                {t("secondaryCta")}
                <span className="inline-block h-px w-8 bg-[var(--dala-muted)] transition-all duration-500 group-hover:w-14 group-hover:bg-[var(--dala-text)]" />
              </a>
            </motion.div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </motion.div>
    </section>
  );
}
