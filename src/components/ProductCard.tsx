import React from 'react';
import { Link } from 'react-router-dom';
import { DetailedProduct } from '@/services/productsApi';
import { Zap, Sun, ShieldCheck, Sparkles, ArrowRight, Layers, Eye } from 'lucide-react';

interface ProductCardProps {
  product: DetailedProduct;
  onOpenQuote?: (productName?: string) => void;
}

export function ProductCard({ product, onOpenQuote }: ProductCardProps) {
  return (
    <div className="group cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-[#00c853] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between font-sans">
      {/* Product Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-white text-[10px] font-mono font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#00e676]" />
            <span>{product.brand}</span>
          </span>

          {product.is_smart && (
            <span className="px-2.5 py-1 rounded-full bg-[#00c853] text-slate-950 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Smart Wi-Fi</span>
            </span>
          )}
        </div>

        {/* 3D Badge */}
        {product.is_3d_enabled && (
          <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-cyan-400 text-[10px] font-mono font-bold backdrop-blur-md flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>3D View</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00c853]">
            {product.category_name}
          </span>

          <h3 className="text-lg font-display font-extrabold text-slate-900 group-hover:text-[#00c853] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 font-normal leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications Pills */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-700">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{product.wattage}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{product.lumens}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            to={`/products/detail/${product.slug}`}
            className="text-xs font-bold text-[#00c853] uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1.5"
          >
            <span>View Product</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {onOpenQuote && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuote(product.name);
              }}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
            >
              Get Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
