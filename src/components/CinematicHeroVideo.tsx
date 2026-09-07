import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import signifyVideo from '@/assets/09042026-signify-2026-16x9-12-sec.mp4';
import './CinematicHeroVideo.css';

interface CinematicHeroVideoProps {
  onOpenQuote: (productName?: string) => void;
}

export interface ChapterItem {
  id: number;
  title: string;
  subtitle: string;
  type: 'video' | 'image';
  src: string;
  thumb: string;
  durationSec: number;
}

const CHAPTERS: ChapterItem[] = [
  {
    id: 0,
    title: 'A Universe of Lights',
    subtitle: 'Lighting by Signify',
    type: 'video',
    src: signifyVideo,
    thumb: '/images/universe_of_lights.jpg',
    durationSec: 12,
  },
  {
    id: 1,
    title: 'The Shanghai Bund',
    subtitle: 'Lighting by Signify',
    type: 'image',
    src: '/images/shanghai_bund.jpg',
    thumb: '/images/shanghai_bund.jpg',
    durationSec: 6,
  },
  {
    id: 2,
    title: 'The London Eye',
    subtitle: 'Lighting by Signify',
    type: 'image',
    src: '/images/london_eye.jpg',
    thumb: '/images/london_eye.jpg',
    durationSec: 6,
  },
  {
    id: 3,
    title: 'Maracana Stadium, Rio de Janeiro',
    subtitle: 'Lighting by Signify',
    type: 'image',
    src: '/images/maracana_stadium.jpg',
    thumb: '/images/maracana_stadium.jpg',
    durationSec: 6,
  },
];

export default function CinematicHeroVideo({ onOpenQuote }: CinematicHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0); // 0 to 100%

  const currentChapter = CHAPTERS[activeChapterIndex];

  // Automatic progress timer for active chapter (advances automatically)
  useEffect(() => {
    const stepMs = 50;
    const totalSteps = (currentChapter.durationSec * 1000) / stepMs;
    setChapterProgress(0);

    const interval = setInterval(() => {
      setChapterProgress((prev) => {
        const next = prev + (100 / totalSteps);
        if (next >= 100) {
          // Auto advance to next chapter automatically
          setActiveChapterIndex((curr) => (curr + 1) % CHAPTERS.length);
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [activeChapterIndex, currentChapter.durationSec]);

  // Video playback management when video chapter is active
  useEffect(() => {
    if (currentChapter.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeChapterIndex, currentChapter.type]);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    setChapterProgress(0);
    if (index === 0 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePrevChapter = () => {
    const prevIndex = activeChapterIndex === 0 ? CHAPTERS.length - 1 : activeChapterIndex - 1;
    handleSelectChapter(prevIndex);
  };

  const handleNextChapter = () => {
    const nextIndex = (activeChapterIndex + 1) % CHAPTERS.length;
    handleSelectChapter(nextIndex);
  };

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden shadow-2xl border-b border-slate-800/80 font-sans">
      {/* Main Responsive Stage Canvas: taller on mobile for mobile view, sleeker on desktop */}
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[560px] lg:h-[620px] overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Render Chapters with Smooth Fade Transitions */}
        {CHAPTERS.map((chap, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <div
              key={chap.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {chap.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={chap.src}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => {
                    // Video automatically ends and transitions to next image chapter
                    setActiveChapterIndex(1);
                  }}
                  style={{ filter: 'brightness(1.06) contrast(1.06) saturate(1.06)' }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={chap.src}
                  alt={chap.title}
                  style={{ filter: 'brightness(1.06) contrast(1.06) saturate(1.06)' }}
                  className="w-full h-full object-cover animate-pulse-subtle"
                />
              )}
            </div>
          );
        })}

        {/* Soft Vignette Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none z-15" />

        {/* Hero Content Overlay: Positioned near bottom left on mobile (matching screenshot), top/center on desktop */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-start pb-16 sm:pb-20 md:pb-0 md:pt-16 p-6 sm:p-10 md:p-14 lg:p-16 z-20 pointer-events-none">
          {/* Dynamic Hero Headlines matching exact screenshot */}
          <div className="max-w-3xl space-y-1.5 md:space-y-4 pointer-events-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-2xl">
              {currentChapter.title === 'A Universe of Lights' ? (
                <>
                  Transform Spaces With <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    Signify Lighting
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  {currentChapter.title}
                </span>
              )}
            </h1>

            <p className="text-slate-100 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl text-shadow-md drop-shadow">
              {currentChapter.subtitle}
            </p>
          </div>
        </div>

        {/* 1. DESKTOP HERO BOTTOM CHAPTER BAR (Shown on md+ screens) */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {CHAPTERS.map((chap, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <div
                  key={chap.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`flex-1 min-w-[200px] sm:min-w-[240px] p-2 sm:p-2.5 rounded-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {/* Thumbnail Image */}
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden shrink-0 border border-slate-700 group-hover:border-cyan-400 transition-colors">
                      <img
                        src={chap.thumb}
                        alt={chap.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
                      )}
                    </div>

                    {/* Chapter Title text */}
                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-snug transition-colors line-clamp-2 ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {chap.title}
                      </h4>
                    </div>
                  </div>

                  {/* Active Progress Bar Underneath */}
                  <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-75 ${
                        isActive ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-transparent'
                      }`}
                      style={{ width: isActive ? `${chapterProgress}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. MOBILE HERO BOTTOM NAVIGATION DOCK (Shown on mobile/tablet screens < md - Matching exact user screenshot) */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2.5 px-4 flex items-center justify-between">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevChapter}
            className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Center 4-Segment Progress Bar (Matching exact user screenshot: - - - -) */}
          <div className="flex items-center gap-1.5 px-2">
            {CHAPTERS.map((chap, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <div
                  key={chap.id}
                  onClick={() => handleSelectChapter(idx)}
                  className="h-1 rounded-full overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    width: isActive ? '28px' : '14px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{
                      width: isActive ? `${chapterProgress}%` : idx < activeChapterIndex ? '100%' : '0%',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Arrow Square Blue Button (Matching exact user screenshot) */}
          <button
            onClick={handleNextChapter}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded flex items-center justify-center shadow-lg transition-all cursor-pointer"
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}







