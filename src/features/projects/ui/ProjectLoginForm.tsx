/**
 * @file src/features/projects/ui/ProjectLoginForm.tsx
 * @updated 2026-08-20
 * @summary Formulari client per desbloquejar el cataleg privat.
 * @scope UI i estat de la server action.
 */
"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/routing";
import { unlockProjects } from "../actions/project-access";

export function ProjectLoginForm() {
  const t = useTranslations("Projects.access");
  const router = useRouter();
  const [state, action, pending] = useActionState(unlockProjects, { success: false });
  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);
  return (
    <form action={action} className="mt-10 space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500">{t("label")}</span>
        <div className="flex items-center border-b border-zinc-700 focus-within:border-violet-500">
          <KeyRound className="h-4 w-4 text-zinc-500" />
          <input name="password" type="password" required autoComplete="current-password" className="w-full bg-transparent px-3 py-4 text-lg text-white outline-none" />
        </div>
      </label>
      {state.error && <p className="text-sm text-red-400">{t(`errors.${state.error}`)}</p>}
      <button disabled={pending} className="flex h-12 w-full items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t("submit")}<ArrowRight className="ml-2 h-4 w-4" /></>}
      </button>
    </form>
  );
}
