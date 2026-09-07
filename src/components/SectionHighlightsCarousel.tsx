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
    <section id="highlights" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header matching Screenshot 4 */}
        <div className="mb-10 text-left">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
            Signify highlights
          </h2>
        </div>

        {/* Carousel Grid Cards matching Screenshot 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {highlights.slice(activeIndex, activeIndex + 3).concat(
            highlights.slice(0, Math.max(0, (activeIndex + 3) - highlights.length))
          ).map((item) => (
            <div
              key={item.id}
              onClick={onOpenQuote}
              className="group cursor-pointer relative aspect-[16/10] overflow-hidden bg-slate-900 signify-card shadow-sm hover:shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

              {/* Tag & Title matching Screenshot 4 */}
              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                {item.tag && (
                  <span className="text-xs text-slate-300 font-medium tracking-wide block">
                    {item.tag}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#00e676] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar & Navigation Controls matching Screenshot 4 */}
        <div className="flex items-center gap-6 pt-4">
          <button
            onClick={handlePrev}
            className="p-2 text-slate-600 hover:text-slate-950 transition-colors"
            title="Previous highlight"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Progress Bar Track */}
          <div className="flex-1 h-[3px] bg-slate-200 relative rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 bottom-0 bg-slate-900 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <button
            onClick={handleNext}
            className="p-2 text-slate-600 hover:text-slate-950 transition-colors"
            title="Next highlight"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
