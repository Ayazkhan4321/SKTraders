import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Tv,
  Layers,
  Award,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Box,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge: string;
  disabled?: boolean;
}

export default function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: 'Overview',
    },
    {
      label: 'Product Catalogue',
      path: '/admin/products',
      icon: <Box className="w-5 h-5 text-amber-400" />,
      badge: '3D Studio',
    },
    {
      label: 'Hero Section',
      path: '/admin/hero',
      icon: <Tv className="w-5 h-5" />,
      badge: 'Video/Img',
    },
    {
      label: 'Feature Cards',
      path: '/admin/hero-cards',
      icon: <Layers className="w-5 h-5" />,
      badge: 'Cards/PDFs',
    },
    {
      label: 'Feature Pages',
      path: '/admin/features',
      icon: <Sparkles className="w-5 h-5 text-[#00e676]" />,
      badge: 'CMS Pages',
    },
    {
      label: 'Brands',
      path: '/admin/brands',
      icon: <Sparkles className="w-5 h-5 text-[#00e676]" />,
      badge: 'CMS Section',
    },
    {
      label: 'Applications',
      path: '/admin/applications',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      badge: 'CMS Sectors',
    },
    {
      label: 'Certificates',
      path: '/admin/certificates',
      icon: <Award className="w-5 h-5" />,
      badge: 'Compliance',
    },
    {
      label: 'Footer Brands',
      path: '/admin/footer-brands',
      icon: <Sparkles className="w-5 h-5" />,
      badge: 'Logos',
    },
  ];

  const handleNavClick = (path: string, disabled?: boolean) => {
    if (disabled) return;
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out font-sans ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Navigation Group Header */}
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-3 px-3">
              CMS Navigation
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 cursor-not-allowed opacity-60 bg-slate-900/40"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {item.badge}
                      </span>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-cyan-400 font-bold shadow-lg shadow-cyan-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded group-hover:text-slate-200">
                        {item.badge}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick System Info Box */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>CMS System Status</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Supabase Auth & Database APIs active. Changes reflect instantly on website.
            </p>
          </div>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
