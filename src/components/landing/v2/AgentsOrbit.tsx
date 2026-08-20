/**
 * @file src/components/landing/v2/AgentsOrbit.tsx
 * @updated 2026-08-19
 * @summary Orbites d'agents: anells que giren, nodes que polsen i inclinacio 3D segons el cursor.
 * @scope Il·lustracio visual de seccio; sense logica de negoci.
 */
'use client';

import { motion, useTransform } from 'framer-motion';
import { usePointerMotion } from './fx/usePointerMotion';

const rings = [
  { radius: 168, duration: 46, dash: '2 10', color: 'rgba(128,82,255,0.35)' },
  { radius: 118, duration: 32, dash: '2 8', color: 'rgba(255,184,41,0.28)' },
  { radius: 68, duration: 22, dash: '2 6', color: 'rgba(21,132,110,0.42)' },
];

const nodes = [
  { angle: 20, radius: 168, color: '#8052ff', size: 6 },
  { angle: 150, radius: 168, color: '#3b82f6', size: 4 },
  { angle: 265, radius: 168, color: '#ec4899', size: 5 },
  { angle: 80, radius: 118, color: '#ffb829', size: 5 },
  { angle: 210, radius: 118, color: '#a855f7', size: 4 },
  { angle: 330, radius: 68, color: '#15846e', size: 5 },
];

export function AgentsOrbit() {
  const { x, y } = usePointerMotion({ stiffness: 60, damping: 20 });
  const rotateY = useTransform(x, [-1, 1], [16, -16]);
  const rotateX = useTransform(y, [-1, 1], [-14, 14]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] [perspective:1200px]">
      <motion.svg
        viewBox="-200 -200 400 400"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {rings.map((ring) => (
          <motion.circle
            key={ring.radius}
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth="1"
            strokeDasharray={ring.dash}
            animate={{ rotate: 360 }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '50%', originY: '50%' }}
          />
        ))}

        {nodes.map((node) => {
          const radians = (node.angle * Math.PI) / 180;
          const cx = Math.cos(radians) * node.radius;
          const cy = Math.sin(radians) * node.radius;
          return (
            <g key={`${node.angle}-${node.radius}`}>
              <line x1={0} y1={0} x2={cx} y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
              <motion.circle
                cx={cx}
                cy={cy}
                r={node.size}
                fill={node.color}
                animate={{ scale: [1, 1.45, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 3.2 + node.size * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          );
        })}

        <motion.circle
          r={22}
          fill="url(#core)"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <radialGradient id="core">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#8052ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8052ff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
