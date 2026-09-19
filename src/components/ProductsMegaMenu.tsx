import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Lightbulb,
  Tv,
  Layers,
  Wind,
  Sliders,
} from 'lucide-react';

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export const MEGA_MENU_CATEGORIES = [
  {
    title: 'Architectural & Household',
    icon: <Sun className="w-4 h-4 text-[#00c853]" />,
    items: [
      { name: 'Ceiling Lights', slug: 'ceiling-lights', desc: 'Ultra-thin, glare-free ceiling troffers' },
      { name: 'LED Bulbs', slug: 'led-bulbs', desc: 'High-efficacy B22 & E27 lamps' },
      { name: 'Panel Lights', slug: 'panel-lights', desc: 'Edge-lit 2x2 office grid panels' },
      { name: 'Downlights', slug: 'downlights', desc: 'Deep recessed COB spotlights' },
      { name: 'Spotlights', slug: 'spotlights', desc: '360° rotatable track spotlights' },
    ],
  },
  {
    title: 'Decorative & Ambience',
    icon: <Sparkles className="w-4 h-4 text-purple-600" />,
    items: [
      { name: 'Decorative Lights', slug: 'decorative-lights', desc: 'Chandeliers, pendants & wall sconces' },
      { name: 'Pendant Lights', slug: 'decorative-lights', desc: 'Suspended architectural lighting' },
      { name: 'Wall Lights', slug: 'decorative-lights', desc: 'Warm wall ambient sconces' },
    ],
  },
  {
    title: 'Smart Connected Lighting',
    icon: <Zap className="w-4 h-4 text-amber-500" />,
    items: [
      { name: 'WiZ Smart Bulbs', slug: 'smart-lighting', desc: '16 Million RGB colors & voice control' },
      { name: 'Smart Ceiling Lights', slug: 'smart-lighting', desc: 'Tunable white app-scheduled panels' },
      { name: 'RGB Lightstrips', slug: 'smart-lighting', desc: 'Flexible mood cove LED strips' },
    ],
  },
  {
    title: 'Fans & Power Electronics',
    icon: <Wind className="w-4 h-4 text-blue-600" />,
    items: [
      { name: 'Ceiling Fans', slug: 'fans', desc: 'Silent BLDC motor energy-saving fans' },
      { name: 'Decorative Fans', slug: 'fans', desc: 'Premium wood & metallic blade fans' },
      { name: 'LED Drivers & Supplies', slug: 'ceiling-lights', desc: 'Constant current electronic transformers' },
    ],
  },
];

export default function ProductsMegaMenu({ isOpen, onClose, isMobile = false }: ProductsMegaMenuProps) {
  if (!isOpen) return null;

  if (isMobile) {
    return (
      <div className="py-3 px-2 space-y-4 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Product Categories
          </span>
          <Link
            to="/products"
            onClick={onClose}
            className="text-[11px] font-bold text-[#00c853] hover:underline flex items-center gap-1"
          >
            <span>View All Catalogue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {MEGA_MENU_CATEGORIES.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <div className="pl-6 space-y-1.5 border-l-2 border-slate-200">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={`/products/${item.slug}`}
                    onClick={onClose}
                    className="block text-xs font-semibold text-slate-600 hover:text-[#00c853] py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-6xl mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-8 z-50 animate-fadeIn font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00c853]/10 border border-[#00c853]/30 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#00c853]" />
          </div>
          <div>
            <h3 className="text-base font-display font-extrabold text-slate-900 tracking-tight">
              SK Traders Lighting Product Catalogue
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Explore high-performance LED luminaires, smart WiZ systems, and BLDC fans
            </p>
          </div>
        </div>

        <Link
          to="/products"
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00e676]" />
        </Link>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-4 gap-8 pt-6">
        {MEGA_MENU_CATEGORIES.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              {section.icon}
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {section.title}
              </h4>
            </div>

            <div className="space-y-3">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={`/products/${item.slug}`}
                  onClick={onClose}
                  className="group block space-y-0.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#00c853] transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#00c853]" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal line-clamp-1">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00c853]" />
          <span className="font-semibold text-slate-900">Philips Official Authorized Partner</span>
          <span>• Complete technical warranty & photometric calculations</span>
        </div>

        <Link
          to="/features/smart-lighting"
          onClick={onClose}
          className="text-xs font-bold text-[#00c853] hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Smart Lighting Experience →</span>
        </Link>
      </div>
    </div>
  );
}
