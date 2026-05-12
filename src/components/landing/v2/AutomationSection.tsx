'use client';

import { useState, useEffect } from 'react';
// IMPORTACIÓ CORREGIDA: Assegura't que AnimatePresence està aquí
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Database, FileText, Bell, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

// --- PASOS DE LA CINEMÀTICA ---
const FLOW_STEPS = [
  {
    id: 'trigger',
    title: 'Client via WhatsApp',
    message: '"Hola, necessito un pressupost per al servei de manteniment..."',
    icon: MessageCircle,
    color: 'text-[#25D366]',
    bg: 'bg-[#25D366]/10',
    borderColor: 'border-[#25D366]/30',
  },
  {
    id: 'action-1',
    title: 'Resposta Automàtica',
    message: 'S\'envia confirmació immediata al client per WhatsApp.',
    icon: CheckCircle2,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    borderColor: 'border-zinc-500/20',
  },
  {
    id: 'action-2',
    title: 'Registre al CRM',
    message: 'Es crea la fitxa "Nou Lead" i s\'assigna a un comercial.',
    icon: Database,
    color: 'text-[#5e6ad2]',
    bg: 'bg-[#5e6ad2]/10',
    borderColor: 'border-[#5e6ad2]/30',
  },
  {
    id: 'action-3',
    title: 'Generació a l\'ERP',
    message: 'Es crea l\'esborrany del pressupost llest per revisar.',
    icon: FileText,
    color: 'text-[#f5a623]',
    bg: 'bg-[#f5a623]/10',
    borderColor: 'border-[#f5a623]/30',
  },
  {
    id: 'action-4',
    title: 'Avís al Departament',
    message: 'Notificació a l\'equip de Vendes amb l\'enllaç al pressupost.',
    icon: Bell,
    color: 'text-[#e43b44]',
    bg: 'bg-[#e43b44]/10',
    borderColor: 'border-[#e43b44]/30',
  }
];

export function AutomationSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Bucle controlat per a la "cinemàtica"
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        // Quan arriba al final, aturem la reproducció
        if (prev >= FLOW_STEPS.length - 1) {
          setIsPlaying(false);
          return FLOW_STEPS.length; // L'estat final on tot està completat
        }
        return prev + 1;
      });
    }, 1800); // Temps suficient per llegir cada pas

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Funció per reiniciar l'animació manualment
  const handleRestart = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <section id="automatitzacions" className="relative w-full bg-background px-4 md:px-6 py-16 lg:py-32 overflow-hidden border-t border-border">

      {/* Background subtil */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      {/* 
        CONTENIDOR PRINCIPAL (items-stretch per igualar alçades)
      */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

        {/* --- PART ESQUERRA: COPYWRITING FLUID I FLEXIBLE --- */}
        <div className="flex flex-col h-full w-full max-w-[600px] mx-auto lg:mx-0 justify-between py-2 lg:py-6">

          <div className="flex flex-col gap-4 md:gap-6">
          

            {/* Títol amb Tipografia Fluida (clamp) */}
            <h2 className="text-[clamp(28px,4vw,48px)] font-[590] leading-[1.1] tracking-[-0.02em] text-foreground">
              Un sol missatge.<br />
              <span className="text-[#27a644]">Hores de feina estalviades.</span>
            </h2>

            {/* Paràgraf amb Tipografia Fluida */}
            <p className="text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-muted-foreground">
              Oblida't de picar dades a mà i copiar informació entre programes. Quan entra un correu, un formulari o un WhatsApp, el nostre sistema atrapa les dades i les distribueix on toca de forma instantània.
            </p>
          </div>

          {/* Llista Flexible: flex-1 permet adaptar-se a l'espai sobrant */}
          <ul className="flex-1 flex flex-col justify-center gap-4 md:gap-6 my-8 lg:my-10">
            {[
              "Sincronització en temps real entre CRM, ERP i bases de dades.",
              "Generació automàtica de pressupostos, factures i documents.",
              "Notificacions intel·ligents (Slack, Telegram, Correu).",
              "Sistemes robustos 24/7. Res no es perd, res no s'oblida."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[clamp(14px,1.2vw,16px)] text-foreground">
                <CheckCircle2 className="h-[18px] w-[18px] md:h-5 md:w-5 text-[#27a644] shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <Link
              href="#contacte"
              className="inline-flex h-11 md:h-12 w-full sm:w-auto items-center justify-center rounded-[6px] bg-primary px-6 md:px-8 text-[14px] md:text-[15px] font-[590] text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Vull automatitzar els meus processos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* --- PART DRETA: CINEMÀTICA CENTRADA --- */}
        <div className="flex items-center justify-center w-full h-full lg:min-h-[600px]">

          {/* Caixa Terminal: Es centra sola i ocupa 100% de l'alçada disponible */}
          <div className="relative w-full max-w-full lg:max-w-none h-full flex flex-col rounded-[12px] border border-border bg-[#fdfdfd] dark:bg-[#08090a] p-4 md:p-8 lg:p-10 shadow-sm mx-auto overflow-hidden">

            {/* Llum de fons del terminal */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#27a644]/5 blur-[80px] pointer-events-none" />

            {/* Capçalera del terminal simulada */}
     

            {/* Contenidor del flux de nodes */}
            <div className="relative flex-1 flex flex-col justify-center">
              {FLOW_STEPS.map((step, index) => {
                const isActive = index <= activeStep;
                const isCurrent = index === activeStep;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-start gap-3 md:gap-4 mb-4 md:mb-5 last:mb-0">

                    {/* Línia de connexió vertical intel·ligent */}
                    {index !== FLOW_STEPS.length - 1 && (
                      <div className="absolute left-[15px] md:left-[19px] top-[32px] md:top-[40px] bottom-[-16px] md:bottom-[-20px] w-[2px] bg-border/40 z-0">
                        <motion.div
                          className="w-full bg-[#27a644]"
                          initial={{ height: '0%' }}
                          animate={{ height: isActive && index < activeStep ? '100%' : '0%' }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                      </div>
                    )}

                    {/* Icona del Node */}
                    <div className="relative z-10 mt-1 shrink-0">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                          scale: isCurrent ? 1.1 : isActive ? 1 : 0.8,
                          opacity: isActive ? 1 : 0.4,
                          boxShadow: isCurrent ? `0 0 20px ${step.color.replace('text-', '')}30` : 'none'
                        }}
                        className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-[8px] border bg-background transition-colors ${isActive ? step.borderColor : 'border-border'}`}
                      >
                        <Icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? step.color : 'text-muted-foreground'}`} />
                      </motion.div>
                    </div>

                    {/* Contingut del Node */}
                    <div className="flex-1 w-full min-w-0">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -5 }}
                        transition={{ duration: 0.4 }}
                        className={`rounded-[8px] border p-2.5 md:p-3.5 transition-colors w-full overflow-hidden ${isCurrent
                            ? `border-${step.color.split('-')[1]}/30 bg-card shadow-sm dark:bg-[#161718]`
                            : 'border-transparent bg-transparent'
                          }`}
                      >
                        <h4 className={`text-[12px] md:text-[14px] font-[590] mb-0.5 md:mb-1 truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h4>
                        <div className={`mt-1 md:mt-1.5 rounded-[6px] px-2.5 md:px-3 py-1.5 md:py-2 text-[11px] md:text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-words ${isActive ? step.bg : 'bg-muted/30'} ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.message}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estat del sistema i Botó Reiniciar */}
            <div className="mt-6 md:mt-8 pt-4 flex justify-center shrink-0 h-[40px] items-center border-t border-border/30">
              <AnimatePresence mode="wait">
                {activeStep >= FLOW_STEPS.length ? (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-3 rounded-full border border-[#27a644]/30 bg-[#27a644]/10 pl-3 md:pl-4 pr-1.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium text-[#27a644]"
                  >
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>Procés completat.</span>
                    </div>

                    {/* Botó petit per reiniciar */}
                    <button
                      onClick={handleRestart}
                      className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-[#27a644]/20 hover:bg-[#27a644]/30 text-[#27a644] transition-colors cursor-pointer group"
                      aria-label="Reiniciar animació"
                      title="Tornar a veure el flux"
                    >
                      <RotateCcw className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:-rotate-90 transition-transform duration-300" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2 text-[11px] md:text-[13px] text-muted-foreground font-mono"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
                    Processant dades...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}