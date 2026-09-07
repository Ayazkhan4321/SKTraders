import React from 'react';
import { COMPANY_INFO } from '@/lib/data';
import { Sparkles, Phone, Mail, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Products', href: '#products' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00e676]/10 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          {/* Col 1: Logo & Vision */}
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            <a href="#hero" className="flex items-center gap-3.5 group">
              <img
                src="/images/philips_home_lighting_logo.png"
                alt="Philips Home Lighting"
                className="h-11 sm:h-12 w-auto object-contain bg-white px-2 py-1 rounded-md shadow-md transition-transform group-hover:scale-105"
              />
              <div className="h-9 w-px bg-slate-700 mx-0.5" />
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-2xl tracking-wider text-white">
                  PHILIPS <span className="text-slate-400 font-normal">| SK Traders</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#0066FF] uppercase font-mono font-bold">
                  Authorized Distributor of Philips
                </span>
              </div>
            </a>

            <p className="text-slate-300 text-sm font-light leading-relaxed max-w-md">
              SK Traders is an Authorized Distributor of Philips lighting products in Hyderabad, supplying genuine LED lighting solutions for residential, commercial, retail, and industrial spaces.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-white/5 border border-[#00e676]/30 text-[#00e676] text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Authorized Distributor of Philips</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-mono text-[#00e676] uppercase tracking-widest font-bold">
              Navigation
            </span>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00e676] group-hover:translate-x-0.5 transition-all" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hyderabad Contact Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-mono text-[#00e676] uppercase tracking-widest font-bold">
              Hyderabad Office & Showroom
            </span>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00e676] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{COMPANY_INFO.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00e676] shrink-0" />
                <a href={COMPANY_INFO.phoneUrl} className="text-xs hover:text-[#00e676] font-mono transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00e676] shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-xs hover:text-[#00e676] font-mono transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <span>
            © {currentYear} SK TRADERS. All rights reserved. Lighting Products & Solutions.
          </span>
          <span className="text-brand-slate">
            Hyderabad, Telangana, India
          </span>
        </div>
      </div>
    </footer>
  );
}
