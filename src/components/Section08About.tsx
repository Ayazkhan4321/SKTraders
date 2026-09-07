import React from 'react';
import { COMPANY_INFO } from '@/lib/data';
import { ShieldCheck, CheckCircle2, MapPin, Phone, Mail, Award, Compass, HeartHandshake, Tag } from 'lucide-react';
import './Section08About.css';

export default function Section08About() {
  const coreValues = [
    {
      title: 'Genuine Products',
      icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />,
      desc: '100% authentic Philips lighting fixtures sourced through verified product distribution lines.',
    },
    {
      title: 'Product Knowledge',
      icon: <Compass className="w-6 h-6 text-brand-blue" />,
      desc: 'In-depth optical and electrical technical understanding to guide fixture selection for any lux requirement.',
    },
    {
      title: 'Customer Support',
      icon: <HeartHandshake className="w-6 h-6 text-brand-gold" />,
      desc: 'Prompt response time, responsive after-sales service, and direct communication for all inquiries.',
    },
    {
      title: 'Lighting Solutions',
      icon: <Award className="w-6 h-6 text-brand-blue" />,
      desc: 'Tailored recommendations for residential homes, corporate offices, retail stores, and industrial plants.',
    },
    {
      title: 'Competitive Pricing',
      icon: <Tag className="w-6 h-6 text-brand-gold" />,
      desc: 'Fair market wholesale rates for electrical contractors, interior designers, and project managers.',
    },
    {
      title: 'Project Assistance',
      icon: <CheckCircle2 className="w-6 h-6 text-brand-blue" />,
      desc: 'Hands-on support for BOQ lighting estimates, luminaire schedules, and bulk order logistics.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-28 bg-gradient-to-b from-brand-charcoal via-brand-navyDark to-brand-navy text-white overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Text & Values */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-brand-gold"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-brand-gold uppercase">
                Section 08 — Corporate Identity
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white">
              ABOUT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-blue">
                SK TRADERS
              </span>
            </h2>

            <p className="text-xl text-brand-gold font-light italic">
              Lighting expertise. Genuine products. Reliable solutions.
            </p>

            <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed">
              <strong className="text-white font-semibold">SK Traders</strong> provides lighting products and solutions for customers looking for dependable, high-quality lighting for residential, commercial and professional environments in Hyderabad.
            </p>

            <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">
              Located in Troop Bazar, Nampally, we serve electrical contractors, architects, interior designers, and property owners with direct product access, expert luminaire guidance, and dependable supply.
            </p>

            {/* Core Values 6-Box Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              {coreValues.map((val) => (
                <div
                  key={val.title}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    {val.icon}
                    <span className="font-display font-bold text-white text-base">
                      {val.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hyderabad Showroom Card */}
          <div className="lg:col-span-5 relative">
            <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col gap-8 relative overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/30 border border-brand-blue flex items-center justify-center text-brand-gold shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-brand-gold uppercase tracking-wider font-bold">
                    Primary Office & Showroom
                  </span>
                  <span className="text-xl font-display font-bold text-white">
                    SK Traders — Hyderabad
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <span>{COMPANY_INFO.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-blue shrink-0" />
                  <a href={COMPANY_INFO.phoneUrl} className="hover:text-brand-gold transition-colors font-mono">
                    {COMPANY_INFO.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-brand-gold transition-colors font-mono">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-navyDark/90 border border-white/10 text-xs text-slate-300 leading-relaxed">
                <span className="text-brand-gold font-semibold block mb-1">
                  ✦ Business Hours & Visit:
                </span>
                Monday to Saturday: 10:00 AM – 8:00 PM. Walk-ins welcome for luminaire demonstrations and contractor trade quotes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
