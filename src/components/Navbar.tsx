import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '@/lib/data';
import { Search, Globe, Menu, X, ArrowRight, PhoneCall, User } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onOpenQuote: () => void;
  onOpenAuth?: () => void;
  currentUser?: { name: string; email: string; isAdmin?: boolean } | null;
  onLogout?: () => void;
}

export default function Navbar({
  onOpenQuote,
  onOpenAuth,
  currentUser,
  onLogout,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#offerings' },
    { name: 'Applications', href: '#offerings' },
    { name: 'Resources', href: '#resources' },
    { name: 'Sustainability', href: '#hero' },
    { name: 'Highlights', href: '#highlights' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Eagle Logo + Philips Logo + SK Traders */}
        <a href="#hero" className="flex items-center gap-3 group shrink-0">
          <img
            src="/favicon.svg"
            alt="SK Traders Eagle Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow transition-transform group-hover:scale-108"
          />
          <img
            src="/images/philips_home_lighting_logo.png"
            alt="Philips Home Lighting"
            className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-102"
          />
          <div className="h-8 w-px bg-slate-300 mx-0.5" />
          <div className="flex flex-col justify-center">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
              SK Traders
            </span>
            <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider mt-1">
              Authorized Distributor of Philips
            </span>
          </div>
        </a>

        {/* Center: Signify Main Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-800 hover:text-[#00c853] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#00e676] hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions: Search, Language, User, CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <button className="p-2 text-slate-700 hover:text-[#00c853] transition-colors" title="Search catalog">
            <Search className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-700 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-bold">IN | EN</span>
          </div>

          {/* User Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded text-xs text-slate-800">
              <User className="w-3.5 h-3.5 text-[#00c853]" />
              <span className="font-semibold max-w-[100px] truncate">{currentUser.name}</span>
              {onLogout && (
                <button onClick={onLogout} className="text-[10px] text-red-500 hover:underline ml-1">
                  Exit
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 border border-slate-300 hover:border-slate-800 transition-all"
            >
              Login
            </button>
          )}

          {/* Signify Vibrant Green Button */}
          <button
            onClick={onOpenQuote}
            className="btn-signify-green text-xs"
          >
            <span>Get Fast Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded bg-slate-100 text-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 hover:text-[#00c853] py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full btn-signify-green justify-center py-3 text-sm"
            >
              <span>Get Fast Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
