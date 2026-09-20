import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProducts, DetailedProduct } from '../../services/productsApi';
import {
  apiFetchHomepageProducts,
  apiSaveHomepageProduct,
  HomepageProductConfig,
} from '../../services/homepageProductsApi';
import { uploadFile } from '../services/storageApi';
import { ArrowLeft, Save, Sparkles, Upload, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';

export const AdminHomepageProductEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [masterProducts, setMasterProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State (Homepage-Specific Independent Fields)
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [homepageName, setHomepageName] = useState<string>('');
  const [homepagePrice, setHomepagePrice] = useState<string>('');
  const [homepageImageUrl, setHomepageImageUrl] = useState<string>('');
  const [homepageDescription, setHomepageDescription] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showViewButton, setShowViewButton] = useState<boolean>(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [prods, cfgs] = await Promise.all([
          getProducts(),
          apiFetchHomepageProducts(),
        ]);
        setMasterProducts(prods);

        if (id) {
          const cfg = cfgs.find((c) => c.id === id);
          if (cfg) {
            setSelectedProductId(cfg.product_id);
            setHomepageName(cfg.homepage_name || '');
            setHomepagePrice(cfg.homepage_price != null ? cfg.homepage_price.toString() : '');
            setHomepageImageUrl(cfg.homepage_image_url || '');
            setHomepageDescription(cfg.homepage_description || '');
            setDisplayOrder(cfg.display_order ?? 1);
            setIsActive(cfg.is_active ?? true);
            setShowPrice(cfg.show_price ?? true);
            setShowViewButton(cfg.show_view_button ?? true);
          }
        } else if (prods.length > 0) {
          // Default to first master product if creating new
          const first = prods[0];
          setSelectedProductId(first.id);
          populateDefaultsFromMaster(first);
        }
      } catch (err) {
        console.error('Error initializing homepage product editor:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const populateDefaultsFromMaster = (master: DetailedProduct) => {
    setHomepageName(master.name);
    setHomepagePrice(master.price.toString());
    setHomepageImageUrl(master.image_url);
    setHomepageDescription(master.short_description || master.description?.substring(0, 100) || '');
  };

  const handleMasterProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const master = masterProducts.find((p) => p.id === productId);
    if (master && !isEditing) {
      populateDefaultsFromMaster(master);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file, 'homepage-products/images');
      if (res.success && res.url) {
        setHomepageImageUrl(res.url);
      } else {
        alert(res.error || 'Failed to upload homepage image.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Please select a master product.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<HomepageProductConfig> = {
        id: id || undefined,
        product_id: selectedProductId,
        homepage_name: homepageName.trim(),
        homepage_price: homepagePrice ? parseFloat(homepagePrice) : undefined,
        homepage_image_url: homepageImageUrl.trim(),
        homepage_description: homepageDescription.trim(),
        display_order: displayOrder,
        is_active: isActive,
        show_price: showPrice,
        show_view_button: showViewButton,
      };

      await apiSaveHomepageProduct(payload);
      navigate('/admin/homepage-products');
    } catch (err) {
      console.error('Failed to save homepage product config:', err);
      alert('Error saving homepage product settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading homepage product editor...
      </div>
    );
  }

  const selectedMaster = masterProducts.find((p) => p.id === selectedProductId);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/homepage-products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isEditing ? 'Edit Homepage Product Settings' : 'Add Product to Homepage'}
            </h1>
            <p className="text-xs text-slate-400">
              Configure independent presentation overrides for the homepage search section.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Info Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="font-bold text-white block mb-0.5">Independent Display Control</strong>
          Changes made here belong ONLY to the homepage presentation layer. The master product catalog on <code className="text-amber-200">/products</code> and <code className="text-amber-200">/products/detail/:slug</code> will remain completely unchanged.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Master Product */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            1. Select Master Product
          </h2>

          <div className="space-y-2 text-xs">
            <label className="block text-slate-400 font-medium">Master Product Catalogue Item *</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleMasterProductChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {masterProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku}) — Catalogue Price: ₹{p.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {selectedMaster && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3 text-xs">
              <img
                src={selectedMaster.image_url}
                alt={selectedMaster.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
              />
              <div>
                <div className="font-bold text-white">{selectedMaster.name}</div>
                <div className="text-[10px] text-slate-400">
                  Master SKU: {selectedMaster.sku} • Brand: {selectedMaster.brand} • Catalogue Price: ₹{selectedMaster.price.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Homepage Independent Fields */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            2. Homepage Display Overrides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Homepage Product Name</label>
              <input
                type="text"
                value={homepageName}
                onChange={(e) => setHomepageName(e.target.value)}
                placeholder={selectedMaster?.name || 'e.g. Philips Smart LED Bulb'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to use master product name.</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Homepage Display Price (₹)</label>
              <input
                type="number"
                value={homepagePrice}
                onChange={(e) => setHomepagePrice(e.target.value)}
                placeholder={selectedMaster?.price?.toString() || '1499'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to use master product price.</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block text-slate-400 font-medium">Homepage Product Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="text"
                value={homepageImageUrl}
                onChange={(e) => setHomepageImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg or /images/..."
                className="flex-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />

              <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-2 border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                {uploading ? 'Uploading...' : 'Upload New Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {homepageImageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800 w-fit">
                <img
                  src={homepageImageUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"
                />
                <div className="text-[10px] text-slate-400 font-mono">Image Preview Ready</div>
              </div>
            )}
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Homepage Short Summary</label>
            <textarea
              rows={2}
              value={homepageDescription}
              onChange={(e) => setHomepageDescription(e.target.value)}
              placeholder="Short description displayed on homepage product card"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Step 3: Display Settings */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            3. Order & Status Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Homepage Display Order (1 to 4)</label>
              <select
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value={1}>Position 1 (First Card)</option>
                <option value={2}>Position 2 (Second Card)</option>
                <option value={3}>Position 3 (Third Card)</option>
                <option value={4}>Position 4 (Fourth Card)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 justify-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 bg-slate-950 w-4 h-4"
                />
                <span className="font-semibold text-xs">Active on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 bg-slate-950 w-4 h-4"
                />
                <span className="font-semibold text-xs">Show Display Price on Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={showViewButton}
                  onChange={(e) => setShowViewButton(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 bg-slate-950 w-4 h-4"
                />
                <span className="font-semibold text-xs">Show View Button on Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            to="/admin/homepage-products"
            className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
          >
            {saving ? 'Saving...' : 'Save Homepage Product Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
