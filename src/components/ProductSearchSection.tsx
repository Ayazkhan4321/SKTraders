import React, { useState } from "react";

const products = [
    {
        id: 1,
        name: "Philips LED Downlight",
        price: "₹1,499",
        image:
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 2,
        name: "Philips Smart LED Bulb",
        price: "₹899",
        image:
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 3,
        name: "Philips Ceiling Light",
        price: "₹2,499",
        image:
            "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: 4,
        name: "Philips COB Spotlight",
        price: "₹1,999",
        image:
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
    },
];

export default function SectionNew() {
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

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

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto mb-14">
                    <div className="relative">

                        {/* Search Icon */}
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full h-14 pl-14 pr-6 rounded-full border border-gray-200 bg-gray-50 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >

                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                </div>

                                {/* Product Information */}
                                <div className="p-5">

                                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <div className="mt-4 flex items-center justify-between">

                                        <span className="text-xl font-bold text-slate-900">
                                            {product.price}
                                        </span>

                                        <button
                                            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium transition hover:bg-green-600"
                                        >
                                            View
                                        </button>

                                    </div>

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

            </div>
        </section>
    );
}
