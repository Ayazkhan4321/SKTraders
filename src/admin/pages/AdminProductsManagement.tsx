import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, getCategories, DetailedProduct, ProductCategory, syncAllProductsToSupabase, upsertProduct } from '../../services/productsApi';
import { Plus, Search, Edit3, Trash2, Sparkles, AlertTriangle, Eye, RefreshCw, Star, CheckCircle, Clock, Filter } from 'lucide-react';

export const AdminProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteModalProduct, setDeleteModalProduct] = useState<DetailedProduct | null>(null);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err) {
      console.error('Failed to fetch products for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    try {
      const res = await syncAllProductsToSupabase();
      if (res.success) {
        alert(`Successfully synced ${res.count} products to Supabase production!`);
        await fetchInitialData();
      } else {
        alert(`Failed to sync to Supabase: ${res.error}\n\nPlease run the SQL schema script in your Supabase SQL Editor first.`);
      }
    } catch (err) {
      console.error('Error syncing products:', err);
      alert('Error syncing products to Supabase');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModalProduct) return;
    try {
      await deleteProduct(deleteModalProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModalProduct.id));
      setDeleteModalProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const handleTogglePublish = async (prod: DetailedProduct) => {
    const updated = { ...prod, is_published: !prod.is_published };
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
    await upsertProduct(updated);
  };

  const handleToggleFeatured = async (prod: DetailedProduct) => {
    const updated = { ...prod, is_featured: !prod.is_featured };
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
    await upsertProduct(updated);
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category_slug?.toLowerCase().includes(q) ||
      p.specifications?.some((s) => s.specification_name.toLowerCase().includes(q) || s.specification_value.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && p.is_published) ||
      (selectedStatus === 'draft' && !p.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Lighting Product Management CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Product Catalogue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Philips & SK Traders lighting products, specifications, catalogues, and related items.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSyncToSupabase}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
            title="Push all products directly to Supabase production database"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync to Supabase'}
          </button>

          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Product
          </Link>
        </div>
      </div>

      {/* Toolbar, Search & Filters */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, SKU, spec, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium shrink-0 ml-auto md:ml-0">
            Total: <span className="font-bold text-amber-400">{filteredProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
          Loading products catalogue data...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU / Category</th>
                  <th className="p-4">Specs Summary</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Publish Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || p.image_url || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-slate-300">{p.sku}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{p.category_slug}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{p.wattage}W • {p.lumens} lm</div>
                      <div className="text-[10px] text-slate-400">{p.cct}</div>
                    </td>
                    <td className="p-4 font-bold text-amber-400">
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${
                          p.is_featured
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                        title="Toggle Featured product display"
                      >
                        <Star className={`w-3 h-3 ${p.is_featured ? 'fill-amber-400' : ''}`} />
                        {p.is_featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 transition-all ${
                          p.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Click to toggle Published / Draft state"
                      >
                        {p.is_published ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-slate-400" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 inline-block text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700 hover:border-slate-600"
                        title="Preview Product Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="p-1.5 inline-block text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModalProduct(p)}
                        className="p-1.5 inline-block text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg border border-red-500/30"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <p>No products found matching filters.</p>
          <Link
            to="/admin/products/new"
            className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Create New Product
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Delete Product?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong className="text-slate-200">{deleteModalProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalProduct(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2 rounded-xl bg-red-500 text-xs font-bold text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
