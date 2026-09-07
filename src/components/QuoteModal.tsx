import React, { useState } from 'react';
import { COMPANY_INFO } from '@/lib/data';
import { X, Sparkles, Send, Phone, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './QuoteModal.css';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductName?: string;
}

export default function QuoteModal({ isOpen, onClose, initialProductName }: QuoteModalProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [productName, setProductName] = useState(initialProductName || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('Commercial');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 4000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello SK Traders,\nI would like to request a quote for:\n- Product/Scope: ${productName || scope}\n- Customer Name: ${name}\n- Contact Phone: ${phone}\n- Details: ${message}`
    );
    window.open(`https://wa.me/918074681217?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-navyDark/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-brand-navy border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-brand-gold hover:text-brand-navy transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-mono font-semibold uppercase tracking-wider w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SK Traders Official Quote Request</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              Get A Fast Commercial Quote
            </h3>
            <p className="text-xs text-slate-300 font-light">
              Receive competitive wholesale pricing and delivery estimates for authentic Philips luminaires.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center flex flex-col items-center gap-3 animate-fadeIn my-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <span className="text-xl font-bold text-white">Quote Request Received!</span>
              <p className="text-xs text-slate-300">
                Our sales team in Troop Bazar, Hyderabad will prepare your pricing estimate and call you back shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-brand-navyDark border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-brand-navyDark border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-brand-navyDark border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-300">Project Category</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-brand-navyDark border border-white/15 text-white text-sm focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Commercial">Commercial Office</option>
                    <option value="Residential">Residential Villa/Apt</option>
                    <option value="Retail">Retail Showroom</option>
                    <option value="Industrial">Industrial Highbay / Plant</option>
                    <option value="Outdoor">Outdoor / Street Lighting</option>
                  </select>
                </div>
              </div>

              {initialProductName && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-brand-gold">Target Luminaire Fixture</label>
                  <input
                    type="text"
                    readOnly
                    value={initialProductName}
                    className="px-4 py-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-semibold"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-slate-300">Estimated Quantity & Specifications</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 50 units of 36W LED Panel Lights, 3000K CCT..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-brand-navyDark border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-gold resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,102,255,0.4)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-brand-gold" />
                  <span>Submit Web Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct WhatsApp Quote</span>
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              Genuine Philips Products Guaranteed
            </span>
            <span>Troop Bazar, Hyderabad</span>
          </div>
        </div>
      </div>
    </div>
  );
}
