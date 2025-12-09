import { Heart, Leaf, Users } from "lucide-react";
import { motion } from "framer-motion";
import falafelImage from "@/assets/falafel-dish.jpg";
import { 
  fadeUp, 
  staggerContainer, 
  slideInLeft, 
  slideInRight, 
  lineExpand, 
  iconRotate,
  featureCard,
  imageParallax
} from "@/lib/animations";
import { optimizedViewport } from "@/lib/framerMotionConfig";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Mit Liebe gemacht',
      description: 'Jedes Gericht wird mit Sorgfalt und Leidenschaft zubereitet.',
    },
    {
      icon: Leaf,
      title: 'Frische Zutaten',
      description: 'Wir verwenden nur die frischesten und hochwertigsten Zutaten.',
    },
    {
      icon: Users,
      title: 'Familienrezepte',
      description: 'Authentische Rezepte, die seit Generationen weitergegeben werden.',
    },
  ];

  return (
    <section
      id="about"
      className="section-padding bg-background"
    >
      <motion.div 
        className="container-custom"
      initial="hidden"
      whileInView="show"
        viewport={optimizedViewport}
      variants={staggerContainer}
    >
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div 
              className="w-16 h-px bg-secondary origin-left" 
              variants={lineExpand}
            />
            <motion.svg 
              className="w-8 h-8 text-secondary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              variants={iconRotate}
            >
              <path d="M12 2C8.5 2 6 5 6 8c0 2 1 4 3 5v9h6v-9c2-1 3-3 3-5 0-3-2.5-6-6-6zm0 2c2.5 0 4 2 4 4s-1.5 4-4 4-4-2-4-4 1.5-4 4-4z" />
            </motion.svg>
            <motion.div 
              className="w-16 h-px bg-secondary origin-right" 
              variants={lineExpand}
            />
          </div>
          <motion.h2 
            className="heading-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4" 
            variants={fadeUp}
          >
            Über <span className="text-secondary italic">Falafel Kimo</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto" 
            variants={fadeUp}
          >
            Willkommen bei Falafel Kimo Homus – Ihrem Zuhause für authentische orientalische Küche in der Hamburger
            Schanze.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div 
            className="relative" 
            variants={imageParallax}
          >
            <motion.div 
              className="aspect-square rounded-2xl overflow-hidden shadow-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={falafelImage}
                alt="Frische Falafel auf einem Teller"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            {/* Decorative Frame */}
            <motion.div 
              className="absolute -bottom-4 -right-4 w-full h-full border-4 border-secondary rounded-2xl -z-10"
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="space-y-6" 
            variants={staggerContainer}
          >
            <motion.h3 
              className="font-display text-2xl md:text-3xl font-bold text-foreground" 
              variants={slideInRight}
            >
              Tradition trifft auf die Schanze
            </motion.h3>
            <motion.p 
              className="text-muted-foreground leading-relaxed" 
              variants={fadeUp}
            >
              Seit unserer Eröffnung servieren wir unseren Gästen in der Schanzenstraße die besten Falafel Hamburgs.
              Unser Inhaber Mohamed Abdel Elsayed bringt authentische Rezepte und jahrelange Erfahrung mit, um Ihnen ein
              unvergessliches kulinarisches Erlebnis zu bieten.
            </motion.p>
            <motion.p 
              className="text-muted-foreground leading-relaxed" 
              variants={fadeUp}
            >
              Alle unsere Gerichte werden mit Hummus, frischem Salat und hausgemachter Sesamsauce serviert – für den
              perfekten Geschmack des Orients.
            </motion.p>

            {/* Features */}
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title} 
                  className="flex gap-4" 
                  variants={featureCard}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      backgroundColor: "rgba(var(--primary-rgb), 0.2)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
