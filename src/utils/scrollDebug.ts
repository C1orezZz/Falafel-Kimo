/**
 * Umfassendes Scroll-Debugging Tool
 * Führt alle Tests durch, um Scroll-Probleme zu identifizieren
 */

export const initScrollDebug = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const WHEEL_LOG_LIMIT = 10;
  const WHEEL_LOG_EVERY = 20; // log every Nth after limit
  const SCROLL_LOG_LIMIT = 5;
  const SCROLL_LOG_EVERY = 20;

  console.log('🔍 === SCROLL DEBUG INITIALISIERT ===');

  // 1. EventListener prüfen
  console.log('\n1️⃣ === EVENT LISTENER PRÜFUNG ===');
  try {
    // @ts-ignore - getEventListeners ist eine Chrome DevTools Funktion
    if (typeof getEventListeners === 'function') {
      const docListeners = getEventListeners(document);
      const winListeners = getEventListeners(window);
      console.log('📋 Document Listeners:', docListeners);
      console.log('📋 Window Listeners:', winListeners);

      // Prüfe spezifische Event-Typen
      const criticalEvents = ['wheel', 'scroll', 'touchmove', 'keydown'];
      criticalEvents.forEach(eventType => {
        const docHasListener = docListeners?.[eventType]?.length > 0;
        const winHasListener = winListeners?.[eventType]?.length > 0;
        if (docHasListener || winHasListener) {
          console.warn(`⚠️ ${eventType} Listener gefunden!`, {
            document: docListeners?.[eventType],
            window: winListeners?.[eventType]
          });
        }
      });
    } else {
      console.warn('⚠️ getEventListeners nicht verfügbar (nur in Chrome DevTools)');
    }
  } catch (e) {
    console.warn('⚠️ Fehler beim Prüfen der Event Listener:', e);
  }

  // 2. preventDefault() Test beim ersten Scroll - TEMPORÄR DEAKTIVIERT FÜR DEBUG
  console.log('\n2️⃣ === PREVENTDEFAULT TEST ===');
  console.log('⚠️ Wheel-Event-Listener temporär deaktiviert für Debug');
  // let wheelEventCount = 0;
  // window.addEventListener(
  //   'wheel',
  //   (e: WheelEvent) => {
  //     wheelEventCount++;
  //     const isFirstScroll = wheelEventCount <= 2;
  //     const shouldLog =
  //       wheelEventCount <= WHEEL_LOG_LIMIT ||
  //       wheelEventCount % WHEEL_LOG_EVERY === 0 ||
  //       isFirstScroll;
  //     if (shouldLog) {
  //       console.log(`🔄 WHEEL EVENT #${wheelEventCount}`, {
  //         deltaY: e.deltaY,
  //         defaultPrevented: e.defaultPrevented,
  //         cancelable: e.cancelable,
  //         isFirstScroll,
  //         timestamp: Date.now()
  //       });
  //     }
  //     if (isFirstScroll && e.defaultPrevented) {
  //       console.error('❌ FEHLER IDENTIFIZIERT: preventDefault() wurde beim ersten Scroll aufgerufen!');
  //       console.trace('Stack Trace:');
  //     }
  //   },
  //   { passive: false, capture: true }
  // );

  // 3. Scroll-Container prüfen
  console.log('\n3️⃣ === SCROLL CONTAINER PRÜFUNG ===');
  
  // 3.1 CSS prüfen
  const htmlStyle = getComputedStyle(document.documentElement);
  const bodyStyle = getComputedStyle(document.body);
  console.log('📐 HTML overflow:', {
    overflow: htmlStyle.overflow,
    overflowX: htmlStyle.overflowX,
    overflowY: htmlStyle.overflowY,
    height: htmlStyle.height
  });
  console.log('📐 Body overflow:', {
    overflow: bodyStyle.overflow,
    overflowX: bodyStyle.overflowX,
    overflowY: bodyStyle.overflowY,
    height: bodyStyle.height
  });

  // 3.2 Alle scrollbaren Elemente finden
  const scrollableElements: Element[] = [];
  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    const hasScrollableOverflow =
      style.overflow.includes('scroll') ||
      style.overflow.includes('auto') ||
      style.overflowY.includes('scroll') ||
      style.overflowY.includes('auto') ||
      style.overflowX.includes('scroll') ||
      style.overflowX.includes('auto');

    if (hasScrollableOverflow && el !== document.documentElement && el !== document.body) {
      scrollableElements.push(el);
    }
  });

  if (scrollableElements.length > 0) {
    console.warn('⚠️ Scrollbare Elemente gefunden:', scrollableElements);
    scrollableElements.forEach(el => {
      const style = getComputedStyle(el);
      console.log(`  - ${el.tagName}.${el.className}:`, {
        overflow: style.overflow,
        scrollHeight: (el as HTMLElement).scrollHeight,
        clientHeight: (el as HTMLElement).clientHeight
      });
    });
  } else {
    console.log('✅ Keine zusätzlichen scrollbaren Container gefunden');
  }

  // 4. Scroll Snap prüfen
  console.log('\n4️⃣ === SCROLL SNAP PRÜFUNG ===');
  const snapElements: Element[] = [];
  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    if (
      style.scrollSnapType !== 'none' ||
      style.scrollSnapAlign !== 'none' ||
      style.scrollSnapStop !== 'normal'
    ) {
      snapElements.push(el);
    }
  });

  if (snapElements.length > 0) {
    console.warn('⚠️ Scroll Snap gefunden:', snapElements);
    snapElements.forEach(el => {
      const style = getComputedStyle(el);
      console.log(`  - ${el.tagName}.${el.className}:`, {
        scrollSnapType: style.scrollSnapType,
        scrollSnapAlign: style.scrollSnapAlign,
        scrollSnapStop: style.scrollSnapStop
      });
    });
  } else {
    console.log('✅ Kein Scroll Snap gefunden');
  }

  // 5. Zustand nach Footer prüfen
  console.log('\n5️⃣ === FOOTER-ZUSTAND PRÜFUNG ===');
  const footerKeywords = [
    'footer', 'reach', 'end', 'snap', 'lock', 'unlocked',
    'hasVisitedFooter', 'isAtBottom', 'scrollLock', 'blockScroll',
    'initialScroll', 'reachedFooter', 'footerReached', 'atFooter'
  ];

  // Prüfe im Window-Objekt
  const windowKeys = Object.keys(window).filter(key =>
    footerKeywords.some(keyword => key.toLowerCase().includes(keyword.toLowerCase()))
  );
  if (windowKeys.length > 0) {
    console.warn('⚠️ Footer-bezogene Window-Variablen gefunden:', windowKeys);
  }

  // Prüfe im Document
  const footerElements = document.querySelectorAll('[id*="footer"], [class*="footer"]');
  if (footerElements.length > 0) {
    console.log('📄 Footer-Elemente gefunden:', footerElements);
  }

  // 6. IntersectionObserver prüfen
  console.log('\n6️⃣ === INTERSECTION OBSERVER PRÜFUNG ===');
  // Versuche alle Observer zu finden (schwierig ohne direkten Zugriff)
  const footerObserver = document.querySelector('footer');
  if (footerObserver) {
    console.log('📄 Footer-Element vorhanden:', footerObserver);
    // Prüfe ob Footer beobachtet wird (indirekt durch Framer Motion)
    console.log('ℹ️ Hinweis: Framer Motion verwendet IntersectionObserver für whileInView');
  }

  // 7. Smooth-Scroll Libraries prüfen
  console.log('\n7️⃣ === SMOOTH-SCROLL LIBRARIES PRÜFUNG ===');
  const libraries = [
    'Lenis',
    'locomotive',
    'SmoothScroll',
    'ScrollTrigger',
    'Swiper',
    'fullpage'
  ];

  const foundLibraries: string[] = [];
  libraries.forEach(lib => {
    // @ts-ignore
    if (window[lib] || document.querySelector(`[class*="${lib.toLowerCase()}"]`)) {
      foundLibraries.push(lib);
    }
  });

  if (foundLibraries.length > 0) {
    console.warn('⚠️ Smooth-Scroll Libraries gefunden:', foundLibraries);
  } else {
    console.log('✅ Keine Smooth-Scroll Libraries gefunden');
  }

  // 8. ScrollTop-Logging - TEMPORÄR DEAKTIVIERT FÜR DEBUG
  console.log('\n8️⃣ === SCROLLTOP LOGGING ===');
  console.log('⚠️ Scroll-Event-Listener temporär deaktiviert für Debug');
  // let lastScrollTop = document.documentElement.scrollTop;
  // let scrollEventCount = 0;
  // const scrollHandler = () => {
  //   scrollEventCount++;
  //   const currentScrollTop = document.documentElement.scrollTop;
  //   const changed = currentScrollTop !== lastScrollTop;
  //   const shouldLog =
  //     scrollEventCount <= SCROLL_LOG_LIMIT ||
  //     scrollEventCount % SCROLL_LOG_EVERY === 0 ||
  //     !changed;
  //   if (shouldLog) {
  //     console.log(`📊 Scroll Event #${scrollEventCount}:`, {
  //       scrollTop: currentScrollTop,
  //       changed,
  //       bodyScrollTop: document.body.scrollTop,
  //       timestamp: Date.now()
  //     });
  //   }
  //   if (!changed && scrollEventCount <= 3) {
  //     console.warn('⚠️ ScrollTop ändert sich nicht beim ersten Scroll!');
  //   }
  //   lastScrollTop = currentScrollTop;
  // };
  // document.addEventListener('scroll', scrollHandler, { passive: true });
  // window.addEventListener('scroll', scrollHandler, { passive: true });

  // 9. Hard Test: stopPropagation (nur für Test, später entfernen)
  console.log('\n9️⃣ === HARD TEST: STOP PROPAGATION ===');
  console.log('ℹ️ Dieser Test wird NICHT aktiviert, da er alle Events blockieren würde');
  console.log('ℹ️ Falls nötig, manuell aktivieren: document.addEventListener("wheel", e => e.stopPropagation(), true);');

  // 10. Body forced scroll Test
  console.log('\n🔟 === BODY FORCED SCROLL TEST ===');
  const originalHtmlOverflow = htmlStyle.overflow;
  const originalBodyOverflow = bodyStyle.overflow;
  console.log('📐 Original Werte:', {
    htmlOverflow: originalHtmlOverflow,
    bodyOverflow: originalBodyOverflow
  });

  // Testweise setzen (kann später entfernt werden)
  console.log('ℹ️ Test: Setze overflow: auto !important');
  const testStyle = document.createElement('style');
  testStyle.id = 'scroll-debug-test';
  testStyle.textContent = `
    html, body {
      overflow: auto !important;
    }
  `;
  // Nicht automatisch einfügen, nur vorbereiten
  console.log('ℹ️ Um diesen Test zu aktivieren, füge manuell ein:');
  console.log('   document.head.appendChild(testStyle);');

  console.log('\n✅ === SCROLL DEBUG INITIALISIERT ===');
  console.log('📊 Alle Debug-Informationen werden in der Konsole ausgegeben');
  console.log('🔄 Scrollen Sie, um die Tests zu sehen\n');

  // Globale Test-Funktionen für manuelle Ausführung
  // @ts-ignore
  window.__scrollDebug = {
    // Test 9: Hard Test mit stopPropagation
    testStopPropagation: () => {
      console.log('🧪 Test 9: Aktiviere stopPropagation auf allen wheel Events');
      const handler = (e: WheelEvent) => {
        console.log('🛑 stopPropagation aufgerufen:', e);
        e.stopPropagation();
      };
      document.addEventListener('wheel', handler, true);
      console.log('✅ stopPropagation aktiviert. Scrollen Sie jetzt.');
      console.log('ℹ️ Um zu deaktivieren: window.__scrollDebug.removeStopPropagation()');
      // @ts-ignore
      window.__scrollDebug.removeStopPropagation = () => {
        document.removeEventListener('wheel', handler, true);
        console.log('✅ stopPropagation deaktiviert');
      };
    },

    // Test 10: Body forced scroll
    testForcedScroll: () => {
      console.log('🧪 Test 10: Setze overflow: auto !important auf html und body');
      const testStyle = document.createElement('style');
      testStyle.id = 'scroll-debug-forced-scroll';
      testStyle.textContent = `
        html, body {
          overflow: auto !important;
        }
      `;
      document.head.appendChild(testStyle);
      console.log('✅ Forced scroll aktiviert. Scrollen Sie jetzt.');
      console.log('ℹ️ Um zu deaktivieren: window.__scrollDebug.removeForcedScroll()');
      // @ts-ignore
      window.__scrollDebug.removeForcedScroll = () => {
        const el = document.getElementById('scroll-debug-forced-scroll');
        if (el) el.remove();
        console.log('✅ Forced scroll deaktiviert');
      };
    },

    // Alle scrollbaren Elemente finden
    findScrollableElements: () => {
      console.log('🔍 Suche nach allen scrollbaren Elementen...');
      const scrollable: Array<{ element: Element; styles: any }> = [];
      document.querySelectorAll('*').forEach(el => {
        const style = getComputedStyle(el);
        const hasScrollableOverflow =
          style.overflow.includes('scroll') ||
          style.overflow.includes('auto') ||
          style.overflowY.includes('scroll') ||
          style.overflowY.includes('auto') ||
          style.overflowX.includes('scroll') ||
          style.overflowX.includes('auto');

        if (hasScrollableOverflow) {
          const htmlEl = el as HTMLElement;
          scrollable.push({
            element: el,
            styles: {
              overflow: style.overflow,
              overflowY: style.overflowY,
              overflowX: style.overflowX,
              scrollHeight: htmlEl.scrollHeight,
              clientHeight: htmlEl.clientHeight,
              scrollTop: htmlEl.scrollTop,
              canScroll: htmlEl.scrollHeight > htmlEl.clientHeight
            }
          });
        }
      });
      console.table(scrollable.map(s => ({
        tag: s.element.tagName,
        class: s.element.className,
        id: s.element.id,
        ...s.styles
      })));
      return scrollable;
    },

    // Event Listener manuell prüfen
    checkEventListeners: () => {
      console.log('🔍 Prüfe Event Listener...');
      try {
        // @ts-ignore
        if (typeof getEventListeners === 'function') {
          const docListeners = getEventListeners(document);
          const winListeners = getEventListeners(window);
          console.log('Document Listeners:', docListeners);
          console.log('Window Listeners:', winListeners);
          return { document: docListeners, window: winListeners };
        } else {
          console.warn('getEventListeners nur in Chrome DevTools verfügbar');
          console.log('Öffnen Sie Chrome DevTools und führen Sie aus:');
          console.log('  getEventListeners(document)');
          console.log('  getEventListeners(window)');
        }
      } catch (e) {
        console.error('Fehler:', e);
      }
    }
  };

  console.log('💡 Manuelle Tests verfügbar:');
  console.log('   window.__scrollDebug.testStopPropagation() - Test 9');
  console.log('   window.__scrollDebug.testForcedScroll() - Test 10');
  console.log('   window.__scrollDebug.findScrollableElements() - Alle scrollbaren Elemente');
  console.log('   window.__scrollDebug.checkEventListeners() - Event Listener prüfen\n');

  return {
    cleanup: () => {
      document.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('scroll', scrollHandler);
      const testStyleEl = document.getElementById('scroll-debug-test');
      if (testStyleEl) {
        testStyleEl.remove();
      }
      // @ts-ignore
      delete window.__scrollDebug;
    }
  };
};

