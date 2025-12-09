import { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';

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

  // Funktion zum Aktivieren des Scrollens
  const enableScroll = useCallback(() => {
    if (scrollEnabledRef.current) {
      return;
    }

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
    
    void document.body.offsetHeight;
    void document.documentElement.offsetHeight;
    
    scrollEnabledRef.current = true;
  }, []);

  // ResizeObserver, um sicherzustellen, dass die Dokumenthöhe korrekt berechnet wurde
  useEffect(() => {
    if (!contentVisible || !contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        if (scrollHeight > viewportHeight && !scrollEnabledRef.current) {
          enableScroll();
        }
      }
    });

    resizeObserver.observe(contentRef.current);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    const fallbackTimeout = setTimeout(() => {
      if (!scrollEnabledRef.current) {
        enableScroll();
      }
    }, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, [contentVisible, enableScroll]);

  // Überwache #root, um sicherzustellen, dass es nicht scrollbar wird
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const ensureRootNotScrollable = () => {
      const computedStyle = getComputedStyle(rootEl);
      if (computedStyle.overflowY !== 'visible' && computedStyle.overflowY !== 'hidden') {
        rootEl.style.setProperty('overflow-y', 'visible', 'important');
        rootEl.style.setProperty('height', 'auto', 'important');
        rootEl.style.setProperty('max-height', 'none', 'important');
      }
    };

    // Prüfe sofort
    ensureRootNotScrollable();

    // Überwache Style-Änderungen an #root
    const mutationObserver = new MutationObserver(() => {
      ensureRootNotScrollable();
    });

    mutationObserver.observe(rootEl, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false,
    });

    // Prüfe regelmäßig (als Fallback)
    const intervalId = setInterval(ensureRootNotScrollable, 500);

    return () => {
      mutationObserver.disconnect();
      clearInterval(intervalId);
    };
  }, [contentVisible]);

  // Sicherheits-Check: Stelle sicher, dass html immer scrollbar ist
  useEffect(() => {
    if (!contentVisible) return;

    const timeout = setTimeout(() => {
      const htmlOverflow = getComputedStyle(document.documentElement).overflowY;
      if (htmlOverflow === 'hidden') {
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [contentVisible]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <PageLoader
            key="loader"
            onStartExit={() => {
              setContentVisible(true);
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  enableScroll();
                });
              });
            }}
            onComplete={() => {
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
          pointerEvents: 'auto',
          touchAction: 'pan-y',
          overscrollBehavior: 'auto',
          scrollBehavior: 'auto',
          overflow: 'visible'
        }}
      >
        <div
          key="page"
          style={{ 
            opacity: contentVisible ? 1 : 0,
            pointerEvents: 'auto',
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
        </div>
      </div>
    </>
  );
};

export default Index;
