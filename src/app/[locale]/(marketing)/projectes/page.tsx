/**
 * @file src/app/[locale]/(marketing)/projectes/page.tsx
 * @updated 2026-05-15
 * @summary Porta d'entrada protegida i cataleg de projectes comercials.
 * @scope Composicio server-side segons cookie d'accés.
 */
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { ProjectAccessService } from "@/services/ProjectAccessService";
import { ProjectGallery } from "@/features/projects/ui/ProjectGallery";
import { ProjectLoginForm } from "@/features/projects/ui/ProjectLoginForm";

export default async function ProjectsPage() {
  const token = (await cookies()).get("projects_access")?.value;
  if (ProjectAccessService.validateSession(token)) return <ProjectGallery />;
  const t = await getTranslations("Projects.access");
  return (
    <main data-cursor-contrast="light" className="grid min-h-screen place-items-center bg-[#07070a] px-5 py-28 text-white">
      <section className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <span className="text-xs uppercase tracking-[0.24em] text-violet-400">DigitAI · Private</span>
        <h1 className="mt-5 text-4xl tracking-[-0.05em]">{t("title")}</h1>
        <p className="mt-4 font-light leading-relaxed text-zinc-400">{t("description")}</p>
        <ProjectLoginForm />
      </section>
    </main>
  );
}
