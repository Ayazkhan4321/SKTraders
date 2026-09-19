import React, { useState, useEffect } from 'react';
import {
  fetchAdminHeroCards,
  saveHeroCard,
  deleteHeroCard,
  HeroCardItem,
} from '../services/heroCardsApi';
import FileUpload from '../components/FileUpload';
import ConfirmModal from '../components/ConfirmModal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';

export default function HeroCardsManagement() {
  const [cards, setCards] = useState<HeroCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Form edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<HeroCardItem>>({
    title: '',
    short_description: '',
    description: '',
    image_url: '',
    pdf_url: '',
    pdf_name: '',
    button_text: 'View PDF Catalogue',
    is_active: true,
    display_order: 1,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Preview modal state
  const [previewCard, setPreviewCard] = useState<HeroCardItem | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const data = await fetchAdminHeroCards();
    setCards(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    const nextOrder = cards.length > 0 ? Math.max(...cards.map((c) => c.display_order)) + 1 : 1;
    setEditingCard({
      title: '',
      short_description: '',
      description: '',
      image_url: '',
      pdf_url: '',
      pdf_name: '',
      button_text: 'View PDF Catalogue',
      is_active: true,
      display_order: nextOrder,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (card: HeroCardItem) => {
    setEditingCard(card);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard.title || !editingCard.image_url) {
      alert('Please enter a Card Title and Upload a Card Image.');
      return;
    }

    await saveHeroCard(editingCard as any);
    setIsEditing(false);
    showToast('✓ Hero Card saved successfully');
    loadCards();
  };

  const handleToggleActive = async (card: HeroCardItem) => {
    await saveHeroCard({ ...card, is_active: !card.is_active });
    showToast(`✓ Card "${card.title}" ${!card.is_active ? 'Activated' : 'Deactivated'}`);
    loadCards();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteHeroCard(deleteTargetId);
    setDeleteTargetId(null);
    showToast('✓ Hero Card deleted successfully');
    loadCards();
  };

  const handleReorder = async (card: HeroCardItem, direction: 'up' | 'down') => {
    const sorted = [...cards].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === card.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const temp = card.display_order;
      await saveHeroCard({ ...card, display_order: prev.display_order });
      await saveHeroCard({ ...prev, display_order: temp });
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const temp = card.display_order;
      await saveHeroCard({ ...card, display_order: next.display_order });
      await saveHeroCard({ ...next, display_order: temp });
    }
    loadCards();
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
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Hero Cards Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage circular solutions cards, images, titles, descriptions, and downloadable PDF catalogues.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hero Card</span>
        </button>
      </div>

      {/* Cards Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Card Image</th>
                <th className="py-3.5 px-4">Title & Short Description</th>
                <th className="py-3.5 px-4">PDF Catalogue</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    Loading Hero Cards...
                  </td>
                </tr>
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No cards created yet. Click "Add New Hero Card".
                  </td>
                </tr>
              ) : (
                cards
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((card, idx) => (
                    <tr key={card.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-cyan-400 w-5">
                            {card.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorder(card, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder(card, 'down')}
                              disabled={idx === cards.length - 1}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                          {card.image_url ? (
                            <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Short Description */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          <div className="font-bold text-white leading-snug">{card.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {card.short_description || card.description}
                          </div>
                        </div>
                      </td>

                      {/* PDF Status */}
                      <td className="py-3 px-4">
                        {card.pdf_url ? (
                          <a
                            href={card.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:underline"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{card.pdf_name || 'PDF Document'}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">No PDF attached</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(card)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            card.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {card.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{card.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewCard(card)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Preview Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(card)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Edit Card"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(card.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Delete Card"
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
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>{editingCard.id ? 'Edit Hero Card' : 'Add Hero Card'}</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Image Upload */}
              <FileUpload
                label="Card Image *"
                category="hero-cards/images"
                accept="image/jpeg,image/png,image/webp"
                currentUrl={editingCard.image_url}
                onUploadSuccess={(url) => setEditingCard({ ...editingCard, image_url: url })}
                onRemove={() => setEditingCard({ ...editingCard, image_url: '' })}
              />

              {/* Title & Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.title || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  placeholder="e.g. Ceiling Design Lights"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingCard.short_description || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, short_description: e.target.value })}
                  placeholder="e.g. Elegant designs that transform your ceilings..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingCard.description || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  placeholder="Enter detailed card description..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* PDF Document Upload */}
              <FileUpload
                label="Attached PDF Catalogue (Optional)"
                category="hero-cards/pdfs"
                accept="application/pdf"
                currentUrl={editingCard.pdf_url}
                onUploadSuccess={(url, name) =>
                  setEditingCard({ ...editingCard, pdf_url: url, pdf_name: name || editingCard.pdf_name })
                }
                onRemove={() => setEditingCard({ ...editingCard, pdf_url: '', pdf_name: '' })}
                helpText="PDF document that will open in browser when user clicks action button."
              />

              {editingCard.pdf_url && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      PDF Display Name
                    </label>
                    <input
                      type="text"
                      value={editingCard.pdf_name || ''}
                      onChange={(e) => setEditingCard({ ...editingCard, pdf_name: e.target.value })}
                      placeholder="e.g. Philips Ceiling Catalogue 2025.pdf"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      PDF Button Text
                    </label>
                    <input
                      type="text"
                      value={editingCard.button_text || 'View PDF Catalogue'}
                      onChange={(e) => setEditingCard({ ...editingCard, button_text: e.target.value })}
                      placeholder="e.g. View PDF Catalogue"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCard.display_order || 1}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingCard.is_active}
                      onChange={(e) => setEditingCard({ ...editingCard, is_active: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                    <span className="text-xs font-bold text-white">Active (Show on Public Site)</span>
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
                  <span>Save Hero Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Hero Card?"
        message="Are you sure you want to permanently delete this hero card? This action cannot be undone."
        confirmText="Delete Card"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Card Preview Modal */}
      {previewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-slate-900 overflow-hidden font-sans">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-900 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-200">
              <img src={previewCard.image_url} alt={previewCard.title} className="w-full h-full object-cover" />
            </div>

            <h3 className="font-extrabold text-lg text-blue-600 mb-1">{previewCard.title}</h3>
            <p className="text-slate-600 text-xs mb-3">{previewCard.short_description || previewCard.description}</p>

            {previewCard.pdf_url ? (
              <a
                href={previewCard.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{previewCard.button_text || 'View PDF Catalogue'}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto" />
              </a>
            ) : (
              <div className="text-[11px] text-slate-400 text-center py-2 bg-slate-50 rounded-xl">
                No PDF Attached
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
