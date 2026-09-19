import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminBrandSection,
  fetchPublicLeadingBrands,
  BrandSectionContent,
  LeadingBrand,
} from '../admin/services/leadingBrandsApi';

interface SectionLeadingBrandsProps {
  onOpenQuote: () => void;
}

export default function SectionLeadingBrands({ onOpenQuote }: SectionLeadingBrandsProps) {
  const navigate = useNavigate();
  const [sectionContent, setSectionContent] = useState<BrandSectionContent>({
    id: 'default',
    heading: "The world's leading lighting brands",
    description:
      'Our products, connected systems and services unlock the extraordinary potential of light to enhance well-being and performance, elevate experiences and advance sustainability.',
    button_text: 'View all brands',
    button_url: '/brands',
    is_enabled: true,
    updated_at: new Date().toISOString(),
  });

  const [brands, setBrands] = useState<LeadingBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const [sec, brs] = await Promise.all([
        fetchAdminBrandSection(),
        fetchPublicLeadingBrands(),
      ]);
      setSectionContent(sec);
      setBrands(brs);
      setLoading(false);
    }
    loadContent();
  }, []);

  // Hide section completely if section is set to disabled by Admin
  if (!loading && !sectionContent.is_enabled) {
    return null;
  }

  const handleButtonClick = () => {
    if (sectionContent.button_url && sectionContent.button_url.startsWith('/')) {
      navigate(sectionContent.button_url);
    } else if (sectionContent.button_url && sectionContent.button_url.startsWith('http')) {
      window.open(sectionContent.button_url, '_blank');
    } else {
      onOpenQuote();
    }
  };

  const handleCardClick = (brand: LeadingBrand) => {
    if (brand.website_url && brand.website_url.startsWith('http')) {
      window.open(brand.website_url, '_blank');
    } else if (brand.website_url && brand.website_url.startsWith('/')) {
      navigate(brand.website_url);
    } else {
      onOpenQuote();
    }
  };

  return (
    <section id="brands" className="py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Header & Subtitle controlled from Admin CMS */}
        <div className="max-w-3xl mx-auto space-y-4 mb-10 text-center">
          {(() => {
            const raw = sectionContent.heading || "The world's leading lighting brands";
            let lines: string[] = [];
            if (raw.includes('\n')) {
              lines = raw.split('\n');
            } else if (/signify innovation/i.test(raw)) {
              const match = raw.match(/(.*)(philips)(.*signify innovation.*)/i);
              if (match) {
                lines = [match[1].trim(), match[2].trim(), match[3].trim()];
              } else {
                lines = raw.split(/(signify innovation.*)/i).map((s) => s.trim()).filter(Boolean);
              }
            } else {
              lines = [raw];
            }

            return (
              <div className="flex flex-col items-center justify-center text-center space-y-1">
                {lines.map((line, idx) => {
                  const isSignify = /signify innovation/i.test(line);
                  const isPhilips = /^philips$/i.test(line);

                  if (isSignify) {
                    return (
                      <div
                        key={idx}
                        className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase text-center mt-1"
                      >
                        {line}
                      </div>
                    );
                  }
                  if (isPhilips) {
                    return (
                      <div
                        key={idx}
                        className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight text-center mt-1"
                      >
                        {line}
                      </div>
                    );
                  }
                  return (
                    <h2
                      key={idx}
                      className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight text-center"
                    >
                      {line}
                    </h2>
                  );
                })}
              </div>
            );
          })()}

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {sectionContent.description}
          </p>

          <div className="pt-2">
            <button
              onClick={handleButtonClick}
              className="bg-[#00e676] hover:bg-[#00c853] text-black font-bold px-8 py-3.5 rounded-none text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{sectionContent.button_text || 'View all brands'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Brand Cards Grid fetched from Supabase / Admin CMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left pt-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-none bg-slate-100 animate-pulse border border-slate-200"
                />
              ))
            : brands.map((brand, idx) => (
                <div
                  key={brand.id}
                  onClick={() => handleCardClick(brand)}
                  className="group relative cursor-pointer aspect-[3/4] overflow-hidden signify-card shadow-sm hover:shadow-2xl transition-all duration-500 rounded-none bg-slate-950 flex flex-col justify-end"
                >
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Connected Green Grid Overlay for first card */}
                  {idx === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-600/20 to-transparent mix-blend-screen pointer-events-none">
                      <div className="absolute inset-0 bg-[radial-gradient(#00e676_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                    </div>
                  )}

                  {/* Gradient Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95"></div>

                  {/* Card Content & Brand Info */}
                  <div className="relative z-10 p-6 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center bg-black/40 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-[#00e676]"></span>
                      </div>
                      <span className="font-display font-bold text-2xl text-white tracking-tight">
                        {brand.name}
                      </span>
                    </div>

                    {brand.description && (
                      <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed font-normal opacity-90 group-hover:opacity-100 transition-opacity">
                        {brand.description}
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-1.5 text-[#00e676] font-bold text-xs group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
