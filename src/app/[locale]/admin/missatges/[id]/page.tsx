import { getAdminLeadById } from '@/actions/admin/leads';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Mail,  Tag, MessageSquare, Reply } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  // 1. AWAIT els params (Obligatori a Next.js 16)
  const { id, locale } = await params;

  // 2. Carregar dades
  const result = await getAdminLeadById(id);

  // 3. Gestió d'errors (si no existeix, 404)
  if (!result.success || !result.lead) {
    return notFound();
  }

  const { lead } = result;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-6 md:space-y-8">
      {/* --- BOTÓ ENRERE --- */}
      <div>
        <Link 
          href={`/${locale}/admin/missatges`} 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tornar a la bústia
        </Link>
      </div>

      {/* --- CAPÇALERA DEL LEAD --- */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Dades Principals */}
          <div className="space-y-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {lead.full_name || 'Usuari Anònim'}
              </h1>
              <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {lead.service || 'Consulta General'}
              </span>
            </div>

            {/* Graella de Metadades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 text-sm text-muted-foreground pt-2">
              
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 bg-muted rounded-md shrink-0">
                    <Mail className="w-4 h-4 text-foreground" />
                </div>
                <a href={`mailto:${lead.email}`} className="hover:text-primary hover:underline truncate">
                  {lead.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md shrink-0">
                    <Calendar className="w-4 h-4 text-foreground" />
                </div>
                <span>
                  {/* ✅ CORRECCIÓ: Fem servir toLocaleString en lloc de toLocaleDateString */}
                  {new Date(lead.created_at).toLocaleString('ca-ES', {
                    dateStyle: 'long', 
                    timeStyle: 'short'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md shrink-0">
                    <Tag className="w-4 h-4 text-foreground" />
                </div>
                <span className="capitalize">{lead.source?.replace('_', ' ') || 'Web'}</span>
              </div>
            </div>
          </div>

          {/* Botó d'acció ràpida (Respondre) */}
          <div className="shrink-0 flex gap-2">
             <a href={`mailto:${lead.email}?subject=Resposta a la teva consulta sobre ${lead.service}`}>
                <Button className="w-full md:w-auto gap-2">
                    <Reply className="w-4 h-4" />
                    Respondre
                </Button>
             </a>
          </div>
        </div>
      </div>

      {/* --- COS DEL MISSATGE --- */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          <MessageSquare className="w-4 h-4" />
          Contingut del missatge
        </h3>
        
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm min-h-50">
          {lead.message ? (
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed wrap-break-word">
              {lead.message}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              L'usuari no ha escrit cap missatge addicional.
            </p>
          )}
        </div>
      </div>

      {/* --- PEU DE PÀGINA (Lloc per al Delete a la Fase 3) --- */}
      <div className="flex justify-end pt-6 border-t border-border mt-8">
        {/* Aquí posarem el botó d'eliminar en vermell */}
      </div>
    </div>
  );
}