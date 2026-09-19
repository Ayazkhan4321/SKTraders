import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, ExternalLink } from 'lucide-react';
import signifyCertificate from '../assets/signify_certificate.jpg';
import { fetchPublicCertificates, CertificateItem } from '@/admin/services/certificatesApi';

interface SectionResourcesProps {
  onOpenQuote: () => void;
}

export default function SectionResources({ onOpenQuote }: SectionResourcesProps) {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  useEffect(() => {
    async function loadCerts() {
      try {
        const certs = await fetchPublicCertificates();
        if (certs && certs.length > 0) {
          setActiveCert(certs[0]);
        }
      } catch (e) {
        // fallback
      }
    }
    loadCerts();
  }, []);

  const certificateDisplay = activeCert || {
    title: 'Certificate',
    image_url: signifyCertificate,
    description: 'Official Corporate Certification & Compliance',
    pdf_url: '',
  };

  const resourceCards = [
    {
      id: 'designers',
      category: 'Resources',
      title: 'Lighting designers, architects and engineers',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'integrators',
      category: 'Resources',
      title: 'System Integrators',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="resources" className="py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Dedicated Certificate Showcase Block */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="bg-slate-50/60 border border-slate-200/80 rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-between text-center group">
              <div className="w-full flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{certificateDisplay.title || 'Official Certificate'}</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500/80"></span>
              </div>

              <div
                onClick={() => {
                  if (certificateDisplay.pdf_url) {
                    window.open(certificateDisplay.pdf_url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className={`w-full aspect-[1/1.3] relative flex items-center justify-center p-6 bg-white rounded-md border border-slate-100 shadow-inner mb-6 overflow-hidden ${
                  certificateDisplay.pdf_url ? 'cursor-pointer' : ''
                }`}
              >
                <img
                  src={certificateDisplay.image_url}
                  alt={certificateDisplay.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="text-xs text-slate-600 font-medium tracking-wide space-y-1">
                <p>{certificateDisplay.description || 'Official Corporate Certification & Compliance'}</p>
                {certificateDisplay.pdf_url && (
                  <a
                    href={certificateDisplay.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold text-xs pt-1"
                  >
                    <span>Open Verification PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Resources Intro & Stacked Resource Cards */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <div className="flex flex-col items-start space-y-6">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                Resources for lighting professionals
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                See how Signify can support your business with expert services, tools, documentation, case studies and trainings.
              </p>

              <button
                onClick={onOpenQuote}
                className="btn-signify-outline text-sm font-medium border border-slate-900 hover:bg-slate-900 hover:text-white px-6 py-3 transition-all rounded"
              >
                <span>Explore all resources</span>
              </button>
            </div>

            <div className="flex flex-col space-y-4 pt-2">
              {resourceCards.map((card) => (
                <div
                  key={card.id}
                  onClick={onOpenQuote}
                  className="group cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-all duration-300 flex flex-col sm:flex-row items-stretch overflow-hidden border border-slate-100 rounded-lg"
                >
                  <div className="sm:w-2/5 aspect-[16/10] sm:aspect-auto relative overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="sm:w-3/5 p-6 flex flex-col justify-between items-start">
                    <div>
                      <span className="text-xs text-slate-500 font-medium tracking-wide block mb-1">
                        {card.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 leading-snug">
                        {card.title}
                      </h3>
                    </div>

                    <div className="pt-6 w-full flex justify-end">
                      <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}