import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: { name: string; email: string; phone: string; address: string; isAdmin: boolean }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccessLogin }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleUserSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    // Check if user is logging in as admin with provided credentials
    if (email.trim().toLowerCase() === 'aa1552582@gmail.com') {
      if (password === '@Yaz1234') {
        const adminUser = {
          name: 'SK Traders Admin',
          email: 'aa1552582@gmail.com',
          phone: '+91 8074 681 217',
          address: 'SK Traders Store, Nampally, Hyderabad',
          isAdmin: true,
        };
        onSuccessLogin(adminUser);
        onClose();
        window.location.hash = 'admin';
        return;
      } else {
        setErrorMsg('Invalid admin password.');
        return;
      }
    }

    // Standard User Login
    const user = {
      name: name || email.split('@')[0],
      email,
      phone: phone || '+91 9876543210',
      address: address || 'Hyderabad, Telangana',
      isAdmin: false,
    };
    onSuccessLogin(user);
    setSuccessMsg('Signed in successfully!');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleUserSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !phone) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    // Check if user is signing up with admin email
    const isAdmin = email.trim().toLowerCase() === 'aa1552582@gmail.com';
    const user = {
      name,
      email,
      phone,
      address: address || 'India',
      isAdmin,
    };

    onSuccessLogin(user);
    setSuccessMsg('Account created successfully!');
    setTimeout(() => {
      onClose();
      if (isAdmin) window.location.hash = 'admin';
    }, 500);
  };

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (email.trim().toLowerCase() === 'aa1552582@gmail.com' && password === '@Yaz1234') {
      const adminUser = {
        name: 'SK Traders Admin',
        email: 'aa1552582@gmail.com',
        phone: '+91 8074 681 217',
        address: 'Troop Bazar, Nampally, Hyderabad',
        isAdmin: true,
      };
      onSuccessLogin(adminUser);
      onClose();
      window.location.hash = 'admin';
    } else {
      setErrorMsg('Invalid Admin Credentials. Required: aa1552582@gmail.com / @Yaz1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-brand-navy border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mb-3">
            {tab === 'admin' ? (
              <Lock className="w-6 h-6 text-amber-400" />
            ) : (
              <User className="w-6 h-6 text-amber-400" />
            )}
          </div>

          <h3 className="text-2xl font-display font-bold">
            {tab === 'signin' && 'Sign In to SK Traders'}
            {tab === 'signup' && 'Create Customer Account'}
            {tab === 'admin' && 'Admin Portal Access'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'admin'
              ? 'Enter master administrator credentials'
              : 'Sign in to place orders, book lighting, and track purchases'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
          <button
            onClick={() => {
              setTab('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'signin' ? 'bg-amber-400 text-brand-navy font-bold shadow' : 'text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'signup' ? 'bg-amber-400 text-brand-navy font-bold shadow' : 'text-slate-300'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setTab('admin');
              setEmail('aa1552582@gmail.com');
              setPassword('@Yaz1234');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'admin' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300'
            }`}
          >
            Admin Portal
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-200 text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleUserSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-brand-navy font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleUserSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Pincode"
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-brand-navy font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Admin Portal Direct Form */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-400/30 text-blue-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Admin verification required for catalogue & product management.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:border-amber-400 outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Access Admin Dashboard</span>
              <Lock className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
