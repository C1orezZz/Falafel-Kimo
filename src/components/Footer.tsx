import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="bg-primary text-primary-foreground"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      {/* Main Footer */}
      <div className="container-custom section-padding pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div className="lg:col-span-2" variants={fadeUp}>
            <h3 className="font-display text-3xl font-bold mb-4">
              Falafel <span className="text-secondary">Kimo</span>
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md leading-relaxed">
              Authentische orientalische Küche im Herzen der Hamburger Schanze. 
              Besuchen Sie uns für frische Falafel, Hummus und mehr.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Instagram"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Facebook"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="font-display text-xl font-bold mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <motion.li
                variants={fadeUp}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="https://maps.google.com/?q=Schanzenstraße+111,+20357+Hamburg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Schanzenstraße 111<br />20357 Hamburg</span>
                </a>
              </motion.li>
              <motion.li
                variants={fadeUp}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="tel:+4940399935386"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +49 (0) 40 39993586
                </a>
              </motion.li>
              <motion.li
                variants={fadeUp}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="mailto:falafelkimo2016@gmail.com"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  falafelkimo2016@gmail.com
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div variants={fadeUp}>
            <h4 className="font-display text-xl font-bold mb-6">Öffnungszeiten</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              {[
                { days: 'Mo - Fr', time: '11:00 - 22:00' },
                { days: 'Samstag', time: '12:00 - 23:00' },
                { days: 'Sonntag', time: '12:00 - 21:00' },
              ].map((item, index) => (
                <motion.li 
                  key={item.days}
                  className="flex justify-between"
                  variants={fadeUp}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{item.days}</span>
                  <span className="text-secondary">{item.time}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        className="border-t border-primary-foreground/10"
        variants={fadeUp}
      >
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} Falafel Kimo Homus. Alle Rechte vorbehalten.</p>
            <p>Inhaber: Mohamed Abdel Elsayed</p>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
