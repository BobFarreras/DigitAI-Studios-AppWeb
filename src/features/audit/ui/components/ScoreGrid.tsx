import { Card, CardContent } from '@/components/ui/card';
import { ScoreRing } from '@/components/charts/ScoreRing';

type Props = { seo: number; perf: number };

export function ScoreGrid({ seo, perf }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ScoreCard score={seo} label="SEO" />
      <ScoreCard score={perf} label="Rendiment" />
      <ScoreCard score={85} label="Accessibilitat" />
      <ScoreCard score={92} label="Best Practices" />
    </div>
  );
}

function ScoreCard({ score, label }: { score: number; label: string }) {
  return (
    <Card className="bg-[#0f111a]/50 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm">
      <CardContent className="pt-6 pb-6 flex justify-center">
        <ScoreRing score={score} label={label} />
      </CardContent>
    </Card>
  );
}