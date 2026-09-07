import React, { useState } from 'react';
import { Sun, Thermometer, Sliders, Sparkles, RefreshCw } from 'lucide-react';
import './Section03InteractiveRoom.css';

export default function Section03InteractiveRoom() {
  const [cct, setCct] = useState<number>(3500); // Kelvin: 2700K (Warm) to 6500K (Cool)
  const [brightness, setBrightness] = useState<number>(85); // Percentage: 10% to 100%

  // Helper to map CCT Kelvin (2700K - 6500K) to RGB color tint overlay
  const getTemperatureColor = (k: number) => {
    // 2700K: Warm amber/golden glow (rgba(255, 170, 70))
    // 4000K: Crisp neutral white (rgba(255, 240, 220))
    // 6500K: Cool daylight blue (rgba(190, 225, 255))
    const ratio = (k - 2700) / (6500 - 2700);

    const r = Math.round(255 - ratio * 65);
    const g = Math.round(170 + ratio * 55);
    const b = Math.round(70 + ratio * 185);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getTemperatureLabel = (k: number) => {
    if (k < 3200) return 'Warm White (2700K - 3000K) — Cosy & Elegant';
    if (k < 4800) return 'Neutral White (4000K) — Balanced Productivity';
    return 'Cool Daylight (6500K) — Crisp & High Focus';
  };

  const currentColorRgb = getTemperatureColor(cct);
  const opacityLevel = (brightness / 100) * 0.75 + 0.15;

  const handleReset = () => {
    setCct(3500);
    setBrightness(85);
  };

  return (
    <section
      id="interactive-room"
      className="relative py-24 bg-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden interactive-room-section"
    >
      {/* 1. Large Light-Green Ambient Glow Bubbles */}
      <div className="absolute top-10 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#00e676]/35 via-[#84cc16]/25 to-emerald-400/20 rounded-full blur-[160px] pointer-events-none animate-float-bubble-1 z-0" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-gradient-to-bl from-[#10b981]/30 via-[#7cb342]/25 to-[#00c853]/20 rounded-full blur-[180px] pointer-events-none animate-float-bubble-2 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#84cc16]/15 rounded-full blur-[170px] pointer-events-none animate-float-bubble-3 z-0" />

      {/* 2. Floating Light Green Glass Bubble Orbs */}
      <div className="absolute top-16 left-1/6 w-24 h-24 rounded-full light-green-orb animate-float-bubble-1 pointer-events-none z-0 hidden md:block" />
      <div className="absolute top-1/3 right-12 w-32 h-32 rounded-full light-green-orb animate-float-bubble-2 pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-20 left-16 w-28 h-28 rounded-full light-green-orb animate-float-bubble-3 pointer-events-none z-0 hidden md:block" />
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full light-green-orb animate-float-bubble-1 pointer-events-none z-0 hidden md:block" />

      {/* Dynamic Background Ambient Aura driven by state */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[180px] pointer-events-none transition-colors duration-300 opacity-20 z-0"
        style={{
          backgroundColor: currentColorRgb,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Lighting Simulator</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900">
            SEE LIGHT <br className="sm:hidden" />
            <span className="text-[#00c853]">
              DIFFERENTLY.
            </span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed">
            Adjust the sliders below to experience how color temperature (CCT) and brightness intensity transform interior architecture, atmosphere, and human comfort in real-time.
          </p>
        </div>

        {/* Simulator Grid Stage & Control Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl">
          {/* Left / Top: Interactive Room Visual Stage */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 h-[380px] md:h-[480px] bg-slate-900 group">
            {/* Room Base Architectural Photo */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="Architectural Room Interior"
              className="w-full h-full object-cover object-center filter grayscale-[30%]"
            />

            {/* Dynamic Light Temperature Overlay Layer */}
            <div
              className="absolute inset-0 transition-colors duration-300 mix-blend-color-dodge pointer-events-none"
              style={{
                backgroundColor: currentColorRgb,
                opacity: opacityLevel,
              }}
            ></div>

            {/* Dynamic Light Beam Glow Layer */}
            <div
              className="absolute inset-0 transition-all duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 25%, ${currentColorRgb} 0%, transparent 70%)`,
                opacity: (brightness / 100) * 0.85,
              }}
            ></div>

            {/* Active Atmosphere Description Banner */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 border border-white/20 backdrop-blur-md flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-white/40 shadow-md"
                  style={{ backgroundColor: currentColorRgb }}
                ></div>
                <span className="text-slate-200 font-medium">
                  {getTemperatureLabel(cct)}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                title="Reset Sliders"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Right / Bottom: Lighting Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00c853]" />
                Room Lighting Console
              </h3>
              <span className="text-xs text-slate-500 uppercase font-mono tracking-wider">
                Live Optics Simulator
              </span>
            </div>

            {/* Slider 1: Color Temperature (CCT) */}
            <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  Color Temperature (CCT)
                </label>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                  {cct} K
                </span>
              </div>

              {/* Range Input */}
              <input
                type="range"
                min={2700}
                max={6500}
                step={50}
                value={cct}
                onChange={(e) => setCct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00c853]"
                data-cursor="SLIDE CCT"
              />

              <div className="flex justify-between text-[11px] text-slate-600 font-mono pt-1">
                <span className="text-amber-700 font-medium">WARM (2700K)</span>
                <span className="text-slate-600">NEUTRAL (4000K)</span>
                <span className="text-sky-700 font-medium">COOL (6500K)</span>
              </div>
            </div>

            {/* Slider 2: Brightness Dimmer */}
            <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-blue-600" />
                  Dimming & Brightness
                </label>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200">
                  {brightness} %
                </span>
              </div>

              {/* Range Input */}
              <input
                type="range"
                min={10}
                max={100}
                step={1}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                data-cursor="DIMMER"
              />

              <div className="flex justify-between text-[11px] text-slate-600 font-mono pt-1">
                <span>DIM (10%)</span>
                <span>50%</span>
                <span className="text-slate-900 font-medium">MAX BRIGHT (100%)</span>
              </div>
            </div>

            {/* Solution Recommendation Tip Box */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-1">
                ✦ SK Traders Technical Tip:
              </strong>
              Philips CCT-tunable LED luminaires support dynamic circadian rhythm scenes, switching from high 6500K daylight during office focus hours to relaxing 2700K warm ambient white during evenings.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
