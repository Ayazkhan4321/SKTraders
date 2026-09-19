import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, getCategories, upsertProduct, DetailedProduct, ProductCategory } from '../../services/productsApi';
import { ArrowLeft, Save, Sparkles, Box, Image as ImageIcon, Zap, ShieldCheck } from 'lucide-react';

export const AdminProductEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState<Partial<DetailedProduct>>({
    name: '',
    slug: '',
    sku: '',
    brand: 'SK Traders Architectural',
    category_slug: 'ceiling-lights',
    price: 1499,
    original_price: 1999,
    short_description: '',
    description: '',
    wattage: 12,
    lumens: 1200,
    voltage: '220V - 240V AC 50/60Hz',
    cri: '> 90 Ra',
    beam_angle: '24° / 36°',
    ip_rating: 'IP44',
    dimensions: 'Dia: 90mm x H: 110mm',
    material_finish: 'Die-cast Aerospace Aluminum',
    lifespan_hours: 50000,
    warranty_years: 5,
    is_smart: false,
    is_in_stock: true,
    rating: 4.9,
    cct_options: ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)'],
    features: ['High efficacy optical refractor lens', 'Zero flicker solid-state LED driver', 'Triac dimmable driver compatible'],
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'],
    model_3d_url: '',
  });

  const [imagesInput, setImagesInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (id) {
          const prod = await getProductById(id);
          if (prod) {
            setFormData(prod);
            setImagesInput(prod.images ? prod.images.join('\n') : '');
            setFeaturesInput(prod.features ? prod.features.join('\n') : '');
          }
        }
      } catch (err) {
        console.error('Error fetching data for product editor:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      // Auto-generate slug if new product
      slug: !isEditing ? nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug,
    }));
  };

  const handleCctToggle = (cct: string) => {
    setFormData((prev) => {
      const currentCcts = prev.cct_options || [];
      const updated = currentCcts.includes(cct)
        ? currentCcts.filter((c) => c !== cct)
        : [...currentCcts, cct];
      return { ...prev, cct_options: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedImages = imagesInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedFeatures = featuresInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const wattNum = Number(formData.wattage) || 0;
      const lumNum = Number(formData.lumens) || 0;
      const catSlug = formData.category_slug || 'ceiling-lights';
      const catObj = categories.find((c) => c.slug === catSlug);

      const payload: DetailedProduct = {
        id: formData.id || `prod-${Date.now()}`,
        name: formData.name || 'Untitled Product',
        slug: formData.slug || `prod-${Date.now()}`,
        sku: formData.sku || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
        category_id: catObj?.id || catSlug,
        category_name: catObj?.name || catSlug.replace('-', ' '),
        category_slug: catSlug,
        brand: formData.brand || 'SK Traders Architectural',
        price: Number(formData.price) || 0,
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        short_description: formData.short_description || '',
        description: formData.description || '',
        wattage: wattNum,
        wattage_num: wattNum,
        lumens: lumNum,
        lumens_num: lumNum,
        cct: formData.cct || (formData.cct_options?.[0] || 'Warm White 3000K'),
        cct_options: formData.cct_options || ['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)'],
        voltage: formData.voltage || '220V - 240V AC 50/60Hz',
        cri: formData.cri || '> 90 Ra',
        beam_angle: formData.beam_angle || '36°',
        ip_rating: formData.ip_rating || 'IP44',
        dimensions: formData.dimensions || '',
        material_finish: formData.material_finish || '',
        lifespan_hours: Number(formData.lifespan_hours) || 50000,
        warranty_years: Number(formData.warranty_years) || 5,
        is_smart: Boolean(formData.is_smart),
        is_in_stock: Boolean(formData.is_in_stock),
        rating: Number(formData.rating) || 4.9,
        features: parsedFeatures.length > 0 ? parsedFeatures : ['High quality finish'],
        image_url: parsedImages[0] || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
        images: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'],
        gallery_images: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'],
        model_3d_url: formData.model_3d_url || undefined,
        variants: formData.variants || [],
        is_featured: formData.is_featured ?? true,
        is_published: formData.is_published ?? true,
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await upsertProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading product editor...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isEditing ? `Edit Product: ${formData.name}` : 'Create New Product'}
            </h1>
            <p className="text-xs text-slate-400">Configure lighting specifications, pricing, and 3D GLB assets.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Product Information */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={handleNameChange}
                placeholder="e.g. Architectural Trimless COB Spotlight"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">URL Slug *</label>
              <input
                type="text"
                required
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">SKU Code *</label>
              <input
                type="text"
                required
                name="sku"
                value={formData.sku || ''}
                onChange={handleChange}
                placeholder="SK-COB-12W-01"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category *</label>
              <select
                name="category_slug"
                value={formData.category_slug || 'ceiling-lights'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 capitalize"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Short Summary</label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description || ''}
              onChange={handleChange}
              placeholder="Sleek recessed architectural spotlight with anti-glare reflector"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Price (₹) *</label>
              <input
                type="number"
                required
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Original Price (₹ MRP)</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  name="is_in_stock"
                  checked={Boolean(formData.is_in_stock)}
                  onChange={handleChange}
                  className="rounded border-slate-700 text-amber-500 bg-slate-950"
                />
                <span className="font-semibold">In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  name="is_smart"
                  checked={Boolean(formData.is_smart)}
                  onChange={handleChange}
                  className="rounded border-slate-700 text-sky-500 bg-slate-950"
                />
                <span className="font-semibold text-sky-400">Smart App</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Specifications */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Lighting Technical Parameters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Wattage (W)</label>
              <input
                type="number"
                name="wattage"
                value={formData.wattage || 0}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Lumens (lm)</label>
              <input
                type="number"
                name="lumens"
                value={formData.lumens || 0}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">CRI Index</label>
              <input
                type="text"
                name="cri"
                value={formData.cri || '> 90 Ra'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">IP Rating</label>
              <input
                type="text"
                name="ip_rating"
                value={formData.ip_rating || 'IP44'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Color Temperature Checkboxes */}
          <div className="space-y-2 text-xs">
            <label className="block text-slate-400 font-medium">Supported Color Temperatures (CCT)</label>
            <div className="flex flex-wrap gap-3">
              {['Warm White (3000K)', 'Neutral White (4000K)', 'Cool White (6500K)', 'RGB / Tunable Smart'].map(
                (cct) => (
                  <label key={cct} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.cct_options?.includes(cct))}
                      onChange={() => handleCctToggle(cct)}
                      className="rounded border-slate-700 text-amber-500 bg-slate-950"
                    />
                    <span>{cct}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Section 4: 3D Model & Images */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Box className="w-4 h-4 text-emerald-400" />
            3D GLB Model & 2D Image Gallery
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">3D Model File URL (.glb / .gltf)</label>
              <input
                type="text"
                name="model_3d_url"
                value={formData.model_3d_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/models/ceiling-light.glb (Leave empty to use procedural 3D model fallback)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">2D High-Res Product Image URLs (One URL per line)</label>
              <textarea
                rows={3}
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Key Highlights / Features (One feature per line)</label>
              <textarea
                rows={3}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="High optical clarity lens&#10;Triac dimmable driver support"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
          >
            {saving ? 'Saving Product...' : 'Save Product Catalogue Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};
