import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProducts, getCategories, DetailedProduct, ProductCategory } from '../services/productsApi';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { Search, Filter, SlidersHorizontal, X, Sparkles, ChevronRight, Zap, CheckCircle } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedWattageRanges, setSelectedWattageRanges] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [smartOnly, setSmartOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load catalogue data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku?.toLowerCase().includes(q);
        const matchesCat = product.category_slug.toLowerCase().includes(q);
        const matchesDesc = product.short_description?.toLowerCase().includes(q);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSku && !matchesCat && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all') {
        if (product.category_slug !== selectedCategory) {
          return false;
        }
      }

      // 3. Smart feature filter
      if (smartOnly && !product.is_smart) {
        return false;
      }

      // 4. In Stock filter
      if (inStockOnly && !product.is_in_stock) {
        return false;
      }

      // 5. Light color filter
      if (selectedColors.length > 0) {
        const productCcts = product.cct_options || [];
        const hasMatchingColor = selectedColors.some((color) =>
          productCcts.some((cct) => cct.toLowerCase().includes(color.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // 6. Wattage filter
      if (selectedWattageRanges.length > 0) {
        const watt = Number(product.wattage) || 0;
        const matchesWattage = selectedWattageRanges.some((range) => {
          if (range === 'low') return watt > 0 && watt <= 12;
          if (range === 'mid') return watt > 12 && watt <= 30;
          if (range === 'high') return watt > 30 && watt <= 60;
          if (range === 'extra') return watt > 60;
          return false;
        });
        if (!matchesWattage) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'wattage') return (Number(b.wattage) || 0) - (Number(a.wattage) || 0);
      return 0; // default featured
    });
  }, [products, searchQuery, selectedCategory, smartOnly, inStockOnly, selectedColors, selectedWattageRanges, sortBy]);

  const toggleWattageRange = (range: string) => {
    setSelectedWattageRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedWattageRanges([]);
    setSelectedColors([]);
    setSmartOnly(false);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const seoTitle = activeCategoryObj
    ? `Philips ${activeCategoryObj.name} | SK Traders Lighting Catalogue`
    : 'Philips Lighting & Smart Fans Catalogue | SK Traders Hyderabad';

  const seoDesc = activeCategoryObj
    ? `Official Philips ${activeCategoryObj.name} catalog at SK Traders Hyderabad. ${activeCategoryObj.description}`
    : 'Browse the official SK Traders Philips Lighting catalogue in Hyderabad. Features COB downlights, WiZ smart LEDs, office panels, decorative chandeliers & BLDC fans.';

  const seoCanonical = activeCategoryObj ? `/products/${activeCategoryObj.slug}` : '/products';

  const breadcrumbJsonLd = {
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
        name: 'Products Catalogue',
        item: 'https://www.sktradersphilipslighting.com/products',
      },
      ...(activeCategoryObj
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: activeCategoryObj.name,
              item: `https://www.sktradersphilipslighting.com/products/${activeCategoryObj.slug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonicalPath={seoCanonical}
        keywords={`SK Traders, Philips ${activeCategoryObj?.name || 'Lighting'}, Philips Distributor Hyderabad, LED lights`}
        jsonLd={breadcrumbJsonLd}
      />
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 right-10 w-[500px] h-[300px] bg-sky-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-amber-400 transition-colors">Catalogue</Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-semibold">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Hero Banner Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              SK Traders Lighting Collection
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : 'Architectural & Smart Lighting Catalogue'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeCategoryObj
                ? activeCategoryObj.description
                : 'Discover premium commercial & residential lighting solutions engineered for efficiency, warmth, and modern interior aesthetic.'}
            </p>
          </div>

          {/* Quick Stats Pill Header */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <div>
                <span className="text-amber-400 font-bold text-base block">{filteredProducts.length}</span>
                Products Available
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-sky-400 font-bold text-base block">{categories.length}</span>
                Categories
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-emerald-400 font-bold text-base block">100%</span>
                Tested & Certified
              </div>
            </div>

            {/* Global Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, SKUs, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                Filter Options
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Wattage Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Wattage Range
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'low', label: '1W - 12W (Accent / Soft Light)' },
                  { id: 'mid', label: '13W - 30W (Standard Living / Office)' },
                  { id: 'high', label: '31W - 60W (High Lumen Main Light)' },
                  { id: 'extra', label: '60W+ (Commercial High Bay / Outdoor)' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWattageRanges.includes(item.id)}
                      onChange={() => toggleWattageRange(item.id)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-950"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Light Color Temperature Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Light Color (CCT)
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'Warm', label: 'Warm White (3000K)' },
                  { id: 'Neutral', label: 'Neutral White (4000K)' },
                  { id: 'Cool', label: 'Cool White (6500K)' },
                  { id: 'RGB', label: 'RGB / Tunable Smart' },
                ].map((cct) => (
                  <label key={cct.id} className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(cct.id)}
                      onChange={() => toggleColor(cct.id)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-950"
                    />
                    <span>{cct.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Smart & Stock Toggles */}
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <span className="font-medium text-slate-200">Smart App / Alexa Only</span>
                <input
                  type="checkbox"
                  checked={smartOnly}
                  onChange={(e) => setSmartOnly(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <span className="font-medium text-slate-200">In Stock Ready to Dispatch</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar for Sort & Mobile Filter Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">
                Showing <span className="font-bold text-white">{filteredProducts.length}</span> of {products.length} products
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 hover:bg-slate-700"
                >
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="wattage">Wattage: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading Grid Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">No products found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn't find any products matching your active search or filters. Try adjusting your search query or clear filter selections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                Filter Products
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300">Wattage Range</h3>
                {[
                  { id: 'low', label: '1W - 12W' },
                  { id: 'mid', label: '13W - 30W' },
                  { id: 'high', label: '31W - 60W' },
                  { id: 'extra', label: '60W+' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={selectedWattageRanges.includes(item.id)}
                      onChange={() => toggleWattageRange(item.id)}
                      className="rounded border-slate-700 text-amber-500 bg-slate-950"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between text-slate-300">
                  <span>Smart Features Only</span>
                  <input
                    type="checkbox"
                    checked={smartOnly}
                    onChange={(e) => setSmartOnly(e.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between text-slate-300">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-xs font-bold text-slate-950"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
