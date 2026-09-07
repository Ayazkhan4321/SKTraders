import React, { useState } from 'react';
import { CATEGORIES, Category } from '@/lib/data';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './Section02Categories.css';

interface Section02CategoriesProps {
  onSelectCategory?: (categoryId: string) => void;
}

export default function Section02Categories({ onSelectCategory }: Section02CategoriesProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES[2].id); // Default to Downlights

  return (
    <section
      id="categories"
      className="relative py-28 bg-brand-charcoal text-white overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-brand-gold"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-brand-gold uppercase">
                Section 02 — Product Portfolio
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white">
              EXPLORE OUR <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-blue">
                LIGHTING CATEGORIES
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-md">
            Interactive showcase of 10 primary architectural and industrial lighting ranges available through SK Traders.
          </p>
        </div>

        {/* Dynamic Accordion Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Column: Interactive List of 10 Categories */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {CATEGORIES.map((cat, index) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    if (onSelectCategory) onSelectCategory(cat.id);
                  }}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue/30 via-brand-navy to-brand-navy border border-brand-gold/50 shadow-[0_0_25px_rgba(0,102,255,0.3)] scale-[1.02]'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  data-cursor={cat.name}
                >
                  <div className="flex items-center gap-4 z-10">
                    <span className={`text-xs font-mono font-bold transition-colors ${
                      isActive ? 'text-brand-gold' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      0{index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className={`font-display font-semibold transition-all ${
                        isActive ? 'text-xl text-white tracking-wide' : 'text-base text-slate-300 group-hover:text-white'
                      }`}>
                        {cat.name}
                      </span>
                      {isActive && (
                        <span className="text-xs text-slate-400 font-light mt-0.5 animate-fadeIn">
                          {cat.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 z-10">
                    {isActive && (
                      <span className="text-[11px] font-mono tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                        {cat.count}
                      </span>
                    )}
                    <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                      isActive
                        ? 'text-brand-gold translate-x-1'
                        : 'text-slate-500 group-hover:text-white group-hover:translate-x-0.5'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Visual Stage / Active Image Showcase */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-white/20 bg-brand-navy shadow-2xl min-h-[450px] flex flex-col justify-end p-8 md:p-12">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              if (!isActive) return null;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-0"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navyDark via-brand-navy/60 to-transparent"></div>
                </motion.div>
              );
            })}

            {/* Content overlay on active image */}
            {CATEGORIES.map((cat) => {
              if (activeCategoryId !== cat.id) return null;
              return (
                <div key={cat.id + '-content'} className="relative z-10 flex flex-col items-start gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navyDark/90 border border-brand-gold/40 text-brand-gold text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Lighting Category</span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white flex items-center gap-3">
                    {cat.name}
                    <span className="text-brand-gold font-light">→</span>
                  </h3>

                  <p className="text-slate-200 text-base md:text-lg font-light leading-relaxed max-w-xl">
                    {cat.description}
                  </p>

                  <a
                    href="#products"
                    className="mt-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand-navy uppercase bg-brand-gold hover:bg-white px-6 py-3 rounded-full transition-colors shadow-lg"
                    data-cursor="VIEW RANGE"
                  >
                    <span>View {cat.name} Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
