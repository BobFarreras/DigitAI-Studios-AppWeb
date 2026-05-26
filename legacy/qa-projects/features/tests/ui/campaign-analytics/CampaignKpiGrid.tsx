/**
 * @file src/features/tests/ui/campaign-analytics/CampaignKpiGrid.tsx
 * @updated 2026-05-09
 * @summary Graella de KPI globals de la campanya.
 * @scope Presentació de volum, taxa d'èxit, errors i testers actius.
 */

import { Card, CardContent } from '@/components/ui/card';

interface Props {
  totalExecutions: number;
  successRate: number;
  failed: number;
  activeTesters: number;
}

export function CampaignKpiGrid({ totalExecutions, successRate, failed, activeTesters }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-card border-border text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="text-muted-foreground text-xs uppercase font-bold mb-1">Total Validacions</div>
          <div className="text-3xl font-bold text-foreground">{totalExecutions}</div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="text-muted-foreground text-xs uppercase font-bold mb-1">Taxa d'Èxit</div>
          <div className={`text-3xl font-bold ${successRate > 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
            {successRate}%
          </div>
        </CardContent>
      </Card>
      <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20 shadow-sm">
        <CardContent className="p-6">
          <div className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1">Errors Crítics</div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-500">{failed}</div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border text-card-foreground shadow-sm">
        <CardContent className="p-6">
          <div className="text-muted-foreground text-xs uppercase font-bold mb-1">Testers Actius</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeTesters}</div>
        </CardContent>
      </Card>
    </div>
  );
}
