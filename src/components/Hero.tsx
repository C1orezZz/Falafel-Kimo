import { MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-restaurant.jpg";
import {
  fadeUp,
  floatParallax,
  scrollIndicator,
  staggerContainer,
} from "@/lib/animations";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0"
        variants={floatParallax}
        transition={{ duration: 1.4, delay: 0.1 }}
      >
        <motion.img
          src={heroImage}
          alt="Falafel Kimo Restaurant Atmosphäre"
          className="w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1, transition: { duration: 1.6, ease: [0.25, 1, 0.5, 1] } }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 opacity-20"
        variants={floatParallax}
        animate="hover"
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 6 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary fill-current">
          <path d="M50 5 C55 25, 75 30, 95 50 C75 70, 55 75, 50 95 C45 75, 25 70, 5 50 C25 30, 45 25, 50 5Z" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative container-custom px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-2"
            variants={fadeUp}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Hamburger Schanze</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="space-y-3" variants={fadeUp}>
            <span className="block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground/90 tracking-wide">
              Authentische Streetfood-Küche
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 text-lg sm:text-xl text-primary-foreground/90 max-w-xl"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            Frisch zubereitete orientalische Spezialitäten mit Liebe gemacht – direkt im Herzen
            der Schanze.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="mt-6 flex flex-wrap gap-4" variants={fadeUp} transition={{ delay: 0.2 }}>
            <motion.a
              href="#menu"
              className="btn-3d bg-secondary text-secondary-foreground shadow-glow"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              Speisekarte ansehen
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-3d bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground border-2 border-primary-foreground/30"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock className="w-5 h-5" />
              Öffnungszeiten
            </motion.a>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            className="pt-6 flex flex-wrap gap-6 text-primary-foreground/80"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
          >
            {["100% Frisch", "Vegetarische Optionen", "Hausgemacht"].map((label) => (
              <motion.div
                key={label}
                className="flex items-center gap-2"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
