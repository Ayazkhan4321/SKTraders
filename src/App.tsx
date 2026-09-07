import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SectionResources from '@/components/SectionResources';
import SectionBrandGrid from '@/components/SectionBrandGrid';
import SectionLeadingBrands from '@/components/SectionLeadingBrands';
import SectionHighlightsCarousel from '@/components/SectionHighlightsCarousel';
import SectionProfessionalOfferings from '@/components/SectionProfessionalOfferings';
import SectionCatalogues from '@/components/SectionCatalogues';
import Section03InteractiveRoom from '@/components/Section03InteractiveRoom';
import Section05FeaturedProducts from '@/components/Section05FeaturedProducts';
import Section07Projects from '@/components/Section07Projects';
import Section10Contact from '@/components/Section10Contact';
import Footer from '@/components/Footer';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import CustomCursor from '@/components/CustomCursor';
import Lenis from 'lenis';

// Modals
import QuoteModal from '@/components/QuoteModal';
import CatalogueModal from '@/components/CatalogueModal';
import AuthModal from '@/components/AuthModal';
import { CatalogueItem } from '@/lib/supabase';

export default function App() {
  // Modal Visibility States
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');
  const [catalogueModalItem, setCatalogueModalItem] = useState<CatalogueItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isAdmin?: boolean;
  } | null>(null);

  // Initialize Lenis Smooth Scrolling Physics & Intersection Observer Reveal Animations
  useEffect(() => {
    // 1. Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // 2. JS Intersection Observer for Scroll Reveal Animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('section, .reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    // 3. Load User Session from LocalStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sk_user_session');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          // ignore error
        }
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  const handleUserLoginSuccess = (user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    isAdmin: boolean;
  }) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sk_user_session', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sk_user_session');
      localStorage.removeItem('sk_admin_authenticated');
    }
  };

  const handleOpenQuote = (productName?: string) => {
    if (productName) {
      setSelectedQuoteProduct(productName);
    } else {
      setSelectedQuoteProduct('');
    }
    setQuoteModalOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-white text-slate-900 overflow-hidden selection:bg-[#00e676] selection:text-black font-sans">
      {/* 1. Signify Navigation Header */}
      <Navbar
        onOpenQuote={() => handleOpenQuote()}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Signify Video Hero Section (Screenshot 1 Top: "Brighter Lives Better World") */}
      <Hero onOpenQuote={() => handleOpenQuote()} />

      {/* 3. Resources for Lighting Professionals (Screenshot 1 Bottom) */}
      <SectionResources onOpenQuote={() => handleOpenQuote()} />

      {/* 4. Brand Cards: PHILIPS, PHILIPS hue, COLOR KINETICS (Screenshot 2) */}
      <SectionBrandGrid onOpenQuote={() => handleOpenQuote()} />

      {/* 5. The World's Leading Lighting Brands: Signify, Interact, Dynalite (Screenshot 3) */}
      <SectionLeadingBrands onOpenQuote={() => handleOpenQuote()} />

      {/* 6. Signify Highlights Carousel (Screenshot 4) */}
      <SectionHighlightsCarousel onOpenQuote={() => handleOpenQuote()} />

      {/* 7. Explore Signify's Professional Offerings: Products & Applications (Screenshot 5) */}
      <SectionProfessionalOfferings onOpenQuote={() => handleOpenQuote()} />


      {/* 9. Interactive Room Lighting Simulator */}
      <Section03InteractiveRoom />

      {/* 10. Featured Philips & Signify Lighting Products */}
      <Section05FeaturedProducts onOpenQuote={handleOpenQuote} />

      {/* 11. Project Showcase Gallery */}
      <Section07Projects onOpenQuote={() => handleOpenQuote()} />

      {/* 12. Contact CTA, Form & Showroom Location Map */}
      <Section10Contact onOpenQuote={() => handleOpenQuote()} />

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp & Phone Call Buttons */}
      <FloatingContactButtons />

      {/* Custom JS Glowing Cursor */}
      <CustomCursor />

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={selectedQuoteProduct}
      />

      <CatalogueModal
        catalogue={catalogueModalItem}
        onClose={() => setCatalogueModalItem(null)}
        onOpenPayment={(title) => handleOpenQuote(title)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessLogin={handleUserLoginSuccess}
      />
    </main>
  );
}
