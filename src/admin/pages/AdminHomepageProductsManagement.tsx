import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  apiFetchHomepageProducts,
  apiFetchMergedHomepageProducts,
  apiSaveHomepageProduct,
  apiDeleteHomepageProduct,
  HomepageProductConfig,
  MergedHomepageProduct,
} from '../../services/homepageProductsApi';
import { Plus, Edit3, Trash2, Sparkles, AlertTriangle, Eye, EyeOff, Layers, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminHomepageProductsManagement: React.FC = () => {
  const [configs, setConfigs] = useState<HomepageProductConfig[]>([]);
  const [mergedList, setMergedList] = useState<MergedHomepageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalConfig, setDeleteModalConfig] = useState<HomepageProductConfig | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cfgs, merged] = await Promise.all([
        apiFetchHomepageProducts(),
        apiFetchMergedHomepageProducts(),
      ]);
      setConfigs(cfgs);
      setMergedList(merged);
    } catch (err) {
      console.error('Failed to fetch homepage products data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (cfg: HomepageProductConfig) => {
    try {
      const updated = { ...cfg, is_active: !cfg.is_active };
      await apiSaveHomepageProduct(updated);
      await fetchData();
    } catch (err) {
      console.error('Error toggling homepage product active status:', err);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModalConfig) return;
    try {
      await apiDeleteHomepageProduct(deleteModalConfig.id);
      setDeleteModalConfig(null);
      await fetchData();
    } catch (err) {
      console.error('Error removing homepage product:', err);
      alert('Failed to remove homepage product');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Homepage Product CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Homepage Product Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure independent display images, prices, and titles for products featured on the homepage search section (Max 4 active).
          </p>
        </div>

        <Link
          to="/admin/homepage-products/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Homepage Product
        </Link>
      </div>

      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div>
            Total Configured: <span className="font-bold text-amber-400">{configs.length}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            Active on Homepage: <span className="font-bold text-emerald-400">{configs.filter((c) => c.is_active).length} / 4</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          💡 Master product catalogue data remains 100% separate & untouched.
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
          Loading homepage products configuration...
        </div>
      ) : configs.length > 0 ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Homepage Display Image</th>
                  <th className="p-4">Homepage Display Title</th>
                  <th className="p-4">Master Product</th>
                  <th className="p-4">Homepage Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {configs.map((cfg) => {
                  const merged = mergedList.find((m) => m.id === cfg.id);
                  return (
                    <tr key={cfg.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">
                        #{cfg.display_order}
                      </td>

                      <td className="p-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                          <img
                            src={merged?.image_url || cfg.homepage_image_url || '/images/card_smart_led_bulb.jpg'}
                            alt={cfg.homepage_name || 'Homepage Product'}
                            className="w-full h-full object-cover"
                          />
                          {cfg.homepage_image_url && (
                            <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-amber-500 text-slate-950 text-[8px] font-bold">
                              Override
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white line-clamp-1">
                          {cfg.homepage_name || merged?.masterProduct?.name || 'Untitled Product'}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {cfg.homepage_description || merged?.masterProduct?.short_description}
                        </div>
                      </td>

                      <td className="p-4">
                        {merged?.masterProduct ? (
                          <div>
                            <div className="font-semibold text-slate-200">{merged.masterProduct.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">SKU: {merged.masterProduct.sku}</div>
                          </div>
                        ) : (
                          <span className="text-amber-400 text-[10px] font-mono">ID: {cfg.product_id}</span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-amber-400">
                        ₹{(merged?.price || cfg.homepage_price || 0).toLocaleString()}
                        {cfg.homepage_price != null && merged?.masterProduct?.price !== cfg.homepage_price && (
                          <span className="text-[9px] text-slate-500 block line-through font-normal">
                            Master: ₹{merged?.masterProduct?.price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div>
                          {cfg.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                              <Eye className="w-3 h-3" />
                              Active on Home
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                              <EyeOff className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 text-[9px]">
                          <span className={`px-1.5 py-0.5 rounded ${cfg.show_price !== false ? 'bg-slate-800 text-emerald-400' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            Price: {cfg.show_price !== false ? 'Active' : 'Hidden'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded ${cfg.show_view_button !== false ? 'bg-slate-800 text-cyan-400' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            View Btn: {cfg.show_view_button !== false ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleActive(cfg)}
                          className={`p-1.5 inline-block rounded-lg text-xs font-semibold ${
                            cfg.is_active
                              ? 'bg-slate-800 text-slate-400 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                          }`}
                          title={cfg.is_active ? 'Deactivate on homepage' : 'Activate on homepage'}
                        >
                          {cfg.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <Link
                          to={`/admin/homepage-products/edit/${cfg.id}`}
                          className="p-1.5 inline-block text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
                          title="Edit Homepage Settings"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setDeleteModalConfig(cfg)}
                          className="p-1.5 inline-block text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg border border-red-500/30"
                          title="Remove from Homepage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <p>No homepage product configurations found.</p>
          <Link
            to="/admin/homepage-products/new"
            className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Add First Homepage Product
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalConfig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Remove from Homepage?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-200">{deleteModalConfig.homepage_name || deleteModalConfig.product_id}</strong> from the homepage product section?
              <br />
              <span className="text-amber-400 font-semibold block mt-1">
                Note: The master product will NOT be deleted from the catalogue.
              </span>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalConfig(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2 rounded-xl bg-red-500 text-xs font-bold text-white hover:bg-red-600"
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
