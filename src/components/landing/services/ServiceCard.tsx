'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass?: string; // Ex: "text-blue-600"
  wrapperClass?: string;   // Ex: "md:col-span-2"
  children?: React.ReactNode; // El Mockup visual
  cta?: string; // Text del botó opcional
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  iconColorClass = "text-primary",
  wrapperClass,
  children,
  cta,
  delay = 0
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 flex flex-col",
        wrapperClass
      )}
    >
      <div className="p-6 flex-1 z-10 flex flex-col h-full">
        {/* Icona */}
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-4 border transition-colors",
          "bg-muted/50 border-border group-hover:border-primary/20", 
          // Aquí podríem fer servir classes dinàmiques de Tailwind si calgués, 
          // però el bg-muted/50 és més net per defecte.
        )}>
          <Icon className={cn("w-5 h-5", iconColorClass)} />
        </div>

        {/* Textos */}
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 grow">
          {description}
        </p>

        {/* CTA Opcional */}
        {cta && (
          <button className={cn(
            "text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto",
            iconColorClass
          )}>
            {cta} <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Àrea del Mockup Visual */}
      {children && (
        <div className="relative w-full mt-auto">
           {children}
        </div>
      )}
    </motion.div>
  );
}