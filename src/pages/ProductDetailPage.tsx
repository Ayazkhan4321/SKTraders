import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getProducts, DetailedProduct } from '../services/productsApi';
import { ProductCard } from '../components/ProductCard';
import SEOHead from '../components/SEOHead';
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  Sun,
  ShieldCheck,
  CheckCircle,
  FileText,
  MessageSquare,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  Info,
  Maximize2,
  Download,
  X,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Dynamic user selection state
  const [selectedCct, setSelectedCct] = useState<string>('Warm White (3000K)');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#ffedc2');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'installation' | 'warranty'>('specs');
  const [enquirySuccessModal, setEnquirySuccessModal] = useState(false);
  const [savedToProject, setSavedToProject] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setActiveImageIndex(0);
          if (prod.cct_options && prod.cct_options.length > 0) {
            setSelectedCct(prod.cct_options[0]);
            updateHexFromCct(prod.cct_options[0]);
          }
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariantId(prod.variants[0].id);
          }

          // Fetch related products (manually connected or fallback to same category)
          const allProds = await getProducts();
          let relatedList: DetailedProduct[] = [];

          if (prod.related_product_ids && prod.related_product_ids.length > 0) {
            relatedList = allProds.filter((p) => prod.related_product_ids?.includes(p.id));
          }

          if (relatedList.length === 0) {
            relatedList = allProds.filter((p) => p.category_slug === prod.category_slug && p.id !== prod.id);
          }

          setRelatedProducts(relatedList.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  const updateHexFromCct = (cct: string) => {
    const cctLower = cct.toLowerCase();
    if (cctLower.includes('warm') || cctLower.includes('3000k') || cctLower.includes('2700k')) {
      setSelectedColorHex('#ffc87c');
    } else if (cctLower.includes('neutral') || cctLower.includes('4000k')) {
      setSelectedColorHex('#fff4e0');
    } else if (cctLower.includes('cool') || cctLower.includes('6500k')) {
      setSelectedColorHex('#e0f2fe');
    } else if (cctLower.includes('rgb') || cctLower.includes('tunable')) {
      setSelectedColorHex('#38bdf8');
    } else {
      setSelectedColorHex('#ffedc2');
    }
  };

  const handleCctChange = (cct: string) => {
    setSelectedCct(cct);
    updateHexFromCct(cct);
  };

  const handleEnquiry = () => {
    setEnquirySuccessModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center pt-24 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading Philips Product Studio...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center pt-24 font-sans">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-600 mt-2 mb-6">The requested product catalogue entry could not be located.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
        >
          Return to Product Catalogue
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;

  const galleryImagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url || '/images/card_smart_led_bulb.jpg'];

  const currentMainImage = galleryImagesList[activeImageIndex] || galleryImagesList[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImagesList.length - 1 ? 0 : prev + 1));
  };

  // Specs array cleanup: filter out empty names or values
  const validSpecsList = (product.specifications || []).filter(
    (s) => s.specification_name.trim() !== '' && s.specification_value.trim() !== ''
  );

  const primaryCatalogue = product.catalogues?.[0] || (product.catalogue_url ? { name: `${product.name} Datasheet`, file_url: product.catalogue_url, file_size_bytes: 1500000 } : null);

  const productJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: currentMainImage,
      description: product.short_description || product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Philips',
      },
      offers: {
        '@type': 'Offer',
        url: `https://www.sktradersphilipslighting.com/products/${product.slug}`,
        priceCurrency: 'INR',
        price: currentPrice,
        availability: product.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'SK Traders',
        },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <SEOHead
        title={`${product.name} | ${product.brand} - SK Traders`}
        description={product.short_description || product.description}
        canonicalPath={`/products/${product.slug}`}
        image={currentMainImage}
        type="product"
        keywords={`${product.name}, ${product.brand}, ${product.sku}, ${product.category_name}, SK Traders Hyderabad`}
        jsonLd={productJsonLd}
      />

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] blur-[160px] rounded-full transition-colors duration-700 opacity-10"
          style={{ backgroundColor: selectedColorHex }}
        />
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-amber-500/5 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* 1. Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-600 flex-wrap">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-amber-600 transition-colors">Catalogue</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            to={`/products/${product.category_slug}`}
            className="hover:text-amber-600 transition-colors capitalize font-semibold text-slate-800"
          >
            {product.category_name || product.category_slug.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold line-clamp-1">{product.name}</span>
        </nav>

        {/* Top Product Showcase Layout: Left Image Gallery | Right Key Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center p-4 group">
              <img
                src={currentMainImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl transition-all duration-500"
              />

              <div
                className="absolute inset-0 pointer-events-none opacity-10 transition-colors duration-700 rounded-3xl"
                style={{ backgroundColor: selectedColorHex }}
              />

              {/* Prev & Next Gallery Controls */}
              {galleryImagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 opacity-80 hover:opacity-100 transition-all"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 opacity-80 hover:opacity-100 transition-all"
                    title="Next Image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Lightbox Trigger */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4 text-slate-800" />
                <span className="hidden sm:inline">Zoom View</span>
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 relative ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-md scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-amber-500 text-[8px] font-black text-slate-950 uppercase">
                        Main
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Color Temperature Preview Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse shrink-0"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Color Temperature & Light Preview
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Active CCT Mode: <span className="text-amber-700 font-bold">{selectedCct}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(product.cct_options || ['Warm White', 'Neutral White', 'Cool White']).map((cct) => (
                  <button
                    key={cct}
                    onClick={() => handleCctChange(cct)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedCct === cct
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {cct.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Details, SKU, Actions */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {/* Header Badges */}
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              {product.is_smart && (
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  WiZ Connected
                </span>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-slate-500">({product.reviews_count || 18} reviews)</span>
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <span>Code / SKU: <strong className="text-slate-800 font-mono">{product.sku}</strong></span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 block font-medium">Bulk Trade Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold block">
                  {product.is_in_stock ? 'In Stock • Ready to Dispatch' : 'Made to Order'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">GST Included</span>
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Wattage</span>
                <span className="text-xs font-bold text-slate-900">{product.wattage}W</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Sun className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Brightness</span>
                <span className="text-xs font-bold text-slate-900">{product.lumens} lm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Award className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Efficiency</span>
                <span className="text-xs font-bold text-slate-900">
                  {Number(product.wattage) > 0 ? Math.round(Number(product.lumens) / Number(product.wattage)) : 100} lm/W
                </span>
              </div>
            </div>

            {/* Short Summary */}
            {product.short_description && (
              <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-amber-500 pl-3">
                "{product.short_description}"
              </p>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>

                {/* Primary Contact / Bulk Enquiry Button */}
                <button
                  onClick={handleEnquiry}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Bulk Quote / Enquiry
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSavedToProject(!savedToProject)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    savedToProject
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {savedToProject ? 'Saved to Project' : 'Save to Spec Sheet'}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    alert('Product link copied to clipboard!');
                  }}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Download Catalogue Button */}
              {primaryCatalogue && (
                <a
                  href={primaryCatalogue.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Download Catalogue PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 2. DYNAMIC TECHNICAL SPECIFICATIONS TABLE & STRUCTURED TABS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-sm">
          {/* Tab Controls */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Technical Specifications ({validSpecsList.length})
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'features'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Features & Description
            </button>
            <button
              onClick={() => setActiveTab('installation')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'installation'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Installation & Mounting
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'warranty'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Warranty & Compliance
            </button>
          </div>

          {/* TAB 1: DYNAMIC TECHNICAL SPECIFICATIONS GRID */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Technical Specification Parameters
              </h3>

              {validSpecsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs border border-slate-200 rounded-2xl overflow-hidden divide-y md:divide-y-0 divide-slate-100">
                  <div className="divide-y divide-slate-100">
                    {validSpecsList.slice(0, Math.ceil(validSpecsList.length / 2)).map((spec, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                        <span className="font-semibold text-slate-600 w-1/2">{spec.specification_name}</span>
                        <span className="font-bold text-slate-900 w-1/2 text-right font-mono">{spec.specification_value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-slate-100 border-t md:border-t-0 border-slate-200">
                    {validSpecsList.slice(Math.ceil(validSpecsList.length / 2)).map((spec, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                        <span className="font-semibold text-slate-600 w-1/2">{spec.specification_name}</span>
                        <span className="font-bold text-slate-900 w-1/2 text-right font-mono">{spec.specification_value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No custom specifications listed.</p>
              )}
            </div>
          )}

          {/* TAB 2: FEATURES, BENEFITS & DESCRIPTION */}
          {activeTab === 'features' && (
            <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Product Overview */}
              {product.overview_text && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">Product Overview</h4>
                  <p className="text-slate-600 whitespace-pre-line">{product.overview_text}</p>
                </div>
              )}

              {/* Key Features & Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {product.features && product.features.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key Product Features
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-800 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.benefits && product.benefits.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-sky-600" />
                      Product Benefits
                    </h4>
                    <ul className="space-y-2">
                      {product.benefits.map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-800 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Applications & Sectors */}
              {product.applications && product.applications.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    Recommended Applications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INSTALLATION GUIDE */}
          {activeTab === 'installation' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-bold text-sm text-slate-900">Recommended Mounting & Electrical Setup</h3>
              <p className="whitespace-pre-line">
                {product.installation_text ||
                  `1. Ensure power mains are isolated prior to installation.\n2. Prepare false ceiling cutout matching specified cutout dimensions (${product.dimensions || 'Standard'}).\n3. Connect constant current LED driver input wires to AC mains (220-240V).\n4. Secure fixture into cavity using spring retention clips.`}
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Licensed electrician installation recommended. Contact SK Traders technical helpdesk for custom wiring diagrams.</span>
              </div>
            </div>
          )}

          {/* TAB 4: WARRANTY & COMPLIANCE */}
          {activeTab === 'warranty' && (
            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                SK Traders {product.warranty_years || 5}-Year On-Site / Replacement Warranty
              </h3>
              <p className="whitespace-pre-line">
                {product.technical_info_text ||
                  'All SK Traders fixtures undergo 100% thermal and optical burn-in testing. We provide full component replacement coverage against driver failures, LED lumen degradation exceeding 10%, or housing defects within the warranty window.'}
              </p>
            </div>
          )}
        </div>

        {/* 3. DEDICATED CATALOGUE SECTION */}
        {product.catalogues && product.catalogues.length > 0 && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Product Catalogue & Datasheet</h3>
                  <p className="text-xs text-slate-400">Download high-resolution PDF technical specification sheet</p>
                </div>
              </div>

              <a
                href={product.catalogues[0].file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Catalogue PDF
              </a>
            </div>
          </div>
        )}

        {/* 4. MANUALLY CONTROLLED RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Related Products</h2>
                <p className="text-xs text-slate-600">Explore complementary architectural lighting solutions</p>
              </div>
              <Link
                to={`/products/${product.category_slug}`}
                className="text-xs text-amber-600 hover:underline font-semibold flex items-center gap-1"
              >
                View Category <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL OVERLAY */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[85vh] flex items-center justify-center p-4">
            <img
              src={currentMainImage}
              alt={product.name}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* BULK ENQUIRY MODAL */}
      {enquirySuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enquiry Requested!</h3>
            <p className="text-xs text-slate-600">
              Thank you for your interest in <strong className="text-amber-600">{product.name}</strong> (SKU: {product.sku}).
              Our SK Traders lighting specialist will get back to you with custom bulk pricing within 2 business hours.
            </p>
            <button
              onClick={() => setEnquirySuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Back to Product Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
