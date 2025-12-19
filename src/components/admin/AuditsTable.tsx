'use client';

import { ExternalLink, Calendar, Search, Gauge, User, Activity } from 'lucide-react';
import { AuditSummary } from '@/repositories/interfaces/IAuditRepository';
import { Badge } from '@/components/ui/badge'; // Si tens el component Badge, sinó fes servir el span d'abans

export function AuditsTable({ audits }: { audits: AuditSummary[] }) {
  
  // 1. Funció segura per formatar dates (evita "Invalid Date")
  const formatDate = (dateInput: Date | string) => {
    try {
      const date = new Date(dateInput);
      // Si la data no és vàlida, retornem avui o un text
      if (isNaN(date.getTime())) return 'Data desconeguda';
      
      return date.toLocaleDateString('ca-ES', {
        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
      });
    } catch (e) {
      return '-';
    }
  };

  // 2. Funció per determinar el color (Google Lighthouse colors)
  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
  };

  // 3. Helper per netejar la URL visualment
  const cleanUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (audits.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border mt-4">
        <p className="text-muted-foreground">No hi ha auditories realitzades encara.</p>
      </div>
    );
  }

  return (
    <>
      {/* 📱 VERSIÓ MÒBIL (Cards) - Visible < md */}
      <div className="grid grid-cols-1 gap-4 md:hidden mt-4">
        {audits.map((audit) => (
          <div 
            key={audit.id} 
            className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4"
          >
            {/* Capçalera Card: URL i Data */}
            <div className="flex justify-between items-start">
              <a 
                href={audit.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-primary truncate pr-2 flex items-center gap-2"
              >
                {cleanUrl(audit.url)}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap">
                {formatDate(audit.createdAt)}
              </span>
            </div>

            {/* Usuari */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate">{audit.email || 'Anònim'}</span>
            </div>

            {/* Puntuacions (Grid de 2) */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              {/* SEO */}
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Search className="w-3 h-3" /> SEO
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(audit.seoScore)}`}>
                  {audit.seoScore ?? '-'}
                </span>
              </div>

              {/* Performance */}
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Gauge className="w-3 h-3" /> Rendiment
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(audit.performanceScore)}`}>
                  {audit.performanceScore ?? '-'}
                </span>
              </div>
            </div>
            
            {/* Estat (Opcional, si vols mostrar processing/completed) */}
            {audit.status === 'processing' && (
               <div className="text-xs text-center text-blue-500 animate-pulse font-medium">
                  🔄 Analitzant...
               </div>
            )}
          </div>
        ))}
      </div>

      {/* 💻 VERSIÓ ESCRIPTORI (Taula) - Visible >= md */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-sm bg-card mt-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Web Analitzada</th>
              <th className="px-6 py-4">Usuari</th>
              <th className="px-6 py-4 text-center">SEO</th>
              <th className="px-6 py-4 text-center">Rendiment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Calendar className="w-3 h-3" />
                     {formatDate(audit.createdAt)}
                  </div>
                </td>
                
                <td className="px-6 py-4 font-medium">
                  <a href={audit.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary hover:underline transition-colors">
                    {cleanUrl(audit.url)}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </td>
                
                <td className="px-6 py-4 text-muted-foreground">
                  {audit.email || 'Anònim'}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(audit.seoScore)}`}>
                    <Search className="w-3 h-3 mr-1" />
                    {audit.seoScore ?? '-'}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                   <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(audit.performanceScore)}`}>
                    <Gauge className="w-3 h-3 mr-1" />
                    {audit.performanceScore ?? '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}