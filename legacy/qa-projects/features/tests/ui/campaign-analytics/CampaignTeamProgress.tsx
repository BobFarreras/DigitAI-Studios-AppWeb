/**
 * @file src/features/tests/ui/campaign-analytics/CampaignTeamProgress.tsx
 * @updated 2026-05-09
 * @summary Panell de progrés del equip tester.
 * @scope Render de leaderboard i percentatge de cobertura per usuari.
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';
import { UserStat } from './types';

interface Props {
  leaderboard: UserStat[];
  totalTasks: number;
}

export function CampaignTeamProgress({ leaderboard, totalTasks }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Progrés de l'Equip
      </h3>
      <div className="bg-card border border-border rounded-xl p-4 space-y-6 shadow-sm">
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">Encara ningú ha començat.</p>
        ) : (
          leaderboard.map((stat, index) => {
            const progress = totalTasks > 0 ? Math.round((stat.completed / totalTasks) * 100) : 0;
            return (
              <div key={`${stat.user.email}-${index}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={stat.user.avatar_url || ''} />
                      <AvatarFallback className="text-[10px]">{stat.user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground truncate max-w-[100px]">{stat.user.full_name || 'Usuari'}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                <div className="flex gap-2 mt-1 justify-end font-mono">
                  <span className="text-[10px] text-green-600 dark:text-green-400">{stat.passed} OK</span>
                  <span className="text-[10px] text-red-600 dark:text-red-400">{stat.failed} KO</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
