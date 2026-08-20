/**
 * @file src/features/projects/ui/ProjectGallery.tsx
 * @updated 2026-08-20
 * @summary Cataleg privat de presentacions disponibles.
 * @scope Presentacio i navegacio.
 */
import { ArrowUpRight, Layers3 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/routing";

export async function ProjectGallery() {
  const t = await getTranslations("Projects.gallery");
  return (
    <main data-cursor-contrast="light" className="min-h-screen bg-[#07070a] px-5 pb-24 pt-32 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs uppercase tracking-[0.24em] text-violet-400">{t("eyebrow")}</span>
        <h1 className="mt-5 max-w-3xl text-5xl tracking-[-0.05em] sm:text-7xl">{t("title")}</h1>
        <p className="mt-5 max-w-xl text-lg font-light text-zinc-400">{t("description")}</p>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Link href="/projectes/control-hub" className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 transition hover:border-violet-500/60 sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl transition group-hover:bg-violet-600/35" />
            <Layers3 className="h-10 w-10 text-violet-400" strokeWidth={1.4} />
            <p className="mt-12 text-xs uppercase tracking-[0.2em] text-zinc-500">{t("projectType")}</p>
            <h2 className="mt-3 text-3xl tracking-[-0.04em]">Control Hub</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">{t("projectDescription")}</p>
            <span className="mt-8 flex items-center text-sm font-semibold text-violet-300">{t("open")}<ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </div>
    </main>
  );
}
