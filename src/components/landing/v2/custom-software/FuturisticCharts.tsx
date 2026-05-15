/**
 * @file src/components/landing/v2/custom-software/FuturisticCharts.tsx
 * @updated 2026-05-13
 * @summary Charts SVG futuristes i llegibles per dashboard.
 * @scope Components visuals purs; sense logica d'estat.
 */
'use client';

export function RevenueSpark() {
  const points = [42, 54, 48, 61, 66, 73];
  return (
    <svg viewBox="0 0 240 96" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="revGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5e6ad2" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#27a644" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#2b2d31" strokeWidth="0.8" />)}
      <polyline points={points.map((v, i) => `${12 + i * 42},${90 - v * 0.95}`).join(' ')} fill="none" stroke="url(#revGlow)" strokeWidth="3.2" strokeLinecap="round" />
      {points.map((v, i) => <circle key={i} cx={12 + i * 42} cy={90 - v * 0.95} r="2.9" fill="#c8ccff" />)}
      <text x="10" y="94" fontSize="9" fill="#8a8f98">Jan</text>
      <text x="214" y="94" fontSize="9" fill="#8a8f98">Jun</text>
      <text x="208" y="16" fontSize="9" fill="#8a8f98">128k</text>
    </svg>
  );
}

export function SlaRadar() {
  return (
    <svg viewBox="0 0 180 96" preserveAspectRatio="none" className="h-full w-full">
      <circle cx="90" cy="46" r="32" fill="none" stroke="#3a3d45" strokeWidth="1.4" />
      <circle cx="90" cy="46" r="22" fill="none" stroke="#4a4f5c" strokeWidth="1.1" />
      <path d="M90 46 L90 14 A32 32 0 1 1 67 22 Z" fill="rgba(94,106,210,0.25)" stroke="#5e6ad2" strokeWidth="1.7" />
      <text x="82" y="50" fontSize="10" fill="#8a8f98">OK</text>
      <text x="8" y="92" fontSize="9" fill="#8a8f98">97.2%</text>
      <text x="142" y="92" fontSize="9" fill="#8a8f98">31/34</text>
    </svg>
  );
}

export function WorkloadBars() {
  const vals = [74, 91, 62, 78, 83, 69, 88, 57, 80];
  return (
    <svg viewBox="0 0 240 96" preserveAspectRatio="none" className="h-full w-full">
      {[20, 40, 60, 80].map((y) => <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#2b2d31" strokeWidth="0.8" />)}
      {vals.map((v, i) => (
        <rect key={i} x={10 + i * 24} y={92 - v * 0.85} width="14" height={v * 0.85} rx="2" fill={i % 2 ? '#a855f7' : '#5e6ad2'} opacity="0.9" />
      ))}
      <text x="10" y="94" fontSize="9" fill="#8a8f98">Team 1</text>
      <text x="198" y="94" fontSize="9" fill="#8a8f98">Team 9</text>
    </svg>
  );
}

export function IncidentDualChart({ focus = 'all' }: { focus?: 'all' | 'inc' | 'avg' }) {
  const inc = [12, 9, 14, 8, 11, 7, 10];
  const mins = [84, 73, 96, 62, 70, 58, 64];
  const days = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];
  const showInc = focus === 'all' || focus === 'inc';
  const showAvg = focus === 'all' || focus === 'avg';
  return (
    <svg viewBox="0 0 520 156" preserveAspectRatio="none" className="h-full w-full rounded-[6px] border border-[#c0c8d5] bg-white p-2 dark:border-[#323334] dark:bg-[#08090a]">
      <defs>
        <pattern id="dashGrid" width="52" height="24" patternUnits="userSpaceOnUse">
          <path d="M 52 0 L 0 0 0 24" fill="none" stroke="#25282d" strokeWidth="0.7" opacity="0.55" />
        </pattern>
        <filter id="chartGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="incFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7f8cff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#7f8cff" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="avgFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#12a87b" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#12a87b" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="520" height="156" fill="url(#dashGrid)" opacity="0.58" />
      {[28, 54, 80, 106].map((y) => <line key={y} x1="18" y1={y} x2="502" y2={y} stroke="#d8dde7" strokeWidth="1" strokeDasharray="4 8" opacity="0.42" />)}
      <path d={`M 24 118 ${inc.map((v, i) => `L ${24 + i * 78} ${118 - v * 5.6}`).join(' ')} L 492 118 Z`} fill="url(#incFill)" opacity={showInc ? 1 : 0.1} />
      <path d={`M 24 118 ${mins.map((v, i) => `L ${24 + i * 78} ${120 - v * 0.64}`).join(' ')} L 492 118 Z`} fill="url(#avgFill)" opacity={showAvg ? 1 : 0.1} />
      <polyline points={inc.map((v, i) => `${24 + i * 78},${118 - v * 5.6}`).join(' ')} fill="none" stroke="#8a8cff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#chartGlow)" opacity={showInc ? 1 : 0.16} strokeDasharray="620" strokeDashoffset="620">
        <animate attributeName="stroke-dashoffset" from="620" to="0" dur="1.15s" fill="freeze" />
      </polyline>
      <polyline points={mins.map((v, i) => `${24 + i * 78},${120 - v * 0.64}`).join(' ')} fill="none" stroke="#12a87b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#chartGlow)" opacity={showAvg ? 1 : 0.16} strokeDasharray="620" strokeDashoffset="620">
        <animate attributeName="stroke-dashoffset" from="620" to="0" dur="1.35s" fill="freeze" />
      </polyline>
      {inc.map((v, i) => (
        <g key={i}>
          <line x1={24 + i * 78} y1="18" x2={24 + i * 78} y2="118" stroke="#8a8f98" strokeWidth="0.7" opacity="0.18" />
          <circle cx={24 + i * 78} cy={118 - v * 5.6} r="4" fill="#8a8cff" opacity={showInc ? 1 : 0.16}><animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.12}s`} /></circle>
          <circle cx={24 + i * 78} cy={120 - mins[i] * 0.64} r="3.4" fill="#12a87b" opacity={showAvg ? 1 : 0.16} />
          <text x={24 + i * 78} y="149" textAnchor="middle" fontSize="11" fill="#8a8f98">{days[i]}</text>
          <text x={24 + i * 78} y={108 - v * 5.6} textAnchor="middle" fontSize="12" fill="#5e6ad2" opacity={showInc ? 1 : 0.16}>{v}</text>
          <text x={24 + i * 78} y={133 - mins[i] * 0.64} textAnchor="middle" fontSize="10.5" fill="#087a5a" opacity={showAvg ? 1 : 0.18}>{mins[i]}m</text>
        </g>
      ))}
    </svg>
  );
}
