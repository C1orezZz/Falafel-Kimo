import { Variants, Transition } from "framer-motion";

const transitionBase: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transitionBase },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitionBase },
};

export const floatParallax: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ...transitionBase, duration: 1 } },
  hover: { y: -6, transition: { duration: 0.6, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: transitionBase },
};

export const slideTabs: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: transitionBase },
  exit: { opacity: 0, x: -12, transition: { ...transitionBase, duration: 0.35 } },
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.02, transition: { duration: 0.25 } },
  whileTap: { scale: 0.98 },
};

export const revealOnScroll = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...transitionBase, duration: 0.65 },
  },
};

export const glowHover = {
  whileHover: { boxShadow: "0 15px 45px hsla(35, 70%, 50%, 0.35)" },
};

export const scrollIndicator = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1], delay: 0.4 },
  },
};

export const mediaReveal = (index: number): Variants => ({
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...transitionBase, delay: index * 0.05 },
  },
});

export const pageEnter: Variants = {
  hidden: { 
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60, scale: 0.95 },
  show: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    transition: { ...transitionBase, duration: 0.8 } 
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  show: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    transition: { ...transitionBase, duration: 0.8 } 
  },
};

export const lineExpand: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { 
    opacity: 1, 
    scaleX: 1, 
    transition: { ...transitionBase, duration: 0.6, delay: 0.2 } 
  },
};

export const iconRotate: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  show: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0, 
    transition: { ...transitionBase, duration: 0.7, delay: 0.3 } 
  },
};

export const featureCard: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { ...transitionBase, duration: 0.6 } 
  },
};

export const imageParallax: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { ...transitionBase, duration: 0.9 } 
  },
};

