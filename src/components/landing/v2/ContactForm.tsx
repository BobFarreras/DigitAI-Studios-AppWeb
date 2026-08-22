/**
 * @file src/components/landing/v2/ContactForm.tsx
 * @updated 2026-08-19
 * @summary Formulari de contacte de la landing amb seleccio de servei i estats d'enviament.
 * @scope UI del formulari; delega l'enviament a l'action de contacte.
 */
"use client";

import { useActionState, useState } from "react";
import { Bot, AppWindow, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitContactForm } from "@/actions/contact";
import { ContactField } from "./ContactField";
import { Link } from "@/routing";

const initialState = { success: false, message: "", errors: {} };
const services = [
  { value: "ia_automation", key: "automation", Icon: Bot },
  { value: "web_app", key: "software", Icon: AppWindow },
] as const;

export function ContactForm() {
  const t = useTranslations("LandingV2.contact");
  const [state, action, pending] = useActionState(
    submitContactForm,
    initialState,
  );
  const [service, setService] =
    useState<(typeof services)[number]["value"]>("ia_automation");

  return (
    <form action={action} className="space-y-6 rounded-[28px] border border-[var(--dala-border)] bg-[var(--dala-panel)] p-5 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap gap-3">
        {services.map(({ value, key, Icon }) => {
          const active = service === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setService(value)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                active
                  ? "border-[#8052ff] bg-[#8052ff] text-white"
                  : "border-[var(--dala-border)] text-[var(--dala-muted)] hover:border-[#8052ff]/60 hover:text-[var(--dala-text)]"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {t(`services.${key}`)}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="service" value={service} />

      <ContactField
        label={t("form.name")}
        name="fullName"
        placeholder={t("form.namePlaceholder")}
        error={state.errors?.fullName?.[0]}
        required
      />
      <ContactField
        label={t("form.email")}
        name="email"
        type="email"
        placeholder={t("form.emailPlaceholder")}
        error={state.errors?.email?.[0]}
        required
      />
      <ContactField
        label={t("form.message")}
        name="message"
        placeholder={t("form.messagePlaceholder")}
        error={state.errors?.message?.[0]}
        required
        minLength={10}
        rows={4}
      />

      <label className="flex items-start gap-3 text-[13px] font-light leading-relaxed text-[var(--dala-muted)]">
        <input
          name="privacy"
          value="on"
          required
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[var(--dala-border)] accent-[#8052ff]"
        />
        <span>
          {t.rich("privacy", {
            link: (chunks) => (
              <Link
                href="/legal/privacitat"
                className="underline underline-offset-4 transition-colors hover:text-[var(--dala-text)]"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {state.errors?.privacy?.[0] && (
        <p className="text-[11px] text-red-500">{state.errors.privacy[0]}</p>
      )}

      <button
          type="submit"
          disabled={pending || state.success}
          className="group relative flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[27px] bg-[#8052ff] text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-disabled:translate-y-full" />
          <span className="relative flex items-center transition-colors duration-300 group-hover:text-[#08090a]">
            {pending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : state.success ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : null}
            {pending
              ? t("form.sending")
              : state.success
                ? t("form.sent")
                : t("form.submit")}
          </span>
      </button>

      {state.message && (
        <p
          className={`text-center text-[14px] ${state.success ? "text-[#15846e]" : "text-red-500"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
