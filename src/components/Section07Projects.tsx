import React, { useState } from 'react';
import { PROJECTS, Project } from '@/lib/data';
import { ArrowUpRight, MapPin, Building2 } from 'lucide-react';
import ProjectModal from './ProjectModal';
import './Section07Projects.css';

interface Section07ProjectsProps {
  onOpenQuote: () => void;
}

export default function Section07Projects({ onOpenQuote }: Section07ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Residential', 'Commercial', 'Retail', 'Industrial', 'Outdoor'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative py-24 bg-slate-50 border-b border-slate-200 text-slate-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#00c853]"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-[#00c853] uppercase font-bold">
                Section 07 — Project Showcase
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900">
              LIGHT IN <br className="hidden sm:inline" />
              <span className="text-slate-900">
                ACTION
              </span>
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base font-normal max-w-md">
            Architectural and industrial lighting supply installations completed across residential, commercial, and infrastructure developments in Hyderabad.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              data-cursor={cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-[#00c853] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between"
              data-cursor="VIEW PROJECT"
            >
              {/* Photo Showcase */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-100">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />

                {/* Category Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-white text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#00e676]" />
                  <span>{proj.category}</span>
                </div>

                {/* Arrow Icon Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-900 group-hover:bg-[#00c853] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex flex-col gap-3 justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-[#00c853] transition-colors">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{proj.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-normal line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  <span className="text-[#00c853] font-bold">Fixtures:</span> {proj.fixturesUsed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenQuote={onOpenQuote}
      />
    </section>
  );
}
