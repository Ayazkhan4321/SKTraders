import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Fan,
  Lightbulb,
  Lamp,
  ShieldCheck,
  Building2,
  Crown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { fetchPublicHeroCards, getLocalHeroCards, HeroCardItem } from '@/admin/services/heroCardsApi';
import './CircularSolutionsCarousel.css';

interface CircularSolutionsCarouselProps {
  onOpenQuote: (productName?: string) => void;
}

export interface SolutionCard {
  id: string;
  title: string;
  subtitle: string;
  titleColor: string;
  badgeBg: string;
  badgeBorder: string;
  image: string;
  icon: React.ReactNode;
  categoryTag: string;
  pdfUrl?: string;
  buttonText?: string;
}

const STYLES_PALETTE = [
  { titleColor: 'text-[#0066FF]', badgeBg: 'bg-[#0066FF]', badgeBorder: 'border-[#0066FF]', icon: <Sparkles className="w-5 h-5 text-white" /> },
  { titleColor: 'text-[#65A30D]', badgeBg: 'bg-[#7CB342]', badgeBorder: 'border-[#7CB342]', icon: <Fan className="w-5 h-5 text-white" /> },
  { titleColor: 'text-[#8B5CF6]', badgeBg: 'bg-[#9333EA]', badgeBorder: 'border-[#9333EA]', icon: <Lightbulb className="w-5 h-5 text-white" /> },
  { titleColor: 'text-[#EA580C]', badgeBg: 'bg-[#F97316]', badgeBorder: 'border-[#F97316]', icon: <Lamp className="w-5 h-5 text-white" /> },
  { titleColor: 'text-[#0891B2]', badgeBg: 'bg-[#06B6D4]', badgeBorder: 'border-[#06B6D4]', icon: <ShieldCheck className="w-5 h-5 text-white" /> },
  { titleColor: 'text-[#4F46E5]', badgeBg: 'bg-[#4F46E5]', badgeBorder: 'border-[#4F46E5]', icon: <Building2 className="w-5 h-5 text-white" /> },
];

function getInitialSolutions(): SolutionCard[] {
  try {
    const local = getLocalHeroCards().filter((c) => c.is_active);
    if (local && local.length > 0) {
      return local.map((card, idx) => {
        const style = STYLES_PALETTE[idx % STYLES_PALETTE.length];
        return {
          id: card.id,
          title: card.title,
          subtitle: card.short_description || card.description,
          titleColor: style.titleColor,
          badgeBg: style.badgeBg,
          badgeBorder: style.badgeBorder,
          image: card.image_url || '/images/card_ceiling_design_lights.jpg',
          icon: style.icon,
          categoryTag: 'Category',
          pdfUrl: card.pdf_url,
          buttonText: card.button_text || 'View PDF',
        };
      });
    }
  } catch (e) {
    // fallback
  }

  return [];
}

export default function CircularSolutionsCarousel({ onOpenQuote }: CircularSolutionsCarouselProps) {
  const [solutions, setSolutions] = useState<SolutionCard[]>(getInitialSolutions);
  const [isPaused, setIsPaused] = useState(false);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicHeroCards() {
      try {
        const publicCards = await fetchPublicHeroCards();
        if (isMounted && publicCards && publicCards.length > 0) {
          const mapped: SolutionCard[] = publicCards.map((card, idx) => {
            const style = STYLES_PALETTE[idx % STYLES_PALETTE.length];
            return {
              id: card.id,
              title: card.title,
              subtitle: card.short_description || card.description,
              titleColor: style.titleColor,
              badgeBg: style.badgeBg,
              badgeBorder: style.badgeBorder,
              image: card.image_url || '/images/card_ceiling_design_lights.jpg',
              icon: style.icon,
              categoryTag: 'Category',
              pdfUrl: card.pdf_url,
              buttonText: card.button_text || 'View PDF',
            };
          });

          setSolutions((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(mapped)) {
              return prev;
            }
            return mapped;
          });
        }
      } catch (e) {
        // fallback
      }
    }
    loadDynamicHeroCards();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const autoScroll = () => {
      if (scrollTrackRef.current && !isPaused) {
        scrollTrackRef.current.scrollLeft += 1.2;

        const maxScrollLeft = scrollTrackRef.current.scrollWidth / 2;
        if (scrollTrackRef.current.scrollLeft >= maxScrollLeft) {
          scrollTrackRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  const handlePrev = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const duplicatedSolutions = [...solutions, ...solutions];

  return (
    <div className="relative py-16 md:py-24 bg-white text-slate-900 w-full z-20 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center flex flex-col items-center justify-center mb-10 md:mb-14">
          <span className="text-[#0066FF] font-semibold text-sm sm:text-base tracking-wide uppercase mb-1">
            Our Lighting Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Designed for Every Space
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="w-10 h-[3px] bg-[#0066FF] rounded-full"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></span>
            <span className="w-10 h-[3px] bg-[#0066FF] rounded-full"></span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <span>{solutions.length} Core Categories — CMS Synchronized</span>
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-6 h-6 text-[#0066FF]" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur"
          aria-label="Next card"
        >
          <ChevronRight className="w-6 h-6 text-[#0066FF]" />
        </button>

        <div
          ref={scrollTrackRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch gap-6 overflow-x-auto no-scrollbar py-6 px-2 scroll-smooth cursor-grab active:cursor-grabbing"
        >
          {duplicatedSolutions.map((solution, idx) => (
            <div
              key={`${solution.id}-${idx}`}
              onClick={() => {
                if (solution.pdfUrl) {
                  window.open(solution.pdfUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onOpenQuote(solution.title);
                }
              }}
              className="flex-shrink-0 w-[270px] sm:w-[290px] bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-2.5 relative"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-300" />
              </div>

              <div className="relative px-5 pt-0 pb-6 flex flex-col flex-grow bg-white">
                <div
                  className={`absolute -top-5 left-5 w-11 h-11 rounded-full ${solution.badgeBg} flex items-center justify-center shadow-lg border-2 border-white transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {solution.icon}
                </div>

                <div className="pt-8 flex flex-col flex-grow">
                  <h3 className={`font-extrabold text-base sm:text-lg mb-1.5 leading-snug ${solution.titleColor} group-hover:opacity-90 flex items-center justify-between`}>
                    <span>{solution.title}</span>
                    {solution.pdfUrl && (
                      <ExternalLink className="w-4 h-4 text-blue-600 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
                    {solution.subtitle}
                  </p>

                  {solution.pdfUrl && (
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{solution.buttonText || 'Click to Open PDF in Browser'}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-blue-600" /> : <Pause className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isPaused ? 'Resume Motion' : 'Pause Motion'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
