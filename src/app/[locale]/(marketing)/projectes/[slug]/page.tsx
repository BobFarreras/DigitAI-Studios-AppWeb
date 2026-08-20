/**
 * @file src/app/[locale]/(marketing)/projectes/[slug]/page.tsx
 * @updated 2026-08-20
 * @summary Presentacio privada d'un projecte comercial.
 * @scope Guard server-side i composicio de la UI del projecte.
 */
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { redirect, type Locale } from "@/routing";
import { ProjectAccessService } from "@/services/ProjectAccessService";
import { ProjectPresentation } from "@/features/projects/ui/ProjectPresentation";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const token = (await cookies()).get("projects_access")?.value;
  if (!ProjectAccessService.validateSession(token)) {
    redirect({ href: "/projectes", locale });
  }
  if (slug !== "control-hub") notFound();
  return <ProjectPresentation />;
}
