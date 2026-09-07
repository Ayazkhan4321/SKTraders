import React from 'react';
import { VALUE_PILLARS } from '@/lib/data';
import { motion } from 'framer-motion';
import './Section09Values.css';

export default function Section09Values() {
  return (
    <section
      id="values"
      className="relative py-24 bg-brand-navy text-white overflow-hidden border-y border-white/10"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-blue/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-brand-gold"></span>
            <span className="text-xs font-mono tracking-[0.25em] text-brand-gold uppercase">
              Section 09 — Core Service Pillars
            </span>
            <span className="w-8 h-[2px] bg-brand-gold"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white">
            WHY WORK WITH <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-blue">
              SK TRADERS
            </span>
          </h2>
        </div>

        {/* 4 Animated Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-gold/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
              data-cursor={pillar.title}
            >
              <div className="flex flex-col gap-4">
                <span className="text-4xl font-display font-extrabold text-slate-600 group-hover:text-brand-gold transition-colors font-mono">
                  {pillar.number}
                </span>

                <h3 className="text-xl font-display font-bold text-white tracking-wide group-hover:text-brand-gold transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {pillar.detail}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>SK TRADERS</span>
                <span className="w-2 h-2 rounded-full bg-brand-gold group-hover:scale-150 transition-transform"></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
