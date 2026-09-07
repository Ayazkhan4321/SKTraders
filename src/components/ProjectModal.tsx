import React from 'react';
import { Project, COMPANY_INFO } from '@/lib/data';
import { X, MapPin, Building2, Layers, MessageSquare, Phone } from 'lucide-react';
import './ProjectModal.css';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenQuote: () => void;
}

export default function ProjectModal({ project, onClose, onOpenQuote }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-navyDark/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-brand-navy border border-white/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-brand-gold hover:text-brand-navy transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column Image */}
        <div className="w-full md:w-1/2 relative bg-black min-h-[300px] md:min-h-full">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>

          <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-brand-navyDark/90 border border-brand-gold/40 text-brand-gold text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            ✦ Project Showcase
          </div>
        </div>

        {/* Right Column Breakdown */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-gold uppercase tracking-widest mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Sector: {project.category}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                {project.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 font-mono">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                <span>{project.location}</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm font-light leading-relaxed">
              {project.description}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <span className="text-xs font-mono text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Luminaires Supplied & Installed:
              </span>
              <span className="text-sm font-medium text-white">
                {project.fixturesUsed}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-6">
            <button
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="w-full py-3.5 rounded-full bg-brand-blue hover:bg-blue-600 text-white font-display font-semibold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>Request Lighting Consultation for Similar Project</span>
            </button>

            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Discuss via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
