'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, Search, Shirt, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BigMarketProductsPage() {
  const { db, addToCart, cart } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const products = (db?.products || []).filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shopName.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'ALL' || p.category === category;
    return matchSearch && matchCat;
  });

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Clean Light Header */}
      <div className="bg-[#F9FAFB] dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF4F0] text-[#FF5A1F] text-xs font-semibold">
              <Tag className="h-3.5 w-3.5" />
              <span>Code Promo : BENIN229 (-15% immédiat)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Boutique &amp; Merchandising Officiel
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Mode béninoise, tissages Kanvo d&apos;Abomey, bracelets festivaliers et articles
              certifiés des événements.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/jerseys"
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white font-semibold text-xs flex items-center gap-2 hover:border-[#FF5A1F]"
            >
              <Shirt className="h-4 w-4 text-[#FF5A1F]" />
              <span>Maillots personnalisés</span>
            </Link>
            <Link
              href="/shop/cart"
              className="px-4 py-2.5 rounded-xl bg-[#111827] dark:bg-[#FF5A1F] text-white font-semibold text-xs flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Mon Panier ({cartCount})</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            {['ALL', 'MODE', 'ACCESSOIRES', 'ELECTRONIQUE', 'ART'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  category === cat
                    ? 'bg-[#111827] dark:bg-[#FF5A1F] text-white'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'Tous les articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit ou boutique..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prd) => (
            <div
              key={prd.id}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="relative h-52 bg-gray-100">
                <img src={prd.image} alt={prd.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-gray-900 text-[10px] font-semibold">
                  {prd.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#111827]/90 text-white text-[11px] font-medium">
                  Stock : {prd.stock}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#FF5A1F]">{prd.shopName}</p>
                  <h2 className="font-bold text-base text-gray-900 dark:text-white mt-0.5">
                    {prd.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prd.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {prd.price.toLocaleString('fr-FR')} FCFA
                    </span>
                    {prd.comparePrice && (
                      <span className="block text-xs line-through text-gray-400">
                        {prd.comparePrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        id: prd.id,
                        title: prd.name,
                        price: prd.price,
                        image: prd.image,
                        type: 'PRODUCT'
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
