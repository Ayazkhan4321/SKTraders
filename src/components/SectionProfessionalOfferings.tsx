import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionProfessionalOfferingsProps {
  onOpenQuote: () => void;
}

export default function SectionProfessionalOfferings({ onOpenQuote }: SectionProfessionalOfferingsProps) {
  return (
    <section id="offerings" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header matching Screenshot 5 */}
        <div className="mb-10 text-left">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
            Explore Signify's professional offerings
          </h2>
        </div>

        {/* 2 Split Feature Boxes Grid matching Screenshot 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Box: Products (Light Background with Luminaire Cutout) */}
          <div
            onClick={onOpenQuote}
            className="group cursor-pointer relative bg-slate-50 border border-slate-100 p-8 sm:p-10 flex flex-col justify-between min-h-[460px] overflow-hidden signify-card shadow-sm hover:shadow-xl"
          >
            {/* Top Product Hero Image Cutout matching Screenshot 5 */}
            <div className="w-full h-56 flex items-center justify-center mb-6 relative">
              <img
                src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop"
                alt="Signify Linear LED Luminaire Products"
                className="max-h-52 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Content matching Screenshot 5 */}
            <div className="space-y-3 pt-4 border-t border-slate-200/60">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Products
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                Explore our Signify catalogue of LED luminaires, lamps, bulbs, tubes, controls and electronics.
              </p>
              <div className="pt-4 flex justify-end">
                <ArrowRight className="w-6 h-6 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right Box: Applications (Dark Night Background with Lit Tower) */}
          <div
            onClick={onOpenQuote}
            className="group cursor-pointer relative bg-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[460px] overflow-hidden signify-card shadow-sm hover:shadow-2xl border-b-4 border-b-[#00e676]"
          >
            {/* Background Night Tower Image matching Screenshot 5 */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
                alt="Signify Applications Tower"
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>
            </div>

            {/* Empty top for spacing */}
            <div className="relative z-20 h-40"></div>

            {/* Bottom Content matching Screenshot 5 */}
            <div className="relative z-20 space-y-3 pt-4">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Applications
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed max-w-md">
                Discover how to best light up your area including offices, buildings, cities, horticulture and entertainment.
              </p>
              <div className="pt-4 flex justify-end">
                <ArrowRight className="w-6 h-6 text-[#00e676] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
