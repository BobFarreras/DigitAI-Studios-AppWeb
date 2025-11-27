// ARA (Import net des de la feature):
import { ProjectsHero, ProjectsList, ProjectsCTA } from '@/features/projects';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30 transition-colors duration-300">
      <ProjectsHero />
      <ProjectsList />
      <ProjectsCTA />
    </main>
  );
}