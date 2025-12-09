import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import shawarmaImage from "@/assets/shawarma-dish.jpg";
import hummusImage from "@/assets/hummus-dish.jpg";
import falafelImage from "@/assets/falafel-dish.jpg";
import { 
  hoverLift, 
  mediaReveal, 
  slideTabs, 
  staggerContainer,
  fadeUp,
  lineExpand,
  iconRotate
} from "@/lib/animations";

type Category = 'vorspeise' | 'falafel' | 'fleisch' | 'weitere';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string;
}

const menuData: Record<Category, MenuItem[]> = {
  vorspeise: [
    { id: 1, name: 'Hummus', price: '3,00€' },
    { id: 2, name: 'Baba Ganousch', price: '3,00€' },
    { id: 3, name: 'Walnussmus', price: '2,50€' },
    { id: 4, name: 'Gemischter Salat', price: '3,00€' },
    { id: 5, name: 'Gemischter Salat mit Käse', price: '4,00€' },
    { id: 6, name: 'Gemischter Salat mit Käse klein', price: '3,00€' },
    { id: 7, name: 'Krautsalat', price: '2,50€' },
    { id: 8, name: 'Foul (Ägyptische Bohnen)', price: '3,00€' },
    { id: 9, name: 'Taboule', price: '3,00€' },
  ],
  falafel: [
    { id: 10, name: 'Falafel Classic', price: '2,50€' },
    { id: 11, name: 'Falafel im Brot', price: '3,00€' },
    { id: 12, name: 'Falafel mit Käse', price: '3,50€' },
    { id: 13, name: 'Falafel mit Auberginen', price: '3,50€' },
    { id: 14, name: 'Falafel mit Blumenkohl', price: '3,00€' },
    { id: 15, name: 'Falafel mit gekochtem Ei', price: '3,50€' },
    { id: 16, name: 'Falafel Kimo', description: 'Von allem etwas', price: '3,50€' },
  ],
  fleisch: [
    { id: 30, name: 'Shawarma im Brot', price: '3,50€' },
    { id: 31, name: 'Shawarma Kimo', description: 'Von allem etwas', price: '4,00€' },
    { id: 32, name: 'Shawarma Teller klein', price: '4,00€' },
    { id: 33, name: 'Shawarma Teller groß', price: '6,00€' },
    { id: 34, name: 'Kebab im Brot', price: '3,50€' },
    { id: 35, name: 'Kebab Kimo', price: '4,00€' },
    { id: 36, name: 'Kebab Teller klein', price: '4,00€' },
    { id: 37, name: 'Kebab Teller groß', price: '6,00€' },
    { id: 38, name: 'Kimo Teller', description: 'Von allem etwas', price: '5,00€' },
    { id: 39, name: 'Merguez im Brot', price: '3,50€' },
    { id: 40, name: 'Merguez Teller klein', price: '4,00€' },
    { id: 41, name: 'Merguez Teller groß', price: '6,00€' },
  ],
  weitere: [
    { id: 17, name: 'Falafel mit Halloumi', price: '3,50€' },
    { id: 18, name: 'Blumenkohl im Brot', price: '3,00€' },
    { id: 19, name: 'Auberginen im Brot', price: '3,00€' },
    { id: 20, name: 'Gekochtes Ei im Brot', price: '3,00€' },
    { id: 21, name: 'Käse im Brot', price: '3,00€' },
    { id: 22, name: 'Gemüse im Brot', price: '3,00€' },
    { id: 23, name: 'Halloumi im Brot', price: '3,50€' },
    { id: 24, name: 'Falafel Teller klein', price: '3,50€' },
    { id: 25, name: 'Falafel Teller groß', price: '5,50€' },
    { id: 26, name: 'Halloumi Teller klein', price: '4,00€' },
    { id: 27, name: 'Halloumi Teller groß', price: '5,00€' },
    { id: 28, name: 'Gemüse Teller klein', price: '3,50€' },
    { id: 29, name: 'Gemüse Teller groß', price: '5,00€' },
  ],
};

const categories: { key: Category; label: string }[] = [
  { key: 'vorspeise', label: 'Vorspeisen' },
  { key: 'falafel', label: 'Falafel' },
  { key: 'fleisch', label: 'Fleischgerichte' },
  { key: 'weitere', label: 'Weitere Gerichte' },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('falafel');

  const categoryImages: Record<Category, string> = {
    vorspeise: hummusImage,
    falafel: falafelImage,
    fleisch: shawarmaImage,
    weitere: falafelImage,
  };

  const categoryColors: Record<Category, { bg: string; text: string; border: string; hover: string }> = {
    vorspeise: {
      bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
      hover: 'hover:from-amber-200 hover:to-orange-200',
    },
    falafel: {
      bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
      text: 'text-green-800',
      border: 'border-green-300',
      hover: 'hover:from-green-200 hover:to-emerald-200',
    },
    fleisch: {
      bg: 'bg-gradient-to-r from-red-100 to-rose-100',
      text: 'text-red-800',
      border: 'border-red-300',
      hover: 'hover:from-red-200 hover:to-rose-200',
    },
    weitere: {
      bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      hover: 'hover:from-slate-200 hover:to-gray-200',
    },
  };

  return (
    <motion.section
      id="menu"
      className="section-padding bg-card"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      layout={false}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
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
            Unsere <span className="bg-gradient-to-r from-orange-500 via-green-500 to-red-500 bg-clip-text text-transparent italic">Speisekarte</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto" 
            variants={fadeUp}
          >
            Alle Gerichte werden mit Hummus, Salat und hausgemachter Sesamsauce serviert.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-12" variants={staggerContainer}>
          {categories.map((category) => {
            const colors = categoryColors[category.key];
            return (
              <motion.button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                  activeCategory === category.key
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg scale-105`
                    : `bg-background text-foreground border-transparent hover:${colors.bg} hover:${colors.text} hover:${colors.border}`
                }`}
                variants={slideTabs}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Menu Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Featured Image */}
          <div className="relative order-2 lg:order-1">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.98, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -12 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-card"
                >
                  <motion.img
                    src={categoryImages[activeCategory]}
                    alt={`${activeCategory} Gerichte`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  />
                </motion.div>
              </AnimatePresence>
              <motion.div
                className="absolute -top-4 -left-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-display text-lg font-bold shadow-lg"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ⭐ Empfehlung
              </motion.div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="order-1 lg:order-2">
            <motion.div key={activeCategory} className="space-y-3" variants={staggerContainer}>
              <AnimatePresence initial={false} mode="popLayout">
                {(menuData[activeCategory] ?? []).map((item, index) => (
                  <motion.div
                    key={`${activeCategory}-${item.id}`}
                    className={`group flex items-start justify-between p-5 rounded-xl border-2 transition-all duration-300 ${
                      activeCategory === 'vorspeise'
                        ? 'bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-orange-200/50 hover:from-amber-100/70 hover:to-orange-100/70 hover:border-orange-300'
                        : activeCategory === 'falafel'
                        ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200/50 hover:from-green-100/70 hover:to-emerald-100/70 hover:border-green-300'
                        : activeCategory === 'fleisch'
                        ? 'bg-gradient-to-r from-red-50/50 to-rose-50/50 border-red-200/50 hover:from-red-100/70 hover:to-rose-100/70 hover:border-red-300'
                          : 'bg-gradient-to-r from-slate-50/50 to-gray-50/50 border-slate-200/50 hover:from-slate-100/70 hover:to-gray-100/70 hover:border-slate-300'
                    }`}
                    variants={mediaReveal(index)}
                    {...hoverLift}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activeCategory === 'vorspeise' ? 'bg-orange-400'
                          : activeCategory === 'falafel' ? 'bg-green-400'
                          : activeCategory === 'fleisch' ? 'bg-red-400'
                            : 'bg-slate-400'
                        }`} />
                        <h4 className={`font-semibold transition-colors ${
                          activeCategory === 'vorspeise' ? 'text-orange-900 group-hover:text-orange-700'
                          : activeCategory === 'falafel' ? 'text-green-900 group-hover:text-green-700'
                          : activeCategory === 'fleisch' ? 'text-red-900 group-hover:text-red-700'
                            : 'text-slate-800 group-hover:text-slate-700'
                        }`}>
                          {item.name}
                        </h4>
                      </div>
                      {item.description && (
                        <p className={`text-sm mt-1.5 ml-4 ${
                          activeCategory === 'vorspeise' ? 'text-orange-700/80'
                          : activeCategory === 'falafel' ? 'text-green-700/80'
                          : activeCategory === 'fleisch' ? 'text-red-700/80'
                            : 'text-slate-600/80'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className={`font-display text-lg font-bold ml-4 ${
                      activeCategory === 'vorspeise' ? 'text-orange-600'
                      : activeCategory === 'falafel' ? 'text-green-600'
                      : activeCategory === 'fleisch' ? 'text-red-600'
                        : 'text-slate-600'
                    }`}>
                      {item.price}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Menu;
