import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchPublicApplications,
  ApplicationItem,
} from '../admin/services/applicationsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingContactButtons from '../components/FloatingContactButtons';
import QuoteModal from '../components/QuoteModal';
import SEOHead from '../components/SEOHead';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Factory,
  Hospital,
  ShoppingBag,
  Trees,
  Trophy,
  Filter,
} from 'lucide-react';

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubject, setQuoteSubject] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchPublicApplications();
      setApplications(data);
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Commercial', 'Industrial', 'Healthcare', 'Retail', 'Outdoor'];

  const filteredApplications =
    selectedCategory === 'All'
      ? applications
      : applications.filter((app) => app.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Commercial':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'Industrial':
        return <Factory className="w-4 h-4 text-amber-400" />;
      case 'Healthcare':
        return <Hospital className="w-4 h-4 text-cyan-400" />;
      case 'Retail':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      case 'Outdoor':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'Sports':
        return <Trophy className="w-4 h-4 text-[#00e676]" />;
      default:
        return <Building2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleOpenQuote = (title: string) => {
    setQuoteSubject(`Application Inquiry: ${title}`);
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#00e676] selection:text-black">
      <SEOHead
        title="Lighting Applications & Solutions | Commercial, Hospital Cleanroom & Industrial"
        description="Discover specialized Philips & Signify lighting application solutions by SK Traders Hyderabad. Cleanroom hospital fixtures, industrial high-bays, commercial offices & facade lighting."
        canonicalPath="/applications"
        keywords="SK Traders Applications, Hospital Cleanroom Lighting Hyderabad, Industrial Highbay Lighting, Office Circadian LED, Facade Lighting India"
      />
      <Navbar onOpenQuote={() => handleOpenQuote('General Application')} />

      {/* Hero Banner Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(#00e676_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-[#00e676]/40 text-[#00e676] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#00e676]/10">
            <Sparkles className="w-4 h-4" />
            <span>Signify Professional Lighting Applications</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Light Up Every Space With Precision & Intelligence
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover tailored Signify & Philips professional lighting solutions for offices, healthcare, manufacturing, retail, outdoor infrastructure, and sports arenas.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mr-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Sectors:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00e676] text-black shadow-lg shadow-[#00e676]/20 font-extrabold scale-105'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Showcase Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No applications available in this sector currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#00e676]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00e676]/10"
              >
                {/* Header Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={app.image_url}
                    alt={app.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-bold text-white flex items-center gap-2">
                    {getCategoryIcon(app.category)}
                    <span>{app.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#00e676] transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                      {app.subtitle || app.description}
                    </p>

                    {/* Key Features List */}
                    {app.key_features && app.key_features.length > 0 && (
                      <div className="pt-3 space-y-2 border-t border-slate-800/80">
                        {app.key_features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                    <Link
                      to={`/applications/${app.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#00e676] transition-colors"
                    >
                      <span>Explore Application</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      onClick={() => handleOpenQuote(app.title)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-[#00e676] text-slate-200 hover:text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <FloatingContactButtons />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={quoteSubject}
      />
    </div>
  );
}
