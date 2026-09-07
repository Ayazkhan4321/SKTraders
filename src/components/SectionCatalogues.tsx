import React, { useState, useEffect } from 'react';
import { CatalogueItem, apiFetchCatalogues } from '@/lib/supabase';
import { Download, Eye, FileText, Sparkles, ShoppingBag, Filter, BookOpen } from 'lucide-react';
import './SectionCatalogues.css';

interface SectionCataloguesProps {
  onSelectCatalogue: (catalogue: CatalogueItem) => void;
  onOpenPayment: () => void;
}

export default function SectionCatalogues({ onSelectCatalogue, onOpenPayment }: SectionCataloguesProps) {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalogues() {
      setLoading(true);
      const data = await apiFetchCatalogues();
      setCatalogues(data);
      setLoading(false);
    }
    loadCatalogues();
  }, []);

  const categories = [
    'All',
    'Residential',
    'Hospitals & Healthcare',
    'Commercial & Retail',
    'Construction & Infrastructure',
  ];

  const filteredCatalogues =
    activeCategory === 'All'
      ? catalogues
      : catalogues.filter((c) => c.category === activeCategory);

  return (
    <section id="catalogues" className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#00e676]/10 border border-[#00e676]/40 text-[#00c853] text-xs font-semibold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Project Catalogues & Specifications
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              PHILIPS & SIGNIFY <span className="text-[#00c853]">CATALOGUES</span>
            </h2>
            <p className="text-slate-600 mt-2 text-base max-w-2xl">
              Explore official Signify & Philips product specification catalogues for residential homes, hospitals, commercial centers, and major construction projects.
            </p>
          </div>

          <button
            onClick={onOpenPayment}
            className="btn-signify-green text-xs self-start md:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Request Full Catalogue</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-800 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalogues Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse border border-slate-300"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalogues.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white border border-slate-200 hover:border-slate-900 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Catalogue Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-[#00e676] uppercase tracking-wider">
                      {cat.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] text-slate-200 font-mono flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[#00e676]" /> {cat.pageCount} Pages
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#00c853] transition-colors line-clamp-2">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCatalogue(cat)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <a
                    href={cat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#00e676] hover:bg-[#00c853] text-black transition-all shadow-sm"
                    title="Download Catalogue PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
