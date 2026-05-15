/**
 * @file src/features/projects/ui/ProjectList.tsx
 * @updated 2026-05-08
 * @summary Feature module: src/features/projects/ui/ProjectList.tsx
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
import { PROJECTS } from '../data/projects-data';
import { ProjectCard } from './ProjectCard';

export function ProjectsList() {
  return (
    <section className="py-10 pb-20 md:pb-32">
      {/* ✅ CORRECCIÓ: Padding responsiu */}
      <div className="container mx-auto px-6 md:px-10 lg:px-14 space-y-20 md:space-y-32">
         {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
         ))}
      </div>
    </section>
  );
}
