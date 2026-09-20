import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getProductById,
  getCategories,
  getProducts,
  upsertProduct,
  DetailedProduct,
  ProductCategory,
  ProductSpecification,
  ProductCatalogue,
} from '../../services/productsApi';
import { uploadFile } from '../services/storageApi';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Image as ImageIcon,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Upload,
  FileText,
  Search,
  Check,
  Eye,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Layers,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';

const COMMON_SPEC_NAMES = [
  'Wattage',
  'Brightness / Lumens',
  'Efficiency',
  'Color Temperature',
  'Voltage',
  'Beam Angle',
  'CRI',
  'IP Rating',
  'Life Hours',
  'Size / Dimensions',
  'Material',
  'Shape',
  'Base / Holder',
  'Dimmable',
  'Warranty',
  'Quantity / Pack Size',
];

export const AdminProductEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [allProductsList, setAllProductsList] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // General Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Philips');
  const [categorySlug, setCategorySlug] = useState('ceiling-lights');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(1999);
  const [shortDescription, setShortDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Description & Content Sections
  const [overviewText, setOverviewText] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [applicationsInput, setApplicationsInput] = useState('');
  const [installationText, setInstallationText] = useState('');
  const [technicalInfoText, setTechnicalInfoText] = useState('');

  // Images State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [uploadingMultiImages, setUploadingMultiImages] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Technical Specifications State
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);

  // Catalogue PDF State
  const [catalogues, setCatalogues] = useState<ProductCatalogue[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Related Products State
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);
  const [relatedSearchQuery, setRelatedSearchQuery] = useState('');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats);
        setAllProductsList(prods);

        if (id) {
          const prod = await getProductById(id);
          if (prod) {
            setName(prod.name || '');
            setSlug(prod.slug || '');
            setSku(prod.sku || '');
            setBrand(prod.brand || 'Philips');
            setCategorySlug(prod.category_slug || 'ceiling-lights');
            setSubCategory(prod.sub_category || '');
            setPrice(prod.price || 0);
            setOriginalPrice(prod.original_price);
            setShortDescription(prod.short_description || '');
            setIsPublished(prod.is_published ?? true);
            setIsFeatured(prod.is_featured ?? false);

            setOverviewText(prod.overview_text || prod.description || '');
            setFeaturesInput(prod.features ? prod.features.join('\n') : '');
            setBenefitsInput(prod.benefits ? prod.benefits.join('\n') : '');
            setApplicationsInput(prod.applications ? prod.applications.join('\n') : '');
            setInstallationText(prod.installation_text || '');
            setTechnicalInfoText(prod.technical_info_text || '');

            setImages(prod.images && prod.images.length > 0 ? prod.images : [prod.image_url]);
            setSpecifications(prod.specifications || []);
            setCatalogues(prod.catalogues || []);
            setRelatedProductIds(prod.related_product_ids || []);
          }
        } else {
          // Initialize default lighting specs for a new product
          setSpecifications([
            { specification_name: 'Wattage', specification_value: '18W', sort_order: 1 },
            { specification_name: 'Brightness / Lumens', specification_value: '1600 lm', sort_order: 2 },
            { specification_name: 'Efficiency', specification_value: '88 lm/W', sort_order: 3 },
            { specification_name: 'Color Temperature', specification_value: '6500K / 4000K / 3000K', sort_order: 4 },
            { specification_name: 'Voltage', specification_value: '220V–240V AC', sort_order: 5 },
            { specification_name: 'CRI', specification_value: '>80 Ra', sort_order: 6 },
            { specification_name: 'IP Rating', specification_value: 'IP20', sort_order: 7 },
            { specification_name: 'Life Hours', specification_value: '15,000 Hours', sort_order: 8 },
            { specification_name: 'Size / Dimensions', specification_value: '600 × 600 mm', sort_order: 9 },
            { specification_name: 'Warranty', specification_value: '2 Years Warranty', sort_order: 10 },
          ]);
        }
      } catch (err) {
        console.error('Error loading product data:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  // Handle Name change & Auto SEO Slug generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Image Upload Handlers
  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMultiImages(true);
    const newImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadFile(file, 'product-images');
      if (res.success && res.url) {
        newImageUrls.push(res.url);
      }
    }

    setImages((prev) => [...prev, ...newImageUrls]);
    setUploadingMultiImages(false);
    if (multiFileInputRef.current) multiFileInputRef.current.value = '';
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetIndex === null) return;

    setUploadingImageIndex(replaceTargetIndex);
    const res = await uploadFile(file, 'product-images');
    setUploadingImageIndex(null);

    if (res.success && res.url) {
      const newImgs = [...images];
      newImgs[replaceTargetIndex] = res.url;
      setImages(newImgs);
    }
    setReplaceTargetIndex(null);
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, idx) => idx !== index);
    setImages([item, ...filtered]);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const newImgs = [...images];
    const temp = newImgs[index];
    newImgs[index] = newImgs[targetIdx];
    newImgs[targetIdx] = temp;
    setImages(newImgs);
  };

  // Specification Handlers
  const handleAddSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      { specification_name: '', specification_value: '', sort_order: prev.length + 1 },
    ]);
  };

  const handleSpecChange = (index: number, field: 'specification_name' | 'specification_value', val: string) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleDeleteSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveSpec = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= specifications.length) return;
    const copy = [...specifications];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSpecifications(copy);
  };

  // Catalogue Upload Handler
  const handleCatalogueUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const res = await uploadFile(file, 'product-catalogues');
    setUploadingPdf(false);

    if (res.success && res.url) {
      const newCat: ProductCatalogue = {
        name: file.name.replace('.pdf', ''),
        file_url: res.url,
        file_size_bytes: res.sizeBytes || file.size,
        description: 'Product Catalogue PDF',
        sort_order: catalogues.length + 1,
        created_at: new Date().toISOString(),
      };
      setCatalogues((prev) => [...prev, newCat]);
    } else {
      alert(res.error || 'Catalogue PDF upload failed');
    }
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const handleDeleteCatalogue = (index: number) => {
    setCatalogues((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Related Products Handlers
  const handleToggleRelatedProduct = (prodId: string) => {
    if (prodId === id) return; // Cannot relate product to itself
    setRelatedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((pid) => pid !== prodId) : [...prev, prodId]
    );
  };

  // Submit Handler with Validation
  const handleSubmit = async (saveAsStatus: 'publish' | 'draft') => {
    setValidationError(null);

    // Validation
    if (!name.trim()) {
      setValidationError('Product Name is required.');
      return;
    }
    if (!categorySlug) {
      setValidationError('Product Category is required.');
      return;
    }
    if (images.length === 0) {
      setValidationError('At least 1 Main Product Image is required.');
      return;
    }
    if (!overviewText.trim() && !shortDescription.trim()) {
      setValidationError('Product Description is required.');
      return;
    }

    // SKU duplication check
    if (sku.trim()) {
      const duplicateSku = allProductsList.find(
        (p) => p.sku?.toLowerCase() === sku.trim().toLowerCase() && p.id !== id
      );
      if (duplicateSku) {
        setValidationError(`Duplicate SKU code '${sku}'. Please use a unique SKU.`);
        return;
      }
    }

    // Filter empty specs
    const validSpecs = specifications
      .filter((s) => s.specification_name.trim() && s.specification_value.trim())
      .map((s, idx) => ({ ...s, sort_order: idx + 1 }));

    setSaving(true);
    try {
      const parsedFeatures = featuresInput.split('\n').map((s) => s.trim()).filter(Boolean);
      const parsedBenefits = benefitsInput.split('\n').map((s) => s.trim()).filter(Boolean);
      const parsedApps = applicationsInput.split('\n').map((s) => s.trim()).filter(Boolean);
      const selectedCat = categories.find((c) => c.slug === categorySlug);

      const wattMatch = specifications.find((s) => s.specification_name.toLowerCase().includes('watt'));
      const lumensMatch = specifications.find((s) => s.specification_name.toLowerCase().includes('lumen') || s.specification_name.toLowerCase().includes('bright'));

      const wattNum = wattMatch ? parseInt(wattMatch.specification_value) || 18 : 18;
      const lumNum = lumensMatch ? parseInt(lumensMatch.specification_value) || 1600 : 1600;

      const payload: DetailedProduct = {
        id: id || `prod_${Date.now()}`,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: sku.trim() || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
        brand: brand.trim() || 'Philips',
        category_id: selectedCat?.id || categorySlug,
        category_name: selectedCat?.name || categorySlug.replace('-', ' '),
        category_slug: categorySlug,
        sub_category: subCategory.trim(),
        price: Number(price) || 0,
        original_price: originalPrice ? Number(originalPrice) : undefined,
        short_description: shortDescription.trim() || overviewText.substring(0, 120),
        description: overviewText.trim(),
        overview_text: overviewText.trim(),
        features: parsedFeatures.length > 0 ? parsedFeatures : ['High luminous efficacy optical lens', 'Energy efficient LED technology'],
        benefits: parsedBenefits,
        applications: parsedApps,
        installation_text: installationText.trim(),
        technical_info_text: technicalInfoText.trim(),
        wattage: wattNum,
        wattage_num: wattNum,
        lumens: lumNum,
        lumens_num: lumNum,
        cct: specifications.find((s) => s.specification_name.toLowerCase().includes('color temp'))?.specification_value || '6500K / 4000K / 3000K',
        voltage: specifications.find((s) => s.specification_name.toLowerCase().includes('voltage'))?.specification_value || '220V-240V AC',
        beam_angle: specifications.find((s) => s.specification_name.toLowerCase().includes('beam'))?.specification_value || '36°',
        ip_rating: specifications.find((s) => s.specification_name.toLowerCase().includes('ip'))?.specification_value || 'IP20',
        dimensions: specifications.find((s) => s.specification_name.toLowerCase().includes('dimen') || s.specification_name.toLowerCase().includes('size'))?.specification_value || 'Standard',
        image_url: images[0],
        images: images,
        gallery_images: images,
        product_images: images.map((url, idx) => ({ image_url: url, is_main: idx === 0, sort_order: idx + 1 })),
        catalogue_url: catalogues[0]?.file_url || '',
        catalogues: catalogues,
        specifications: validSpecs,
        related_product_ids: relatedProductIds,
        is_published: saveAsStatus === 'publish',
        is_featured: isFeatured,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await upsertProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product catalogue entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading product management editor...
      </div>
    );
  }

  const filteredOtherProducts = allProductsList.filter(
    (p) =>
      p.id !== id &&
      (p.name.toLowerCase().includes(relatedSearchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(relatedSearchQuery.toLowerCase()) ||
        p.category_slug.toLowerCase().includes(relatedSearchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto text-slate-100 font-sans">
      {/* Hidden File Inputs */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleMultiImageUpload}
        className="hidden"
      />
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceImage}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleCatalogueUpload}
        className="hidden"
      />

      {/* Top Sticky Bar / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isEditing ? `Edit Lighting Product: ${name}` : 'Create New Lighting Product'}
            </h1>
            <p className="text-xs text-slate-400">
              Configure product details, gallery images, dynamic specifications, and catalogue PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {slug && (
            <Link
              to={`/products/${slug}`}
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              Preview Page
            </Link>
          )}

          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            Save as Draft
          </button>

          <button
            onClick={() => handleSubmit('publish')}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SECTION 1: BASIC PRODUCT INFORMATION CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            1. Basic Product Information
          </h2>
          <span className="text-[11px] text-amber-400 font-semibold">* Required fields</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 mb-1 font-semibold">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Philips LED Downlight 18W Warm White"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Brand *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Philips / SK Traders Architectural"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">SEO Friendly Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="philips-led-downlight-18w"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-cyan-400 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Product Code / SKU *</label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. SK-PH-DL-18W"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-amber-400 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Category *</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 capitalize focus:outline-none focus:border-amber-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Sub-Category (Optional)</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g. Recessed Spotlights / Wi-Fi Smart"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Trade Bulk Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-emerald-400 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Original Price / MRP (₹)</label>
            <input
              type="number"
              value={originalPrice || ''}
              onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="2100"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-950"
              />
              <span className="font-bold">Published</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-amber-400">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-950"
              />
              <span className="font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Featured Product
              </span>
            </label>
          </div>
        </div>

        <div className="text-xs space-y-1">
          <label className="block text-slate-300 font-semibold">Short Summary / Tagline</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="High-efficacy architectural LED downlight with anti-glare reflector"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* SECTION 2: PRODUCT IMAGE MANAGEMENT CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              2. Product Image Management (2–5 Product Images)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              First image will be set as Main Image for catalogue listing cards. Drag or reorder as needed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => multiFileInputRef.current?.click()}
            disabled={uploadingMultiImages}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {uploadingMultiImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            + Upload Images
          </button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`relative bg-slate-950 p-3 rounded-2xl border transition-all space-y-3 group ${
                  idx === 0 ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Main Badge */}
                {idx === 0 && (
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" />
                    Main Image
                  </div>
                )}

                <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                  <img src={imgUrl} alt={`Product Image ${idx + 1}`} className="w-full h-full object-cover" />

                  {uploadingImageIndex === idx && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Image #{idx + 1}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Left/Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 -rotate-90 sm:rotate-0" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Right/Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 -rotate-90 sm:rotate-0" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                    {idx !== 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(idx)}
                        className="py-1 px-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                      >
                        Set Main
                      </button>
                    ) : (
                      <div className="py-1 px-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-center">
                        Main
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setReplaceTargetIndex(idx);
                        replaceFileInputRef.current?.click();
                      }}
                      className="py-1 px-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-center"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(idx)}
                      className="py-1 px-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => multiFileInputRef.current?.click()}
            className="p-10 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">No images uploaded yet</p>
              <p className="text-[11px] text-slate-400">Click to upload 2–5 high-resolution product photos from local computer storage</p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: DYNAMIC TECHNICAL SPECIFICATIONS CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              3. Dynamic Product Technical Specifications
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add key-value technical parameters. Frontend will display populated rows in a clean spec table.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSpecification}
            className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/40 hover:bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Specification
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800"
            >
              <span className="text-[11px] font-mono text-slate-500 w-6 shrink-0 text-center">
                #{idx + 1}
              </span>

              {/* Spec Name with Dropdown Suggestion */}
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  list={`spec-suggestions-${idx}`}
                  value={spec.specification_name}
                  onChange={(e) => handleSpecChange(idx, 'specification_name', e.target.value)}
                  placeholder="Specification Name (e.g. Wattage, CRI, IP Rating)"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-sky-500"
                />
                <datalist id={`spec-suggestions-${idx}`}>
                  {COMMON_SPEC_NAMES.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              {/* Spec Value */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={spec.specification_value}
                  onChange={(e) => handleSpecChange(idx, 'specification_value', e.target.value)}
                  placeholder="Specification Value (e.g. 18W, 1600 lm, IP20)"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Row Actions */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleMoveSpec(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSpec(idx, 'down')}
                  disabled={idx === specifications.length - 1}
                  className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSpec(idx)}
                  className="p-1.5 text-red-400 hover:text-red-300"
                  title="Delete Row"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: FULL DESCRIPTION & METADATA SECTIONS */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          4. Detailed Product Description & Sections
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Overview & Description</label>
            <textarea
              rows={4}
              value={overviewText}
              onChange={(e) => setOverviewText(e.target.value)}
              placeholder="Detailed product overview, light quality, optical performance..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Features (One line per feature)</label>
              <textarea
                rows={4}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="High optical clarity lens&#10;Triac dimmable driver support"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Benefits (One line per benefit)</label>
              <textarea
                rows={4}
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                placeholder="Up to 90% energy savings&#10;EyeComfort non-flicker illumination"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Applications (One line per application)</label>
              <textarea
                rows={3}
                value={applicationsInput}
                onChange={(e) => setApplicationsInput(e.target.value)}
                placeholder="Corporate Office Suites&#10;Luxury Residential Living"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Installation Information</label>
              <textarea
                rows={3}
                value={installationText}
                onChange={(e) => setInstallationText(e.target.value)}
                placeholder="Recessed false ceiling installation with spring clip retention."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: PRODUCT CATALOGUE PDF CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              5. Product Catalogue PDF Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload PDF specification sheets. A "Download Catalogue" button will appear on frontend.
            </p>
          </div>

          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            disabled={uploadingPdf}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/40 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            + Upload Catalogue PDF
          </button>
        </div>

        {catalogues.length > 0 ? (
          <div className="space-y-3">
            {catalogues.map((cat, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="text-xs font-bold text-slate-100 truncate">{cat.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {(cat.file_size_bytes ? (cat.file_size_bytes / (1024 * 1024)).toFixed(2) : '1.5')} MB PDF
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <a
                    href={cat.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700"
                  >
                    Preview / Download
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteCatalogue(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                    title="Delete Catalogue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => pdfInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-slate-700 hover:border-red-500/50 rounded-2xl bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2"
          >
            <FileText className="w-6 h-6 text-red-400" />
            <p className="text-xs font-bold text-slate-200">No PDF catalogue uploaded</p>
            <p className="text-[11px] text-slate-400">Click to upload product spec sheet PDF from computer</p>
          </div>
        )}
      </div>

      {/* SECTION 6: MANUALLY CURATED RELATED PRODUCTS CARD */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            6. Related Products Selector
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manually select related lighting fixtures to display on the frontend product detail page.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU or category to relate..."
              value={relatedSearchQuery}
              onChange={(e) => setRelatedSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Product Checklist Grid */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {filteredOtherProducts.map((p) => {
              const isChecked = relatedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleToggleRelatedProduct(p.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-950"
                    />
                    <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover bg-slate-900" />
                    <div className="overflow-hidden text-xs">
                      <div className="font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.sku} • ₹{p.price}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 capitalize">
                    {p.category_slug}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Selected Related Products: <span className="text-amber-400 font-bold">{relatedProductIds.length}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <Link
          to="/admin/products"
          className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
        >
          Cancel
        </Link>
        <button
          onClick={() => handleSubmit('draft')}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit('publish')}
          disabled={saving}
          className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Publish Product Entry'}
        </button>
      </div>
    </div>
  );
};
