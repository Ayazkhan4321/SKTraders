import React, { useState, useEffect } from 'react';
import {
  fetchAdminApplications,
  saveApplication,
  deleteApplication,
  reorderApplications,
  ApplicationItem,
} from '../services/applicationsApi';
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
  GripVertical,
  Eye,
  Layers,
  Check,
} from 'lucide-react';

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Add / Edit Modal state
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<ApplicationItem>>({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    category: 'Commercial',
    image_url: '',
    key_features: [],
    display_order: 1,
    is_active: true,
  });

  const [featuresInput, setFeaturesInput] = useState<string>('');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Live preview tab state
  const [showLivePreview, setShowLivePreview] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminApplications();
    setApplications(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAdd = () => {
    const nextOrder =
      applications.length > 0
        ? Math.max(...applications.map((a) => a.display_order)) + 1
        : 1;
    setEditingApp({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      category: 'Commercial',
      image_url: '',
      key_features: [],
      display_order: nextOrder,
      is_active: true,
    });
    setFeaturesInput('');
    setIsEditingModalOpen(true);
  };

  const handleOpenEdit = (app: ApplicationItem) => {
    setEditingApp(app);
    setFeaturesInput(app.key_features ? app.key_features.join('\n') : '');
    setIsEditingModalOpen(true);
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp.title?.trim()) {
      alert('Please enter an Application Title.');
      return;
    }
    if (!editingApp.image_url) {
      alert('Please upload or select an Application Image.');
      return;
    }

    const keyFeaturesList = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const slug =
      editingApp.slug ||
      editingApp.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    await saveApplication({
      ...editingApp,
      slug,
      key_features: keyFeaturesList,
    } as any);

    setIsEditingModalOpen(false);
    showToast(`✓ Application "${editingApp.title}" saved successfully!`);
    loadData();
  };

  const handleToggleActive = async (app: ApplicationItem) => {
    await saveApplication({ ...app, is_active: !app.is_active });
    showToast(
      `✓ Application "${app.title}" ${!app.is_active ? 'Activated' : 'Deactivated'}`
    );
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const target = applications.find((a) => a.id === deleteTargetId);
    await deleteApplication(deleteTargetId);
    setDeleteTargetId(null);
    showToast(`✓ Application "${target?.title || 'Item'}" deleted.`);
    loadData();
  };

  // Reorder via arrows
  const handleReorderArrow = async (
    app: ApplicationItem,
    direction: 'up' | 'down'
  ) => {
    const sorted = [...applications].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((a) => a.id === app.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const tempOrder = app.display_order;
      app.display_order = prev.display_order;
      prev.display_order = tempOrder;
      await reorderApplications(sorted);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tempOrder = app.display_order;
      app.display_order = next.display_order;
      next.display_order = tempOrder;
      await reorderApplications(sorted);
    }
    loadData();
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const sorted = [...applications].sort((a, b) => a.display_order - b.display_order);
    const draggedItem = sorted[draggedIdx];

    sorted.splice(draggedIdx, 1);
    sorted.splice(targetIndex, 0, draggedItem);

    setDraggedIdx(null);
    setApplications(sorted);
    await reorderApplications(sorted);
    showToast('✓ Applications reordered successfully via drag-and-drop');
  };

  return (
    <div className="space-y-8 font-sans animate-fade-in pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#00e676]" />
            <span>Signify Applications CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Manage professional lighting applications (Offices, Healthcare, Industry, Retail, Outdoor, Sports) displayed on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
              showLivePreview
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-[#00c853] hover:to-emerald-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Application</span>
          </button>
        </div>
      </div>

      {/* Applications Table with Drag-and-Drop */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Application Sectors List</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag and drop rows using <GripVertical className="inline w-3.5 h-3.5 text-slate-400" /> to reorder lighting sectors.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">Reorder</th>
                <th className="py-3.5 px-4 w-14">Order</th>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Sector Title & Subtitle</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    Loading Applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No applications created yet. Click "+ Add Application" to create one.
                  </td>
                </tr>
              ) : (
                applications
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((app, idx) => (
                    <tr
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        draggedIdx === idx ? 'opacity-40 bg-cyan-950/30' : ''
                      }`}
                    >
                      {/* Drag Handle */}
                      <td className="py-3 px-3 text-center cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400">
                        <GripVertical className="w-5 h-5 mx-auto" />
                      </td>

                      {/* Display Order & Arrows */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-cyan-400 w-5">
                            {app.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorderArrow(app, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorderArrow(app, 'down')}
                              disabled={idx === applications.length - 1}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center">
                          {app.image_url ? (
                            <img
                              src={app.image_url}
                              alt={app.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </td>

                      {/* Title & Subtitle */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-white text-sm">{app.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {app.subtitle || app.description}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                          /applications/{app.slug}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
                          {app.category}
                        </span>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(app)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            app.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {app.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{app.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Application"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(app.id)}
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Delete Application"
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

      {/* Admin Live Preview Section */}
      {showLivePreview && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>Live Admin Preview: Applications Showcase</span>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
              Website Live View
            </span>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {applications
                .filter((a) => a.is_active)
                .sort((a, b) => a.display_order - b.display_order)
                .map((app) => (
                  <div
                    key={app.id}
                    className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={app.image_url}
                        alt={app.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#00e676]">
                        {app.category}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-white text-lg">{app.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {app.subtitle || app.description}
                      </p>
                      {app.key_features && app.key_features.length > 0 && (
                        <div className="pt-2 space-y-1">
                          {app.key_features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                              <Check className="w-3.5 h-3.5 text-[#00e676] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-3 text-[#00e676] font-bold text-xs">
                        Explore Application →
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-sans space-y-6">
            <button
              onClick={() => setIsEditingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sparkles className="w-5 h-5 text-[#00e676]" />
              <span>{editingApp.id ? 'Edit Application Sector' : 'Add Application Sector'}</span>
            </h2>

            <form onSubmit={handleSaveApp} className="space-y-5">
              {/* Application Image */}
              <FileUpload
                label="Application Header / Hero Image *"
                category="applications/images"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                currentUrl={editingApp.image_url}
                onUploadSuccess={(url) => setEditingApp({ ...editingApp, image_url: url })}
                onRemove={() => setEditingApp({ ...editingApp, image_url: '' })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Application Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingApp.title || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, title: e.target.value })}
                    placeholder="e.g. Office & Commercial Spaces"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Category Sector
                  </label>
                  <select
                    value={editingApp.category || 'Commercial'}
                    onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e676]"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingApp.slug || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, slug: e.target.value })}
                    placeholder="office-commercial"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676] font-mono text-xs"
                  />
                </div>
              </div>

              {/* Subtitle / Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Subtitle / Short Tagline
                </label>
                <input
                  type="text"
                  value={editingApp.subtitle || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, subtitle: e.target.value })}
                  placeholder="Human-centric & circadian LED lighting for modern workplaces"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676]"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Application Description
                </label>
                <textarea
                  rows={3}
                  value={editingApp.description || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  placeholder="Transform workspace productivity, employee well-being..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676] leading-relaxed"
                />
              </div>

              {/* Key Features (One per line) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Features & Advantages (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder={`Circadian rhythm & tunable white lighting\nWiZ & Interact IoT sensor integration\nUp to 80% energy savings`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676] font-mono leading-relaxed"
                />
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingApp.display_order || 1}
                    onChange={(e) =>
                      setEditingApp({ ...editingApp, display_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e676] font-mono"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingApp.is_active}
                      onChange={(e) => setEditingApp({ ...editingApp, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#00e676] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">Active Status (Public View)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-[#00c853] hover:to-emerald-600 text-black font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Application Sector?"
        message="Are you sure you want to delete this application? It will be removed from the public website immediately."
        confirmText="Delete Application"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
