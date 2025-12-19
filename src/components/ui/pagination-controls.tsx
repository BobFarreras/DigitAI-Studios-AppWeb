'use client';

import { Button } from '@/components/ui/button'; // Si tens Shadcn, sinó un button normal
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  metadata: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export function PaginationControls({ metadata }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`); // Això recarrega la pàgina amb la nova query
  };

  return (
    <div className="flex items-center justify-between py-4 border-t border-border mt-4">
      <div className="text-sm text-muted-foreground">
        Mostrant pàgina <span className="font-medium text-foreground">{metadata.page}</span> de{' '}
        <span className="font-medium text-foreground">{metadata.totalPages}</span> ({metadata.total} total)
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(metadata.page - 1)}
          disabled={metadata.page <= 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(metadata.page + 1)}
          disabled={metadata.page >= metadata.totalPages}
        >
          Següent
        </Button>
      </div>
    </div>
  );
}