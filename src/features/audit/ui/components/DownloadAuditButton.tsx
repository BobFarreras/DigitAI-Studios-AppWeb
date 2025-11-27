'use client';

import React from 'react';
// 👇 1. Usem dynamic import en lloc d'importar directament
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { AuditPDFDocument } from '../pdf/AuditPdfDocument';
// 👇 2. Importem el tipus real per treure l'error 'any'
import { AuditIssue } from '@/adapters/IWebScanner';

// 👇 3. Carreguem el component PDF de manera dinàmica (SSR: false)
// Això elimina la necessitat del useEffect/isClient que et donava error
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { 
    ssr: false,
    // Mentre carrega la llibreria pesada, mostrem això:
    loading: () => (
      <Button variant="outline" disabled>
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
    // ✅ CORRECCIÓ: Usem el tipus estricte en lloc d'any
    issues: AuditIssue[]; 
  }
};

export function DownloadAuditButton({ data }: Props) {
  // Ja no necessitem isClient ni useEffect gràcies al dynamic import!

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
      {/* Aquest 'loading' és intern de la generació del PDF (creant el Blob),
          diferent del loading de carregar la llibreria.
      */}
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
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