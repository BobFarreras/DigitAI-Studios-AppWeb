'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import Image from 'next/image';
// Assegura't de posar la imatge a public/images/hero.webp

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ... (La lògica del useEffect que tenies és correcta, la mantenim)
  useEffect(() => {
    // Lògica de visibilitat (copiada del teu codi original)
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !videoElement.paused) {
        videoElement.pause();
      } else if (!document.hidden && isPlaying) {
        videoElement.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  return (
    <section id="inici" className="pt-32 pb-20 min-h-screen flex items-center hero-pattern overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

        {/* Text Content */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Automatitza</span> el teu negoci.<br />
            Allibera temps.<br />
            <span className="gradient-text">Impulsa el futur.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transforma la teva petita empresa amb solucions d'intel·ligència artificial reals i pràctiques.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full gradient-bg hover:scale-105 transition-transform shadow-lg shadow-primary/25">
              Descobreix les Solucions
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-8 border-t pt-8 border-border/50">
            {[
              { value: "+50", label: "Empreses" },
              { value: "20h", label: "Estalvi/setmana" },
              { value: "150%", label: "Productivitat" }
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Video/Image Content */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
          <div className={`relative w-full aspect-video rounded-3xl shadow-2xl overflow-hidden border border-white/10 ${!showVideo ? 'animate-floating' : ''}`}>
            {showVideo ? (
              <div className="relative w-full h-full group">
                <video
                  ref={videoRef}
                  src="/videos/Presentacio_DAIS.mp4"
                  className="w-full h-full object-cover"
                  autoPlay muted={isMuted} loop playsInline
                />
                {/* Controls Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={48} /> : <Play size={48} />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="absolute bottom-4 right-4 text-white p-2 bg-black/50 rounded-full">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full cursor-pointer" onClick={() => setShowVideo(true)}>
    
                <Image
                  src="/images/hero.webp"  // Next.js sap que ha de buscar a la carpeta public
                  alt="Equip divers col·laborant"
                  fill
                  className="object-cover"
                  priority // Important per la imatge principal (LCP)
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayCircle className="w-20 h-20 text-white/80" />
                </div>
              </div>
            )}
          </div>

          {/* Floating Cards (Decoratives) */}
          <div className="absolute -bottom-6 -left-6 glass-effect p-4 rounded-xl flex items-center gap-3 animate-pulse-glow">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-sm">IA Activa 24/7</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}