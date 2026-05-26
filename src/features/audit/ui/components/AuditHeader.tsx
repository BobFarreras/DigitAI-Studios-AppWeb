/**
 * @file src/features/audit/ui/components/AuditHeader.tsx
 * @updated 2026-05-08
 * @summary Feature module: src/features/audit/ui/components/AuditHeader.tsx
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
// 👇 Importem el botó real
import { DownloadAuditButton } from './DownloadAuditButton';
// 👇 1. Importem el tipus correcte per als issues
import { AuditIssue } from '@/adapters/IWebScanner';

type Props = { 
  url: string; 
  date: Date;
  pdfData: {
    url: string;
    date: string;
    scores: { seo: number; perf: number; a11y: number; best: number };
    screenshot?: string;
    // 👇 2. Corregim 'any[]' per 'AuditIssue[]'
    issues: AuditIssue[];
    
  }
};

export function AuditHeader({ url, date, pdfData }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
      <div>
        <Link href="/dashboard" className="text-xs font-medium text-slate-400 hover:text-primary flex items-center gap-1 mb-3 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3 h-3" /> Tornar al Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight truncate max-w-2xl">
          Informe: <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-primary">{url}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-mono">
          ID: {date.getTime().toString(36).toUpperCase()} • Generat el {date.toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Share2 className="w-4 h-4 mr-2" /> Compartir
        </Button>
        
        {/* Botó de descarrega */}
        <DownloadAuditButton data={pdfData} />
      </div>
    </div>
  );
}
