import { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import { pageEnter } from '@/lib/animations';

const Hero = lazy(() => import('@/components/Hero'));
const About = lazy(() => import('@/components/About'));
const Menu = lazy(() => import('@/components/Menu'));
const OpeningHours = lazy(() => import('@/components/OpeningHours'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = () => {
  const [contentVisible, setContentVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollEnabledRef = useRef(false);

  // Debug-Logging Funktion
  const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Scroll Debug] ${message}`, data || '');
    }
  };

  // Funktion zum Aktivieren des Scrollens
  const enableScroll = useCallback(() => {
    if (scrollEnabledRef.current) return;
    
    debugLog('Aktiviere Scrollen...');
    
    // Entferne alle möglichen Blockaden und setze explizite Werte
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = '';
    document.documentElement.style.position = '';
    document.body.style.height = '';
    document.documentElement.style.height = '';
    document.body.style.width = '';
    document.documentElement.style.width = '';
    // Setze overscroll-behavior explizit auf 'auto', um Scroll-Momentum zu ermöglichen
    document.body.style.overscrollBehavior = 'auto';
    document.documentElement.style.overscrollBehavior = 'auto';
    // Stelle sicher, dass scroll-behavior nicht das Scrollen blockiert
    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Stelle sicher, dass wir bei Position 0 starten
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    // Force Browser to recalculate layout
    void document.body.offsetHeight;
    void document.documentElement.offsetHeight;
    
    const bodyHeight = document.body.scrollHeight;
    const htmlHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    
    debugLog('Dokumenthöhen-Berechnung', {
      bodyHeight,
      htmlHeight,
      viewportHeight,
      isScrollable: bodyHeight > viewportHeight || htmlHeight > viewportHeight
    });
    
    scrollEnabledRef.current = true;
    debugLog('Scrollen aktiviert');
  }, []);

  // ResizeObserver, um sicherzustellen, dass die Dokumenthöhe korrekt berechnet wurde
  useEffect(() => {
    if (!contentVisible || !contentRef.current) return;

    debugLog('ResizeObserver wird eingerichtet...');
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        debugLog('ResizeObserver: Größe geändert', {
          contentHeight: height,
          scrollHeight,
          viewportHeight,
          isScrollable: scrollHeight > viewportHeight
        });
        
        // Wenn Content geladen ist und höher als Viewport, aktiviere Scrollen
        if (scrollHeight > viewportHeight && !scrollEnabledRef.current) {
          enableScroll();
        }
      }
    });

    resizeObserver.observe(contentRef.current);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    // Fallback: Aktiviere Scrollen nach kurzer Verzögerung, falls ResizeObserver nicht auslöst
    const fallbackTimeout = setTimeout(() => {
      if (!scrollEnabledRef.current) {
        debugLog('Fallback: Aktiviere Scrollen nach Timeout');
        enableScroll();
      }
    }, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [contentVisible, enableScroll]);

  // Scroll-Event-Listener für Debugging und zur Verhinderung von Blockaden
  useEffect(() => {
    if (!contentVisible) return;

    let lastScrollY = window.scrollY;
    let lastDeltaY = 0;
    let scrollDirection: 'up' | 'down' | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newDirection = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : scrollDirection;
      
      if (newDirection !== scrollDirection) {
        debugLog('Scroll-Richtung geändert', {
          from: scrollDirection,
          to: newDirection,
          scrollY: currentScrollY
        });
        scrollDirection = newDirection;
      }
      
      lastScrollY = currentScrollY;
      
      debugLog('Scroll-Event', {
        scrollY: currentScrollY,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        direction: scrollDirection
      });
    };

    const handleWheel = (e: WheelEvent) => {
      const currentDeltaY = e.deltaY;
      const newDirection = currentDeltaY > 0 ? 'down' : currentDeltaY < 0 ? 'up' : null;
      
      // Wenn sich die Scroll-Richtung ändert, stelle sicher, dass das Event nicht blockiert wird
      if (newDirection && newDirection !== scrollDirection && lastDeltaY !== 0) {
        debugLog('Wheel-Richtung geändert - stelle sicher, dass Event nicht blockiert wird', {
          from: scrollDirection,
          to: newDirection,
          deltaY: currentDeltaY,
          lastDeltaY
        });
        
        // Stelle sicher, dass overscroll-behavior korrekt gesetzt ist
        if (document.documentElement.style.overscrollBehavior !== 'auto') {
          document.documentElement.style.overscrollBehavior = 'auto';
          document.body.style.overscrollBehavior = 'auto';
        }
      }
      
      lastDeltaY = currentDeltaY;
      
      debugLog('Wheel-Event', {
        deltaY: currentDeltaY,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        direction: newDirection
      });
    };

    // Verwende passive Listeners für bessere Performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [contentVisible]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <PageLoader
            key="loader"
            onStartExit={() => {
              debugLog('PageLoader: onStartExit aufgerufen');
              // Setze contentVisible sofort, damit Content scrollbar ist
              setContentVisible(true);
              
              // Aktiviere Scrollen nach kurzer Verzögerung, damit der Browser das Layout berechnen kann
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  enableScroll();
                });
              });
            }}
            onComplete={() => {
              debugLog('PageLoader: onComplete aufgerufen');
              setShowLoader(false);
            }}
          />
        )}
      </AnimatePresence>

      <Header />
      {/* Content ist immer vorhanden, auch wenn unsichtbar - damit Scrollen funktioniert */}
      <div
        ref={contentRef}
        className="min-h-screen bg-background"
        style={{ 
          position: 'relative',
          zIndex: 1,
          // Stelle sicher, dass der Content sofort scrollbar ist
          pointerEvents: 'auto',
          touchAction: 'pan-y',
          // Stelle sicher, dass overscroll-behavior korrekt gesetzt ist
          overscrollBehavior: 'auto',
          scrollBehavior: 'auto'
        }}
      >
        <motion.div
          key="page"
          initial="hidden"
          animate={contentVisible ? 'show' : 'hidden'}
          variants={pageEnter}
          layout={false}
          style={{ 
            opacity: contentVisible ? 1 : 0,
            // Verhindere, dass Animationen das Scrollen blockieren
            pointerEvents: 'auto',
            // Optimiere für Scroll-Performance
            willChange: contentVisible ? 'opacity' : 'auto'
          }}
        >
          <main>
            <Suspense fallback={null}>
              <Hero />
            </Suspense>
            <Suspense fallback={null}>
              <About />
            </Suspense>
            <Suspense fallback={null}>
              <Menu />
            </Suspense>
            <Suspense fallback={null}>
              <OpeningHours />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </motion.div>
      </div>
    </>
  );
};

export default Index;
