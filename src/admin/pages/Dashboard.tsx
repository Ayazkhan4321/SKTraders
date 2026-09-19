import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminHeroes, HeroSlide } from '../services/heroApi';
import { fetchAdminHeroCards, HeroCardItem } from '../services/heroCardsApi';
import { fetchAdminCertificates, CertificateItem } from '../services/certificatesApi';
import { fetchAdminBrandLogos, FooterBrand } from '../services/brandLogosApi';
import { fetchAdminFeatures, CompleteFeatureData } from '../services/featuresApi';
import {
  Tv,
  Layers,
  Award,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [heroes, setHeroes] = useState<HeroSlide[]>([]);
  const [heroCards, setHeroCards] = useState<HeroCardItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [brandLogos, setBrandLogos] = useState<FooterBrand[]>([]);
  const [featurePages, setFeaturePages] = useState<CompleteFeatureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const [h, hc, c, b, f] = await Promise.all([
        fetchAdminHeroes(),
        fetchAdminHeroCards(),
        fetchAdminCertificates(),
        fetchAdminBrandLogos(),
        fetchAdminFeatures(),
      ]);
      setHeroes(h);
      setHeroCards(hc);
      setCertificates(c);
      setBrandLogos(b);
      setFeaturePages(f);
      setLoading(false);
    }
    loadStats();
  }, []);

  const totalHeroSlides = heroes.length;
  const activeHeroSlides = heroes.filter((item) => item.is_active).length;
  const totalHeroCards = heroCards.length;
  const totalCertificates = certificates.length;
  const totalBrandLogos = brandLogos.length;
  const activeBrandLogos = brandLogos.filter((b) => b.is_active).length;
  const totalFeaturePages = featurePages.length;
  const activeFeaturePages = featurePages.filter((f) => f.feature.is_active).length;
  const pdfDocumentsCount = heroCards.filter((card) => Boolean(card.pdf_url)).length + certificates.filter((cert) => Boolean(cert.pdf_url)).length;

  // Combine recent items for update history list
  const recentUpdates = [
    ...heroes.map((h) => ({ type: 'Hero Slide', title: h.title, updated: h.updated_at, active: h.is_active })),
    ...heroCards.map((c) => ({ type: 'Hero Card', title: c.title, updated: c.updated_at, active: c.is_active })),
    ...certificates.map((cert) => ({ type: 'Certificate', title: cert.title, updated: cert.updated_at, active: cert.is_active })),
    ...brandLogos.map((brand) => ({ type: 'Brand Logo', title: brand.brand_name, updated: brand.updated_at, active: brand.is_active })),
    ...featurePages.map((feat) => ({ type: 'Feature Page', title: feat.feature.title, updated: feat.feature.updated_at, active: feat.feature.is_active })),
  ]
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Admin CMS Dashboard</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Central overview and content management hub for SK Traders website.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/hero')}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Hero Slide</span>
          </button>
          <button
            onClick={() => navigate('/admin/hero-cards')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Hero Card</span>
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Certificates</span>
          </button>
          <button
            onClick={() => navigate('/admin/features')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#00e676]" />
            <span>Feature Pages</span>
          </button>
          <button
            onClick={() => navigate('/admin/footer-brands')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Footer Brands</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Hero Slides */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Hero Slides</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : totalHeroSlides}
          </div>
          <div className="text-[11px] text-slate-400">Configured slides</div>
        </div>

        {/* Active Hero Slides */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Active Hero Slides</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {loading ? '-' : activeHeroSlides}
          </div>
          <div className="text-[11px] text-slate-400">Live on website</div>
        </div>

        {/* Feature Pages */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Feature Pages</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#00e676] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : `${activeFeaturePages}/${totalFeaturePages}`}
          </div>
          <div className="text-[11px] text-slate-400">Active CMS pages</div>
        </div>

        {/* Certificates */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Certificates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : totalCertificates}
          </div>
          <div className="text-[11px] text-slate-400">Compliance badges</div>
        </div>

        {/* Footer Brand Logos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 relative overflow-hidden group col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Footer Brands</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : `${activeBrandLogos}/${totalBrandLogos}`}
          </div>
          <div className="text-[11px] text-slate-400">Active / Total brands</div>
        </div>
      </div>

      {/* Main Grid: Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Website Content Health Status */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Website Content Health Status</span>
            </h3>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>System Live</span>
            </span>
          </div>

          <div className="space-y-4">
            {/* Feature Pages Status Bar */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00e676] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Feature Pages Engine</h4>
                  <p className="text-xs text-slate-400">
                    {activeFeaturePages} active CMS feature pages (/features/:slug).
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/features')}
                className="text-xs text-[#00e676] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hero Status Bar */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Hero Slider Engine</h4>
                  <p className="text-xs text-slate-400">
                    {activeHeroSlides} active of {totalHeroSlides} slides. Video & Image rendering.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/hero')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hero Cards Status Bar */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Circular Hero Cards</h4>
                  <p className="text-xs text-slate-400">
                    {totalHeroCards} cards active with PDF catalogue links.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/hero-cards')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Certificates Status Bar */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Certificates & Compliance</h4>
                  <p className="text-xs text-slate-400">
                    {totalCertificates} official certificates displayed in corporate resources.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/certificates')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Footer Brands Status Bar */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Footer Lighting Brands</h4>
                  <p className="text-xs text-slate-400">
                    {activeBrandLogos} active brands displaying dynamically in website footer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/footer-brands')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recently Updated Content Log */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Recently Updated Content</span>
          </h3>

          <div className="space-y-3">
            {recentUpdates.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <h5 className="font-semibold text-white truncate max-w-[200px]">{item.title}</h5>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  {new Date(item.updated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
