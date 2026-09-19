import React, { useEffect, useRef, useState } from 'react';
import { FeatureInteractiveComponent } from '@/admin/services/featuresApi';
import {
  Sparkles,
  Sun,
  Zap,
  Cpu,
  ShieldCheck,
  ChevronDown,
  Info,
  Maximize2,
  Sliders,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface InteractiveProductExploderProps {
  components: FeatureInteractiveComponent[];
  productTitle: string;
  productImage?: string;
}

export default function InteractiveProductExploder({
  components,
  productTitle,
  productImage,
}: InteractiveProductExploderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (closed) to 1 (fully exploded)
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Auto-select first component
  useEffect(() => {
    if (components && components.length > 0 && !activeComponentId) {
      setActiveComponentId(components[0].id);
    }
  }, [components, activeComponentId]);

  // Scroll Progress Observer
  useEffect(() => {
    if (reducedMotion || manualMode) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start animation when section enters viewport mid-screen
      const totalDistance = rect.height + windowHeight * 0.4;
      const currentScroll = windowHeight - rect.top;

      let progress = currentScroll / totalDistance;
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, manualMode]);

  if (!components || components.length === 0) {
    return null;
  }

  const renderIcon = (iconName?: string) => {
    const props = { className: 'w-5 h-5 text-[#00e676]' };
    switch (iconName) {
      case 'Sun':
        return <Sun {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const selectedComp = components.find((c) => c.id === activeComponentId) || components[0];

  return (
    <section
      id="discover-inside"
      ref={containerRef}
      className="py-24 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden font-sans select-none"
    >
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e676]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00e676] uppercase tracking-[0.25em] font-bold bg-[#00e676]/10 border border-[#00e676]/30 px-4 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>DISCOVER WHAT'S INSIDE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            See How {productTitle} Is Built
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Scroll to slowly disassemble the fixture. Click any part to learn what it does in simple human terms.
          </p>

          {/* Controls Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3.5 py-1.5 rounded-full border transition-all font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                reducedMotion
                  ? 'bg-[#00e676] text-slate-950 border-[#00e676]'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{reducedMotion ? '✓ Static Card Mode' : 'Toggle Reduced Motion'}</span>
            </button>

            <button
              onClick={() => {
                setManualMode(!manualMode);
                if (!manualMode) setScrollProgress(0.75);
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                manualMode
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{manualMode ? 'Manual Slider Active' : 'Manual Progress Controls'}</span>
            </button>
          </div>
        </div>

        {/* Manual Progress Slider if Enabled */}
        {(manualMode || reducedMotion) && (
          <div className="max-w-md mx-auto mb-12 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 text-center animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <span>Product Assembled (0%)</span>
              <span className="text-[#00e676]">Exploded View ({Math.round(scrollProgress * 100)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={scrollProgress}
              onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
              className="w-full accent-[#00e676] cursor-pointer"
            />
          </div>
        )}

        {/* REDUCED MOTION STATIC CARD GRID FALLBACK */}
        {reducedMotion ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {components.map((comp, idx) => (
              <div
                key={comp.id}
                onClick={() => setActiveComponentId(comp.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  comp.id === selectedComp.id
                    ? 'bg-slate-900 border-[#00e676] shadow-xl shadow-[#00e676]/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center text-xs font-mono font-bold text-[#00e676]">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {comp.tagline}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                  <p className="text-xs text-[#00e676] font-medium mt-1">
                    {comp.human_explanation}
                  </p>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {comp.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* CINEMATIC INTERACTIVE EXPLODED STAGE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[600px]">
            {/* LEFT / CENTER: INTERACTIVE EXPLODED VISUALIZER */}
            <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[500px] bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
              {/* Scroll Progress Indicator Ring */}
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping" />
                <span>Explode Progress: {Math.round(scrollProgress * 100)}%</span>
              </div>

              {/* Central Stack of Exploded Component Layers */}
              <div className="relative w-full max-w-sm flex flex-col items-center justify-center py-12 space-y-3">
                {components.map((comp, idx) => {
                  const isSelected = comp.id === selectedComp.id;

                  // Calculate exploded vertical displacement based on scrollProgress
                  const spreadFactor = (scrollProgress - 0.1) / 0.8;
                  const clampedSpread = Math.max(0, Math.min(1, spreadFactor));

                  // Offset ranges from 0 (assembled) to expanded translateY pixels
                  const maxDisplacement = (idx - (components.length - 1) / 2) * 48;
                  const currentY = clampedSpread * maxDisplacement;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setActiveComponentId(comp.id)}
                      style={{
                        transform: `translateY(${currentY}px) scale(${isSelected ? 1.05 : 1})`,
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s',
                      }}
                      className={`w-full max-w-xs p-4 rounded-2xl border cursor-pointer backdrop-blur-md flex items-center justify-between shadow-lg relative group ${
                        isSelected
                          ? 'bg-[#00e676]/15 border-[#00e676] shadow-[#00e676]/20 z-30'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-600 z-10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#00e676] text-slate-950 font-bold'
                              : 'bg-slate-800 text-[#00e676]'
                          }`}
                        >
                          {renderIcon(comp.icon_name)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-[#00e676] transition-colors">
                            {comp.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {comp.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Line connector dot */}
                      <div
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'bg-[#00e676] border-white scale-125'
                            : 'bg-slate-700 border-slate-500'
                        }`}
                      />

                      {/* Connecting Line Badge on Hover/Select */}
                      {isSelected && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-12 h-[2px] bg-[#00e676]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scroll prompt guide */}
              <div className="absolute bottom-4 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                <span>{scrollProgress > 0.8 ? 'Fully exploded — click any part' : 'Scroll down to explode components'}</span>
              </div>
            </div>

            {/* RIGHT SIDE: HUMAN-FRIENDLY COMPONENT EXPLANATION CARD */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-[#00e676] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#00e676]" />
                    <span>Component Breakdown</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                    {selectedComp.tagline}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-display font-extrabold text-white">
                    {selectedComp.name}
                  </h3>

                  {/* HUMAN FRIENDLY HIGHLIGHT BOX */}
                  <div className="p-4 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/30 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00e676] font-bold">
                      WHAT DOES THIS DO?
                    </span>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      "{selectedComp.human_explanation}"
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Technical Function
                  </span>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {selectedComp.description}
                  </p>
                </div>

                {/* Interactive Selection Tabs at Bottom */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                    Select Part to Inspect:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {components.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveComponentId(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          c.id === selectedComp.id
                            ? 'bg-[#00e676] text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {i + 1}. {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
