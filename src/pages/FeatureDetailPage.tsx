import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchFeatureBySlug,
  fetchPublicFeatures,
  CompleteFeatureData,
} from '@/admin/services/featuresApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContactButtons from '@/components/FloatingContactButtons';
import InteractiveProductExploder from '@/components/InteractiveProductExploder';
import QuoteModal from '@/components/QuoteModal';
import CatalogueModal from '@/components/CatalogueModal';
import AuthModal from '@/components/AuthModal';
import SEOHead from '@/components/SEOHead';
import { CatalogueItem } from '@/lib/supabase';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Sun,
  ShieldCheck,
  Cpu,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Sliders,
  Globe,
  Award,
  Lightbulb,
  X,
  Maximize2,
  Check,
  ChevronDown,
  Info,
  Layers,
  MessageSquare,
} from 'lucide-react';

export default function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isPreview = searchParams.get('preview') === 'true';

  const [data, setData] = useState<CompleteFeatureData | null>(null);
  const [allFeatures, setAllFeatures] = useState<CompleteFeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [showFullTechSpecs, setShowFullTechSpecs] = useState(false);

  // Modals state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');
  const [catalogueModalItem, setCatalogueModalItem] = useState<CatalogueItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      if (!slug) {
        setLoading(false);
        return;
      }

      const [featureData, publicFeatures] = await Promise.all([
        fetchFeatureBySlug(slug),
        fetchPublicFeatures(),
      ]);

      setData(featureData);
      setAllFeatures(publicFeatures);
      setLoading(false);

      if (featureData?.feature) {
        // Update dynamic SEO Metadata
        document.title = `${featureData.feature.hero_title || featureData.feature.title} | SK Traders`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', featureData.feature.short_description || '');
        }
      }
    }
    loadContent();
  }, [slug]);

  // Icon mapping helper for highlights
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[#00e676]' };
    switch (iconName) {
      case 'Zap':
        return <Zap {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Sliders':
        return <Sliders {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Lightbulb':
        return <Lightbulb {...props} />;
      default:
        return <Sparkles {...props} />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00e676]/20 border-t-[#00e676] rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-slate-400">Loading Lighting Experience...</p>
        </div>
      </div>
    );
  }

  // 404 handler if feature does not exist or is inactive (and not preview mode)
  if (!data || (!data.feature.is_active && !isPreview)) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans">
        <Navbar
          onOpenQuote={() => handleOpenQuote()}
          onOpenAuth={() => setAuthModalOpen(true)}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />

        <div className="max-w-3xl mx-auto px-6 py-32 text-center space-y-6 animate-fade-in my-auto">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl mx-auto flex items-center justify-center text-slate-500">
            <Sparkles className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
            Feature Page Not Found
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The requested lighting feature page "{slug}" could not be found.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00e676] hover:bg-[#00c853] text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#00e676]/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to SK Traders Homepage</span>
            </button>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const { feature, highlights, solutions, specifications, applications, gallery, interactive_components } = data;

  // Filter related features
  const relatedFeatures = allFeatures.filter((f) => {
    if (f.feature.id === feature.id) return false;
    if (feature.related_feature_ids && feature.related_feature_ids.length > 0) {
      return feature.related_feature_ids.includes(f.feature.id);
    }
    return true;
  }).slice(0, 3);

  const heroTextAlignClass =
    feature.hero_text_align === 'center'
      ? 'text-center items-center'
      : feature.hero_text_align === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const featureBreadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.sktradersphilipslighting.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Features',
        item: `https://www.sktradersphilipslighting.com/features/${feature.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: feature.title,
        item: `https://www.sktradersphilipslighting.com/features/${feature.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-[#00e676] selection:text-slate-950 font-sans relative">
      <SEOHead
        title={`${feature.title} | SK Traders Lighting Feature`}
        description={feature.short_description || feature.hero_subtitle}
        canonicalPath={`/features/${feature.slug}`}
        image={feature.card_image_url || feature.hero_image_url}
        keywords={`${feature.title}, Philips Lighting Features, SK Traders Hyderabad`}
        jsonLd={featureBreadcrumbJsonLd}
      />
      {/* Preview Banner if in Admin Preview mode */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center shadow-lg flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>ADMIN PREVIEW MODE — Live view of "{feature.title}" (Status: {feature.is_active ? 'Active' : 'Draft'})</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenQuote={() => handleOpenQuote(feature.title)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950">
        {/* Full-Screen Background Image */}
        {feature.hero_image_url && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={feature.hero_image_url}
              alt={feature.hero_title}
              className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 brightness-[1.08] contrast-[1.05]"
            />
            {/* Tuned soft overlay for maximum background image clarity */}
            <div
              className="absolute inset-0 bg-slate-950"
              style={{ opacity: (feature.hero_overlay_opacity ?? 30) / 100 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/30" />
          </div>
        )}

        <div className={`max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col ${heroTextAlignClass} space-y-6 pt-12`}>
          {/* Back Button */}
          <Link
            to="/#products"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-[#00e676] bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all mb-2 hover:translate-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Features</span>
          </Link>

          <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold inline-flex items-center gap-2 bg-[#00e676]/10 border border-[#00e676]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{feature.title}</span>
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-none max-w-4xl">
            {feature.hero_title || feature.title}
          </h1>

          {feature.hero_subtitle && (
            <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed max-w-2xl">
              {feature.hero_subtitle}
            </p>
          )}

          {/* Hero Action CTA */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleOpenQuote(feature.title)}
              className="px-7 py-4 bg-[#00e676] hover:bg-[#00c853] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#00e676]/20 cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>{feature.hero_cta_text || 'Request Quote'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {feature.catalogue_pdf_url && (
              <a
                href={feature.catalogue_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <FileText className="w-4 h-4 text-[#00e676]" />
                <span>View Specification PDF</span>
              </a>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 animate-bounce flex flex-col items-center gap-2 text-slate-400 text-[11px] font-mono">
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 text-[#00e676]" />
          </div>
        </div>
      </section>

      {/* STICKY SUB-NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 border-y border-slate-800 backdrop-blur-md py-3 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-6 text-xs font-mono font-bold">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <a href="#product-intro" className="text-slate-300 hover:text-[#00e676] transition-colors">
              Product Overview
            </a>
            {interactive_components && interactive_components.length > 0 && (
              <a href="#discover-inside" className="text-[#00e676] hover:underline flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discover Inside</span>
              </a>
            )}
            <a href="#highlights" className="text-slate-300 hover:text-[#00e676] transition-colors">
              Why You'll Like It
            </a>
            {specifications.length > 0 && (
              <a href="#specifications" className="text-slate-300 hover:text-[#00e676] transition-colors">
                Specifications
              </a>
            )}
            {applications.length > 0 && (
              <a href="#applications" className="text-slate-300 hover:text-[#00e676] transition-colors">
                Applications
              </a>
            )}
            {feature.catalogue_pdf_url && (
              <a href="#catalogue" className="text-slate-300 hover:text-[#00e676] transition-colors">
                Catalogue PDF
              </a>
            )}
          </div>

          <button
            onClick={() => handleOpenQuote(feature.title)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00e676] text-slate-950 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#00c853] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Inquire Now</span>
          </button>
        </div>
      </nav>

      {/* 2. PRODUCT INTRODUCTION & SPLIT SCREEN */}
      <section id="product-intro" className="py-20 bg-slate-900/60 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Product Image Side */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
                <img
                  src={feature.intro_image_url || feature.card_image_url || feature.hero_image_url}
                  alt={feature.title}
                  className="w-full h-auto object-cover max-h-[500px] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
                    <span className="text-xs font-bold text-white">Philips Authorized Original</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    SK Traders Hyderabad
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details Side */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#00e676]"></span>
                <span className="text-xs font-mono tracking-[0.2em] text-[#00e676] uppercase font-bold">
                  Lighting That Works For You
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                {feature.intro_title || feature.title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line">
                {feature.intro_description || feature.short_description}
              </p>

              {/* Simple Human Benefit Checkmarks */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '✓ Energy Efficient',
                  '✓ Long Lasting Performance',
                  '✓ Easy to Install',
                  '✓ EyeComfort Certified Glare-Free',
                  '✓ 5-Year Authorized Warranty',
                  '✓ Instant On Zero Warmup',
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-bold text-slate-200"
                  >
                    <Check className="w-4 h-4 text-[#00e676] shrink-0" />
                    <span>{benefit.replace('✓ ', '')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => handleOpenQuote(feature.title)}
                  className="px-6 py-3.5 bg-[#00e676] hover:bg-[#00c853] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#00e676]/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Contact SK Traders Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT DISCOVERY ("DISCOVER WHAT'S INSIDE") */}
      {interactive_components && interactive_components.length > 0 && (
        <InteractiveProductExploder
          components={interactive_components}
          productTitle={feature.title}
          productImage={feature.card_image_url}
        />
      )}

      {/* 4. BENEFITS BEFORE SPECIFICATIONS ("WHY YOU'LL LIKE IT") */}
      {highlights.length > 0 && (
        <section id="highlights" className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
                Simple Human Benefits
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                WHY YOU'LL LIKE IT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 hover:border-[#00e676]/40 transition-all duration-300 space-y-4 hover:-translate-y-1 group shadow-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderIcon(item.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00e676] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. "WHAT DOES THIS MEAN?" SPECIFICATIONS SECTION */}
      {specifications.length > 0 && (
        <section id="specifications" className="py-20 bg-slate-900/40 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
                Human-Readable Datasheet
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                TECHNICAL DETAILS & WHAT THEY MEAN
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-md mx-auto">
                No engineering degree required — here is what every specification means for your home or project.
              </p>
            </div>

            {/* Human Readable Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-[#00e676]/40 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-xs text-[#00e676] uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-xs font-bold font-mono text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                      {spec.value}
                    </span>
                  </div>

                  {spec.explanation ? (
                    <div className="flex items-start gap-2 pt-1">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {spec.explanation}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-light pt-1">
                      Standard technical specification value.
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Toggle Full Raw Technical Table */}
            <div className="pt-8 text-center">
              <button
                onClick={() => setShowFullTechSpecs(!showFullTechSpecs)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-800 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#00e676]" />
                <span>{showFullTechSpecs ? 'Hide Raw Technical Table' : 'View Full Technical Specification Table'}</span>
              </button>
            </div>

            {/* Raw Specification Table if Toggled */}
            {showFullTechSpecs && (
              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
                <div className="divide-y divide-slate-800/80">
                  {specifications.map((spec) => (
                    <div key={spec.id} className="grid grid-cols-1 sm:grid-cols-12 p-4 text-xs">
                      <div className="sm:col-span-5 font-mono font-bold text-[#00e676] uppercase">
                        {spec.label}
                      </div>
                      <div className="sm:col-span-7 text-slate-200 font-light">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. PRODUCTS & LUMINAIRES RANGE */}
      {solutions.length > 0 && (
        <section id="solutions" className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
                  Product Models
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mt-1">
                  Product & Luminaire Lineup
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                All models supplied with official Philips manufacturer warranty by SK Traders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {solutions.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-[#00e676]/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group shadow-xl"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </div>

                  <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#00e676] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800 text-xs font-bold text-[#00e676]">
                      <button
                        onClick={() => handleOpenQuote(item.title)}
                        className="hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                      >
                        <span>Get Product Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {item.pdf_url && (
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Spec Sheet</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. APPLICATIONS ("WHERE CAN YOU USE IT?") */}
      {applications.length > 0 && (
        <section id="applications" className="py-20 bg-slate-900/60 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
                Environments & Use Cases
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                WHERE CAN YOU USE IT?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="relative rounded-3xl overflow-hidden border border-slate-800 aspect-[16/11] group shadow-xl bg-slate-950"
                >
                  <img
                    src={app.image_url}
                    alt={app.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                  <div className="absolute bottom-6 left-6 right-6 z-20 space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00e676] transition-colors">
                      {app.title}
                    </h3>
                    {app.description && (
                      <p className="text-xs text-slate-300 font-light line-clamp-2">
                        {app.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. GALLERY SECTION */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
                Project Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                Installation Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxImage(item.image_url)}
                  className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-800 aspect-[16/10] bg-slate-900 shadow-xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.caption || 'Project visual'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-[#00e676]" />
                  </div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-3 text-xs text-slate-300 truncate font-mono">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          onClick={() => setActiveLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#00e676] p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={activeLightboxImage}
            alt="Full size project preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
          />
        </div>
      )}

      {/* 9. DYNAMIC CATALOGUE SECTION */}
      {feature.catalogue_active && feature.catalogue_pdf_url && (
        <section id="catalogue" className="py-20 bg-slate-900 border-b border-slate-800 relative">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl mx-auto flex items-center justify-center text-red-400 shadow-xl">
              <FileText className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em] font-bold block">
              WANT TO KNOW MORE?
            </span>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {feature.catalogue_title || 'Explore The Complete Product Catalogue'}
            </h2>

            {feature.catalogue_description && (
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
                {feature.catalogue_description}
              </p>
            )}

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href={feature.catalogue_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{feature.catalogue_button_text || 'View / Download PDF Catalogue'}</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 10. RELATED FEATURES SECTION */}
      {relatedFeatures.length > 0 && (
        <section id="related" className="py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Explore More Lighting Solutions
              </h2>
              <Link to="/#products" className="text-xs font-bold text-[#00e676] hover:underline flex items-center gap-1">
                <span>View All Ranges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFeatures.map((rel) => (
                <Link
                  key={rel.feature.id}
                  to={`/features/${rel.feature.slug}`}
                  className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-[#00e676]/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={rel.feature.card_image_url || rel.feature.hero_image_url}
                      alt={rel.feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00e676] transition-colors">
                      {rel.feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-light">
                      {rel.feature.short_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. FINAL CONTACT / ENQUIRY CTA SECTION */}
      {feature.contact_cta_active && (
        <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center space-y-6">
            <span className="text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold">
              SK Traders Authorized Lighting Partner
            </span>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              {feature.contact_cta_title || 'NEED HELP CHOOSING THE RIGHT LIGHT?'}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              {feature.contact_cta_description || 'Our lighting team in Hyderabad can help you find the perfect fixture, layout, and wholesale BOQ pricing for your project.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleOpenQuote(feature.title)}
                className="px-8 py-4 bg-[#00e676] hover:bg-[#00c853] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#00e676]/20 cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{feature.contact_cta_button_text || 'Contact SK Traders'}</span>
              </button>

              <a
                href="https://wa.me/919849012345?text=Hello%20SK%20Traders,%20I%20am%20interested%20in%20"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border border-emerald-500/40"
              >
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />

      <FloatingContactButtons />

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
        onSuccessLogin={(u) => setCurrentUser(u)}
      />
    </main>
  );
}
