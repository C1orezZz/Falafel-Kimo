/**
 * Globale Framer Motion Konfiguration
 * Optimiert die viewport Einstellungen, um Scroll-Blockaden zu vermeiden
 */

export const optimizedViewport = {
  once: true,
  amount: 0.1, // Reduziert von 0.2, damit Observer früher ausgelöst werden
  margin: '-100px 0px', // Fügt Margin hinzu, damit Observer früher ausgelöst werden
};

export const optimizedViewportStrict = {
  once: true,
  amount: 0.2,
  margin: '-150px 0px', // Mehr Margin für wichtige Elemente
};

