'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, List, Search, MoreHorizontal, Plus, UserCircle } from 'lucide-react';

export function WebMockup() {
  return (
    // CONTENIDOR PRINCIPAL: Ocupa tot l'ample i s'enganxa a baix
    <div className="w-full mt-6 -mb-1 relative">
      
      {/* 🖥️ FINESTRA NAVEGADOR (Full Width) */}
      <div className="w-full bg-slate-100 dark:bg-[#0b0d14] rounded-t-xl border-t border-x border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Browser Chrome (Barra Superior) */}
        <div className="h-9 bg-white dark:bg-[#151925] border-b border-slate-200 dark:border-white/5 flex items-center px-4 justify-between shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          
          {/* Fake URL Bar - Responsive */}
          <div className="hidden sm:flex flex-1 mx-4 h-6 bg-slate-100 dark:bg-white/5 rounded-md items-center px-3 max-w-sm border border-slate-200 dark:border-white/5">
            <div className="w-3 h-3 text-slate-400 mr-2"><Search className="w-3 h-3" /></div>
            <div className="h-1.5 w-24 bg-slate-300 dark:bg-white/10 rounded-full"></div>
          </div>

          <div className="flex items-center gap-2">
             <div className="h-2 w-8 bg-slate-200 dark:bg-white/10 rounded-full hidden sm:block"></div>
             <UserCircle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        {/* 🧩 UI DASHBOARD (App Layout) */}
        <div className="flex flex-1 min-h-[220px] bg-slate-50/50 dark:bg-transparent relative overflow-hidden">
            
            {/* Sidebar (Esquerra) */}
            <div className="w-14 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#151925] flex flex-col items-center py-4 gap-4 z-10">
                <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
                    <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <List className="w-5 h-5" />
                </div>
                <div className="mt-auto p-2 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/30">
                    <Plus className="w-4 h-4" />
                </div>
            </div>

            {/* Main Content (Grid Responsive) */}
            <div className="flex-1 p-4 md:p-6 overflow-hidden relative">
                
                {/* Header Content */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="h-2 w-16 bg-blue-500/20 rounded-full mb-2"></div>
                        <div className="h-5 w-32 bg-slate-800 dark:bg-white rounded-md"></div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0b0d14] bg-slate-200 dark:bg-slate-700"></div>
                        ))}
                    </div>
                </div>

                {/* KANBAN BOARD / GRID WIDGETS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Column 1: To Do */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <span>To Do</span>
                            <MoreHorizontal className="w-3 h-3" />
                        </div>
                        
                        {/* Task Card 1 */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-[#1e2330] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-default group"
                        >
                            <div className="flex gap-2 mb-2">
                                <span className="w-8 h-1.5 rounded-full bg-orange-400/20"></span>
                                <span className="w-4 h-1.5 rounded-full bg-blue-400/20"></span>
                            </div>
                            <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-600 rounded-full mb-1"></div>
                            <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                            
                            {/* Hover Reveal Action */}
                            <div className="mt-3 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-[9px] text-slate-400">Dec 12</div>
                            </div>
                        </motion.div>

                        {/* Task Card 2 (Skeleton) */}
                        <div className="bg-slate-200/50 dark:bg-white/5 p-3 rounded-lg border border-transparent h-24 animate-pulse"></div>
                    </div>

                    {/* Column 2: In Progress (Mobile amagat si és molt estret, visible en tablet) */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <span>In Progress</span>
                            <MoreHorizontal className="w-3 h-3" />
                        </div>

                        {/* Active Task Card */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-[#1e2330] p-3 rounded-lg border-l-4 border-l-blue-500 border-y border-r border-slate-200 dark:border-r-white/5 dark:border-y-white/5 shadow-lg relative"
                        >
                            {/* Cursor Interactiu */}
                            <motion.div 
                                animate={{ x: [10, 40, 10], y: [10, 30, 10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-2 -bottom-2 z-20 pointer-events-none drop-shadow-xl"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="#3b82f6" stroke="white" />
                                </svg>
                                <div className="absolute top-4 left-2 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm">You</div>
                            </motion.div>

                            <div className="h-2 w-full bg-slate-800 dark:bg-slate-300 rounded-full mb-2"></div>
                            <div className="h-24 w-full bg-blue-50 dark:bg-blue-500/10 rounded border border-blue-100 dark:border-blue-500/20 mb-2 flex items-center justify-center">
                                <div className="text-[9px] text-blue-500 font-bold">LIVE PREVIEW</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 3: Done (Només Desktop o Tablet gran) */}
                    <div className="hidden md:block space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <span>Done</span>
                            <div className="text-green-500 text-[10px]">98%</div>
                        </div>
                        
                        {[1, 2].map((i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 0.6, x: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5 opacity-60 grayscale"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full border border-slate-400 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <div className="h-1.5 w-20 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}