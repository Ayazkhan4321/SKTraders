import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  fetchAdminBrandLogos,
  saveBrandLogo,
  deleteBrandLogo,
  reorderBrandLogos,
  FooterBrand,
} from '../services/brandLogosApi';
import FileUpload from '../components/FileUpload';
import ConfirmModal from '../components/ConfirmModal';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  Globe,
  ExternalLink,
  AlertTriangle,
  Database,
  Copy,
} from 'lucide-react';

export default function BrandLogosManagement() {
  const [brands, setBrands] = useState<FooterBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Form edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<FooterBrand>>({
    brand_name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    display_order: 1,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const checkSupabase = async () => {
    try {
      const { error } = await supabase.from('footer_brands').select('id').limit(1);
      if (error) {
        setSupabaseSynced(false);
      } else {
        setSupabaseSynced(true);
      }
    } catch {
      setSupabaseSynced(false);
    }
  };

  const loadBrands = async () => {
    setLoading(true);
    await checkSupabase();
    const data = await fetchAdminBrandLogos();
    setBrands(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    const nextOrder = brands.length > 0 ? Math.max(...brands.map((b) => b.display_order)) + 1 : 1;
    setEditingBrand({
      brand_name: '',
      logo_url: '',
      website_url: '',
      is_active: true,
      display_order: nextOrder,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (brand: FooterBrand) => {
    setEditingBrand(brand);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand.brand_name?.trim() || !editingBrand.logo_url) {
      alert('Please enter a Brand Name and upload or provide a Logo Image.');
      return;
    }

    await saveBrandLogo(editingBrand as any);
    setIsEditing(false);
    showToast('✓ Brand logo saved successfully');
    loadBrands();
  };

  const handleToggleActive = async (brand: FooterBrand) => {
    await saveBrandLogo({ ...brand, is_active: !brand.is_active });
    showToast(`✓ Brand "${brand.brand_name}" ${!brand.is_active ? 'Activated' : 'Deactivated'}`);
    loadBrands();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteBrandLogo(deleteTargetId);
    setDeleteTargetId(null);
    showToast('✓ Brand logo deleted successfully');
    loadBrands();
  };

  const handleReorder = async (brand: FooterBrand, direction: 'up' | 'down') => {
    const sorted = [...brands].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((b) => b.id === brand.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const tempOrder = brand.display_order;
      brand.display_order = prev.display_order;
      prev.display_order = tempOrder;
      await reorderBrandLogos(sorted);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tempOrder = brand.display_order;
      brand.display_order = next.display_order;
      next.display_order = tempOrder;
      await reorderBrandLogos(sorted);
    }
    loadBrands();
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>Footer Brand Logos Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage official lighting brand logos displayed dynamically in the public website footer (Philips, Signify, EcoLink, Crompton, etc.).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand Logo</span>
        </button>
      </div>

      {/* Supabase Production Sync Notice Banner */}
      {supabaseSynced === false && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-start gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-200 text-sm">
                Vercel Production Sync Warning (`vercel --prod`)
              </p>
              <p className="text-amber-300/90 leading-relaxed mt-0.5">
                The <code className="bg-amber-950 px-1 py-0.5 rounded font-mono text-amber-200">public.footer_brands</code> table is not created in your Supabase database yet. Changes saved locally will NOT persist on Vercel deployment until the table is created.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Fix Vercel Sync (1-Min Setup)</span>
          </button>
        </div>
      )}

      {/* Brand Logos Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Logo Preview</th>
                <th className="py-3.5 px-4">Brand Name</th>
                <th className="py-3.5 px-4">Website URL</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    Loading Brand Logos...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No brand logos configured. Click "Add Brand Logo" to create one.
                  </td>
                </tr>
              ) : (
                brands
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((brand, idx) => (
                    <tr key={brand.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order Controls */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-cyan-400 w-5">
                            {brand.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorder(brand, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder(brand, 'down')}
                              disabled={idx === brands.length - 1}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Logo Preview */}
                      <td className="py-3 px-4">
                        <div className="w-28 h-12 rounded-lg overflow-hidden bg-white border border-slate-700/60 p-2 flex items-center justify-center shadow-inner">
                          {brand.logo_url ? (
                            <img
                              src={brand.logo_url}
                              alt={brand.brand_name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Brand Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{brand.brand_name}</div>
                      </td>

                      {/* Website URL */}
                      <td className="py-3 px-4">
                        {brand.website_url ? (
                          <a
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline max-w-[200px] truncate"
                          >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{brand.website_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">Optional / None</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(brand)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            brand.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {brand.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{brand.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(brand)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Edit Brand"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(brand.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{editingBrand.id ? 'Edit Brand Logo' : 'Add Brand Logo'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingBrand.brand_name || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, brand_name: e.target.value })}
                  placeholder="e.g. Philips, Signify, EcoLink, Crompton"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Logo File Upload */}
              <FileUpload
                label="Brand Logo Image (PNG, JPG, SVG, WebP) *"
                category="brand-logos/images"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                currentUrl={editingBrand.logo_url}
                onUploadSuccess={(url) => setEditingBrand({ ...editingBrand, logo_url: url })}
                onRemove={() => setEditingBrand({ ...editingBrand, logo_url: '', logo_height: undefined, logo_width: undefined })}
              />

              {/* Image Dimensions & Best Fit Range Sliders */}
              {editingBrand.logo_url && (
                <div className="space-y-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Best Fit Sizing & Range Tuning
                    </label>
                  </div>

                  {/* Range Sliders for Width & Height */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Logo Display Height Slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <span>Display Height Range</span>
                        <span className="font-mono text-cyan-400">{editingBrand.logo_height ? `${editingBrand.logo_height}px` : 'Auto (38px)'}</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={90}
                        step={2}
                        value={editingBrand.logo_height || 38}
                        onChange={(e) => setEditingBrand({ ...editingBrand, logo_height: parseInt(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    {/* Logo Max Width Slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <span>Max Width Range</span>
                        <span className="font-mono text-cyan-400">{editingBrand.logo_width ? `${editingBrand.logo_width}px` : 'Auto (180px)'}</span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={280}
                        step={5}
                        value={editingBrand.logo_width || 180}
                        onChange={(e) => setEditingBrand({ ...editingBrand, logo_width: parseInt(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Best Fit Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Best Fit Presets:</span>
                    <button
                      type="button"
                      onClick={() => setEditingBrand({ ...editingBrand, logo_height: 30, logo_width: 140 })}
                      className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer"
                    >
                      Compact (30px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBrand({ ...editingBrand, logo_height: 38, logo_width: 180 })}
                      className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer"
                    >
                      Standard (38px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBrand({ ...editingBrand, logo_height: 50, logo_width: 220 })}
                      className="px-2 py-0.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors cursor-pointer"
                    >
                      Prominent (50px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBrand({ ...editingBrand, logo_height: undefined, logo_width: undefined })}
                      className="px-2 py-0.5 text-[11px] bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded transition-colors cursor-pointer"
                    >
                      Auto Reset
                    </button>
                  </div>

                  {/* Live Preview Container with exact style */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Footer Preview
                    </label>
                    <div className="p-4 bg-slate-50 border border-slate-700/80 rounded-xl flex items-center justify-center h-24 shadow-inner overflow-hidden">
                      <img
                        src={editingBrand.logo_url}
                        alt={editingBrand.brand_name || 'Brand Logo'}
                        style={{
                          height: editingBrand.logo_height ? `${editingBrand.logo_height}px` : '38px',
                          maxWidth: editingBrand.logo_width ? `${editingBrand.logo_width}px` : '180px',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingBrand.website_url || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })}
                  placeholder="https://www.brand-domain.com"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  If provided, clicking the logo in the public footer will navigate visitors to this website.
                </p>
              </div>

              {/* Display Order & Active Checkbox */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingBrand.display_order || 1}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, display_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingBrand.is_active}
                      onChange={(e) => setEditingBrand({ ...editingBrand, is_active: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Active (Show in Footer)</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Brand Logo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Brand Logo?"
        message="Are you sure you want to delete this brand logo? It will be removed from the public website footer immediately."
        confirmText="Delete Brand"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* SQL Setup Modal for Vercel Deployment */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSqlModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Enable Vercel Production Sync (`vercel --prod`)</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To make your Admin Panel changes instantly reflect on Vercel production, run this 1-click SQL script in your Supabase SQL Editor:
            </p>

            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-amber-200 overflow-x-auto mb-5 max-h-60 leading-relaxed select-all">
              <pre>{`-- Run this SQL in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/xyyqlmkszozyvlkmotgw/sql

CREATE TABLE IF NOT EXISTS public.footer_brands (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  logo_height INTEGER,
  logo_width INTEGER,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.footer_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on footer_brands"
  ON public.footer_brands FOR SELECT USING (true);

CREATE POLICY "Allow public all on footer_brands"
  ON public.footer_brands FOR ALL USING (true) WITH CHECK (true);`}</pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Saved locally at <code className="text-cyan-400">supabase_schema.sql</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.footer_brands (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  logo_height INTEGER,
  logo_width INTEGER,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.footer_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on footer_brands"
  ON public.footer_brands FOR SELECT USING (true);

CREATE POLICY "Allow public all on footer_brands"
  ON public.footer_brands FOR ALL USING (true) WITH CHECK (true);`);
                    showToast('✓ SQL Setup script copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Script</span>
                </button>
                <a
                  href="https://supabase.com/dashboard/project/xyyqlmkszozyvlkmotgw/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>Open Supabase SQL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
