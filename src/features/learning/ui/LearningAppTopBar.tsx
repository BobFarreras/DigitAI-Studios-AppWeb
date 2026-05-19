/**
 * @file src/features/learning/ui/LearningAppTopBar.tsx
 * @updated 2026-05-19
 * @summary Compact app-style stats bar for learning routes.
 * @scope Presentational top bar for mobile-first learning surfaces.
 */
import { Flame, Gem, Shield, Target } from 'lucide-react';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  data: Pick<LearningDashboardData, 'xpTotal' | 'streakDays' | 'accuracy' | 'dailyGoal'>;
};

export function LearningAppTopBar({ data }: Props) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b-2 border-[#e5e5e5] bg-white/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:rounded-xl md:border-2">
      <div className="mx-auto flex max-w-md items-center justify-between text-sm font-black">
        <Stat icon={Flame} value={data.streakDays} color="text-orange-500" />
        <Stat icon={Shield} value={data.accuracy} color="text-sky-500" suffix="%" />
        <Stat icon={Gem} value={data.xpTotal} color="text-[#1cb0f6]" />
        <Stat icon={Target} value={data.dailyGoal.progress} color="text-[#cc348d]" suffix="%" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  color,
  suffix = '',
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[#777777]">
      <Icon className={`h-5 w-5 ${color}`} />
      <span>{value}{suffix}</span>
    </div>
  );
}
