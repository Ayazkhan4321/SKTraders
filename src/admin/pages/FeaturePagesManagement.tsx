import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchAdminFeatures,
  saveFeature,
  deleteFeature,
  duplicateFeature,
  reorderFeatures,
  CompleteFeatureData,
} from '../services/featuresApi';
import ConfirmModal from '../components/ConfirmModal';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function FeaturePagesManagement() {
  const navigate = useNavigate();

  const [features, setFeatures] = useState<CompleteFeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    const data = await fetchAdminFeatures();
    setFeatures(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleActive = async (item: CompleteFeatureData) => {
    const updated: CompleteFeatureData = {
      ...item,
      feature: {
        ...item.feature,
        is_active: !item.feature.is_active,
      },
    };
    await saveFeature(updated);
    showToast(`✓ Feature "${item.feature.title}" ${!item.feature.is_active ? 'Activated' : 'Deactivated'}`);
    loadFeatures();
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicateFeature(id);
    if (duplicated) {
      showToast('✓ Feature page duplicated successfully');
      loadFeatures();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteFeature(deleteTargetId);
    setDeleteTargetId(null);
    showToast('✓ Feature page deleted successfully');
    loadFeatures();
  };

  const handleReorder = async (item: CompleteFeatureData, direction: 'up' | 'down') => {
    const sorted = [...features].sort((a, b) => a.feature.display_order - b.feature.display_order);
    const idx = sorted.findIndex((f) => f.feature.id === item.feature.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const tempOrder = item.feature.display_order;
      item.feature.display_order = prev.feature.display_order;
      prev.feature.display_order = tempOrder;
      await reorderFeatures(sorted);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tempOrder = item.feature.display_order;
      item.feature.display_order = next.feature.display_order;
      next.feature.display_order = tempOrder;
      await reorderFeatures(sorted);
    }
    loadFeatures();
  };

  const filteredFeatures = features.filter(
    (f) =>
      f.feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.feature.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Toast Notification */}
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
            <Sparkles className="w-6 h-6 text-[#00e676]" />
            <span>Feature Pages CMS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage dynamic feature specification pages, hero banners, highlights, specs, applications, and catalogue PDFs.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/features/new')}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Feature Page</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features by name or slug..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676]"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Pages: <span className="text-white font-bold">{features.length}</span> | Active:{' '}
          <span className="text-emerald-400 font-bold">{features.filter((f) => f.feature.is_active).length}</span>
        </div>
      </div>

      {/* Feature Pages Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Card Image</th>
                <th className="py-3.5 px-4">Feature Name & Details</th>
                <th className="py-3.5 px-4">Dynamic Route Slug</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    Loading Feature Pages...
                  </td>
                </tr>
              ) : filteredFeatures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No feature pages found. Click "Add New Feature Page" to create one.
                  </td>
                </tr>
              ) : (
                filteredFeatures
                  .sort((a, b) => a.feature.display_order - b.feature.display_order)
                  .map((item, idx) => {
                    const f = item.feature;
                    return (
                      <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Order Controls */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#00e676] w-5">
                              {f.display_order}
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleReorder(item, 'up')}
                                disabled={idx === 0}
                                className="text-slate-500 hover:text-[#00e676] disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReorder(item, 'down')}
                                disabled={idx === filteredFeatures.length - 1}
                                className="text-slate-500 hover:text-[#00e676] disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 p-0.5">
                            <img
                              src={f.card_image_url || f.hero_image_url}
                              alt={f.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        </td>

                        {/* Title & Short Description */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            <div className="font-bold text-white text-sm">{f.title}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{f.short_description}</div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/features/${f.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400 hover:underline bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded"
                          >
                            <span>/features/{f.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleActive(item)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              f.is_active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {f.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{f.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/features/${f.slug}?preview=true`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                              title="Live Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => navigate(`/admin/features/edit/${f.id}`)}
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                              title="Edit Feature"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDuplicate(f.id)}
                              className="p-1.5 text-slate-400 hover:text-purple-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                              title="Duplicate Feature"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteTargetId(f.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                              title="Delete Feature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Feature Page?"
        message="Are you sure you want to delete this feature page and all associated highlights, solutions, specs, applications, and gallery photos? This action cannot be undone."
        confirmText="Delete Feature Page"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
