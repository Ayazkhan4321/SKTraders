import React from 'react';
import { COMPANY_INFO } from '@/lib/data';
import './FloatingContactButtons.css';

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3.5 pointer-events-auto">
      {/* Official WhatsApp Quick Chat Button */}
      <a
        href={COMPANY_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_4px_20px_rgba(37,211,102,0.55)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.8)] transition-all duration-300 hover:scale-110 active:scale-95"
        title="Chat on WhatsApp (+91 95735 77765)"
      >
        {/* Official WhatsApp Logo SVG */}
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.638A8.955 8.955 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.2 4.488L3 21l4.661-1.222a8.964 8.964 0 0 0 4.386 1.147h.004c4.947 0 8.976-4.027 8.978-8.977 0-2.399-.934-4.654-2.626-6.31M12.053 19.452h-.003a7.466 7.466 0 0 1-3.805-1.048l-.272-.162-2.828.741.754-2.756-.177-.282a7.476 7.476 0 0 1-1.144-4.008c.002-4.12 3.354-7.471 7.477-7.471 1.996 0 3.871.778 5.28 2.189 1.408 1.41 2.184 3.286 2.183 5.284-.002 4.122-3.354 7.473-7.467 7.473m4.1-5.6c-.225-.113-1.332-.657-1.54-.731-.207-.075-.357-.113-.507.113-.15.225-.58.732-.711.882-.132.15-.263.169-.488.056-.225-.113-.951-.35-1.81-1.117-.67-.599-1.122-1.338-1.254-1.564-.132-.225-.014-.347.098-.459.101-.101.225-.263.338-.395.113-.131.15-.225.225-.375.075-.15.038-.282-.019-.395-.056-.113-.507-1.22-.695-1.673-.183-.441-.369-.381-.507-.389l-.432-.007c-.15 0-.395.056-.601.282-.207.225-.79.771-.79 1.881 0 1.11.808 2.184.92 2.334.113.15 1.59 2.428 3.85 3.407.538.233.957.373 1.284.477.54.172 1.031.148 1.419.09.433-.065 1.332-.544 1.52-1.07.188-.525.188-.976.131-1.07-.056-.094-.207-.15-.432-.263" />
        </svg>
        
        {/* Tooltip text */}
        <span className="absolute right-16 bg-slate-900/95 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          WhatsApp Support (+91 95735 77765)
        </span>

        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
      </a>

      {/* Official Phone Call Button */}
      <a
        href={COMPANY_INFO.phoneUrl}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.55)] transition-all duration-300 hover:scale-110 active:scale-95"
        title="Call SK Traders Direct"
      >
        {/* Official Phone Receiver Icon SVG */}
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>

        {/* Tooltip text */}
        <span className="absolute right-16 bg-slate-900/95 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Call Direct (+91 95735 77765)
        </span>
      </a>
    </div>
  );
}
