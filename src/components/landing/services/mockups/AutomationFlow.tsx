'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Zap, Database, Mail, Slack, BrainCircuit, CheckCircle2, LucideIcon } from 'lucide-react';

// 1. Definim els tipus per a les Props
interface NodeProps {
    icon: LucideIcon;
    color: 'blue' | 'purple' | 'indigo' | 'orange' | 'green';
    label: string;
    delay: number;
    cycle: number;
    pulse?: boolean;
    isFinal?: boolean;
}

export function AutomationFlow() {
  const cycle = 4; 

  return (
    // CONTENIDOR ADAPTABLE: 
    // Ajustem l'alçada: h-40 en mòbil (més baixet) i h-64 en escriptori.
    <div className="h-40 sm:h-56 md:h-64 w-full mt-4 relative bg-slate-50/80 dark:bg-[#0f111a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-inner dark:shadow-2xl group flex items-center justify-center transition-colors duration-500">
      
      {/* FONS TÈCNIC (Grid adaptable) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-transparent to-blue-500/0 dark:from-purple-500/5 dark:to-blue-500/5 pointer-events-none"></div>

      {/* 🔴 TRUC MÀGIC RESPONSIVE: 
          Creem un contenidor de mida FIXA (500x200) que conté tot el diagrama perfecte.
          Després, usem 'scale' per fer-lo petit en mòbils sense trencar la posició dels elements.
      */}
      <div className="relative w-[500px] h-[200px] shrink-0 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-500 origin-center flex items-center justify-center">

          {/* --- LAYER DE CONNEXIONS (SVG) --- */}
          {/* Ara l'SVG ocupa exactament l'espai del contenidor escalat */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
                </linearGradient>
            </defs>

            {/* LÍNIES ESTRUCTURALS ADAPTABLES */}
            <g className="stroke-slate-300 dark:stroke-slate-700 transition-colors duration-500">
                <path d="M 50 100 L 150 100" strokeWidth="2" /> {/* Start -> AI */}
                <path d="M 150 100 C 200 100, 200 50, 280 50" strokeWidth="2" fill="none" /> {/* AI -> Top */}
                <path d="M 150 100 C 200 100, 200 150, 280 150" strokeWidth="2" fill="none" /> {/* AI -> Bottom */}
                <path d="M 280 150 L 380 150" strokeWidth="2" /> {/* Slack -> Mail */}
            </g>

            {/* --- PARTÍCULES DE DADES --- */}
            
            {/* P1: Trigger -> AI */}
            <motion.circle r="4" fill="#3b82f6"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: cycle * 0.25, ease: "linear", repeat: Infinity, repeatDelay: cycle * 0.75 }}
                style={{ offsetPath: "path('M 50 100 L 150 100')" }}
            />

            {/* P2: AI -> Database */}
            <motion.circle r="4" fill="#a855f7"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: cycle * 0.25, ease: "linear", repeat: Infinity, delay: cycle * 0.25, repeatDelay: cycle * 0.75 }}
                style={{ offsetPath: "path('M 150 100 C 200 100, 200 50, 280 50')" }}
            />

            {/* P3: AI -> Slack */}
            <motion.circle r="4" fill="#a855f7"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: cycle * 0.25, ease: "linear", repeat: Infinity, delay: cycle * 0.25, repeatDelay: cycle * 0.75 }}
                style={{ offsetPath: "path('M 150 100 C 200 100, 200 150, 280 150')" }}
            />

            {/* P4: Slack -> Mail */}
            <motion.circle r="4" fill="#22c55e"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: cycle * 0.25, ease: "linear", repeat: Infinity, delay: cycle * 0.5, repeatDelay: cycle * 0.75 }}
                style={{ offsetPath: "path('M 280 150 L 380 150')" }}
            />
          </svg>


          {/* --- NODES (Posicionats en absolut dins del contenidor de 500x200) --- */}
          <div className="absolute inset-0">
            
            {/* NODE 1: TRIGGER (Webhook) */}
            <div className="absolute left-[30px] top-[80px]">
                <Node icon={MessageSquare} color="blue" label="Webhook" delay={0} cycle={cycle} />
            </div>

            {/* NODE 2: BRAIN (AI Processing) */}
            <div className="absolute left-[130px] top-[80px]">
                <Node icon={BrainCircuit} color="purple" label="AI Analyze" delay={cycle * 0.25} cycle={cycle} pulse />
            </div>

            {/* NODE 3: DATABASE (Storage) */}
            <div className="absolute left-[260px] top-[30px]">
                <Node icon={Database} color="indigo" label="Store Data" delay={cycle * 0.5} cycle={cycle} />
            </div>

            {/* NODE 4: SLACK (Notify Team) */}
            <div className="absolute left-[260px] top-[130px]">
                <Node icon={Slack} color="orange" label="Notify Team" delay={cycle * 0.5} cycle={cycle} />
            </div>

            {/* NODE 5: MAIL (Confirm Client) */}
            <div className="absolute left-[360px] top-[130px]">
                <Node icon={Mail} color="green" label="Send Email" delay={cycle * 0.75} cycle={cycle} isFinal />
            </div>

          </div>
      </div>
    </div>
  );
}

// --- COMPONENT AUXILIAR PER ALS NODES ---

function Node({ icon: Icon, color, label, delay, cycle, isFinal }: NodeProps) {
    const colors: Record<NodeProps['color'], string> = {
        blue:   "bg-white border-blue-200 text-blue-600 shadow-sm dark:bg-blue-950/50 dark:border-blue-500/50 dark:text-blue-400 dark:shadow-blue-500/20",
        purple: "bg-white border-purple-200 text-purple-600 shadow-sm dark:bg-purple-950/50 dark:border-purple-500/50 dark:text-purple-400 dark:shadow-purple-500/20",
        indigo: "bg-white border-indigo-200 text-indigo-600 shadow-sm dark:bg-indigo-950/50 dark:border-indigo-500/50 dark:text-indigo-400 dark:shadow-indigo-500/20",
        orange: "bg-white border-orange-200 text-orange-600 shadow-sm dark:bg-orange-950/50 dark:border-orange-500/50 dark:text-orange-400 dark:shadow-orange-500/20",
        green:  "bg-white border-emerald-200 text-emerald-600 shadow-sm dark:bg-emerald-950/50 dark:border-emerald-500/50 dark:text-emerald-400 dark:shadow-emerald-500/20",
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <motion.div
                animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 4px 12px rgba(0,0,0,0.1)", "0 0 0px rgba(0,0,0,0)"]
                }}
                transition={{ 
                    duration: 0.4, 
                    delay: delay, 
                    repeat: Infinity, 
                    repeatDelay: cycle - 0.4 
                }}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center relative z-10 transition-colors duration-500 ${colors[color]}`}
            >
                <Icon className="w-5 h-5" />
                
                {/* Success Indicator */}
                {isFinal && (
                    <motion.div
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ duration: 0.5, delay: delay + 0.2, repeat: Infinity, repeatDelay: cycle - 0.5 }}
                        className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900 shadow-sm"
                    >
                        <CheckCircle2 className="w-3 h-3" />
                    </motion.div>
                )}
            </motion.div>

            <motion.span 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.4, delay: delay, repeat: Infinity, repeatDelay: cycle - 0.4 }}
                className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors duration-500 whitespace-nowrap
                    text-slate-500 bg-slate-100 border-slate-200 
                    dark:text-slate-400 dark:bg-black/40 dark:border-white/5"
            >
                {label}
            </motion.span>
        </div>
    );
}