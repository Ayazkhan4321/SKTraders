import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCategoryBySlug,
  getProducts,
  ProductCategory,
  DetailedProduct,
} from '../services/productsApi';
import { ProductCard } from '../components/ProductCard';
import SEOHead from '../components/SEOHead';
import { ChevronRight, Sparkles, Layers, ArrowRight, ShieldCheck, Box } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchCategoryData = async () => {
      if (!categorySlug) return;
      setLoading(true);
      try {
        const cat = await getCategoryBySlug(categorySlug);
        setCategory(cat);

        const allProducts = await getProducts();
        const filtered = allProducts.filter(
          (p) =>
            p.category_slug.toLowerCase() === categorySlug.toLowerCase() ||
            (cat && p.category_id === cat.id) ||
            (cat && p.category_name.toLowerCase() === cat.name.toLowerCase())
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load category page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center pt-24 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading Lighting Category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center pt-24 font-sans space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Category Not Found</h2>
        <p className="text-xs text-slate-600 max-w-sm">
          The requested lighting category could not be located in the SK Traders catalogue.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
        >
          View All Products
        </Link>
      </div>
    );
  }

  const bannerImg = category.banner_image_url || category.image_url || '/images/card_home_lighting.jpg';

  const categoryJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} - SK Traders Philips Lighting`,
      description: category.description || category.subtitle,
      url: `https://www.sktradersphilipslighting.com/lighting/${category.slug}`,
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
          name: 'Lighting',
          item: 'https://www.sktradersphilipslighting.com/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://www.sktradersphilipslighting.com/lighting/${category.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <SEOHead
        title={`${category.name} | Authorized Philips Lighting - SK Traders`}
        description={category.description || category.subtitle}
        canonicalPath={`/lighting/${category.slug}`}
        image={bannerImg}
        type="website"
        keywords={`${category.name}, Philips ${category.name}, SK Traders Hyderabad`}
        jsonLd={categoryJsonLd}
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* 1. Breadcrumbs Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-600 flex-wrap">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-emerald-600 transition-colors">Lighting</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{category.name}</span>
        </nav>

        {/* 2. Category Hero / Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[260px] sm:min-h-[320px] flex items-end p-6 sm:p-12 shadow-xl border border-slate-800">
          <img
            src={bannerImg}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Philips Lighting Category
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {category.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {category.description || category.subtitle}
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-emerald-400 font-bold">
                {products.length} {products.length === 1 ? 'Product Available' : 'Products Available'}
              </span>
              <span>100% Authentic Philips & SK Traders Fixtures</span>
            </div>
          </div>
        </div>

        {/* 3. Products Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {category.name} Collection
            </h2>
            <p className="text-xs text-slate-600">
              Browse professional lighting options designed for performance and efficiency.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-600 flex items-center gap-1 shrink-0"
          >
            Explore All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4. Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Products in {category.name}</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Products for this category are currently being configured in the Admin CMS. Please check back shortly or explore our full product range.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              Browse Full Catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
