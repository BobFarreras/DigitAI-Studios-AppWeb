/**
 * @file src/app/[locale]/(marketing)/projectes/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/(marketing)/projectes/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { ProjectsHero, ProjectsList, ProjectsCTA } from '@/features/projects';

export default function ProjectsPage() {
  return (
    // ✅ CORRECCIÓ: Tret 'px-14' del main per permetre fons full-width als components fills
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30 transition-colors duration-300">
      <ProjectsHero />
      <ProjectsList />
      <ProjectsCTA />
    </main>
  );
}
