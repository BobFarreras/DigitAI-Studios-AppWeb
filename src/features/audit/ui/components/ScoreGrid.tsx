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
    // Canviem bg-[#0f111a]/50 per bg-background/40 o bg-card
    <Card className="bg-background/40 border border-border hover:border-primary/20 transition-colors backdrop-blur-md shadow-sm">
      <CardContent className="pt-6 pb-6 flex justify-center">
        <ScoreRing score={score} label={label} />
      </CardContent>
    </Card>
  );
}