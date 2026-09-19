import React, { useState, useEffect } from 'react';
import {
  fetchAdminHeroes,
  saveHeroSlide,
  deleteHeroSlide,
  HeroSlide,
} from '../services/heroApi';
import FileUpload from '../components/FileUpload';
import ConfirmModal from '../components/ConfirmModal';
import {
  Tv,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Video,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';

export default function HeroManagement() {
  const [heroes, setHeroes] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Form modal / state
  const [isEditing, setIsEditing] = useState(false);
  const [editingHero, setEditingHero] = useState<Partial<HeroSlide>>({
    title: '',
    subtitle: '',
    description: '',
    media_type: 'image',
    image_url: '',
    video_url: '',
    button_text: 'Explore',
    button_url: '#',
    is_active: true,
    display_order: 1,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Preview modal state
  const [previewHero, setPreviewHero] = useState<HeroSlide | null>(null);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    setLoading(true);
    const data = await fetchAdminHeroes();
    setHeroes(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    const nextOrder = heroes.length > 0 ? Math.max(...heroes.map((h) => h.display_order)) + 1 : 1;
    setEditingHero({
      title: '',
      subtitle: 'Lighting by Signify',
      description: '',
      media_type: 'image',
      image_url: '',
      video_url: '',
      button_text: 'Explore',
      button_url: '#',
      is_active: true,
      display_order: nextOrder,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (hero: HeroSlide) => {
    setEditingHero(hero);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHero.title) {
      alert('Please enter a Hero Title.');
      return;
    }

    await saveHeroSlide(editingHero as any);
    setIsEditing(false);
    showToast('✓ Hero slide saved successfully');
    loadHeroes();
  };

  const handleToggleActive = async (hero: HeroSlide) => {
    await saveHeroSlide({ ...hero, is_active: !hero.is_active });
    showToast(`✓ Hero "${hero.title}" ${!hero.is_active ? 'Activated' : 'Deactivated'}`);
    loadHeroes();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteHeroSlide(deleteTargetId);
    setDeleteTargetId(null);
    showToast('✓ Hero slide deleted successfully');
    loadHeroes();
  };

  const handleReorder = async (hero: HeroSlide, direction: 'up' | 'down') => {
    const sorted = [...heroes].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((h) => h.id === hero.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const temp = hero.display_order;
      await saveHeroSlide({ ...hero, display_order: prev.display_order });
      await saveHeroSlide({ ...prev, display_order: temp });
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const temp = hero.display_order;
      await saveHeroSlide({ ...hero, display_order: next.display_order });
      await saveHeroSlide({ ...next, display_order: temp });
    }
    loadHeroes();
  };

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
            <Tv className="w-6 h-6 text-cyan-400" />
            <span>Hero Section Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage main website hero slides, video backgrounds, headlines, button actions, and ordering.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hero Slide</span>
        </button>
      </div>

      {/* Hero Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Media</th>
                <th className="py-3.5 px-4">Title & Subtitle</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    Loading Hero slides...
                  </td>
                </tr>
              ) : heroes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No hero slides created yet. Click "Add New Hero Slide".
                  </td>
                </tr>
              ) : (
                heroes
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((hero, idx) => (
                    <tr key={hero.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order Controls */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-cyan-400 w-5">
                            {hero.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorder(hero, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder(hero, 'down')}
                              disabled={idx === heroes.length - 1}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 relative">
                          {hero.image_url ? (
                            <img src={hero.image_url} alt={hero.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          {hero.media_type === 'video' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Video className="w-4 h-4 text-cyan-400" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Subtitle */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-white leading-snug">{hero.title}</div>
                          <div className="text-[11px] text-slate-400">{hero.subtitle}</div>
                        </div>
                      </td>

                      {/* Media Type Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            hero.media_type === 'video'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {hero.media_type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                          <span>{hero.media_type}</span>
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(hero)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            hero.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {hero.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{hero.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewHero(hero)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Preview Hero"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(hero)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Edit Hero"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(hero.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Delete Hero"
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

      {/* Edit / Add Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <span>{editingHero.id ? 'Edit Hero Slide' : 'Add Hero Slide'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Media Type Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Background Media Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingHero({ ...editingHero, media_type: 'image' })}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      editingHero.media_type === 'image'
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image Background</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingHero({ ...editingHero, media_type: 'video' })}
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      editingHero.media_type === 'video'
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Background</span>
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Hero Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHero.title || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, title: e.target.value })}
                    placeholder="e.g. A Universe of Lights"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={editingHero.subtitle || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, subtitle: e.target.value })}
                    placeholder="e.g. Lighting by Signify"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={editingHero.description || ''}
                  onChange={(e) => setEditingHero({ ...editingHero, description: e.target.value })}
                  placeholder="Enter detailed hero description..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Background Media Upload / URL */}
              {editingHero.media_type === 'video' ? (
                <FileUpload
                  label="Hero Video Upload (MP4 / WEBM)"
                  category="hero/videos"
                  accept="video/mp4,video/webm"
                  currentUrl={editingHero.video_url}
                  onUploadSuccess={(url) => setEditingHero({ ...editingHero, video_url: url })}
                  onRemove={() => setEditingHero({ ...editingHero, video_url: '' })}
                />
              ) : (
                <FileUpload
                  label="Hero Background Image (JPG / PNG / WEBP)"
                  category="hero/images"
                  accept="image/jpeg,image/png,image/webp"
                  currentUrl={editingHero.image_url}
                  onUploadSuccess={(url) => setEditingHero({ ...editingHero, image_url: url })}
                  onRemove={() => setEditingHero({ ...editingHero, image_url: '' })}
                />
              )}

              {/* Button Text & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={editingHero.button_text || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, button_text: e.target.value })}
                    placeholder="e.g. Explore Catalogues"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Button Action URL / Section Hash
                  </label>
                  <input
                    type="text"
                    value={editingHero.button_url || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, button_url: e.target.value })}
                    placeholder="e.g. #catalogues or https://..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingHero.display_order || 1}
                    onChange={(e) =>
                      setEditingHero({ ...editingHero, display_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingHero.is_active}
                      onChange={(e) => setEditingHero({ ...editingHero, is_active: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Active (Show on Public Site)</span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
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
                  <span>Save Hero Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Hero Slide?"
        message="Are you sure you want to permanently delete this hero slide? This action cannot be undone."
        confirmText="Delete Hero"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Live Preview Modal */}
      {previewHero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
            <button
              onClick={() => setPreviewHero(null)}
              className="absolute top-4 right-4 z-20 text-white bg-slate-900/80 p-2 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Hero Slide Live Preview
            </h3>

            <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
              {previewHero.media_type === 'video' && previewHero.video_url ? (
                <video src={previewHero.video_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={previewHero.image_url || '/images/shanghai_bund.jpg'} alt={previewHero.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-slate-950/60" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h2 className="text-3xl font-black text-white">{previewHero.title}</h2>
                <p className="text-cyan-300 text-sm font-semibold mt-1">{previewHero.subtitle}</p>
                <p className="text-slate-200 text-xs mt-2 max-w-lg">{previewHero.description}</p>

                {previewHero.button_text && (
                  <button className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl w-fit">
                    {previewHero.button_text}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
