'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control de reproducció en canviar de pestanya
  useEffect(() => {
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
    <section id="inici" className="pt-32 pb-20 min-h-screen flex items-center hero-pattern overflow-hidden relative">

      {/* Element de fons (opcional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        {/* COLUMNA ESQUERRA: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >


          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Creem la teva <span className="gradient-text">AppWeb</span>.<br />
            Automatitzem el <span className="text-foreground">dia a dia</span>.
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
            Deixa de perdre temps en tasques manuals.
            Desenvolupem plataformes a mida i t'ensenyem a utilitzar la IA per escalar el teu negoci.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#contacte">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full gradient-bg hover:opacity-90 shadow-lg shadow-primary/20 transition-all w-full sm:w-auto text-white border-0">
                Parlem del teu Projecte
              </Button>
            </Link>
            <Link href="#audit">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-input bg-background hover:bg-muted text-foreground w-full sm:w-auto">
                Auditoria Gratuïta
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* COLUMNA DRETA: Marc del Vídeo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* 🛠️ FIX: Ús de variables semàntiques (bg-card, border-border)
              Això farà que agafi el color lila fosc del teu globals.css en Dark Mode
              i el color blanc en Light Mode automàticament.
          */}
          <div className={`relative w-full aspect-video bg-card rounded-xl border border-border shadow-2xl overflow-hidden group transition-colors duration-300 ${!showVideo ? 'animate-floating' : ''}`}>

            {/* Barra superior estil navegador (Ara s'adapta al tema) */}
            <div className="h-8 border-b border-border bg-muted/50 flex items-center px-4 gap-2 z-20 relative transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              {/* URL Bar */}
              <div className="ml-4 px-3 py-0.5 rounded bg-background/50 text-[10px] text-muted-foreground font-mono border border-border hidden sm:block">
                digitai-studios.app
              </div>
            </div>

            {/* Contingut del Vídeo */}
            <div className="relative w-full h-[calc(100%-2rem)] bg-black"> {/* El fons del vídeo sempre negre */}
              {showVideo ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    // 👇 Això ens ajudarà a saber si falla
                    onError={(e) => console.error("Error carregant vídeo:", e)}
                  >
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                    {/* Fallback si el format falla */}
                    El teu navegador no suporta vídeos.
                  </video>

                  {/* Controls Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform p-4 bg-white/10 rounded-full border border-white/20">
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="absolute bottom-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full cursor-pointer group-hover:opacity-90 transition-opacity" onClick={() => setShowVideo(true)}>
                  <Image
                    src="/images/hero.webp"
                    alt="Equip divers col·laborant"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="w-20 h-20 text-white/80 drop-shadow-lg" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Cards (Decoratives) - Adaptades al tema */}
          <div className="absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-md border border-border p-4 rounded-xl flex items-center gap-3 animate-pulse-glow shadow-xl z-30 transition-colors">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute opacity-75"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ESTAT</div>
              <span className="font-medium text-sm text-foreground">Sistemes Operatius</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}