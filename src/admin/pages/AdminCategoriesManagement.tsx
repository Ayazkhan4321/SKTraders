import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategories,
  getProducts,
  upsertCategory,
  deleteCategory,
  ProductCategory,
  DetailedProduct,
} from '../../services/productsApi';
import { uploadFile } from '../services/storageApi';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Sparkles,
  AlertTriangle,
  Eye,
  Upload,
  Layers,
  CheckCircle,
  X,
  Loader2,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';

export const AdminCategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Editor Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<ProductCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Delete Protection Modal state
  const [deleteProtectedModal, setDeleteProtectedModal] = useState<{
    category: ProductCategory;
    productCount: number;
  } | null>(null);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState<ProductCategory | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProductCount = (cat: ProductCategory) => {
    return products.filter(
      (p) =>
        p.category_id === cat.id ||
        p.category_slug?.toLowerCase() === cat.slug.toLowerCase()
    ).length;
  };

  const handleOpenCreateModal = () => {
    setEditingCategory({
      id: '',
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      image_url: '/images/card_home_lighting.jpg',
      banner_image_url: '/images/card_home_lighting.jpg',
      status: 'published',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleNameChange = (nameVal: string) => {
    setEditingCategory((prev) => {
      if (!prev) return prev;
      const isNew = !prev.id;
      const autoSlug = isNew
        ? nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, name: nameVal, slug: autoSlug };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'banner_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'image_url') setUploadingImage(true);
    else setUploadingBanner(true);

    const res = await uploadFile(file, 'product-images');

    if (field === 'image_url') setUploadingImage(false);
    else setUploadingBanner(false);

    if (res.success && res.url) {
      setEditingCategory((prev) => (prev ? { ...prev, [field]: res.url } : prev));
    } else {
      alert(res.error || 'Image upload failed');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) {
      alert('Category Name and Slug are required.');
      return;
    }

    setSaving(true);
    try {
      const catId = editingCategory.id || editingCategory.slug;
      const payload: ProductCategory = {
        id: catId,
        name: editingCategory.name,
        slug: editingCategory.slug,
        subtitle: editingCategory.subtitle || '',
        description: editingCategory.description || '',
        image_url: editingCategory.image_url || '/images/card_home_lighting.jpg',
        banner_image_url: editingCategory.banner_image_url || editingCategory.image_url || '/images/card_home_lighting.jpg',
        item_count_label: `${getProductCount(editingCategory as ProductCategory)} Products`,
        status: editingCategory.status || 'published',
        sort_order: editingCategory.sort_order || categories.length + 1,
        is_active: editingCategory.status !== 'draft',
      };

      await upsertCategory(payload);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (cat: ProductCategory) => {
    const count = getProductCount(cat);
    if (count > 0) {
      setDeleteProtectedModal({ category: cat, productCount: count });
    } else {
      setConfirmDeleteModal(cat);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteModal) return;
    try {
      await deleteCategory(confirmDeleteModal.id);
      setConfirmDeleteModal(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Error deleting category.');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, 'image_url')}
        className="hidden"
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, 'banner_image_url')}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase">
            <Layers className="w-3.5 h-3.5" />
            Lighting Categories CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Category Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product categories, category images, URL slugs, and category page banners.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total Categories: <span className="font-bold text-emerald-400">{filteredCategories.length}</span>
        </div>
      </div>

      {/* Category Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-medium bg-slate-900/40 rounded-2xl border border-slate-800">
          Loading categories...
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const count = getProductCount(cat);
            return (
              <div
                key={cat.id}
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                {/* Image Banner Container */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={cat.image_url || '/images/card_home_lighting.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat.status === 'published' || cat.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {cat.status || 'published'}
                    </span>
                  </div>

                  {/* Dynamic Product Count Pill */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 font-mono text-xs font-bold">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="text-[11px] text-cyan-400 font-mono">
                      /lighting/{cat.slug}
                    </div>
                    {cat.subtitle && (
                      <div className="text-xs font-medium text-slate-300">
                        {cat.subtitle}
                      </div>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {cat.description}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/lighting/${cat.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      View Category
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <p>No categories found.</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {editingCategory.id ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Indoor Lighting"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    placeholder="indoor-lighting"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-cyan-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingCategory.subtitle || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                  placeholder="Lighting solutions designed for residential and indoor environments."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Comprehensive description of products available in this lighting category..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Card Image Upload */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Category Card Image</label>
                <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    <img
                      src={editingCategory.image_url || '/images/card_home_lighting.jpg'}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5"
                    >
                      {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {editingCategory.image_url ? 'Replace Image' : 'Upload Image'}
                    </button>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{editingCategory.image_url}</p>
                  </div>
                </div>
              </div>

              {/* Category Banner Image Upload */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Category Page Banner / Hero Image</label>
                <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    <img
                      src={editingCategory.banner_image_url || editingCategory.image_url || '/images/card_home_lighting.jpg'}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      disabled={uploadingBanner}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5"
                    >
                      {uploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Upload Banner Image
                    </button>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{editingCategory.banner_image_url}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCategory.status !== 'draft'}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 text-emerald-500 bg-slate-950"
                  />
                  <span className="font-bold">Published Category</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2"
                >
                  {saving ? 'Saving Category...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY DELETE PROTECTION MODAL */}
      {deleteProtectedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Cannot Delete Category</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This category <strong className="text-amber-400">"{deleteProtectedModal.category.name}"</strong> currently contains{' '}
                <strong className="text-emerald-400 font-bold">{deleteProtectedModal.productCount}</strong> assigned products.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-left">
                Please reassign or delete the products assigned to this category before deleting the category entry.
              </div>
            </div>

            <button
              onClick={() => setDeleteProtectedModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Understand & Back to CMS
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Delete Category?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong className="text-slate-200">{confirmDeleteModal.name}</strong>?
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
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
