import React, { useState } from 'react';
import { COMPANY_INFO } from '@/lib/data';
import { Phone, Mail, MapPin, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import './Section10Contact.css';

interface Section10ContactProps {
  onOpenQuote: () => void;
}

export default function Section10Contact({ onOpenQuote }: Section10ContactProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Residential',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', projectType: 'Residential', message: '' });
    }, 5000);
  };

  return (
    <section
      id="contact"
      className="relative py-24 bg-white border-b border-slate-200 text-slate-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Main CTA Banner Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-14 shadow-lg mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Start Your Lighting Project</span>
              </div>
              <h2 className="text-3xl md:text-5xl xl:text-6xl font-display font-extrabold text-slate-900 leading-tight">
                LET&apos;S LIGHT UP <br className="hidden sm:inline" />
                <span className="text-[#00c853]">
                  YOUR NEXT PROJECT.
                </span>
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-normal">
                Have a lighting requirement? Talk to SK Traders for expert product selection, authentic Philips luminaires, and competitive quotes.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={onOpenQuote}
                className="w-full py-4 rounded-full bg-[#00e676] hover:bg-[#00c853] text-black font-display font-bold text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2"
                data-cursor="GET QUOTE"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Get A Quote</span>
              </button>

              <a
                href={COMPANY_INFO.phoneUrl}
                className="w-full py-4 rounded-full bg-white border border-slate-300 hover:border-slate-800 text-slate-900 font-display font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                data-cursor="CALL"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Us (+91 95735 77765)</span>
              </a>

              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md"
                data-cursor="WHATSAPP"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Form & Map Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Inquiry Form */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
              Send Direct Message
            </h3>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                <span className="text-lg font-bold text-slate-900">Message Sent Successfully!</span>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out to SK Traders. Our lighting consultation team will contact you shortly at your provided phone number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-700 font-semibold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#00c853]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-700 font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#00c853]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-700 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#00c853]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-slate-700 font-semibold">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#00c853]"
                    >
                      <option value="Residential">Residential Villa/Apt</option>
                      <option value="Commercial">Commercial Office</option>
                      <option value="Retail">Retail Store / Showroom</option>
                      <option value="Industrial">Industrial Plant / Warehouse</option>
                      <option value="Outdoor">Outdoor / Infrastructure</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-slate-700 font-semibold">Requirement Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your luminaire quantity, wattage requirements, or project scope..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#00c853] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-[#00c853] text-white font-display font-bold text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Lighting Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Address Details & Google Maps Preview */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Contact Details List Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500 uppercase font-semibold">LOCATION ADDRESS</span>
                  <span className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {COMPANY_INFO.address}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-200 pt-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500 uppercase font-semibold">PHONE / MOBILE</span>
                  <a href={COMPANY_INFO.phoneUrl} className="text-sm font-semibold text-slate-900 hover:text-[#00c853] font-mono">
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-200 pt-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500 uppercase font-semibold">EMAIL ADDRESS</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm font-semibold text-slate-900 hover:text-[#00c853] font-mono">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Box */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 h-[280px] bg-slate-100 shadow-lg">
              <iframe
                title="SK Traders Location Map - Troop Bazar Hyderabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.476472483863!2d78.4735!3d17.3882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb978e8adffffff%3A0x0!2sTroop%20Bazaar%2C%20Nampally%2C%20Hyderabad%2C%20Telangana%20500001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-white text-xs font-mono font-semibold uppercase tracking-wider backdrop-blur-md">
                ✦ Hyderabad Showroom Map
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
