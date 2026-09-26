import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionHighlightsCarouselProps {
  onOpenQuote: () => void;
}

export default function SectionHighlightsCarousel({ onOpenQuote }: SectionHighlightsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const highlights = [
    {
      id: 1,
      tag: 'Company',
      title: "Signify's second quarter results 2026",
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      tag: 'Markets',
      title: 'Capital Markets Day 2026',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      tag: 'Company',
      title: "Signify's first quarter results 2026",
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      tag: 'Sustainability',
      title: 'Global LED Infrastructure Upgrade & Net-Zero 2026',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? highlights.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === highlights.length - 1 ? 0 : prev + 1));
  };

  // Progress percentage calculation
  const progressPercent = ((activeIndex + 1) / highlights.length) * 100;

  return (
    <section className="py-16 bg-slate-900 text-white overflow-hidden relative" id="highlights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-[#00e676] uppercase tracking-widest block mb-2">
              Corporate & Industry Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white">
              Latest Insights & Innovations from Signify
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Highlight"
                className="w-10 h-10 rounded-full border border-slate-700 hover:border-[#00e676] flex items-center justify-center transition-colors text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Highlight"
                className="w-10 h-10 rounded-full border border-slate-700 hover:border-[#00e676] flex items-center justify-center transition-colors text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={item.id}
              onClick={onOpenQuote}
              className={`group cursor-pointer rounded-2xl overflow-hidden bg-slate-800/80 border transition-all duration-300 ${
                idx === activeIndex
                  ? 'border-[#00e676] shadow-lg shadow-[#00e676]/10 -translate-y-1'
                  : 'border-slate-700/60 hover:border-slate-500'
              }`}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#00e676] tracking-wider uppercase">
                  {item.tag}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white group-hover:text-[#00e676] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs font-semibold text-slate-400 group-hover:text-slate-200 flex items-center gap-1">
                  <span>Read full announcement</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-[#00e676] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}

