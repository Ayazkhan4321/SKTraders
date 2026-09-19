import React, { useState, useEffect } from 'react';
import {
  fetchAdminBrandSection,
  saveBrandSection,
  fetchAdminLeadingBrands,
  saveLeadingBrand,
  deleteLeadingBrand,
  reorderLeadingBrands,
  BrandSectionContent,
  LeadingBrand,
} from '../services/leadingBrandsApi';
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
  GripVertical,
  Eye,
  Sliders,
  Layers,
} from 'lucide-react';

export default function LeadingBrandsManagement() {
  const [sectionContent, setSectionContent] = useState<BrandSectionContent>({
    id: 'default',
    heading: "The world's leading lighting brands",
    description:
      'Our products, connected systems and services unlock the extraordinary potential of light to enhance well-being and performance, elevate experiences and advance sustainability.',
    button_text: 'View all brands',
    button_url: '/brands',
    is_enabled: true,
    updated_at: new Date().toISOString(),
  });

  const [brands, setBrands] = useState<LeadingBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Form edit state for modal
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<LeadingBrand>>({
    name: '',
    description: '',
    image_url: '',
    website_url: '',
    is_active: true,
    display_order: 1,
  });

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Live preview tab state
  const [showLivePreview, setShowLivePreview] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sec, brs] = await Promise.all([fetchAdminBrandSection(), fetchAdminLeadingBrands()]);
    setSectionContent(sec);
    setBrands(brs);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Section Content Save
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection(true);
    const updated = await saveBrandSection(sectionContent);
    setSectionContent(updated);
    setSavingSection(false);
    showToast('✓ Section content settings saved successfully!');
  };

  // Open Add Brand Modal
  const handleOpenAdd = () => {
    const nextOrder = brands.length > 0 ? Math.max(...brands.map((b) => b.display_order)) + 1 : 1;
    setEditingBrand({
      name: '',
      description: '',
      image_url: '',
      website_url: '/brands/new-brand',
      is_active: true,
      display_order: nextOrder,
    });
    setIsEditingModalOpen(true);
  };

  // Open Edit Brand Modal
  const handleOpenEdit = (brand: LeadingBrand) => {
    setEditingBrand(brand);
    setIsEditingModalOpen(true);
  };

  // Save Brand (Add or Edit)
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand.name?.trim()) {
      alert('Please enter a Brand Name.');
      return;
    }
    if (!editingBrand.image_url) {
      alert('Please upload or select a Brand Image.');
      return;
    }

    await saveLeadingBrand(editingBrand as any);
    setIsEditingModalOpen(false);
    showToast(`✓ Brand "${editingBrand.name}" saved successfully!`);
    loadData();
  };

  // Toggle Active/Inactive status
  const handleToggleActive = async (brand: LeadingBrand) => {
    await saveLeadingBrand({ ...brand, is_active: !brand.is_active });
    showToast(`✓ Brand "${brand.name}" ${!brand.is_active ? 'Activated' : 'Deactivated'}`);
    loadData();
  };

  // Delete Brand
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const target = brands.find((b) => b.id === deleteTargetId);
    await deleteLeadingBrand(deleteTargetId);
    setDeleteTargetId(null);
    showToast(`✓ Brand "${target?.name || 'Item'}" deleted successfully.`);
    loadData();
  };

  // Arrow Reorder (Up/Down)
  const handleReorderArrow = async (brand: LeadingBrand, direction: 'up' | 'down') => {
    const sorted = [...brands].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((b) => b.id === brand.id);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      const prev = sorted[idx - 1];
      const tempOrder = brand.display_order;
      brand.display_order = prev.display_order;
      prev.display_order = tempOrder;
      await reorderLeadingBrands(sorted);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tempOrder = brand.display_order;
      brand.display_order = next.display_order;
      next.display_order = tempOrder;
      await reorderLeadingBrands(sorted);
    }
    loadData();
  };

  // Drag and Drop Reordering handlers
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

    const sorted = [...brands].sort((a, b) => a.display_order - b.display_order);
    const draggedItem = sorted[draggedIdx];

    // Remove item and insert at target
    sorted.splice(draggedIdx, 1);
    sorted.splice(targetIndex, 0, draggedItem);

    setDraggedIdx(null);
    setBrands(sorted);
    await reorderLeadingBrands(sorted);
    showToast('✓ Brand order updated via drag-and-drop');
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
            <span>Leading Lighting Brands CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Manage heading, description, button links, brand cards, images, and drag-and-drop order for "The world's leading lighting brands" section.
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
            <span>{showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-[#00c853] hover:to-emerald-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Brand</span>
          </button>
        </div>
      </div>

      {/* 1. Section Content Settings Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>1. Section Heading & Settings</span>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={sectionContent.is_enabled}
              onChange={(e) => setSectionContent({ ...sectionContent, is_enabled: e.target.checked })}
              className="w-4 h-4 accent-[#00e676] rounded cursor-pointer"
            />
            <span className="text-xs font-bold text-white">
              {sectionContent.is_enabled ? 'Section Enabled' : 'Section Disabled'}
            </span>
          </label>
        </div>

        <form onSubmit={handleSaveSection} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section Heading */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Section Heading * (Supports multiple lines e.g. title \n Philips \n Signify Innovation India Limited)
              </label>
              <textarea
                rows={2}
                required
                value={sectionContent.heading}
                onChange={(e) => setSectionContent({ ...sectionContent, heading: e.target.value })}
                placeholder="The world's leading lighting brands&#10;Philips&#10;Signify Innovation India Limited"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono leading-relaxed"
              />
            </div>

            {/* Section Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Section Description *
              </label>
              <textarea
                rows={3}
                required
                value={sectionContent.description}
                onChange={(e) => setSectionContent({ ...sectionContent, description: e.target.value })}
                placeholder="Our products, connected systems and services unlock..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
              />
            </div>

            {/* Button Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Button Text
              </label>
              <input
                type="text"
                value={sectionContent.button_text}
                onChange={(e) => setSectionContent({ ...sectionContent, button_text: e.target.value })}
                placeholder="View all brands"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Button URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Button URL / Path
              </label>
              <input
                type="text"
                value={sectionContent.button_url}
                onChange={(e) => setSectionContent({ ...sectionContent, button_url: e.target.value })}
                placeholder="/brands"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={savingSection}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSection ? 'Saving Settings...' : 'Save Section Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Brand Cards Management Table with Drag-and-Drop */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>2. Brand Cards Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag and drop rows using <GripVertical className="inline w-3.5 h-3.5 text-slate-400" /> to reorder brands. Toggle active status to show/hide on website.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="self-start sm:self-auto px-4 py-2 bg-[#00e676] hover:bg-[#00c853] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Brand</span>
          </button>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">Reorder</th>
                <th className="py-3.5 px-4 w-14">Order</th>
                <th className="py-3.5 px-4">Brand Image</th>
                <th className="py-3.5 px-4">Brand Info</th>
                <th className="py-3.5 px-4">Target URL</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    Loading Brand Cards...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No brand cards created yet. Click "+ Add Brand" to create your first brand card.
                  </td>
                </tr>
              ) : (
                brands
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((brand, idx) => (
                    <tr
                      key={brand.id}
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
                            {brand.display_order}
                          </span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorderArrow(brand, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorderArrow(brand, 'down')}
                              disabled={idx === brands.length - 1}
                              className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Brand Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 p-1 flex items-center justify-center">
                          {brand.image_url ? (
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </td>

                      {/* Brand Name & Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white text-sm">{brand.name}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {brand.description || 'No description provided.'}
                        </p>
                      </td>

                      {/* Website / Target URL */}
                      <td className="py-3 px-4">
                        {brand.website_url ? (
                          <a
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline max-w-[160px] truncate font-mono text-[11px]"
                          >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{brand.website_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Active / Inactive Status Switch */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(brand)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            brand.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {brand.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{brand.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Edit / Delete Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(brand)}
                            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(brand.id)}
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
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

      {/* 3. Live Admin Preview Section */}
      {showLivePreview && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>3. Live Admin Preview</span>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
              Website Live Representation
            </span>
          </div>

          {!sectionContent.is_enabled ? (
            <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 font-medium">
              ⚠️ Section is currently disabled. It will not be shown to visitors on the website.
            </div>
          ) : (
            <div className="bg-white text-slate-900 rounded-2xl p-8 border border-slate-200 shadow-inner">
              <div className="max-w-4xl mx-auto text-center space-y-4">
                {(() => {
                  const raw = sectionContent.heading || "The world's leading lighting brands";
                  let lines: string[] = [];
                  if (raw.includes('\n')) {
                    lines = raw.split('\n');
                  } else if (/signify innovation/i.test(raw)) {
                    const match = raw.match(/(.*)(philips)(.*signify innovation.*)/i);
                    if (match) {
                      lines = [match[1].trim(), match[2].trim(), match[3].trim()];
                    } else {
                      lines = raw.split(/(signify innovation.*)/i).map((s) => s.trim()).filter(Boolean);
                    }
                  } else {
                    lines = [raw];
                  }

                  return (
                    <div className="flex flex-col items-center justify-center text-center space-y-1">
                      {lines.map((line, idx) => {
                        const isSignify = /signify innovation/i.test(line);
                        const isPhilips = /^philips$/i.test(line);

                        if (isSignify) {
                          return (
                            <div
                              key={idx}
                              className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase text-center mt-1"
                            >
                              {line}
                            </div>
                          );
                        }
                        if (isPhilips) {
                          return (
                            <div
                              key={idx}
                              className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight text-center mt-1"
                            >
                              {line}
                            </div>
                          );
                        }
                        return (
                          <h3
                            key={idx}
                            className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center"
                          >
                            {line}
                          </h3>
                        );
                      })}
                    </div>
                  );
                })()}
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  {sectionContent.description}
                </p>
                <div>
                  <button className="bg-[#00e676] text-black font-bold px-6 py-2.5 text-xs uppercase tracking-wider rounded shadow-sm hover:bg-[#00c853]">
                    {sectionContent.button_text || 'View all brands'}
                  </button>
                </div>

                {/* Brands Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
                  {brands
                    .filter((b) => b.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((brand) => (
                      <div
                        key={brand.id}
                        className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-950 shadow-md flex flex-col justify-end p-6 border border-slate-200"
                      >
                        <img
                          src={brand.image_url}
                          alt={brand.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

                        <div className="relative z-10 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></span>
                            <span className="font-bold text-2xl text-white tracking-tight">
                              {brand.name}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed font-normal">
                            {brand.description}
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00e676]">
                              Explore →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Add / Edit Brand Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-sans space-y-6">
            <button
              onClick={() => setIsEditingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sparkles className="w-5 h-5 text-[#00e676]" />
              <span>{editingBrand.id ? 'Edit Brand Card' : 'Add New Brand Card'}</span>
            </h2>

            <form onSubmit={handleSaveBrand} className="space-y-5">
              {/* Brand Image Upload */}
              <FileUpload
                label="Brand Card Image (PNG, JPG, WebP, SVG) *"
                category="brand-images"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                currentUrl={editingBrand.image_url}
                onUploadSuccess={(url) => setEditingBrand({ ...editingBrand, image_url: url })}
                onRemove={() => setEditingBrand({ ...editingBrand, image_url: '' })}
              />

              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingBrand.name || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  placeholder="e.g. Philips, Signify, Interact, Dynalite"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676]"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingBrand.description || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                  placeholder="Professional and consumer lighting solutions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676] leading-relaxed"
                />
              </div>

              {/* Brand Website / Target URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Brand Target URL / Link
                </label>
                <input
                  type="text"
                  value={editingBrand.website_url || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })}
                  placeholder="/brands/philips or https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00e676] font-mono text-xs"
                />
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e676] font-mono"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={editingBrand.is_active}
                      onChange={(e) => setEditingBrand({ ...editingBrand, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#00e676] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">Active Status (Show on Frontend)</span>
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
                  <span>Save Brand Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Brand Card?"
        message="Are you sure you want to delete this brand? This action will remove it from the public website immediately."
        confirmText="Delete Brand"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
