import Image from 'next/image';
import { Project } from '@/types/models'; // O on tinguis la interfície definida
import { cn } from '@/lib/utils';

interface ProjectCardImageProps {
  project: Project;
  locale: string; // L'idioma actual de la pàgina
  className?: string;
}

export function ProjectCardImage({ project, locale, className }: ProjectCardImageProps) {
  // 1. Comprovem si tenim imatges adaptatives per aquest projecte
  if (project.adaptiveImages) {
    // 2. Busquem el set d'imatges per l'idioma actual o fem servir el default
    const imageSet = project.adaptiveImages[locale] || project.adaptiveImages['default'];

    if (imageSet) {
      return (
        <div className={cn("relative w-full h-full", className)}>
          {/* Imatge per TEMA CLAR (Light Mode) */}
          <div className="block dark:hidden w-full h-full">
            <Image
              src={imageSet.light}
              alt={project.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Imatge per TEMA FOSC (Dark Mode) */}
          <div className="hidden dark:block w-full h-full">
            <Image
              src={imageSet.dark}
              alt={project.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      );
    }
  }

  // 3. Fallback: Si no hi ha configuració adaptativa (cas RibotFlow), renderitzem la normal
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}