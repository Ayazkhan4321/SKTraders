import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import signifyVideo from '@/assets/09042026-signify-2026-16x9-12-sec.mp4';
import { fetchPublicHeroes, getLocalHeroes } from '@/admin/services/heroApi';
import './CinematicHeroVideo.css';

interface CinematicHeroVideoProps {
  onOpenQuote: (productName?: string) => void;
}

export interface ChapterItem {
  id: string | number;
  title: string;
  subtitle: string;
  type: 'video' | 'image';
  src: string;
  thumb: string;
  durationSec: number;
  buttonText?: string;
  buttonUrl?: string;
}

function getInitialChapters(): ChapterItem[] {
  try {
    const local = getLocalHeroes().filter((h) => h.is_active);
    if (local && local.length > 0) {
      return local.map((h, index) => {
        const isVid = h.media_type === 'video' || Boolean(h.video_url);
        return {
          id: h.id || index,
          title: h.title,
          subtitle: h.subtitle || 'Lighting by Signify',
          type: isVid ? 'video' : 'image',
          src: isVid ? h.video_url || signifyVideo : h.image_url || '/images/shanghai_bund.jpg',
          thumb: h.image_url || '/images/shanghai_bund.jpg',
          durationSec: isVid ? 12 : 6,
          buttonText: h.button_text,
          buttonUrl: h.button_url,
        };
      });
    }
  } catch (e) {
    // fallback
  }

  return [
    {
      id: 0,
      title: 'A Universe of Lights',
      subtitle: 'Lighting by Signify',
      type: 'video',
      src: signifyVideo,
      thumb: '/images/universe_of_lights.jpg',
      durationSec: 12,
      buttonText: 'Explore',
    },
  ];
}

export default function CinematicHeroVideo({ onOpenQuote }: CinematicHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>(getInitialChapters);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicHeroes() {
      try {
        const publicHeroes = await fetchPublicHeroes();
        if (isMounted && publicHeroes && publicHeroes.length > 0) {
          const mapped: ChapterItem[] = publicHeroes.map((h, index) => {
            const isVid = h.media_type === 'video' || Boolean(h.video_url);
            return {
              id: h.id || index,
              title: h.title,
              subtitle: h.subtitle || 'Lighting by Signify',
              type: isVid ? 'video' : 'image',
              src: isVid ? h.video_url || signifyVideo : h.image_url || '/images/shanghai_bund.jpg',
              thumb: h.image_url || '/images/shanghai_bund.jpg',
              durationSec: isVid ? 12 : 6,
              buttonText: h.button_text,
              buttonUrl: h.button_url,
            };
          });

          // Only update if chapters content actually changed to avoid video flash
          setChapters((prev) => {
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
    loadDynamicHeroes();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  useEffect(() => {
    const stepMs = 50;
    const totalSteps = ((currentChapter?.durationSec || 6) * 1000) / stepMs;
    setChapterProgress(0);

    const interval = setInterval(() => {
      setChapterProgress((prev) => {
        const next = prev + 100 / totalSteps;
        if (next >= 100) {
          setActiveChapterIndex((curr) => (curr + 1) % chapters.length);
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [activeChapterIndex, currentChapter?.durationSec, chapters.length]);

  useEffect(() => {
    if (currentChapter?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeChapterIndex, currentChapter?.type, currentChapter?.src]);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    setChapterProgress(0);
    if (chapters[index]?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePrevChapter = () => {
    const prevIndex = activeChapterIndex === 0 ? chapters.length - 1 : activeChapterIndex - 1;
    handleSelectChapter(prevIndex);
  };

  const handleNextChapter = () => {
    const nextIndex = (activeChapterIndex + 1) % chapters.length;
    handleSelectChapter(nextIndex);
  };

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden shadow-2xl border-b border-slate-800/80 font-sans">
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[560px] lg:h-[620px] overflow-hidden bg-slate-950 flex items-center justify-center">
        {chapters.map((chap, idx) => {
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
                    setActiveChapterIndex((curr) => (curr + 1) % chapters.length);
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

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none z-15" />

        <div className="absolute inset-0 flex flex-col justify-end md:justify-start pb-16 sm:pb-20 md:pb-0 md:pt-16 p-6 sm:p-10 md:p-14 lg:p-16 z-20 pointer-events-none">
          <div className="max-w-3xl space-y-1.5 md:space-y-4 pointer-events-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-2xl">
              {currentChapter?.title === 'A Universe of Lights' ? (
                <>
                  Transform Spaces With <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    Signify Lighting
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  {currentChapter?.title}
                </span>
              )}
            </h1>

            <p className="text-slate-100 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl text-shadow-md drop-shadow">
              {currentChapter?.subtitle}
            </p>

            {currentChapter?.buttonText && (
              <button
                onClick={() => onOpenQuote(currentChapter.title)}
                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer pointer-events-auto"
              >
                {currentChapter.buttonText}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Dock */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {chapters.map((chap, idx) => {
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
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden shrink-0 border border-slate-700 group-hover:border-cyan-400 transition-colors">
                      <img
                        src={chap.thumb}
                        alt={chap.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {isActive && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />}
                    </div>

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

        {/* Mobile Navigation Dock */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 py-2.5 px-4 flex items-center justify-between">
          <button
            onClick={handlePrevChapter}
            className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {chapters.map((chap, idx) => {
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
