'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing';

export function DiaryEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-3xl shadow-xl z-0"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🎉</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Tot llegit!</h3>
      <p className="text-muted-foreground mb-8 max-w-xs">
        Has vist les últimes novetats. Vols repassar-les o veure tot l'arxiu?
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" /> Repassar
        </Button>
        <Link href="/blog">
          <Button>Veure Tot el Blog</Button>
        </Link>
      </div>
    </motion.div>
  );
}