import React, { useState } from 'react';
import { SOLUTIONS_PANELS } from '@/lib/data';
import { ArrowRight, CheckCircle2, Building2, Home, ShoppingBag, Factory, Trees } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Section04Solutions.css';

export default function Section04Solutions() {
  const [activeSolutionId, setActiveSolutionId] = useState<string>('residential');

  const getIcon = (id: string) => {
    switch (id) {
      case 'residential': return <Home className="w-5 h-5" />;
      case 'commercial': return <Building2 className="w-5 h-5" />;
      case 'retail': return <ShoppingBag className="w-5 h-5" />;
      case 'industrial': return <Factory className="w-5 h-5" />;
      case 'outdoor': return <Trees className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const activePanel = SOLUTIONS_PANELS.find((p) => p.id === activeSolutionId) || SOLUTIONS_PANELS[0];

  return (
    <section
      id="solutions"
      className="relative py-28 bg-brand-navyDark text-white overflow-hidden"
    >
      {/* Radial lighting background glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-blue/20 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-brand-gold"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-brand-gold uppercase">
                Section 04 — Specialized Environments
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white">
              LIGHTING FOR <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-brand-gold">
                EVERY SPACE
              </span>
            </h2>
          </div>
          <p className="text-slate-300 text-sm md:text-base font-light max-w-md">
            Tailored lighting packages engineered to meet lux requirements, safety codes, and aesthetic goals across 5 core sectors.
          </p>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {SOLUTIONS_PANELS.map((panel) => {
            const isActive = activeSolutionId === panel.id;
            return (
              <button
                key={panel.id}
                onClick={() => setActiveSolutionId(panel.id)}
                className={`px-6 py-3.5 rounded-2xl font-display font-semibold text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-[0_0_25px_rgba(0,102,255,0.6)] border border-white/30 scale-105'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                data-cursor={panel.title}
              >
                <span className={isActive ? 'text-brand-gold' : 'text-slate-500'}>
                  {getIcon(panel.id)}
                </span>
                <span>{panel.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Panel Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 border border-white/15 rounded-3xl p-6 md:p-12 backdrop-blur-xl shadow-2xl"
          >
            {/* Left Column: Panel Visual */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/20 h-[380px] md:h-[500px] shadow-2xl group">
              <img
                src={activePanel.image}
                alt={activePanel.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navyDark via-brand-navy/40 to-transparent"></div>

              {/* Panel Overlay Label */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-brand-navyDark/90 border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md">
                ✦ Sector Solution: {activePanel.id}
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-brand-navyDark/90 border border-white/15 backdrop-blur-md">
                <span className="text-xs font-mono text-brand-gold uppercase tracking-wider block mb-1">
                  SK Traders Expertise
                </span>
                <h4 className="text-xl md:text-2xl font-display font-bold text-white">
                  {activePanel.subtitle}
                </h4>
              </div>
            </div>

            {/* Right Column: Panel Copy & Engineering Highlights */}
            <div className="lg:col-span-5 flex flex-col items-start gap-6">
              <h3 className="text-3xl md:text-5xl font-display font-extrabold text-white">
                {activePanel.title}
              </h3>

              <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
                {activePanel.description}
              </p>

              {/* Highlights Bullet Grid */}
              <div className="flex flex-col gap-3 w-full pt-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Key Technical Features & Standards:
                </span>
                {activePanel.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <a
                href="#contact"
                className="mt-4 px-8 py-4 rounded-full bg-brand-gold hover:bg-white text-brand-navy font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,216,77,0.3)] flex items-center gap-2 group"
                data-cursor="INQUIRE"
              >
                <span>Consult on {activePanel.title.split(' ')[0]} Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
