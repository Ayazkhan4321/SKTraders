import React from 'react';
import { Product, COMPANY_INFO } from '@/lib/data';
import { X, ShieldCheck, Zap, Sun, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import './ProductDetailModal.css';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenQuote: (productName?: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onOpenQuote,
}: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-navyDark/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-brand-navy border border-white/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-brand-gold hover:text-brand-navy transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Half: Product Photography */}
        <div className="w-full md:w-1/2 relative bg-black min-h-[300px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>

          {/* Brand Badge */}
          <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-brand-navyDark/90 border border-brand-gold/40 text-brand-gold text-xs font-semibold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Genuine {product.brand} Luminaire</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs text-brand-slate uppercase font-mono tracking-wider block">
              Application Scope
            </span>
            <span className="text-sm text-white font-medium">
              {product.application}
            </span>
          </div>
        </div>

        {/* Right Half: Technical Specifications & Quote Request */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-mono text-brand-gold uppercase tracking-widest block mb-1">
                Category: {product.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                {product.name}
              </h3>
            </div>

            <p className="text-slate-300 text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 uppercase text-[10px] font-mono">WATTAGE</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-brand-blue" />
                  {product.wattage}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-x border-white/10 px-2">
                <span className="text-slate-400 uppercase text-[10px] font-mono">LUMENS</span>
                <span className="text-brand-gold font-bold flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" />
                  {product.lumens}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 uppercase text-[10px] font-mono">CCT TEMP</span>
                <span className="text-slate-200 font-bold text-[11px]">
                  {product.cct.split('/')[0]}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Technical Highlights:
              </span>
              {product.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-6">
            <button
              onClick={() => {
                onClose();
                onOpenQuote(product.name);
              }}
              className="w-full py-3.5 rounded-full bg-brand-blue hover:bg-blue-600 text-white font-display font-semibold text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>Inquire Price & Stock for this Product</span>
            </button>

            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Inquiry (+91 8074 681 217)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
