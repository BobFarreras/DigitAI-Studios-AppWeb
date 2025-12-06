'use client';

import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing';

export function DiaryEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-card/80 backdrop-blur-xl border border-border rounded-4xl shadow-2xl z-0"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <span className="text-4xl">🚀</span>
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-3">Estàs al dia!</h3>
      <p className="text-muted-foreground mb-8 max-w-xs text-lg">
        Has vist els nostres articles destacats. Vols veure més contingut?
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Button variant="outline" onClick={onReset} className="h-12 px-6 rounded-full border-2">
          <RotateCcw className="w-4 h-4 mr-2" /> Tornar a començar
        </Button>
        <Link href="/blog">
          <Button className="h-12 px-8 rounded-full shadow-lg shadow-primary/20">
            Veure Tot <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}