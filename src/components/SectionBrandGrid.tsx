import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, ProductCategory } from '../services/productsApi';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SectionBrandGridProps {
  onOpenQuote?: () => void;
}

export default function SectionBrandGrid({ onOpenQuote }: SectionBrandGridProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        // Display active published categories
        const activeCats = data.filter((c) => c.is_active && c.status !== 'draft');
        setCategories(activeCats);
      } catch (err) {
        console.error('Failed to load categories for homepage grid:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Lighting Categories
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Explore Lighting Solutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover tailored illumination systems engineered by Philips & SK Traders for indoor, outdoor, smart, and commercial spaces.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/lighting/${cat.slug}`)}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200 flex flex-col justify-end p-6"
              >
                {/* Background Image */}
                <img
                  src={cat.image_url || '/images/card_home_lighting.jpg'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Card Content */}
                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/30 backdrop-blur-md">
                    {cat.item_count_label || 'Explore Collection'}
                  </span>

                  <h3 className="text-xl font-extrabold tracking-tight group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>

                  {cat.subtitle && (
                    <p className="text-xs text-slate-300 line-clamp-2 font-normal leading-relaxed">
                      {cat.subtitle}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
