import React, { useEffect, useState } from 'react';
import { fetchPublicBrandLogos, FooterBrand } from '@/admin/services/brandLogosApi';
import './Footer.css';

export default function FooterBrandLogos() {
  const [brands, setBrands] = useState<FooterBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchPublicBrandLogos();
        setBrands(data);
      } catch (err) {
        console.warn('Failed to load footer brand logos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  const handleImageError = (brandId: string) => {
    setFailedImageIds((prev) => ({ ...prev, [brandId]: true }));
  };

  if (loading) {
    return (
      <section className="bg-slate-50 border-b border-slate-200/80 py-8 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-3.5 w-36 bg-slate-200 mx-auto rounded animate-pulse mb-6"></div>
          <div className="flex items-center justify-center gap-8">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="h-9 w-28 bg-slate-200/70 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  // Duplicate brands array to create a 100% seamless infinite video loop
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="bg-slate-50 border-b border-slate-200/80 py-8 md:py-10 relative z-10 font-sans shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 md:mb-7 text-center">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-[0.25em] inline-block">
          Our global brands
        </h3>
      </div>

      {/* Video-Play Infinite Marquee Reel */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Gradient Fade Masks on Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-brand-marquee flex items-center gap-10 sm:gap-14 md:gap-16">
          {marqueeBrands.map((brand, idx) => {
            const hasError = failedImageIds[brand.id];
            const itemKey = `${brand.id}-${idx}`;

            const logoContent = (
              <div className="shrink-0 flex items-center justify-center transition-all duration-300 opacity-85 hover:opacity-100 transform hover:scale-105 group cursor-pointer py-1.5 px-3">
                {!hasError && brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={`${brand.brand_name} Logo`}
                    onError={() => handleImageError(brand.id)}
                    style={{
                      height: brand.logo_height ? `${brand.logo_height}px` : undefined,
                      maxWidth: brand.logo_width ? `${brand.logo_width}px` : undefined,
                    }}
                    className="h-8 sm:h-9 md:h-10 max-h-12 w-auto object-contain transition-transform duration-300 select-none"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-800 uppercase group-hover:text-blue-600 transition-colors">
                    {brand.brand_name}
                  </span>
                )}
              </div>
            );

            if (brand.website_url) {
              return (
                <a
                  key={itemKey}
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${brand.brand_name} Official Website`}
                  className="shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-md transition-all"
                >
                  {logoContent}
                </a>
              );
            }

            return (
              <div key={itemKey} className="shrink-0">
                {logoContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


