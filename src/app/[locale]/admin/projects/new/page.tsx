/**
 * @file src/app/[locale]/admin/projects/new/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/admin/projects/new/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { NewProjectForm } from '@/features/projects/ui/form/NewProjectForm';
import { requireAdmin } from '@/lib/auth/admin-guard'; // La teva protecció d'admin

export default async function CreateProjectPage() {
  // 🛡️ Seguretat: Només tu pots entrar aquí
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Nou Client</h1>
        <NewProjectForm />
      </div>
    </div>
  );
}
