import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Reaktiviert: Scroll-Listener für Header-State
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Über uns", href: "#about" },
    { label: "Speisekarte", href: "#menu" },
    { label: "Kontakt", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-b from-primary/95 via-primary/90 to-primary/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#home" 
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.span 
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight flex items-center gap-1.5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="relative inline-block"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span 
                  className="falafel-letter falafel-green relative"
                  style={{
                    textShadow: `
                      0 2px 8px rgba(0, 0, 0, 0.15),
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      0 0 0 rgba(255, 255, 255, 0.1)
                    `,
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }}
                >
                  Falafel
                </span>
                <motion.span
                  className="absolute inset-0 falafel-letter falafel-green opacity-0 blur-sm group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                >
                  Falafel
                </motion.span>
              </motion.span>
              <motion.span 
                className="relative inline-block"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
              >
                <span 
                  className="falafel-letter falafel-gold relative"
                  style={{
                    textShadow: `
                      0 2px 8px rgba(0, 0, 0, 0.15),
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      0 0 0 rgba(255, 255, 255, 0.1)
                    `,
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                  }}
                >
                  Kimo
                </span>
                <motion.span
                  className="absolute inset-0 falafel-letter falafel-gold opacity-0 blur-sm group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                >
                  Kimo
                </motion.span>
              </motion.span>
            </motion.span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="nav-underline font-medium text-primary-foreground/90 hover:text-secondary transition-colors duration-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="tel:+4940399935386"
              className="btn-3d bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold hover:bg-forest-light transition-colors duration-200 gap-2"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone className="w-4 h-4" />
              Anrufen
            </motion.a>
          </nav>

          {/* Mobile Phone Button */}
          <motion.a
            href="tel:+4940399935386"
            className="md:hidden btn-3d bg-primary text-primary-foreground p-3 rounded-full font-semibold hover:bg-forest-light transition-colors duration-200 flex items-center justify-center shadow-lg"
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Jetzt anrufen"
          >
            <Phone className="w-6 h-6" />
          </motion.a>
        </div>
      </div>
    </header>
  );
};

export default Header;
