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
            onStartExit={() => setContentVisible(true)}
            onComplete={() => setShowLoader(false)}
          />
        )}
      </AnimatePresence>

      <Header />
      <motion.div
        key="page"
        className="min-h-screen bg-background"
        initial="hidden"
        animate={contentVisible ? 'show' : 'hidden'}
        variants={pageEnter}
        style={{ opacity: contentVisible ? 1 : 0 }}
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
    </>
  );
};

export default Index;
