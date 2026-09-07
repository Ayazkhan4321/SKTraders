import React, { useState } from 'react';
import { PRODUCTS, Product } from '@/lib/data';
import { ArrowRight, Zap, Sun, ShieldCheck } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import './Section05FeaturedProducts.css';

interface Section05FeaturedProductsProps {
  onOpenQuote: (productName?: string) => void;
}

export default function Section05FeaturedProducts({ onOpenQuote }: Section05FeaturedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const filterCategories = ['All', 'Downlights', 'Panel Lights', 'Commercial Lighting', 'Floodlights', 'Spotlights', 'Smart Lighting', 'LED Tubes'];

  const filteredProducts = activeCategoryFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategoryFilter);

  return (
    <section
      id="products"
      className="relative py-24 bg-white border-b border-slate-200 text-slate-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#00c853]"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-[#00c853] uppercase font-bold">
                Section 05 — Product Catalogue
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900">
              FEATURED <br className="hidden sm:inline" />
              <span className="text-slate-900">
                LIGHTING FIXTURES
              </span>
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base font-normal max-w-md">
            Selected genuine Philips LED fixtures & architectural luminaires supplied with complete technical warranty by SK Traders.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeCategoryFilter === cat
                  ? 'bg-slate-900 text-white font-bold shadow-md'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              data-cursor={cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-[#00c853] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between"
              data-cursor="VIEW PRODUCT →"
            >
              {/* Product Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />

                {/* Brand Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-white text-[10px] font-mono font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00e676]" />
                  <span>{product.brand}</span>
                </div>

                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-mono text-slate-800 border border-slate-200 font-semibold">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-[#00c853] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Spec Indicators */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>{product.wattage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>{product.lumens}</span>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="pt-3 flex items-center justify-between text-xs font-bold text-[#00c853] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>View Technical Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenQuote={onOpenQuote}
      />
    </section>
  );
}
