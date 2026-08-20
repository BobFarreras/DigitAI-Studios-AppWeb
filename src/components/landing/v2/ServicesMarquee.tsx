/**
 * @file src/components/landing/v2/ServicesMarquee.tsx
 * @updated 2026-08-20
 * @summary Cataleg sticky que converteix l'scroll vertical en un recorregut horitzontal.
 * @scope Presentacio de capacitats; sense logica de negoci.
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ServiceImpactDemo } from "./ServiceImpactDemo";

const items = [0, 1, 2] as const;

export function ServicesMarquee() {
  const t = useTranslations("LandingV2.whatWeBuild");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section
      id="serveis"
      ref={ref}
      className="relative z-10 h-[300svh]"
      aria-label={t("badge")}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-4 pb-4 pt-[39svh] sm:px-6 md:pb-10 md:pt-28 lg:px-8">
        <motion.div
          style={{ x }}
          className="flex min-h-0 w-[300%] flex-1 will-change-transform"
        >
          {items.map((item, index) => (
            <article
              key={item}
              className="flex w-1/3 shrink-0 items-start px-[max(1rem,calc((100vw-80rem)/2))] pb-4 md:items-center md:pb-12"
            >
              <div className="grid w-full gap-8 md:grid-cols-[minmax(0,0.92fr)_1.08fr] md:gap-16">
                <motion.div
                  initial={{ opacity: 0.18, y: 28, filter: "blur(14px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ amount: 0.55 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[24px] border-t border-[var(--dala-border)] bg-[var(--dala-panel)] p-4 backdrop-blur-xl sm:p-7 md:p-10"
                >
                  <span className="mb-3 block text-[11px] font-semibold tracking-[0.24em] text-[#8052ff] md:mb-5 md:text-[12px]">
                    0{index + 1}
                  </span>
                  <h3
                    className={`text-[clamp(34px,5.4vh,52px)] font-normal leading-[0.92] tracking-[-0.045em] text-[var(--dala-text)] ${item === 0 ? "[overflow-wrap:anywhere] md:text-[clamp(36px,3.4vw,52px)]" : "md:text-[clamp(52px,6.4vw,92px)]"}`}
                  >
                    {t(`items.${item}.title`)}
                  </h3>
                  <p className="mt-4 max-w-2xl text-[clamp(15px,2vh,18px)] font-light leading-[1.45] text-[var(--dala-muted)] md:mt-7 md:text-[clamp(18px,1.45vw,22px)] md:leading-[1.5]">
                    {t(`items.${item}.description`)}
                  </p>
                  <ServiceImpactDemo
                    variant={item}
                    value={t(`items.${item}.resultValue`)}
                    label={t(`items.${item}.resultLabel`)}
                    steps={[0, 1, 2].map((point) =>
                      t(`items.${item}.points.${point}`),
                    )}
                  />
                </motion.div>
                <div className="hidden md:block" aria-hidden="true" />
              </div>
            </article>
          ))}
        </motion.div>

        <div className="mx-auto hidden h-px w-full max-w-7xl bg-[var(--dala-border)] md:block">
          <motion.div
            className="h-full origin-left bg-[#8052ff]"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}
