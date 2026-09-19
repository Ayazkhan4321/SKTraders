import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchAdminFeatures,
  saveFeature,
  CompleteFeatureData,
  FeatureHighlight,
  FeatureSolution,
  FeatureSpecification,
  FeatureApplication,
  FeatureGalleryImage,
  FeatureInteractiveComponent,
} from '../services/featuresApi';
import FileUpload from '../components/FileUpload';
import {
  Sparkles,
  Save,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Tv,
  FileText,
  Zap,
  Sun,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
  Sliders,
  HelpCircle,
  Check,
  X,
  Info,
  Maximize2,
} from 'lucide-react';

export default function FeaturePageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';

  const [activeTab, setActiveTab] = useState<
    | 'basic'
    | 'hero'
    | 'intro'
    | 'interactive'
    | 'highlights'
    | 'solutions'
    | 'specs'
    | 'applications'
    | 'gallery'
    | 'catalogue'
    | 'cta'
  >('basic');

  const [allFeaturesList, setAllFeaturesList] = useState<CompleteFeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CompleteFeatureData>({
    feature: {
      id: '',
      title: '',
      slug: '',
      card_image_url: '',
      short_description: '',
      hero_image_url: '',
      hero_title: '',
      hero_subtitle: '',
      hero_cta_text: 'Explore Catalogue',
      hero_cta_link: '#catalogue',
      hero_overlay_opacity: 70,
      hero_text_align: 'left',
      intro_title: '',
      intro_description: '',
      intro_image_url: '',
      intro_image_position: 'right',
      catalogue_title: '',
      catalogue_description: '',
      catalogue_pdf_url: '',
      catalogue_button_text: 'Download PDF Catalogue',
      catalogue_active: true,
      contact_cta_title: 'NEED HELP CHOOSING THE RIGHT LIGHT?',
      contact_cta_description: 'Talk to our lighting engineers in Hyderabad regarding product BOQ and direct supply pricing.',
      contact_cta_button_text: 'Request Expert Consultation',
      contact_cta_button_link: '#contact',
      contact_cta_active: true,
      related_feature_ids: [],
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    highlights: [],
    solutions: [],
    specifications: [],
    applications: [],
    gallery: [],
    interactive_components: [],
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const all = await fetchAdminFeatures();
      setAllFeaturesList(all);

      if (!isNew && id) {
        const found = all.find((f) => f.feature.id === id);
        if (found) {
          setFormData(found);
        } else {
          alert('Feature page not found.');
          navigate('/admin/features');
        }
      } else {
        const maxOrder = all.length > 0 ? Math.max(...all.map((f) => f.feature.display_order)) + 1 : 1;
        setFormData((prev) => ({
          ...prev,
          feature: {
            ...prev.feature,
            display_order: maxOrder,
          },
        }));
      }
      setLoading(false);
    }
    loadData();
  }, [id, isNew]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      feature: {
        ...prev.feature,
        title: val,
        slug: isNew || !prev.feature.slug ? autoSlug : prev.feature.slug,
        hero_title: prev.feature.hero_title || val.toUpperCase(),
      },
    }));
  };

  const handleSave = async (e?: React.FormEvent, isDraft = false) => {
    if (e) e.preventDefault();
    if (!formData.feature.title || !formData.feature.slug) {
      alert('Please enter a Feature Title and Slug.');
      return;
    }

    setSaving(true);
    const dataToSave: CompleteFeatureData = {
      ...formData,
      feature: {
        ...formData.feature,
        is_active: isDraft ? false : formData.feature.is_active,
      },
    };

    const saved = await saveFeature(dataToSave);
    setSaving(false);
    showToast(isDraft ? '✓ Saved as Draft' : '✓ Feature Page Published Successfully');
    if (isNew && saved?.feature?.id) {
      navigate(`/admin/features/edit/${saved.feature.id}`, { replace: true });
    }
  };

  // Highlights handlers
  const addHighlight = () => {
    const newH: FeatureHighlight = {
      id: 'h_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      title: '',
      description: '',
      icon: 'Zap',
      display_order: formData.highlights.length + 1,
      is_active: true,
    };
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, newH] }));
  };

  const updateHighlight = (idx: number, field: keyof FeatureHighlight, val: any) => {
    const updated = [...formData.highlights];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, highlights: updated }));
  };

  const removeHighlight = (idx: number) => {
    setFormData((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));
  };

  // Interactive Component handlers
  const addInteractiveComponent = () => {
    const newIC: FeatureInteractiveComponent = {
      id: 'ic_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      name: '',
      tagline: '',
      description: '',
      human_explanation: '',
      icon_name: 'Sparkles',
      exploded_offset_y: ((formData.interactive_components?.length || 0) + 1) * 20,
      display_order: (formData.interactive_components?.length || 0) + 1,
      is_active: true,
    };
    setFormData((prev) => ({
      ...prev,
      interactive_components: [...(prev.interactive_components || []), newIC],
    }));
  };

  const updateInteractiveComponent = (
    idx: number,
    field: keyof FeatureInteractiveComponent,
    val: any
  ) => {
    const list = [...(formData.interactive_components || [])];
    list[idx] = { ...list[idx], [field]: val };
    setFormData((prev) => ({ ...prev, interactive_components: list }));
  };

  const removeInteractiveComponent = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      interactive_components: (prev.interactive_components || []).filter((_, i) => i !== idx),
    }));
  };

  // Solutions handlers
  const addSolution = () => {
    const newS: FeatureSolution = {
      id: 's_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      title: '',
      image_url: '',
      description: '',
      display_order: formData.solutions.length + 1,
      is_active: true,
    };
    setFormData((prev) => ({ ...prev, solutions: [...prev.solutions, newS] }));
  };

  const updateSolution = (idx: number, field: keyof FeatureSolution, val: any) => {
    const updated = [...formData.solutions];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, solutions: updated }));
  };

  const removeSolution = (idx: number) => {
    setFormData((prev) => ({ ...prev, solutions: prev.solutions.filter((_, i) => i !== idx) }));
  };

  // Specs handlers
  const addSpec = () => {
    const newSp: FeatureSpecification = {
      id: 'sp_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      label: '',
      value: '',
      explanation: '',
      display_order: formData.specifications.length + 1,
    };
    setFormData((prev) => ({ ...prev, specifications: [...prev.specifications, newSp] }));
  };

  const updateSpec = (idx: number, field: keyof FeatureSpecification, val: any) => {
    const updated = [...formData.specifications];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const removeSpec = (idx: number) => {
    setFormData((prev) => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }));
  };

  // Applications handlers
  const addApplication = () => {
    const newA: FeatureApplication = {
      id: 'a_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      title: '',
      image_url: '',
      description: '',
      display_order: formData.applications.length + 1,
      is_active: true,
    };
    setFormData((prev) => ({ ...prev, applications: [...prev.applications, newA] }));
  };

  const updateApplication = (idx: number, field: keyof FeatureApplication, val: any) => {
    const updated = [...formData.applications];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, applications: updated }));
  };

  const removeApplication = (idx: number) => {
    setFormData((prev) => ({ ...prev, applications: prev.applications.filter((_, i) => i !== idx) }));
  };

  // Gallery handlers
  const addGalleryImage = (url: string) => {
    const newG: FeatureGalleryImage = {
      id: 'g_' + Math.random().toString(36).substring(2, 9),
      feature_id: formData.feature.id,
      image_url: url,
      caption: '',
      display_order: formData.gallery.length + 1,
      is_active: true,
    };
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newG] }));
  };

  const updateGalleryImage = (idx: number, field: keyof FeatureGalleryImage, val: any) => {
    const updated = [...formData.gallery];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, gallery: updated }));
  };

  const removeGalleryImage = (idx: number) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono">
        Loading Feature CMS Editor...
      </div>
    );
  }

  const f = formData.feature;

  return (
    <div className="space-y-6 font-sans animate-fade-in pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/features')}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Back to Features List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00e676]" />
              <span>{isNew ? 'Create New Feature Page' : `Edit: ${f.title}`}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Human-Friendly CMS Editor for <span className="font-mono text-cyan-400">/features/{f.slug || 'slug'}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {f.slug && (
            <button
              type="button"
              onClick={() => setShowLivePreviewModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave(undefined, true)}
            disabled={saving}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={(e) => handleSave(e, false)}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish Page'}</span>
          </button>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
        {[
          { id: 'basic', label: '1. Basic & Card', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'hero', label: '2. Hero Banner', icon: <Tv className="w-3.5 h-3.5" /> },
          { id: 'intro', label: '3. Introduction', icon: <FileText className="w-3.5 h-3.5" /> },
          {
            id: 'interactive',
            label: `4. Interactive Story (${formData.interactive_components?.length || 0})`,
            icon: <Sparkles className="w-3.5 h-3.5 text-[#00e676]" />,
          },
          { id: 'highlights', label: `5. Benefits (${formData.highlights.length})`, icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'solutions', label: `6. Solutions (${formData.solutions.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'specs', label: `7. Specs & Explanations (${formData.specifications.length})`, icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'applications', label: `8. Applications (${formData.applications.length})`, icon: <Sun className="w-3.5 h-3.5" /> },
          { id: 'gallery', label: `9. Gallery (${formData.gallery.length})`, icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: 'catalogue', label: '10. Catalogue PDF', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'cta', label: '11. Related & CTA', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-800 text-[#00e676] border border-[#00e676]/40 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tabbed Editor Form */}
      <form onSubmit={(e) => handleSave(e, false)} className="space-y-8">
        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00e676]" />
              <span>Basic Information & Homepage Card</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Feature Page Title *
                </label>
                <input
                  type="text"
                  required
                  value={f.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Smart Lighting & WiZ Connected Systems"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e676]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  URL Route Slug * (e.g. /features/smart-lighting)
                </label>
                <input
                  type="text"
                  required
                  value={f.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      feature: { ...prev.feature, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') },
                    }))
                  }
                  placeholder="smart-lighting"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-mono text-cyan-400 focus:outline-none focus:border-[#00e676]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Short Summary (Displayed on homepage feature cards)
              </label>
              <textarea
                rows={3}
                value={f.short_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, short_description: e.target.value } }))}
                placeholder="Brief summary displayed on homepage feature cards..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00e676]"
              />
            </div>

            <FileUpload
              label="Homepage Feature Card Image *"
              category="feature-images/cards"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={f.card_image_url}
              onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, card_image_url: url } }))}
              onRemove={() => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, card_image_url: '' } }))}
            />

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  value={f.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, display_order: parseInt(e.target.value) || 1 } }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#00e676]"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={f.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, is_active: e.target.checked } }))}
                    className="w-4 h-4 accent-[#00e676] rounded"
                  />
                  <span className="text-xs font-bold text-white">Active (Publicly Visible)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO BANNER */}
        {activeTab === 'hero' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <span>Hero Banner Customization</span>
            </h3>

            <FileUpload
              label="Hero Background Image"
              category="feature-images/heroes"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={f.hero_image_url}
              onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_image_url: url } }))}
              onRemove={() => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_image_url: '' } }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hero Title (Main Display)
                </label>
                <input
                  type="text"
                  value={f.hero_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_title: e.target.value } }))}
                  placeholder="e.g. SMART LIGHTING SOLUTIONS"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hero Subtitle / Short Description
                </label>
                <input
                  type="text"
                  value={f.hero_subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_subtitle: e.target.value } }))}
                  placeholder="Better light. Better spaces."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={f.hero_cta_text || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_cta_text: e.target.value } }))}
                  placeholder="Request Quote"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Background Overlay Dark Opacity ({f.hero_overlay_opacity ?? 30}% - Lower = Brighter & Clearer Image)
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={f.hero_overlay_opacity ?? 30}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_overlay_opacity: parseInt(e.target.value) } }))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Text Alignment
                </label>
                <select
                  value={f.hero_text_align || 'left'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, hero_text_align: e.target.value as any } }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTRODUCTION */}
        {activeTab === 'intro' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Product Introduction & Overview</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Introduction Heading
              </label>
              <input
                type="text"
                value={f.intro_title || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, intro_title: e.target.value } }))}
                placeholder="LIGHTING THAT WORKS FOR YOU"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Product Description (Simple, human language)
              </label>
              <textarea
                rows={6}
                value={f.intro_description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, intro_description: e.target.value } }))}
                placeholder="Designed for efficient, comfortable and reliable lighting..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
              />
            </div>

            <FileUpload
              label="Product Introduction Image"
              category="feature-images/intros"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={f.intro_image_url}
              onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, intro_image_url: url } }))}
              onRemove={() => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, intro_image_url: '' } }))}
            />
          </div>
        )}

        {/* TAB 4: INTERACTIVE EXPLODED STORY */}
        {activeTab === 'interactive' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00e676]" />
                  <span>Interactive Exploded Story ("DISCOVER WHAT'S INSIDE")</span>
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Manage the internal components that disassemble dynamically as the user scrolls down the page.
                </p>
              </div>

              <button
                type="button"
                onClick={addInteractiveComponent}
                className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-[#00e676] font-bold text-xs rounded-xl hover:bg-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Component Part</span>
              </button>
            </div>

            <div className="space-y-6">
              {(formData.interactive_components || []).map((comp, idx) => (
                <div key={comp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold text-[#00e676]">
                      Component Layer #{idx + 1}: {comp.name || 'Untitled Part'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeInteractiveComponent(idx)}
                      className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Part Name *</label>
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => updateInteractiveComponent(idx, 'name', e.target.value)}
                        placeholder="e.g. LED BOARD"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Tagline / Subtitle</label>
                      <input
                        type="text"
                        value={comp.tagline}
                        onChange={(e) => updateInteractiveComponent(idx, 'tagline', e.target.value)}
                        placeholder="e.g. Light Creation Core"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Icon</label>
                      <select
                        value={comp.icon_name || 'Sparkles'}
                        onChange={(e) => updateInteractiveComponent(idx, 'icon_name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      >
                        <option value="Sun">Sun (Optics)</option>
                        <option value="Sparkles">Sparkles (LED Matrix)</option>
                        <option value="Cpu">Cpu (Smart Driver)</option>
                        <option value="ShieldCheck">Shield (Heat Sink)</option>
                        <option value="Zap">Zap (Plug Base)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#00e676] uppercase">
                      HUMAN-FRIENDLY EXPLANATION ("What Does This Do?") *
                    </label>
                    <input
                      type="text"
                      value={comp.human_explanation}
                      onChange={(e) => updateInteractiveComponent(idx, 'human_explanation', e.target.value)}
                      placeholder="e.g. The part that creates the light cleanly and bright."
                      className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl p-2.5 text-xs text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Technical Description</label>
                    <input
                      type="text"
                      value={comp.description}
                      onChange={(e) => updateInteractiveComponent(idx, 'description', e.target.value)}
                      placeholder="e.g. High-density SMD diodes with thermal bonding..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HIGHLIGHTS & BENEFITS */}
        {activeTab === 'highlights' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00e676]" />
                <span>WHY YOU'LL LIKE IT — Key Benefits ({formData.highlights.length})</span>
              </h3>
              <button
                type="button"
                onClick={addHighlight}
                className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 text-[#00e676] font-bold text-xs rounded-xl hover:bg-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Benefit Highlight</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.highlights.map((h, idx) => (
                <div key={h.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Icon</label>
                    <select
                      value={h.icon}
                      onChange={(e) => updateHighlight(idx, 'icon', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    >
                      <option value="Zap">Zap (Energy Efficiency)</option>
                      <option value="Sun">Sun (Bright Light)</option>
                      <option value="ShieldCheck">Shield (Long Life)</option>
                      <option value="Cpu">Cpu (Smart Tech)</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Benefit Title</label>
                    <input
                      type="text"
                      value={h.title}
                      onChange={(e) => updateHighlight(idx, 'title', e.target.value)}
                      placeholder="e.g. Uses Less Energy"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={h.description}
                      onChange={(e) => updateHighlight(idx, 'description', e.target.value)}
                      placeholder="Brief human details..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>

                  <div className="md:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SOLUTIONS */}
        {activeTab === 'solutions' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Product & Luminaire Lineup ({formData.solutions.length})</span>
              </h3>
              <button
                type="button"
                onClick={addSolution}
                className="px-3.5 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-xs rounded-xl hover:bg-purple-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Luminaire Model</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.solutions.map((s, idx) => (
                <div key={s.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold text-purple-400">Model Item #{idx + 1}</span>
                    <button type="button" onClick={() => removeSolution(idx)} className="text-slate-500 hover:text-red-400 text-xs">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => updateSolution(idx, 'title', e.target.value)}
                      placeholder="Model Title (e.g. WiZ Smart Ceiling Panel)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />

                    <input
                      type="text"
                      value={s.description}
                      onChange={(e) => updateSolution(idx, 'description', e.target.value)}
                      placeholder="Simple description..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <FileUpload
                    label="Model Image"
                    category="feature-images/solutions"
                    accept="image/jpeg,image/png,image/webp"
                    currentUrl={s.image_url}
                    onUploadSuccess={(url) => updateSolution(idx, 'image_url', url)}
                    onRemove={() => updateSolution(idx, 'image_url', '')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SPECIFICATIONS & HUMAN EXPLANATIONS */}
        {activeTab === 'specs' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>Technical Specifications & Human Explanations ("What Does This Mean?")</span>
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Always provide a simple human explanation for technical terms like IP65, CRI, 6500K.
                </p>
              </div>

              <button
                type="button"
                onClick={addSpec}
                className="px-3.5 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs rounded-xl hover:bg-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Specification</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.specifications.map((sp, idx) => (
                <div key={sp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">Spec Pair #{idx + 1}</span>
                    <button type="button" onClick={() => removeSpec(idx)} className="text-slate-500 hover:text-red-400 text-xs">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Technical Term / Label</label>
                      <input
                        type="text"
                        value={sp.label}
                        onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                        placeholder="e.g. IP Rating or CRI"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-cyan-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Value</label>
                      <input
                        type="text"
                        value={sp.value}
                        onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                        placeholder="e.g. IP65 or CRI 80+"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#00e676] uppercase mb-1">
                      HUMAN-FRIENDLY EXPLANATION ("What Does This Mean?")
                    </label>
                    <input
                      type="text"
                      value={sp.explanation || ''}
                      onChange={(e) => updateSpec(idx, 'explanation', e.target.value)}
                      placeholder="e.g. Protected against dust and water (IP65) or More natural-looking colours (CRI 80+)"
                      className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>WHERE CAN YOU USE IT? — Applications ({formData.applications.length})</span>
              </h3>
              <button
                type="button"
                onClick={addApplication}
                className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl hover:bg-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Environment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.applications.map((a, idx) => (
                <div key={a.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-amber-400">Environment #{idx + 1}</span>
                    <button type="button" onClick={() => removeApplication(idx)} className="text-slate-500 hover:text-red-400 text-xs">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={a.title}
                    onChange={(e) => updateApplication(idx, 'title', e.target.value)}
                    placeholder="Application Title (e.g. Residential Living Room)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    value={a.description || ''}
                    onChange={(e) => updateApplication(idx, 'description', e.target.value)}
                    placeholder="Simple explanation..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-300"
                  />

                  <FileUpload
                    label="Environment Photo"
                    category="feature-images/applications"
                    accept="image/jpeg,image/png,image/webp"
                    currentUrl={a.image_url}
                    onUploadSuccess={(url) => updateApplication(idx, 'image_url', url)}
                    onRemove={() => updateApplication(idx, 'image_url', '')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <span>Project Visuals & Installation Gallery ({formData.gallery.length})</span>
            </h3>

            <FileUpload
              label="Upload Gallery Photo"
              category="feature-gallery/images"
              accept="image/jpeg,image/png,image/webp"
              currentUrl=""
              onUploadSuccess={(url) => addGalleryImage(url)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              {formData.gallery.map((g, idx) => (
                <div key={g.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-900">
                    <img src={g.image_url} alt={g.caption || 'Gallery photo'} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={g.caption || ''}
                    onChange={(e) => updateGalleryImage(idx, 'caption', e.target.value)}
                    placeholder="Photo Caption..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CATALOGUE PDF */}
        {activeTab === 'catalogue' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-400" />
              <span>Catalogue PDF Section</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Catalogue Heading
              </label>
              <input
                type="text"
                value={f.catalogue_title || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_title: e.target.value } }))}
                placeholder="Explore the complete product catalogue"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Catalogue Description
              </label>
              <textarea
                rows={2}
                value={f.catalogue_description || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_description: e.target.value } }))}
                placeholder="Brief summary of catalogue contents..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white"
              />
            </div>

            <FileUpload
              label="Upload Specification PDF Document"
              category="feature-catalogues/pdfs"
              accept="application/pdf"
              currentUrl={f.catalogue_pdf_url}
              onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_pdf_url: url } }))}
              onRemove={() => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_pdf_url: '' } }))}
            />

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Download Button Text
                </label>
                <input
                  type="text"
                  value={f.catalogue_button_text || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_button_text: e.target.value } }))}
                  placeholder="View Catalogue / Download PDF"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={f.catalogue_active ?? true}
                    onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, catalogue_active: e.target.checked } }))}
                    className="w-4 h-4 accent-red-500 rounded"
                  />
                  <span className="text-xs font-bold text-white">Display Catalogue Banner</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: RELATED & CTA */}
        {activeTab === 'cta' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
              <span>Related Features & Bottom Contact CTA</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Related Features to Display at Bottom
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allFeaturesList
                  .filter((item) => item.feature.id !== f.id)
                  .map((item) => {
                    const isSelected = (f.related_feature_ids || []).includes(item.feature.id);
                    return (
                      <label
                        key={item.feature.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentList = f.related_feature_ids || [];
                            const updated = e.target.checked
                              ? [...currentList, item.feature.id]
                              : currentList.filter((id) => id !== item.feature.id);
                            setFormData((prev) => ({ ...prev, feature: { ...prev.feature, related_feature_ids: updated } }));
                          }}
                          className="w-4 h-4 accent-[#00e676] rounded"
                        />
                        <span className="text-xs font-bold">{item.feature.title}</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bottom Conversion CTA</h4>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  CTA Banner Title
                </label>
                <input
                  type="text"
                  value={f.contact_cta_title || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, contact_cta_title: e.target.value } }))}
                  placeholder="NEED HELP CHOOSING THE RIGHT LIGHT?"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  CTA Description
                </label>
                <textarea
                  rows={2}
                  value={f.contact_cta_description || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feature: { ...prev.feature, contact_cta_description: e.target.value } }))}
                  placeholder="Our team can help you find the right lighting solution..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}
      </form>

      {/* LIVE PREVIEW MODAL OVERLAY */}
      {showLivePreviewModal && f.slug && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 animate-fade-in">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-t-2xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Eye className="w-5 h-5 text-[#00e676]" />
              <span>Live CMS Preview Mode — /features/{f.slug}</span>
            </div>
            <button
              onClick={() => setShowLivePreviewModal(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <iframe
            src={`/features/${f.slug}?preview=true`}
            title="Feature Live Preview"
            className="w-full h-full border-x border-b border-slate-800 rounded-b-2xl bg-slate-950"
          />
        </div>
      )}
    </div>
  );
}
