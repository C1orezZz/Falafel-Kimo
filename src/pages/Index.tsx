import { useState, lazy, Suspense } from 'react';
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

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <PageLoader
            key="loader"
            onStartExit={() => {
              // Stelle Scroll sofort wieder her
              document.body.style.overflow = '';
              document.documentElement.style.overflow = '';
              // Setze contentVisible sofort, damit Content scrollbar ist
              setContentVisible(true);
              // Warte kurz, damit Browser Layout neu berechnet
              requestAnimationFrame(() => {
                // Stelle sicher, dass Scrollen funktioniert
                window.scrollTo(0, 0);
              });
            }}
            onComplete={() => setShowLoader(false)}
          />
        )}
      </AnimatePresence>

      <Header />
      {/* Content ist immer vorhanden, auch wenn unsichtbar - damit Scrollen funktioniert */}
      <div
        className="min-h-screen bg-background"
        style={{ 
          position: 'relative',
          zIndex: 1,
          // Stelle sicher, dass der Content sofort scrollbar ist
          pointerEvents: 'auto',
          touchAction: 'pan-y'
        }}
      >
        <motion.div
          key="page"
          initial="hidden"
          animate={contentVisible ? 'show' : 'hidden'}
          variants={pageEnter}
          style={{ 
            opacity: contentVisible ? 1 : 0,
            // Verhindere, dass Animationen das Scrollen blockieren
            pointerEvents: 'auto'
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
