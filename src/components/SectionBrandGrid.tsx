import React from 'react';

interface SectionBrandGridProps {
  onOpenQuote: () => void;
}

export default function SectionBrandGrid({ onOpenQuote }: SectionBrandGridProps) {
  const brandCards = [
    {
      id: 'philips',
      name: 'PHILIPS',
      subtext: 'Professional & Home Lighting',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      logoStyle: 'font-display font-black tracking-widest text-2xl text-white uppercase',
    },
    {
      id: 'hue',
      name: 'PHILIPS hue',
      subtext: 'Smart Connected Home Atmosphere',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      logoStyle: 'font-display font-bold tracking-tight text-2xl text-white',
    },
    {
      id: 'colorkinetics',
      name: 'COLOR KINETICS',
      subtext: 'Architectural Dynamic RGB Illumination',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
      logoStyle: 'font-display font-extrabold tracking-wider text-xl text-white uppercase flex items-center gap-2',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandCards.map((card) => (
            <div
              key={card.id}
              onClick={onOpenQuote}
              className="group relative cursor-pointer aspect-[3/4] rounded-none overflow-hidden signify-card shadow-sm hover:shadow-xl"
            >
              {/* Card Image */}
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay for bottom text visibility matching Screenshot 2 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Bottom Logo & Brand Overlay matching Screenshot 2 */}
              <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col items-start space-y-1">
                {card.id === 'colorkinetics' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <span className="font-display font-extrabold tracking-wider text-xl text-white uppercase">
                      COLOR KINETICS
                    </span>
                  </div>
                ) : card.id === 'hue' ? (
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest font-bold text-white/80">PHILIPS</span>
                    <span className="font-display font-bold text-3xl text-white tracking-tight leading-none">
                      hue
                    </span>
                  </div>
                ) : (
                  <span className="font-display font-black tracking-widest text-3xl text-white uppercase">
                    PHILIPS
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
