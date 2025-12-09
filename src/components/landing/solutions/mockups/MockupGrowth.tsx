'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Activity, DollarSign, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MockupGrowth() {
  const [revenue, setRevenue] = useState(8450);
  
  // 1. Dades Vives: Incrementa suaument
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => {
        const next = prev + 15;
        return next > 9999 ? 8450 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    // CONTENIDOR RESPONSIVE I ADAPTABLE AL TEMA (Light/Dark)
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center p-4">
      
      {/* Targeta Principal amb Glassmorphism */}
      <div className="relative w-full max-w-[380px] aspect-[4/3] bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col group transition-colors duration-500">
        
        {/* --- FONS AMBIENTAL (Subtil) --- */}
        {/* Light: Graella grisa molt suau | Dark: Graella fosca */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Glow Taronja de fons (Més fort en dark) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/10 dark:bg-orange-500/20 blur-[60px] rounded-full pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="relative z-10 flex justify-between items-start p-5 border-b border-slate-100 dark:border-white/5">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-md">
                        <Activity className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Real-time Growth
                    </span>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1 font-mono tracking-tight">
                    ${revenue.toLocaleString()}
                </div>
            </div>
            
            {/* Badge ROI (Pulsant) */}
            <motion.div 
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 4px 12px rgba(249,115,22,0.3)", "0 0 0px rgba(249,115,22,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-orange-500/20"
            >
                <TrendingUp className="w-3 h-3" /> +28%
            </motion.div>
        </div>

        {/* --- ÀREA DEL GRÀFIC --- */}
        <div className="relative flex-1 w-full mt-2">
            
            {/* Línia d'escaneig vertical (Scanner) */}
            <motion.div 
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-orange-400 to-transparent z-20"
            />

            <svg className="w-full h-full overflow-visible px-4 pb-2" viewBox="0 0 340 120" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" /> {/* Light */}
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                    <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* 1. Ombra de la línia (Dóna profunditat en Light Mode) */}
                <motion.path
                    d="M0 100 C 40 100, 70 120, 120 70 S 180 50, 240 80 S 300 40, 340 10"
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="4"
                    className="dark:hidden" // Només en light mode
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.1 }}
                    style={{ transform: 'translateY(4px)' }}
                />

                {/* 2. Àrea sota la línia */}
                <motion.path
                    d="M0 100 C 40 100, 70 120, 120 70 S 180 50, 240 80 S 300 40, 340 10 V 150 H 0 Z"
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* 3. Línia Principal (Taronja) */}
                <motion.path
                    d="M0 100 C 40 100, 70 120, 120 70 S 180 50, 240 80 S 300 40, 340 10"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    // Glow només en dark mode per no "embrutar" el light
                    className="dark:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                />

                {/* 4. Punts Interactius (Pop-up seqüencial) */}
                {[
                    { cx: 120, cy: 70, label: "$3k" },
                    { cx: 240, cy: 80, label: "$5k" },
                    { cx: 340, cy: 10, label: "$8.4k" }
                ].map((p, i) => (
                    <g key={i}>
                        {/* Cercle */}
                        <motion.circle
                            cx={p.cx}
                            cy={p.cy}
                            r="5"
                            className="fill-white stroke-orange-500 dark:fill-slate-900 dark:stroke-orange-400"
                            strokeWidth="3"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 1.5 + (i * 0.4), duration: 0.5 }}
                        />
                        {/* Etiqueta flotant */}
                        <motion.g
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8 + (i * 0.4) }}
                        >
                            <rect x={p.cx - 18} y={p.cy - 30} width="36" height="20" rx="4" className="fill-slate-900 dark:fill-white" />
                            <text x={p.cx} y={p.cy - 16} textAnchor="middle" className="fill-white dark:fill-slate-900 text-[10px] font-bold font-mono">
                                {p.label}
                            </text>
                        </motion.g>
                    </g>
                ))}
            </svg>
        </div>

        {/* --- FLOATERS (ELEMENTS FLOTANTS DECORATIUS) --- */}
        
        {/* Moneda Flotant */}
        <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-8 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-orange-100 dark:border-white/10 z-20"
        >
            <DollarSign className="w-5 h-5 text-orange-500" />
        </motion.div>

        {/* Partícules (Espurnes d'èxit) - Deterministes */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full opacity-60"
                style={{
                    left: `${(i * 17) % 80 + 10}%`,
                    top: `${(i * 23) % 50 + 40}%`
                }}
                animate={{
                    y: [0, -60],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0]
                }}
                transition={{
                    duration: 2 + (i % 2),
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut"
                }}
            />
        ))}

      </div>
    </div>
  );
}