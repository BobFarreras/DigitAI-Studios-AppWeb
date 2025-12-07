'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Terminal, Play, CheckCircle2, Database, FileJson, FileCode, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. DEFINIM EL TIPUS PER A UNA LÍNIA DE LOG
type LogEntry = {
  text: string;
  delay: number;
  color?: string;
};

// 2. DEFINIM EL TIPUS PER A UN ESCENARI
type ScenarioConfig = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  bgGlow: string;
  prompt: string;
  command: string;
  output: LogEntry[]; // Usem el tipus aquí també
};

// --- CONFIGURACIÓ DELS ESCENARIS ---
// (Record<string, ScenarioConfig> assegura que l'objecte compleix el tipus)
const SCENARIOS: Record<string, ScenarioConfig> = {
  js: {
    id: 'js',
    label: 'Node.js',
    icon: FileJson,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    bgGlow: 'bg-yellow-500/10',
    prompt: 'user@digitai:~/projects/api $',
    command: 'npm run deploy:production',
    output: [
      { text: '> building project...', delay: 500 },
      { text: '> optimizing chunks...', delay: 1200 },
      { text: '✔ Build completed in 840ms', color: 'text-green-400', delay: 2000 },
      { text: '🚀 Server running on port 3000', color: 'text-blue-400', delay: 2500 },
    ]
  },
  py: {
    id: 'py',
    label: 'Python',
    icon: FileCode,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    bgGlow: 'bg-blue-500/10',
    prompt: '(env) main.py >',
    command: 'python3 train_model.py --epochs=10',
    output: [
      { text: 'TensorFlow: Loading GPU...', delay: 800 },
      { text: 'Epoch 1/10: loss: 0.4242 - acc: 0.8901', delay: 1600 },
      { text: 'Epoch 10/10: loss: 0.0123 - acc: 0.9998', delay: 2400 },
      { text: '✨ Model saved to /models/v1.h5', color: 'text-purple-400', delay: 3000 },
    ]
  },
  sql: {
    id: 'sql',
    label: 'SQL',
    icon: Database,
    color: 'text-pink-400',
    borderColor: 'border-pink-500/50',
    bgGlow: 'bg-pink-500/10',
    prompt: 'postgres@db:5432 #',
    command: 'SELECT * FROM leads WHERE status = "converted";',
    output: [
      { text: 'Querying table "leads"...', delay: 600 },
      { text: 'Index Scan using leads_pkey...', delay: 1400 },
      { text: '---------------------------------', delay: 1800 },
      { text: '(1,240 rows returned)', color: 'text-green-400', delay: 2200 },
    ]
  }
};

export function TerminalMockup() {
  const [activeTab, setActiveTab] = useState<string>('js');
  const [isTyping, setIsTyping] = useState(true);
  const [text, setText] = useState('');
  
  // 3. SOLUCIÓ: SUBSTITUIM <any[]> PER <LogEntry[]>
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[activeTab];

  useEffect(() => {
    setText('');
    setLogs([]);
    setCompleted(false);
    setIsTyping(true);

    let currentText = '';
    const fullCommand = scenario.command;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < fullCommand.length) {
        currentText += fullCommand.charAt(charIndex);
        setText(currentText);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        runExecution();
      }
    }, 50 + Math.random() * 50);

    return () => clearInterval(typeInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // Afegim dependència correcta

  const runExecution = () => {
    scenario.output.forEach((log, i) => {
      setTimeout(() => {
        // Ara TypeScript sap que 'log' és de tipus LogEntry
        setLogs(prev => [...prev, log]);
        if (i === scenario.output.length - 1) setCompleted(true);
      }, log.delay);
    });
  };

  return (
    <div className="w-full h-full p-4 md:p-6 flex items-center justify-center">
      
      <motion.div 
        layout
        className={cn(
            "w-full max-w-xl bg-[#09090b] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative transition-colors duration-500",
            "hover:shadow-primary/10 hover:border-slate-700"
        )}
      >
        <div className={`absolute inset-0 ${scenario.bgGlow} opacity-5 pointer-events-none transition-colors duration-700`}></div>

        {/* HEADER: TABS */}
        <div className="flex items-center bg-[#18181b] border-b border-slate-800 px-2 pt-2">
            <div className="flex gap-1.5 px-3 pb-2 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>

            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {Object.keys(SCENARIOS).map((key) => {
                    const tab = SCENARIOS[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold font-mono transition-all duration-300 relative",
                                activeTab === key 
                                    ? "bg-[#09090b] text-white border-t border-x border-slate-800" 
                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                            )}
                        >
                            {activeTab === key && (
                                <motion.div 
                                    layoutId="activeTabIndicator"
                                    className={`absolute top-0 left-0 right-0 h-0.5 ${tab.color.replace('text-', 'bg-')}`}
                                />
                            )}
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>
            
            <div className="ml-auto px-3 pb-2 hidden sm:block">
                <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors duration-300 ${completed ? 'text-green-500 bg-green-500/10' : 'text-slate-600'}`}>
                    {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </div>
            </div>
        </div>

        {/* CONSOLE BODY */}
        <div className="p-4 md:p-6 font-mono text-xs md:text-sm min-h-[220px] flex flex-col justify-end relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-slate-300">
                    <span className={`font-bold ${scenario.color}`}>{scenario.prompt}</span>
                    <span className="text-white break-all">{text}</span>
                    {isTyping && (
                        <motion.span 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-slate-400 block"
                        />
                    )}
                </div>

                <div className="space-y-1 pl-2 border-l-2 border-slate-800">
                    <AnimatePresence mode='popLayout'>
                        {logs.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn("flex items-center gap-2", log.color || "text-slate-400")}
                            >
                                <span>{log.text}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!isTyping && completed && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-slate-300 mt-4"
                    >
                        <span className={`font-bold ${scenario.color}`}>{scenario.prompt}</span>
                        <motion.span 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-slate-400 block"
                        />
                    </motion.div>
                )}
            </div>
        </div>

        {/* STATUS BAR */}
        <div className="h-6 bg-[#18181b] border-t border-slate-800 flex items-center px-3 justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex gap-4">
                <span>UTF-8</span>
                <span>Mem: {completed ? '42MB' : 'Processing...'}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3" />
                <span>bash</span>
            </div>
        </div>

      </motion.div>
    </div>
  );
}