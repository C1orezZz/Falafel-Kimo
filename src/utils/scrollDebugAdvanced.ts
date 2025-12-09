/**
 * Erweiterte Scroll-Debug-Funktion
 * Trackt alle Scroll-bezogenen Events mit vollständigen Details
 * Identifiziert Event-Delays und preventDefault() Aufrufe
 */

export const initAdvancedScrollDebug = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.log('🔬 === ERWEITERTE SCROLL-DEBUG INITIALISIERT ===\n');

  const eventLog: Array<{
    type: 'wheel' | 'scroll' | 'preventDefault' | 'cssChange' | 'intersection';
    timestamp: number;
    data: any;
    stack?: string;
  }> = [];

  let lastWheelTime = 0;
  let lastScrollTime = 0;
  let wheelEventCount = 0;
  let scrollEventCount = 0;

  // 1. Wheel-Event Tracking mit vollständigen Details
  const wheelHandler = (e: WheelEvent) => {
    wheelEventCount++;
    const now = performance.now();
    const timeSinceLastWheel = lastWheelTime > 0 ? now - lastWheelTime : 0;
    lastWheelTime = now;

    const wheelData = {
      eventNumber: wheelEventCount,
      deltaY: e.deltaY,
      deltaX: e.deltaX,
      deltaZ: e.deltaZ,
      deltaMode: e.deltaMode,
      defaultPrevented: e.defaultPrevented,
      cancelable: e.cancelable,
      bubbles: e.bubbles,
      timeStamp: e.timeStamp,
      performanceTime: now,
      timeSinceLastWheel,
      target: e.target?.constructor?.name || 'unknown',
      currentTarget: e.currentTarget?.constructor?.name || 'unknown',
      phase: e.eventPhase,
      isTrusted: e.isTrusted,
    };

    eventLog.push({
      type: 'wheel',
      timestamp: now,
      data: wheelData,
    });

    // Logge die ersten 10 Events und dann jeden 20.
    if (wheelEventCount <= 10 || wheelEventCount % 20 === 0) {
      console.log(`🔄 WHEEL #${wheelEventCount}`, wheelData);
    }

    // Warnung bei großen Delays
    if (timeSinceLastWheel > 100 && wheelEventCount > 1) {
      console.warn(`⚠️ Große Verzögerung zwischen Wheel-Events: ${timeSinceLastWheel.toFixed(2)}ms`);
    }
  };

  // 2. Scroll-Event Tracking mit vollständigen Details
  const scrollHandler = () => {
    scrollEventCount++;
    const now = performance.now();
    const timeSinceLastScroll = lastScrollTime > 0 ? now - lastScrollTime : 0;
    const timeSinceLastWheel = lastWheelTime > 0 ? now - lastWheelTime : 0;
    lastScrollTime = now;

    const scrollData = {
      eventNumber: scrollEventCount,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      scrollTop: document.documentElement.scrollTop,
      scrollLeft: document.documentElement.scrollLeft,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      bodyScrollTop: document.body.scrollTop,
      performanceTime: now,
      timeSinceLastScroll,
      timeSinceLastWheel,
      wheelEventCountAtScroll: wheelEventCount,
    };

    eventLog.push({
      type: 'scroll',
      timestamp: now,
      data: scrollData,
    });

    // Logge die ersten 10 Events und dann jeden 20.
    if (scrollEventCount <= 10 || scrollEventCount % 20 === 0) {
      console.log(`📊 SCROLL #${scrollEventCount}`, scrollData);
    }

    // Warnung bei großen Delays zwischen Wheel und Scroll
    if (timeSinceLastWheel > 50 && wheelEventCount > 0) {
      console.warn(`⚠️ Verzögerung zwischen Wheel und Scroll: ${timeSinceLastWheel.toFixed(2)}ms`);
    }
  };

  // 3. preventDefault() Tracking mit Stack-Trace
  const originalPreventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function (this: Event) {
    if (this.type === 'wheel' || this.type === 'scroll') {
      const stack = new Error().stack;
      eventLog.push({
        type: 'preventDefault',
        timestamp: performance.now(),
        data: {
          type: this.type,
          target: (this.target as any)?.constructor?.name || 'unknown',
          cancelable: this.cancelable,
          defaultPrevented: this.defaultPrevented,
        },
        stack,
      });
      console.error(`❌ preventDefault() aufgerufen auf ${this.type} Event`, {
        target: this.target,
        cancelable: this.cancelable,
        stack,
      });
    }
    return originalPreventDefault.call(this);
  };

  // 4. CSS-Änderungen Tracking
  let lastHtmlOverflow = getComputedStyle(document.documentElement).overflowY;
  let lastBodyOverflow = getComputedStyle(document.body).overflowY;

  const cssObserver = new MutationObserver(() => {
    const htmlOverflow = getComputedStyle(document.documentElement).overflowY;
    const bodyOverflow = getComputedStyle(document.body).overflowY;

    if (htmlOverflow !== lastHtmlOverflow || bodyOverflow !== lastBodyOverflow) {
      const changeData = {
        htmlOverflow: { from: lastHtmlOverflow, to: htmlOverflow },
        bodyOverflow: { from: lastBodyOverflow, to: bodyOverflow },
        timestamp: performance.now(),
      };

      eventLog.push({
        type: 'cssChange',
        timestamp: performance.now(),
        data: changeData,
      });

      console.log('🎨 CSS-Änderung erkannt', changeData);

      lastHtmlOverflow = htmlOverflow;
      lastBodyOverflow = bodyOverflow;
    }
  });

  cssObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    subtree: true,
  });

  // 5. IntersectionObserver Tracking
  const originalIntersectionObserver = window.IntersectionObserver;
  window.IntersectionObserver = class extends originalIntersectionObserver {
    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {
      const wrappedCallback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          eventLog.push({
            type: 'intersection',
            timestamp: performance.now(),
            data: {
              target: (entry.target as any)?.tagName || 'unknown',
              isIntersecting: entry.isIntersecting,
              intersectionRatio: entry.intersectionRatio,
              boundingClientRect: {
                top: entry.boundingClientRect.top,
                bottom: entry.boundingClientRect.bottom,
              },
            },
          });

          if (entry.isIntersecting) {
            console.log('👁️ IntersectionObserver Callback', {
              target: entry.target,
              isIntersecting: entry.isIntersecting,
              intersectionRatio: entry.intersectionRatio,
            });
          }
        });
        callback(entries, observer);
      };
      super(wrappedCallback, options);
    }
  } as any;

  // Event-Listener hinzufügen
  // passive: true für wheel, da wir nur loggen und preventDefault bereits über Override getrackt wird
  window.addEventListener('wheel', wheelHandler, { passive: true, capture: true });
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Cleanup-Funktion
  const cleanup = () => {
    window.removeEventListener('wheel', wheelHandler, { capture: true } as any);
    window.removeEventListener('scroll', scrollHandler);
    cssObserver.disconnect();
    Event.prototype.preventDefault = originalPreventDefault;
    window.IntersectionObserver = originalIntersectionObserver;
  };

  // Globale Debug-Funktionen
  (window as any).__scrollDebugAdvanced = {
    getEventLog: () => eventLog,
    getStats: () => ({
      totalEvents: eventLog.length,
      wheelEvents: wheelEventCount,
      scrollEvents: scrollEventCount,
      preventDefaultCalls: eventLog.filter(e => e.type === 'preventDefault').length,
      cssChanges: eventLog.filter(e => e.type === 'cssChange').length,
      intersectionCallbacks: eventLog.filter(e => e.type === 'intersection').length,
    }),
    analyzeDelays: () => {
      const wheelToScrollDelays: number[] = [];
      let lastWheelTime = 0;
      
      eventLog.forEach(event => {
        if (event.type === 'wheel') {
          lastWheelTime = event.timestamp;
        } else if (event.type === 'scroll' && lastWheelTime > 0) {
          wheelToScrollDelays.push(event.timestamp - lastWheelTime);
        }
      });

      if (wheelToScrollDelays.length > 0) {
        const avg = wheelToScrollDelays.reduce((a, b) => a + b, 0) / wheelToScrollDelays.length;
        const max = Math.max(...wheelToScrollDelays);
        const min = Math.min(...wheelToScrollDelays);
        
        console.log('📈 Delay-Analyse:', {
          durchschnittlich: `${avg.toFixed(2)}ms`,
          maximum: `${max.toFixed(2)}ms`,
          minimum: `${min.toFixed(2)}ms`,
          anzahl: wheelToScrollDelays.length,
        });
      }
    },
    cleanup,
  };

  console.log('✅ Erweiterte Debug-Funktionen verfügbar:');
  console.log('   window.__scrollDebugAdvanced.getEventLog() - Alle Events');
  console.log('   window.__scrollDebugAdvanced.getStats() - Statistiken');
  console.log('   window.__scrollDebugAdvanced.analyzeDelays() - Delay-Analyse\n');

  return { cleanup };
};

