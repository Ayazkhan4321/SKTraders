import React from 'react';
import { CatalogueItem } from '@/lib/supabase';
import { X, Download, FileText, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './CatalogueModal.css';

interface CatalogueModalProps {
  catalogue: CatalogueItem | null;
  onClose: () => void;
  onOpenPayment: (catalogueTitle?: string) => void;
}

export default function CatalogueModal({ catalogue, onClose, onOpenPayment }: CatalogueModalProps) {
  if (!catalogue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-[#00e676]/40 rounded-none overflow-hidden shadow-2xl text-white">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white border border-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Preview Image */}
          <div className="md:col-span-5 relative h-64 md:h-auto bg-slate-900">
            <img
              src={catalogue.imageUrl}
              alt={catalogue.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Details Content */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 text-xs font-bold uppercase tracking-wider mb-3">
                <FileText className="w-3.5 h-3.5" /> {catalogue.category} Catalogue
              </div>

              <h3 className="text-2xl font-display font-bold text-white leading-tight">
                {catalogue.title}
              </h3>

              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {catalogue.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
                  <span>100% Genuine Signify & Philips Factory Specification</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
                  <span>Complete Photometric Datasheets & IES files included</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#00e676]" />
                  <span>Backed by SK Traders On-site Warranty & Technical Support</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onClose();
                  onOpenPayment(catalogue.title);
                }}
                className="flex-1 btn-signify-green justify-center py-3 text-xs uppercase"
              >
                <ShoppingBag className="w-4 h-4" /> Request Quote / Inquiry
              </button>

              <a
                href={catalogue.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#00e676]" /> PDF Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
