import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, getProducts, DetailedProduct } from '../services/productsApi';
import { Product3DViewer } from '../components/Product3DViewer';
import { ProductCard } from '../components/ProductCard';
import SEOHead from '../components/SEOHead';
import {
  ChevronRight,
  Star,
  Zap,
  Sun,
  ShieldCheck,
  CheckCircle,
  FileText,
  MessageSquare,
  Bookmark,
  Share2,
  Sliders,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  Info,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic user selections
  const [selectedCct, setSelectedCct] = useState<string>('Warm White (3000K)');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#ffedc2');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'installation' | 'warranty'>('specs');
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
          if (prod.cct_options && prod.cct_options.length > 0) {
            setSelectedCct(prod.cct_options[0]);
            updateHexFromCct(prod.cct_options[0]);
          }
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariantId(prod.variants[0].id);
          }

          // Fetch related products from same category
          const allProds = await getProducts();
          const related = allProds.filter(
            (p) => p.category_slug === prod.category_slug && p.id !== prod.id
          );
          setRelatedProducts(related.slice(0, 3));
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading Product 3D Experience...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center pt-24">
        <h2 className="text-2xl font-bold text-slate-200">Product Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">The requested product catalogue page could not be located.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;

  const productImg = product.image_url.startsWith('http')
    ? product.image_url
    : `https://www.sktradersphilipslighting.com${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`;

  const productJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: productImg,
      description: product.short_description || product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Philips',
      },
      offers: {
        '@type': 'Offer',
        url: `https://www.sktradersphilipslighting.com/products/detail/${product.slug}`,
        priceCurrency: 'INR',
        price: currentPrice,
        availability: product.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'SK Traders',
        },
      },
      ...(product.rating
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews_count || 12,
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.sktradersphilipslighting.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://www.sktradersphilipslighting.com/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category_name,
          item: `https://www.sktradersphilipslighting.com/products/${product.category_slug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: `https://www.sktradersphilipslighting.com/products/detail/${product.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${product.name} | ${product.brand} - SK Traders`}
        description={product.short_description || product.description}
        canonicalPath={`/products/detail/${product.slug}`}
        image={product.image_url}
        type="product"
        keywords={`${product.name}, ${product.brand}, ${product.sku}, ${product.category_name}, SK Traders Hyderabad`}
        jsonLd={productJsonLd}
      />
      {/* Background Lighting Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] blur-[160px] rounded-full transition-colors duration-700 opacity-20"
          style={{ backgroundColor: selectedColorHex }}
        />
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 flex-wrap">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-amber-400 transition-colors">Catalogue</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/products/${product.category_slug}`}
            className="hover:text-amber-400 transition-colors capitalize"
          >
            {product.category_slug.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-400 font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Top Product Detail Section: Left 3D Viewer | Right Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive 3D Product Studio */}
          <div className="lg:col-span-7 space-y-4">
            <Product3DViewer
              modelUrl={product.model_3d_url}
              images={product.images}
              title={product.name}
              categorySlug={product.category_slug}
              lightColorHex={selectedColorHex}
              wattage={product.wattage}
              lumens={product.lumens}
            />

            {/* 3D Color Light Beam Controller Banner */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white/60 shadow-lg animate-pulse"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Live 3D Beam Color Preview
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Active CCT: <span className="text-amber-300 font-semibold">{selectedCct}</span>
                  </p>
                </div>
              </div>

              {/* Color Temperature Selector Buttons */}
              <div className="flex items-center gap-1.5">
                {(product.cct_options || ['Warm White', 'Neutral White', 'Cool White']).map((cct) => (
                  <button
                    key={cct}
                    onClick={() => handleCctChange(cct)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedCct === cct
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cct.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            {/* Header Badges */}
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                {product.brand}
              </span>
              {product.is_smart && (
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Smart Connected
                </span>
              )}
            </div>

            {/* Product Title & Rating */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-slate-500">({product.reviews_count || 18} reviews)</span>
                </div>
                <div className="w-px h-3 bg-slate-800" />
                <span>SKU: <strong className="text-slate-300 font-mono">{product.sku}</strong></span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Bulk Trade Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-slate-500 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold block">
                  {product.is_in_stock ? 'In Stock • Ready to Dispatch' : 'Made to Order'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">GST Included</span>
              </div>
            </div>

            {/* Technical Quick Spec Pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Wattage</span>
                <span className="text-xs font-bold text-white">{product.wattage}W</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                <Sun className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Brightness</span>
                <span className="text-xs font-bold text-white">{product.lumens} lm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
                <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Efficiency</span>
                <span className="text-xs font-bold text-white">
                  {Number(product.wattage) > 0 ? Math.round(Number(product.lumens) / Number(product.wattage)) : 100} lm/W
                </span>
              </div>
            </div>

            {/* Variant Selector (if available) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Size / Finish Variant
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name || variant.sku} ({variant.wattage}W, {variant.color_finish || variant.color}) — ₹
                      {(variant.price || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Key Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Highlights
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-white min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>

                {/* Primary Enquiry Button */}
                <button
                  onClick={handleEnquiry}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
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
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
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
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications Table | Installation Guide | Warranty */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-6">
          {/* Tab Controls */}
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('installation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'installation'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Installation & Mounting
            </button>
            <button
              onClick={() => setActiveTab('warranty')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'warranty'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Warranty & Certifications
            </button>
          </div>

          {/* Tab 1: Technical Specs Table */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold w-1/2">Operating Voltage</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.voltage || '220V - 240V AC 50/60Hz'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">Color Rendering Index (CRI)</th>
                    <td className="py-2.5 text-amber-400 font-bold">CRI {product.cri || '> 90 Ra (High Fidelity)'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">Beam Angle Options</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.beam_angle || '24° / 36° / 60° Refractor'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">IP Protection Rating</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.ip_rating || 'IP44 Dust & Moisture Resistant'}</td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold w-1/2">Dimensions</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.dimensions || 'Dia: 90mm x H: 110mm'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">Body Material & Finish</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.material_finish || 'Die-cast Aerospace Aluminum'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">Rated Lifespan (L70)</th>
                    <td className="py-2.5 text-slate-200 font-medium">{product.lifespan_hours ? `${product.lifespan_hours.toLocaleString()} Hours` : '50,000 Hours'}</td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-2.5 text-slate-400 font-semibold">Warranty Period</th>
                    <td className="py-2.5 text-emerald-400 font-bold">{product.warranty_years || 5} Years Full Replacement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Installation Guide */}
          {activeTab === 'installation' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-sm text-white">Recommended Mounting & Electrical Setup</h3>
              <p>
                1. Ensure power mains are isolated prior to installation.
                <br />
                2. Prepare false ceiling cutout matching specified cutout diameter ({product.dimensions || '75mm - 90mm'}).
                <br />
                3. Connect constant current LED driver input wires to AC mains (220-240V).
                <br />
                4. Secure fixture into false ceiling cavity using heavy-duty stainless steel spring clips.
              </p>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0 text-amber-400" />
                <span>Professional electrician installation recommended. Contact SK Traders technical helpdesk for custom wiring diagrams.</span>
              </div>
            </div>
          )}

          {/* Tab 3: Warranty */}
          {activeTab === 'warranty' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SK Traders {product.warranty_years || 5}-Year On-Site / Factory Replacement Warranty
              </h3>
              <p>
                All SK Traders fixtures undergo 100% thermal and optical burn-in testing. We provide full component replacement coverage against driver failures, LED lumen degradation exceeding 10%, or housing defects within the warranty window.
              </p>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Explore Related Fixtures</h2>
                <p className="text-xs text-slate-400">Matching architectural lighting options from SK Traders</p>
              </div>
              <Link
                to={`/products/${product.category_slug}`}
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                View Category <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Enquiry Modal */}
      {enquirySuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Enquiry Requested!</h3>
            <p className="text-xs text-slate-300">
              Thank you for your interest in <strong className="text-amber-400">{product.name}</strong> (SKU: {product.sku}).
              Our SK Traders lighting specialist will get back to you with custom bulk pricing within 2 business hours.
            </p>
            <button
              onClick={() => setEnquirySuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Back to Product Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
