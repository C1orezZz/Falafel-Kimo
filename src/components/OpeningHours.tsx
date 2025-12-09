import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { 
  fadeUp, 
  scaleIn, 
  staggerContainer,
  slideInLeft,
  slideInRight,
  featureCard
} from "@/lib/animations";

const OpeningHours = () => {
  const hours = [
    { days: 'Montag - Freitag', time: '11:00 - 22:00' },
    { days: 'Samstag', time: '12:00 - 23:00' },
    { days: 'Sonntag', time: '12:00 - 21:00' },
  ];

  return (
    <motion.section
      id="contact"
      className="section-padding bg-background"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full overflow-hidden">
          {/* Map */}
          <motion.div 
            className="relative w-full" 
            variants={slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="w-full max-w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden shadow-card bg-muted"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2369.5!2d9.9658!3d53.5649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18f3c1d3a3f3d%3A0x0!2sSchanzenstra%C3%9Fe%20111%2C%2020357%20Hamburg!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "sepia(20%) saturate(80%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Falafel Kimo Standort"
              />
            </motion.div>
            {/* Map Overlay Pin */}
            <motion.div
              className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-soft"
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium text-sm">Hamburger Schanze</span>
            </motion.div>
          </motion.div>

          {/* Info */}
          <motion.div 
            variants={staggerContainer} 
            className="w-full max-w-full"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Opening Hours */}
            <motion.div className="mb-10" variants={slideInRight}>
              <motion.div 
                className="flex items-center gap-3 mb-6"
                variants={fadeUp}
              >
                <motion.div 
                  className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    backgroundColor: "rgba(var(--primary-rgb), 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <Clock className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="heading-display text-2xl md:text-3xl text-foreground">
                  Öffnungszeiten
                </h3>
              </motion.div>
              <div className="space-y-4">
                {hours.map((item, index) => (
                  <motion.div
                    key={item.days}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-card rounded-xl w-full"
                    variants={featureCard}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <span className="font-medium text-foreground">{item.days}</span>
                    <div className="flex items-center gap-2 text-secondary font-semibold">
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={staggerContainer} className="space-y-4">
              <motion.h3 
                className="heading-display text-2xl md:text-3xl text-foreground mb-2" 
                variants={fadeUp}
              >
                Kontakt
              </motion.h3>
              <motion.a
                href="https://maps.google.com/?q=Schanzenstraße+111,+20357+Hamburg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-card rounded-xl hover:bg-muted transition-colors group"
                variants={featureCard}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Adresse</p>
                  <p className="text-muted-foreground">
                    Schanzenstraße 111<br />
                    20357 Hamburg
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+4940399935386"
                className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted transition-colors group"
                variants={featureCard}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Phone className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Telefon</p>
                  <p className="text-muted-foreground">+49 (0) 40 39993586</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:falafelkimo2016@gmail.com"
                className="flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-muted transition-colors group"
                variants={featureCard}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Mail className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">E-Mail</p>
                  <p className="text-muted-foreground">falafelkimo2016@gmail.com</p>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default OpeningHours;
