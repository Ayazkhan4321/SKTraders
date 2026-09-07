import React from 'react';
import CinematicHeroVideo from './CinematicHeroVideo';
import CircularSolutionsCarousel from './CircularSolutionsCarousel';
import './Hero.css';

interface HeroProps {
  onOpenQuote: (productName?: string) => void;
}

export default function Hero({ onOpenQuote }: HeroProps) {
  return (
    <section id="hero" className="relative pt-16 w-full bg-slate-900 overflow-hidden font-sans">
      {/* 1. 10–15 Second Cinematic Hero Video Experience following exact Storyboard */}
      <CinematicHeroVideo onOpenQuote={onOpenQuote} />

      {/* 2. "Our Lighting Solutions - Designed for Every Space" Circular Moving Cards (7 Cards total) */}
      <CircularSolutionsCarousel onOpenQuote={onOpenQuote} />
    </section>
  );
}