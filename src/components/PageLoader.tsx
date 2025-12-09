import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

type PageLoaderProps = {
  onComplete: () => void;
  onStartExit?: () => void;
};

const PageLoader = ({ onComplete, onStartExit }: PageLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const triggerExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    // Stelle Body-Scroll sofort wieder her, damit Scrollen möglich ist
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // Starte Landing Page sofort für nahtlosen Übergang
    onStartExit?.();
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 50);
    }, 800);
  }, [isExiting, onComplete, onStartExit]);

  useEffect(() => {
    // Verhindere Body-Scroll während des Loaders
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const videoEl = videoRef.current;
    videoEl?.play().catch(() => {
      // falls Autoplay blockiert wird, trotzdem weiter
      setTimeout(triggerExit, 1800);
    });

    const onEnded = () => triggerExit();
    const fallback = setTimeout(triggerExit, 6000);

    videoEl?.addEventListener("ended", onEnded);

    return () => {
      clearTimeout(fallback);
      videoEl?.removeEventListener("ended", onEnded);
      // Stelle Body-Scroll wieder her, wenn Komponente unmountet
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [triggerExit]);

  // Stelle Body-Scroll sofort wieder her, wenn Exit-Animation startet
  useEffect(() => {
    if (isExiting) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isExiting]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={
            isExiting
              ? { opacity: 0, scale: 1.01, filter: "blur(6px)" }
              : { opacity: 1, scale: 1 }
          }
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ 
            pointerEvents: isExiting ? "none" : "auto"
          }}
        >
          {/* Fullscreen Video */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/tmpzvsi_iju.mp4"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />
          </motion.div>

          {/* Logo Overlay */}
          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={isExiting ? { opacity: 0, y: -10, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: isExiting ? 0.4 : 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: isExiting ? 0 : 0.2,
            }}
          >
            <motion.h1
              className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={isExiting ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
              transition={{ duration: isExiting ? 0.35 : 0.6, delay: isExiting ? 0 : 0.35 }}
            >
              Falafel <span className="text-secondary">Kimo</span>
            </motion.h1>
            <motion.div
              className="h-1 w-24 bg-secondary mx-auto mt-4 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isExiting ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{
                duration: isExiting ? 0.25 : 0.5,
                delay: isExiting ? 0 : 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

