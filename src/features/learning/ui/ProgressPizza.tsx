/**
 * @file src/features/learning/ui/ProgressPizza.tsx
 * @updated 2026-05-23
 * @summary Donut progress indicator with pizza-slice segments for node completion.
 * @scope Presentational; SVG-based progress ring with N slices.
 */
import { motion } from 'framer-motion';

type Props = {
  total: number;
  completed: number;
  size?: number;
};

export function ProgressPizza({ total, completed, size = 56 }: Props) {
  if (total <= 0) return null;

  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gapAngle = (3 * Math.PI) / 180;
  const sliceAngle = (2 * Math.PI - gapAngle * total) / total;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute -inset-1">
      {Array.from({ length: total }).map((_, i) => {
        const startAngle = i * (sliceAngle + gapAngle) - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;
        const filled = i < completed;

        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        return (
          <motion.path
            key={i}
            d={`M${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2}`}
            fill="none"
            stroke={filled ? '#58cc02' : '#d5d5d5'}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            initial={{ opacity: filled ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: filled ? i * 0.1 : 0, duration: 0.4 }}
          />
        );
      })}
    </svg>
  );
}
