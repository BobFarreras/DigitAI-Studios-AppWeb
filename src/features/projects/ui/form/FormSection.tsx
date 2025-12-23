'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  delay?: number;
}

export function FormSection({ title, description, icon, children, delay = 0 }: FormSectionProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </motion.section>
  );
}