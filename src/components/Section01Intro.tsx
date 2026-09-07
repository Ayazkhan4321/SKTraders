import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Building2, Lightbulb, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data';
import './Section01Intro.css';

export default function Section01Intro() {
  return (
    <section
      id="intro"
      className="relative py-28 md:py-36 bg-gradient-to-b from-brand-navy via-brand-navyDark to-brand-charcoal text-white overflow-hidden"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/15 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Big Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            {/* Section Tag */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-brand-gold"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-brand-gold uppercase">
                Section 01 — Editorial Philosophy
              </span>
            </div>

            {/* Main Statement */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-100 leading-[1.15]"
            >
              WE DON&apos;T JUST <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-blue">
                SELL LIGHT.
              </span>{' '}
              <br />
              WE HELP YOU CREATE <br />
              AN EXPERIENCE.
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-xl"
            >
              SK Traders provides lighting products and solutions for residential, commercial, retail and industrial environments. We combine technical lighting optics, energy-efficient LED engineering, and genuine product authenticity to transform spaces across Hyderabad.
            </motion.p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 w-full">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
                <ShieldCheck className="w-6 h-6 text-brand-gold" />
                <span className="font-display font-semibold text-white text-sm">Genuine Supply</span>
                <span className="text-xs text-brand-slate">Direct authentic Philips product sourcing</span>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
                <Zap className="w-6 h-6 text-brand-blue" />
                <span className="font-display font-semibold text-white text-sm">Energy Efficacy</span>
                <span className="text-xs text-brand-slate">Up to 90% power saving optics</span>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
                <Award className="w-6 h-6 text-brand-gold" />
                <span className="font-display font-semibold text-white text-sm">Project Support</span>
                <span className="text-xs text-brand-slate">Technical advice & lux planning</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Reveal */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.6)] group"
              data-cursor="LIGHTING"
            >
              <img
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural Lighting Installation"
                className="w-full h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80"></div>

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-brand-navyDark/90 border border-white/15 backdrop-blur-md flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-brand-gold uppercase tracking-wider font-semibold">
                    Showroom Experience
                  </span>
                  <span className="text-sm font-display text-white font-medium">
                    Troop Bazar, Nampally, Hyderabad
                  </span>
                </div>
                <div className="w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_10px_#FFD84D]"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
