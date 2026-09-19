import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, LogOut, Menu, User, ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { adminUser, logout } = useAdminAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans shadow-md">
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-wide">
              SK TRADERS <span className="text-cyan-400 font-semibold text-xs ml-1 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">CMS PANEL</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Public Site Link, Admin Profile, Logout */}
      <div className="flex items-center gap-3 sm:gap-5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 bg-slate-800 hover:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Info Badge */}
        <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl py-1.5 px-3">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-cyan-400 font-medium leading-none">
              {adminUser?.email || 'aa1552582@gmail.com'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
