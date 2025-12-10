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
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Funktion zum Bereinigen des Video-Elements
  const cleanupVideo = useCallback(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      try {
        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl.removeAttribute('src');
        videoEl.load(); // Entlädt das Video-Element
      } catch (error) {
        console.warn('Fehler beim Bereinigen des Videos:', error);
      }
    }
  }, []);

  const triggerExit = useCallback(() => {
    if (isExiting) return;
    
    setIsExiting(true);
    
    // Video-Element bereinigen
    cleanupVideo();
    
    document.documentElement.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    
    document.body.style.setProperty('overflow', 'visible', 'important');
    document.body.style.setProperty('overflow-y', 'visible', 'important');
    document.body.style.setProperty('overflow-x', 'hidden', 'important');
    
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.setProperty('overflow-y', 'visible', 'important');
      rootEl.style.setProperty('height', 'auto', 'important');
    }
    
    document.body.style.removeProperty('position');
    document.documentElement.style.removeProperty('position');
    document.body.style.removeProperty('height');
    document.documentElement.style.removeProperty('height');
    
    window.scrollTo(0, 0);
    
    onStartExit?.();
    setIsVisible(false);
    
    setTimeout(() => {
      onComplete();
    }, 50);
  }, [isExiting, onComplete, onStartExit, cleanupVideo]);

  // Funktion zum Initialisieren und Abspielen des Videos
  const initializeVideo = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl || isExiting) return;

    // Stelle sicher, dass das Video-Element in einem sauberen Zustand ist
    if (videoEl.readyState >= 2) {
      // Video ist bereits geladen, versuche abzuspielen
      videoEl.play().catch((error) => {
        console.warn('Video konnte nicht abgespielt werden:', error);
        // Bei Fehler: Fallback nach kurzer Verzögerung
        setTimeout(triggerExit, 1800);
      });
    } else {
      // Warte auf das loadeddata Event
      const onLoadedData = () => {
        videoEl.play().catch((error) => {
          console.warn('Video konnte nach Laden nicht abgespielt werden:', error);
          setTimeout(triggerExit, 1800);
        });
      };

      videoEl.addEventListener('loadeddata', onLoadedData, { once: true });
      
      // Fallback: Wenn das Video nach 3 Sekunden nicht geladen ist
      const loadTimeout = setTimeout(() => {
        if (videoEl.readyState < 2) {
          console.warn('Video konnte nicht geladen werden, verwende Fallback');
          triggerExit();
        }
      }, 3000);

      return () => {
        clearTimeout(loadTimeout);
        videoEl.removeEventListener('loadeddata', onLoadedData);
      };
    }
  }, [isExiting, triggerExit]);

  useEffect(() => {
    if (isExiting) {
      return;
    }

    // Retry-Counter zurücksetzen bei neuer Initialisierung
    retryCountRef.current = 0;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Event-Handler für Video-Events
    const onEnded = () => {
      triggerExit();
    };

    const onError = (event: Event) => {
      console.warn('Video-Fehler aufgetreten:', event);
      retryCountRef.current += 1;
      
      if (retryCountRef.current < maxRetries) {
        // Versuche das Video neu zu laden
        setTimeout(() => {
          try {
            videoEl.load();
            initializeVideo();
          } catch (error) {
            console.warn('Fehler beim Neuladen des Videos:', error);
            triggerExit();
          }
        }, 1000 * retryCountRef.current);
      } else {
        // Nach max. Retries: Fallback verwenden
        console.warn('Maximale Anzahl von Wiederholungen erreicht, verwende Fallback');
        triggerExit();
      }
    };

    const onStalled = () => {
      console.warn('Video-Wiedergabe gestoppt (stalled)');
      // Versuche das Video neu zu starten
      if (videoEl.readyState >= 2) {
        videoEl.play().catch(() => {
          triggerExit();
        });
      }
    };

    const onWaiting = () => {
      // Video wartet auf Daten, aber nicht kritisch
      console.debug('Video wartet auf Daten');
    };

    const fallback = setTimeout(() => {
      triggerExit();
    }, 6000);

    // Event-Listener hinzufügen
    videoEl.addEventListener("ended", onEnded);
    videoEl.addEventListener("error", onError);
    videoEl.addEventListener("stalled", onStalled);
    videoEl.addEventListener("waiting", onWaiting);

    // Video initialisieren
    const cleanupInit = initializeVideo();

    return () => {
      clearTimeout(fallback);
      // Alle Event-Listener entfernen
      videoEl.removeEventListener("ended", onEnded);
      videoEl.removeEventListener("error", onError);
      videoEl.removeEventListener("stalled", onStalled);
      videoEl.removeEventListener("waiting", onWaiting);
      
      // Cleanup-Funktion für initializeVideo aufrufen
      if (cleanupInit) cleanupInit();
      
      // Video-Element bereinigen
      cleanupVideo();
      
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
      document.body.style.setProperty('overflow-y', 'visible', 'important');
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.style.setProperty('overflow-y', 'visible', 'important');
      }
    };
  }, [triggerExit, isExiting, initializeVideo, cleanupVideo]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black"
          initial={{ opacity: 1 }}
          animate={
            isExiting
              ? { 
                  opacity: 0, 
                  scale: 1.01, 
                  filter: "blur(6px)",
                  x: "100vw" // Verschiebe komplett aus dem Viewport
                }
              : { opacity: 1, scale: 1, x: 0 }
          }
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)", x: "100vw" }}
          transition={{ duration: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ 
            pointerEvents: isExiting ? "none" : "auto",
            touchAction: isExiting ? "pan-y" : "none",
            // Stelle sicher, dass der PageLoader das Scrollen nicht blockiert
            willChange: isExiting ? "transform, opacity" : "auto",
            // Entferne komplett aus dem Viewport, wenn exiting
            display: isExiting ? "none" : "flex",
            // Stelle sicher, dass der PageLoader das Scrollen nicht blockiert, wenn er ausgeblendet wird
            visibility: isExiting ? "hidden" : "visible"
          }}
        >
          {/* Fullscreen Video */}
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/tmpzvsi_iju.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

