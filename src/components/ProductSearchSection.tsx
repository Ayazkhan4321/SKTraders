import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { apiFetchMergedHomepageProducts, MergedHomepageProduct } from "../services/homepageProductsApi";

export default function SectionNew() {
    const [homepageProducts, setHomepageProducts] = useState<MergedHomepageProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProductsData = async () => {
            setLoading(true);
            try {
                const data = await apiFetchMergedHomepageProducts();
                setHomepageProducts(data);
            } catch (err) {
                console.error("Failed to load products for homepage search:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsData();
    }, []);

    // Close autocomplete suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter products based on search input (checks both homepage overrides & master product fields)
    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return homepageProducts;

        return homepageProducts.filter((product) => {
            const master = product.masterProduct;
            const hpNameMatch = product.name?.toLowerCase().includes(q);
            const masterNameMatch = master?.name?.toLowerCase().includes(q);
            const skuMatch = master?.sku?.toLowerCase().includes(q);
            const catMatch = master?.category_name?.toLowerCase().includes(q) || master?.category_slug?.toLowerCase().includes(q);
            const brandMatch = master?.brand?.toLowerCase().includes(q);
            const hpDescMatch = product.short_description?.toLowerCase().includes(q);
            const masterDescMatch = master?.description?.toLowerCase().includes(q);
            const tagsMatch = master?.tags?.some((tag) => tag.toLowerCase().includes(q));
            const specsMatch = master?.specifications?.some(
                (spec) =>
                    spec.specification_name.toLowerCase().includes(q) ||
                    spec.specification_value.toLowerCase().includes(q)
            );

            return (
                hpNameMatch ||
                masterNameMatch ||
                skuMatch ||
                catMatch ||
                brandMatch ||
                hpDescMatch ||
                masterDescMatch ||
                tagsMatch ||
                specsMatch
            );
        });
    }, [homepageProducts, search]);

    // Limit to max 4 product cards on homepage
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, 4);
    }, [filteredProducts]);

    // Dynamic search suggestions for autocomplete
    const suggestions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return [];
        return filteredProducts.slice(0, 5);
    }, [filteredProducts, search]);

    const handleSuggestionClick = (productName: string) => {
        setSearch(productName);
        setShowSuggestions(false);
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600 mb-3">
                        Products For Every Space
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Search Your Products
                    </h2>

                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                        Find the right lighting solution from our collection of
                        Philips and Signify products.
                    </p>
                </div>

                {/* Search Bar with Autocomplete Suggestions */}
                <div ref={searchRef} className="max-w-3xl mx-auto mb-14 relative">
                    <div className="relative">

                        {/* Search Icon */}
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search products..."
                            className="w-full h-14 pl-14 pr-12 rounded-full border border-gray-200 bg-gray-50 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setShowSuggestions(false);
                                }}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                title="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                    </div>

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && search.trim() !== "" && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-30 divide-y divide-gray-100">
                            {suggestions.length > 0 ? (
                                suggestions.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSuggestionClick(product.name)}
                                        className="p-3.5 flex items-center justify-between hover:bg-green-50/50 cursor-pointer transition-colors group/item"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-2">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-slate-900 group-hover/item:text-green-700 truncate">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {product.masterProduct?.category_name} • SKU: {product.masterProduct?.sku}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {product.show_price !== false && (
                                                <span className="text-xs font-bold text-slate-900">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            )}
                                            {product.show_view_button !== false && (
                                                <Link
                                                    to={`/products/detail/${product.slug}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-green-600 hover:text-white text-xs font-medium text-slate-700 transition-colors"
                                                >
                                                    View
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-gray-500">
                                    No matching product suggestions found for "{search}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-gray-100 rounded-2xl h-80 animate-pulse border border-gray-200" />
                        ))}
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between"
                            >

                                {/* Product Image */}
                                <Link
                                    to={`/products/detail/${product.slug}`}
                                    className="block relative aspect-square bg-gray-100 overflow-hidden"
                                >

                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                </Link>

                                {/* Product Information */}
                                <div className="p-5 flex flex-col flex-grow justify-between">

                                    <div>
                                        <Link
                                            to={`/products/detail/${product.slug}`}
                                            className="block text-lg font-semibold text-slate-900 hover:text-green-600 transition-colors line-clamp-2"
                                        >
                                            {product.name}
                                        </Link>
                                    </div>

                                    {(product.show_price !== false || product.show_view_button !== false) && (
                                        <div className="mt-4 flex items-center justify-between">

                                            {product.show_price !== false ? (
                                                <span className="text-xl font-bold text-slate-900">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span />
                                            )}

                                            {product.show_view_button !== false && (
                                                <Link
                                                    to={`/products/detail/${product.slug}`}
                                                    className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium transition hover:bg-green-600 inline-block text-center"
                                                >
                                                    View
                                                </Link>
                                            )}

                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    /* No Results */
                    <div className="text-center py-16">
                        <p className="text-xl font-semibold text-slate-900">
                            No products found
                        </p>

                        <p className="mt-2 text-gray-500">
                            Try searching for another product.
                        </p>
                    </div>
                )}

                {/* More Products Button */}
                <div className="mt-14 text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-sm transition hover:bg-green-600 shadow-md"
                    >
                        <span>More Products</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </Link>
                </div>

            </div>
        </section>
    );
}
