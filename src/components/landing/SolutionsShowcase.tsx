'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  CreditCard, 
  CalendarCheck, 
  BarChart4, 
  Smartphone, 
  Wifi, 
  Zap, 
  Share2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- DEFINICIÓ DELS MÒDULS ---
const SOLUTIONS = [
  {
    id: 'iot',
    title: 'Smart Spaces & IoT',
    icon: Wifi,
    description: 'Controla el món físic des del digital. Obre portes, encén llums i monitoritza espais.',
    tags: ['Accés QR', 'Shelly/Domòtica', 'Sensors', 'Control Remot'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'finance',
    title: 'Finances Automatitzades',
    icon: CreditCard,
    description: 'Deixa que la IA gestioni els diners. Facturació, cobraments i control de despeses sense errors.',
    tags: ['Stripe Payments', 'Auto-Facturació', 'Rebuts OCR', 'Signatura Digital'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'booking',
    title: 'Gestió de Clients & Cites',
    icon: CalendarCheck,
    description: 'La teva agenda s\'omple sola. Sistema de reserves, recordatoris i fidelització.',
    tags: ['Booking Engine', 'Recordatoris WhatsApp', 'Digital Wallet', 'Chatbots IA'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'growth',
    title: 'Growth & Analítica',
    icon: BarChart4,
    description: 'Pren decisions basades en dades, no en intuïcions. Màrqueting automàtic i dashboards.',
    tags: ['Social Auto-Post', 'Business Intelligence', 'KPIs en viu', 'CRM'],
    color: 'from-orange-500 to-red-500'
  }
];

export function SolutionsShowcase() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const activeSolution = SOLUTIONS.find(s => s.id === activeTab)!;

  return (
    <section className="py-24 bg-slate-50 dark:bg-black/50 relative overflow-hidden transition-colors duration-500">
      
      {/* Fons Ambient */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${activeSolution.color} blur-[150px] transition-all duration-700`} />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Més enllà d'una <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Simple Web</span>.
          </h2>
          <p className="text-xl text-muted-foreground">
            Creem ecosistemes digitals que connecten programari, maquinari i intel·ligència artificial.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch h-full min-h-[600px]">
          
          {/* --- COLUMNA ESQUERRA: NAVEGACIÓ --- */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {SOLUTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative group flex items-center gap-4 p-6 rounded-2xl text-left transition-all duration-300 border border-transparent",
                  activeTab === item.id 
                    ? "bg-white dark:bg-slate-900 shadow-xl border-primary/20 scale-[1.02]" 
                    : "hover:bg-white/50 dark:hover:bg-white/5 hover:border-border"
                )}
              >
                {/* Indicador actiu animat */}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeGlow"
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-5 dark:opacity-10`}
                  />
                )}

                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                  activeTab === item.id 
                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className={cn("font-bold text-lg", activeTab === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                    {item.title}
                  </h3>
                  {activeTab === item.id && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      {item.tags.join(' • ')}
                    </motion.p>
                  )}
                </div>
                
                {activeTab === item.id && (
                    <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* --- COLUMNA DRETA: FINESTRA HOLOGRÀFICA --- */}
          <div className="lg:col-span-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[32px] shadow-2xl overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full p-8 md:p-12 flex flex-col"
                >
                  {/* Contingut Textual */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                       <activeSolution.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${activeSolution.color}`} /> 
                       {activeSolution.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      {activeSolution.description}
                    </p>
                  </div>

                  {/* VISUALITZACIÓ DINÀMICA (MOCKUPS) */}
                  <div className="flex-1 relative flex items-center justify-center bg-slate-50/50 dark:bg-black/20 rounded-2xl border border-dashed border-border/50 overflow-hidden">
                     {activeTab === 'iot' && <MockupIoT />}
                     {activeTab === 'finance' && <MockupFinance />}
                     {activeTab === 'booking' && <MockupBooking />}
                     {activeTab === 'growth' && <MockupGrowth />}
                  </div>

                  {/* Footer Tags */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    {activeSolution.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-background border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS VISUALS (MOCKUPS ANIMATS)
// ----------------------------------------------------------------------

function MockupIoT() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-10">
       {/* TELÈFON ESCANEJANT */}
       <motion.div 
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2 }}
         className="absolute left-10 bottom-10 w-40 h-64 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center z-20"
       >
          <div className="w-20 h-20 bg-white rounded-lg p-2 mb-4">
             <QrCode className="w-full h-full text-black" />
          </div>
          <span className="text-xs text-green-400 font-mono animate-pulse">Scanning...</span>
       </motion.div>

       {/* ONES DE SENYAL */}
       <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute left-[110px] bottom-[150px] w-20 h-20 border-2 border-cyan-500 rounded-full z-10"
       />

       {/* PORTA INTEL·LIGENT / SHELLY */}
       <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="w-64 h-80 bg-slate-100 dark:bg-slate-800 rounded-t-full border-8 border-slate-300 dark:border-slate-700 relative flex items-center justify-center shadow-inner"
       >
          <div className="absolute top-1/2 left-4 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
          <motion.div 
             animate={{ rotateY: -100 }}
             transition={{ delay: 1.5, duration: 1, type: "spring" }}
             className="w-full h-full bg-white dark:bg-slate-600 rounded-t-full origin-left border-r border-slate-200 dark:border-slate-500 flex items-center justify-center"
          >
             <div className="w-4 h-4 bg-slate-400 rounded-full absolute right-4 top-1/2" />
             <div className="bg-green-500/20 text-green-600 px-4 py-2 rounded-lg font-bold border border-green-500 flex items-center gap-2">
                <Lock className="w-4 h-4" /> UNLOCKED
             </div>
          </motion.div>
       </motion.div>
    </div>
  )
}

function MockupFinance() {
  return (
    <div className="w-full max-w-md space-y-4">
       {/* TARGETA STRIPE */}
       <motion.div 
         initial={{ y: -50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden"
       >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <div className="flex justify-between items-start mb-8">
             <div className="text-xl font-bold">Stripe</div>
             <Wifi className="w-6 h-6 rotate-90" />
          </div>
          <div className="text-lg font-mono tracking-widest mb-4">**** **** **** 4242</div>
          <div className="flex justify-between text-xs opacity-70">
             <span>Card Holder</span>
             <span>Expires</span>
          </div>
       </motion.div>

       {/* FLUX DE FACTURACIÓ */}
       <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
             <motion.div
               key={i}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: i * 0.3 }}
               className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-border shadow-sm flex flex-col items-center gap-2"
             >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">€</div>
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-2 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
             </motion.div>
          ))}
       </div>
    </div>
  )
}

function MockupBooking() {
   return (
     <div className="relative w-full h-full p-6 flex flex-col items-center">
        {/* CALENDARI */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border overflow-hidden">
           <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-primary/10">
              <span className="font-bold text-primary">Gener 2025</span>
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-red-400" />
                 <div className="w-2 h-2 rounded-full bg-yellow-400" />
                 <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
           </div>
           <div className="p-4 grid grid-cols-7 gap-2">
              {[...Array(14)].map((_, i) => (
                 <div key={i} className="aspect-square rounded-md bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-xs text-muted-foreground">
                    {i + 1}
                 </div>
              ))}
              <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.5, type: "spring" }}
                 className="aspect-square rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/30 col-span-2 w-full"
              >
                 RESERVAT
              </motion.div>
           </div>
        </div>

        {/* NOTIFICACIÓ MÒBIL */}
        <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: -20, opacity: 1 }}
           transition={{ delay: 1 }}
           className="absolute bottom-4 bg-black/80 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 w-64 border border-white/10"
        >
           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
           </div>
           <div className="text-xs">
              <div className="font-bold">Nova Reserva</div>
              <div className="opacity-80">Joan ha reservat per demà.</div>
           </div>
        </motion.div>
     </div>
   )
}

function MockupGrowth() {
   return (
      <div className="flex items-end justify-center gap-4 h-40 w-full px-10">
         {[40, 70, 50, 90, 65, 85].map((height, i) => (
            <motion.div
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${height}%` }}
               transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
               className="w-12 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg relative group"
            >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}%
               </div>
            </motion.div>
         ))}
         
         {/* LÍNIA DE TENDÈNCIA */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <motion.path
               d="M 40 120 L 100 60 L 160 90 L 220 30 L 280 70 L 340 40"
               fill="none"
               stroke="#10b981"
               strokeWidth="4"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.5 }}
            />
         </svg>
      </div>
   )
}