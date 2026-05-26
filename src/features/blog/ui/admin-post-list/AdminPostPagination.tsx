/**
 * @file src/features/blog/ui/admin-post-list/AdminPostPagination.tsx
 * @updated 2026-05-09
 * @summary Peu de taula amb navegacio de paginacio per blog admin.
 * @scope Controls de canvi de pagina i estat visual.
 */
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function AdminPostPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
      <div className="text-xs text-muted-foreground">
        Pàgina <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="h-8 px-3">
          <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="h-8 px-3">
          Següent <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
