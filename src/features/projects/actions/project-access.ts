/**
 * @file src/features/projects/actions/project-access.ts
 * @updated 2026-08-20
 * @summary Server actions per obrir i tancar l'espai privat de projectes.
 * @scope Validacio externa, cookie segura i delegacio al servei d'accés.
 */
"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { ProjectAccessService } from "@/services/ProjectAccessService";

export type ProjectAccessState = { success: boolean; error?: "invalid" | "config" };
const schema = z.object({ password: z.string().min(1).max(200) });

export async function unlockProjects(
  _state: ProjectAccessState,
  formData: FormData,
): Promise<ProjectAccessState> {
  const parsed = schema.safeParse({ password: formData.get("password") });
  if (!ProjectAccessService.isConfigured()) return { success: false, error: "config" };
  if (!parsed.success || !ProjectAccessService.validatePassword(parsed.data.password)) {
    return { success: false, error: "invalid" };
  }
  const session = ProjectAccessService.createSession();
  const store = await cookies();
  store.set("projects_access", session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return { success: true };
}

export async function lockProjects() {
  const store = await cookies();
  store.delete("projects_access");
}
