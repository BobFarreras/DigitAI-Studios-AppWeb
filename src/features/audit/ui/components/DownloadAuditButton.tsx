'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
// Assegura't que el nom del fitxer coincideix exactament (Majúscules/minúscules)
import { AuditPDFDocument } from '@/features/audit/ui/pdf/AuditPdfDocument'; 
import { AuditIssue } from '@/adapters/IWebScanner';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => (
      <Button variant="outline" disabled className="bg-background text-muted-foreground border-border">
         <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparant PDF...
      </Button>
    )
  }
);

type Props = {
  data: {
    url: string;
    date: string;
    scores: { seo: number; perf: number; a11y: number; best: number };
    screenshot?: string;
    issues: AuditIssue[]; 
  }
};

export function DownloadAuditButton({ data }: Props) {
  return (
    <PDFDownloadLink
      document={
        <AuditPDFDocument 
            url={data.url}
            date={data.date}
            scores={data.scores}
            screenshot={data.screenshot}
            issues={data.issues}
        />
      }
      fileName={`audit-${data.url.replace(/[^a-z0-9]/gi, '_')}.pdf`}
    >
      {({ loading }) => (
        <Button 
            // Canviem l'estil perquè sigui consistent amb el tema
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            disabled={loading}
        >
          {loading ? (
            <>
               <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generant...
            </>
          ) : (
            <>
               <Download className="w-4 h-4 mr-2" /> Descarregar PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}