/**
 * @file src/features/projects/index.ts
 * @updated 2026-05-08
 * @summary Feature module: src/features/projects/index.ts
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
// Exportem només el que volem que la resta de l'app pugui utilitzar
export * from './ui/ProjectsHero';
export * from './ui/ProjectList';
export * from './ui/ProjectsCTA';
export * from './data/projects-data'; // Opcional, si necessites els tipus a fora
