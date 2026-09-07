import React from 'react';

interface SectionLeadingBrandsProps {
  onOpenQuote: () => void;
}

export default function SectionLeadingBrands({ onOpenQuote }: SectionLeadingBrandsProps) {
  const brandCards = [
    {
      id: 'signify',
      title: 'signify',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
      hasNetworkOverlay: true,
    },
    {
      id: 'interact',
      title: 'signify interact',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop',
      hasNetworkOverlay: false,
    },
    {
      id: 'dynalite',
      title: 'signify Dynalite',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      hasNetworkOverlay: false,
    },
  ];

  return (
    <section id="brands" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Header & Subtitle matching Screenshot 3 */}
        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
            The world's leading lighting brands
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our products, connected systems and services unlock the extraordinary potential of light to enhance well-being and performance, elevate experiences and advance sustainability.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenQuote}
              className="bg-[#00e676] hover:bg-[#00c853] text-black font-semibold px-6 py-3 rounded-none text-sm transition-all duration-300 shadow-sm active:scale-95"
            >
              <span>View all brands</span>
            </button>
          </div>
        </div>

        {/* 3 Brand Cards Grid matching Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
          {brandCards.map((card) => (
            <div
              key={card.id}
              onClick={onOpenQuote}
              className="group relative cursor-pointer aspect-[3/4] overflow-hidden signify-card shadow-sm hover:shadow-xl"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Connected Green Grid Glow for Card 1 matching Screenshot 3 */}
              {card.hasNetworkOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-600/20 to-transparent mix-blend-screen pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(#00e676_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                </div>
              )}

              {/* Gradient Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

              {/* Bottom Logo Text matching Screenshot 3 */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center bg-black/40">
                  <span className="w-2 h-2 rounded-full bg-[#00e676]"></span>
                </div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">
                  {card.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
