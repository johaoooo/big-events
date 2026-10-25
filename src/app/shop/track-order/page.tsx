'use client';

import React, { useState } from 'react';
import { PackageCheck, Truck, Search, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TrackOrderPage() {
  const { db } = useApp();
  const [query, setQuery] = useState('');
  const orders = (db?.orders || []).filter(
    (o) =>
      !query.trim() ||
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Logistique BigMarket & Maillots Officiels
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">Suivi de mes Commandes</h1>
        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Numéro de commande (ex: ORD-2026-9012)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold"
          />
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono font-black text-sm text-[#FF5A1F] dark:text-[#FF5A1F]">
                  {ord.orderNumber}
                </span>
                <p className="text-xs text-slate-500">
                  Client : <strong>{ord.customerName}</strong> • {ord.shippingAddress}, {ord.city}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> PAYÉ ({ord.paymentProvider})
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FF5A1F]/15 text-amber-600 text-xs font-bold flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> {ord.deliveryStatus}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {ord.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>
                    {it.quantity}x {it.title}
                  </span>
                  <span className="font-bold">
                    {(it.unitPrice * it.quantity).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Commandé le {new Date(ord.createdAt).toLocaleString('fr-FR')}
              </span>
              <span className="text-base font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
                Total : {ord.totalAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
