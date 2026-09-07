import React from 'react';
import { ShieldCheck, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import './Section06PhilipsBrand.css';

export default function Section06PhilipsBrand() {
  return (
    <section
      id="philips-brand"
      className="relative py-28 bg-gradient-to-b from-brand-navy via-brand-navyDark to-brand-charcoal text-white overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-blue/15 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 md:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Decorative Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-mono uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Primary Product Portfolio Brand</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white">
                PHILIPS LIGHTING
              </h2>

              <p className="text-xl text-slate-200 font-light leading-relaxed">
                Trusted lighting technology for modern spaces.
              </p>

              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-2xl">
                <strong className="text-white font-semibold">SK Traders</strong> is a leading lighting solutions company based in Hyderabad, specializing in the distribution and project supply of genuine <strong className="text-brand-gold font-semibold">Philips Lighting</strong> products. We connect residential architects, commercial contractors, and industrial managers with authentic, energy-efficient Philips LED luminaires backed by manufacturer warranties.
              </p>

              {/* Genuine Sourcing Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">100% Genuine Products</span>
                    <span className="text-xs text-slate-400">Direct authentic sourcing with original optical certificates</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Zap className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">High Efficacy Optics</span>
                    <span className="text-xs text-slate-400">Superior lumens-per-watt ratings and thermal management</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a
                href="#products"
                className="mt-4 px-8 py-4 rounded-full bg-white hover:bg-brand-gold text-brand-navy font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center gap-2 group"
                data-cursor="EXPLORE"
              >
                <span>Explore Philips Products Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right Graphic Box */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-brand-navyDark/90 border border-brand-gold/30 shadow-2xl flex flex-col items-center text-center gap-6 relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-navy border border-brand-gold/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,102,255,0.5)]">
                  <Award className="w-10 h-10 text-brand-gold animate-bounce" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono tracking-widest text-brand-gold uppercase">
                    Authentic Guarantee
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white">
                    SK Traders Technical Promise
                  </h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    Every Philips fixture supplied by SK Traders in Hyderabad undergoes rigorous batch quality verification to ensure optical color accuracy, glare compliance (UGR ratings), and surge protection specs.
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-white/10 flex justify-between text-[11px] font-mono text-slate-400">
                  <span>HYDERABAD SHOWROOM</span>
                  <span className="text-brand-gold font-bold">TROOP BAZAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
