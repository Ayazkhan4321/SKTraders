import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchApplicationBySlug,
  fetchPublicApplications,
  ApplicationItem,
} from '../admin/services/applicationsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingContactButtons from '../components/FloatingContactButtons';
import QuoteModal from '../components/QuoteModal';
import SEOHead from '../components/SEOHead';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<ApplicationItem | null>(null);
  const [otherApps, setOtherApps] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const [item, all] = await Promise.all([
        fetchApplicationBySlug(slug),
        fetchPublicApplications(),
      ]);
      setApp(item);
      setOtherApps(all.filter((a) => a.slug !== slug).slice(0, 3));
      setLoading(false);
    }
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#00e676] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-medium">Loading Application Specifications...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Application Sector Not Found</h2>
          <p className="text-slate-400 text-sm">The requested application area does not exist or has been removed.</p>
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00e676] text-black font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Applications</span>
          </Link>
        </div>
      </div>
    );
  }

  const appBreadcrumbJsonLd = {
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
        name: 'Applications',
        item: 'https://www.sktradersphilipslighting.com/applications',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: app.title,
        item: `https://www.sktradersphilipslighting.com/applications/${app.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#00e676] selection:text-black">
      <SEOHead
        title={`${app.title} | Philips Solutions | SK Traders`}
        description={app.description || app.subtitle}
        canonicalPath={`/applications/${app.slug}`}
        image={app.image_url}
        keywords={`${app.title}, ${app.category}, Philips Lighting Solutions, SK Traders Hyderabad`}
        jsonLd={appBreadcrumbJsonLd}
      />
      <Navbar onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Hero Banner with Application Background */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={app.image_url}
            alt={app.title}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 space-y-6">
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00e676] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications Overview</span>
          </Link>

          <div className="space-y-4 max-w-3xl">
            <span className="px-3.5 py-1.5 rounded-full bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 text-xs font-extrabold uppercase tracking-wider">
              {app.category} Sector Specification
            </span>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
              {app.title}
            </h1>

            <p className="text-slate-200 text-lg sm:text-xl font-medium leading-relaxed">
              {app.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content Body & Key Advantages */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Overview & Detailed Features */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-[#00e676]" />
              <span>Application Overview</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {app.description}
            </p>
          </div>

          {/* Key Advantages List */}
          {app.key_features && app.key_features.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Key Lighting Benefits & Standards</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {app.key_features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00e676] shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-xs sm:text-sm font-medium leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Products CTA Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Looking for Luminaires for {app.title}?</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Explore our full 3D interactive product studio catalogue of Signify & Philips luminaires.
              </p>
            </div>
            <Link
              to="/products"
              className="px-6 py-3 bg-[#00e676] hover:bg-[#00c853] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-[#00e676]/20"
            >
              Browse Products Studio →
            </Link>
          </div>
        </div>

        {/* Right Sidebar: Inquiry Card & Other Sectors */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl sticky top-28">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#00e676]">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Project Consultation</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Need Specifier Design Support?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Contact SK Traders lighting specialists for Dialux calculations, photometric data, and turnkey supply.
              </p>
            </div>

            <button
              onClick={() => setQuoteModalOpen(true)}
              className="w-full py-3.5 bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-[#00c853] hover:to-emerald-600 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Request Lighting Quotation</span>
            </button>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Official Authorized Signify Distributor</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Original Manufacturer Warranty & Support</span>
              </div>
            </div>
          </div>

          {/* Other Applications Links */}
          {otherApps.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Other Application Sectors
              </h4>
              <div className="space-y-3">
                {otherApps.map((other) => (
                  <Link
                    key={other.id}
                    to={`/applications/${other.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <img
                      src={other.image_url}
                      alt={other.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-white truncate group-hover:text-[#00e676]">
                        {other.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{other.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingContactButtons />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={`Application Inquiry: ${app.title}`}
      />
    </div>
  );
}
