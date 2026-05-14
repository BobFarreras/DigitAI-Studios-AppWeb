'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Flame, 
  Trophy, 
  Play, 
  Check, 
  Lock, 
  BookOpen,
  Sparkles
} from 'lucide-react';

// --- DADES DE LES LLIÇONS ---
interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  xp: number;
  type: 'concept' | 'interactive';
}

const LESSON_PATH: Lesson[] = [
  { id: 1, title: 'Navegació Bàsica', description: 'Aprèn a moure\'t pel teu nou Command Center en menys de 2 minuts.', duration: '2 min', xp: 50, type: 'concept' },
  { id: 2, title: 'El teu primer Client', description: 'Crea un registre al CRM pas a pas.', duration: '3 min', xp: 100, type: 'interactive' },
  { id: 3, title: 'Gestió de Tiquets', description: 'Mou el teu primer tiquet pel Kanban.', duration: '4 min', xp: 150, type: 'interactive' },
  { id: 4, title: 'Filtres Avançats', description: 'Troba qualsevol dada en segons.', duration: '3 min', xp: 100, type: 'concept' },
];

export function TrainingSection() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]); // La primera ja està feta per defecte a la demo
  const [activeLesson, setActiveLesson] = useState<number>(2);
  const [isSimulating, setIsSimulating] = useState(false);

  // Càlculs de progrés
  const totalXP = completedLessons.reduce((acc, curr) => acc + (LESSON_PATH.find(l => l.id === curr)?.xp || 0), 0);
  const progressPercentage = (completedLessons.length / LESSON_PATH.length) * 100;

  const handleStartLesson = () => {
    if (completedLessons.includes(activeLesson)) return;
    
    setIsSimulating(true);
    // Simulem que la lliçó triga 1.5s en fer-se
    setTimeout(() => {
      setCompletedLessons([...completedLessons, activeLesson]);
      setIsSimulating(false);
      // Movem el focus a la següent si n'hi ha
      if (activeLesson < LESSON_PATH.length) {
        setActiveLesson(activeLesson + 1);
      }
    }, 1500);
  };

  return (
    <section id="formacio" className="relative w-full overflow-hidden bg-transparent px-4 py-24 md:px-6 lg:py-32">
      
      {/* GLOW DE FONS (Lila subtil) */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,rgba(8,9,10,0)_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl flex flex-col items-center">
        
        {/* --- HEADER: COPYWRITING --- */}
        <div className="text-center max-w-3xl mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#323334] bg-[#161718] px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#d0d6e0] shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              <GraduationCap className="h-4 w-4 text-[#8b5cf6]" /> DigitAI Academy
            </div>
            
            <h2 className="text-[clamp(32px,5vw,56px)] font-[590] leading-[1.05] tracking-[-0.02em] text-[#f7f8f8]">
              Un software només és bo si<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#5e6ad2]">el teu equip l'utilitza.</span>
            </h2>
            
            <p className="text-[clamp(16px,1.5vw,18px)] leading-[1.6] tracking-[-0.01em] text-[#8a8f98]">
              Oblida't dels manuals avorrits de 200 pàgines. Integrem un sistema de formació interactiu pas a pas. Micro-lliçons perquè el teu equip domini el sistema des del dia 1.
            </p>
          </motion.div>
        </div>

        {/* --- INTERFÍCIE ACADEMY (DUOLINGO B2B STYLE) --- */}
        <div className="w-full max-w-5xl relative">
          <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 rounded-[12px] border border-[#323334] bg-[#0f1011] p-6 lg:p-8 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.8)]">
            
            {/* ESQUERRA: El "Path" de lliçons */}
            <div className="flex-1 flex flex-col relative">
              <h3 className="text-[15px] font-medium text-[#f7f8f8] mb-6 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#62666d]" /> Rastre d'Onboarding
              </h3>
              
              <div className="relative pl-6 space-y-8">
                {/* Línia de progrés vertical */}
                <div className="absolute left-[35px] top-4 bottom-8 w-[2px] bg-[#23252a] -z-10" />
                <div 
                  className="absolute left-[35px] top-4 w-[2px] bg-[#e4f222] -z-10 transition-all duration-700 ease-out" 
                  style={{ height: `calc(${progressPercentage}% - 2rem)` }} 
                />

                {LESSON_PATH.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isUnlocked = isCompleted || lesson.id === Math.max(...completedLessons) + 1 || (completedLessons.length === 0 && lesson.id === 1);
                  const isActive = activeLesson === lesson.id;

                  return (
                    <div 
                      key={lesson.id}
                      onClick={() => isUnlocked && setActiveLesson(lesson.id)}
                      className={`relative flex items-center gap-6 ${isUnlocked ? 'cursor-pointer group' : 'opacity-50 cursor-not-allowed'}`}
                    >
                      {/* Node Circle */}
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all z-10 shrink-0 ${
                        isCompleted 
                          ? 'bg-[#e4f222]/10 border-[#e4f222] text-[#e4f222]' 
                          : isActive 
                            ? 'bg-[#161718] border-[#8b5cf6] text-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : isUnlocked
                              ? 'bg-[#161718] border-[#323334] text-[#8a8f98] group-hover:border-[#62666d]'
                              : 'bg-[#08090a] border-[#23252a] text-[#323334]'
                      }`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : isUnlocked ? <span className="font-mono font-bold text-[14px]">{index + 1}</span> : <Lock className="h-4 w-4" />}
                      </div>

                      {/* Info Lliçó */}
                      <div className="flex-1">
                        <h4 className={`text-[15px] font-medium mb-1 transition-colors ${isActive ? 'text-[#f7f8f8]' : 'text-[#d0d6e0]'}`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[12px] font-mono text-[#62666d]">
                          <span>{lesson.duration}</span>
                          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-[#e4f222]" /> {lesson.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DRETA: Targeta Activa i Stats */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
              
              {/* Top Stats Bar */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#161718] border border-[#23252a] rounded-[8px] p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#eb5757]/10 flex items-center justify-center">
                    <Flame className="h-4 w-4 text-[#eb5757]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8a8f98] font-medium uppercase tracking-wider">Racha</div>
                    <div className="text-[15px] font-bold text-[#f7f8f8]">3 Dies</div>
                  </div>
                </div>
                <div className="flex-1 bg-[#161718] border border-[#23252a] rounded-[8px] p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#e4f222]/10 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-[#e4f222]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8a8f98] font-medium uppercase tracking-wider">Punts</div>
                    <div className="text-[15px] font-bold text-[#f7f8f8]">{totalXP} XP</div>
                  </div>
                </div>
              </div>

              {/* Targeta de Lliçó Activa */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLesson}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#08090a] border border-[#323334] rounded-[12px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex-1 flex flex-col"
                >
                  {(() => {
                    const lesson = LESSON_PATH.find(l => l.id === activeLesson)!;
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <>
                        <div className="inline-flex items-center gap-2 mb-4">
                          <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            lesson.type === 'interactive' ? 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20' : 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20'
                          }`}>
                            {lesson.type === 'interactive' ? 'Pràctica Guiada' : 'Concepte Clau'}
                          </span>
                        </div>
                        
                        <h3 className="text-[20px] font-semibold text-[#f7f8f8] mb-3 leading-tight">
                          {lesson.title}
                        </h3>
                        <p className="text-[14px] text-[#8a8f98] leading-relaxed mb-8 flex-1">
                          {lesson.description}
                        </p>

                        <button
                          onClick={handleStartLesson}
                          disabled={isDone || isSimulating}
                          className={`w-full h-12 rounded-[6px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                            isDone 
                              ? 'bg-[#161718] text-[#27a644] border border-[#27a644]/30 cursor-default'
                              : isSimulating
                                ? 'bg-[#e4f222]/50 text-[#08090a] cursor-wait'
                                : 'bg-[#e4f222] text-[#08090a] hover:scale-[1.02] shadow-[0_0_20px_rgba(228,242,34,0.15)]'
                          }`}
                        >
                          {isDone ? (
                            <><Check className="h-5 w-5" /> Lliçó Completada</>
                          ) : isSimulating ? (
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="h-5 w-5 border-2 border-[#08090a] border-t-transparent rounded-full"
                            />
                          ) : (
                            <><Play className="h-4 w-4 fill-current" /> Començar Lliçó</>
                          )}
                        </button>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* Llista de beneficis en text (Sota la UI) */}
        <div className="mt-16 max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="text-[15px] font-semibold text-[#f7f8f8]">Micro-càpsules</h4>
            <p className="text-[13px] text-[#8a8f98] leading-relaxed">Aprenentatge pràctic en sessions de menys de 5 minuts, directament dins la interfície de treball.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[15px] font-semibold text-[#f7f8f8]">Sense Fricció</h4>
            <p className="text-[13px] text-[#8a8f98] leading-relaxed">El teu equip aprèn utilitzant el sistema real. Les tasques de prova formen part de la feina diària.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-[15px] font-semibold text-[#f7f8f8]">Mètriques d'Adopció</h4>
            <p className="text-[13px] text-[#8a8f98] leading-relaxed">Com a gerent, pots veure el progrés de cada treballador i assegurar-te que tothom sap utilitzar l'eina.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
