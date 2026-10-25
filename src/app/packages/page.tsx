'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';
import type { PackageItem } from '@/lib/store';

export default function PackagesPage() {
  const router = useRouter();
  const { db, performAction, notify } = useApp();
  const packages = db?.packages || [];
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);

  const handleBookPackage = async (provider: string, phone: string) => {
    if (!selectedPkg) return;
    const res = await performAction('CREATE_ORDER', {
      customerName: 'Client Séjour VIP',
      customerEmail: 'koffi@bigevents.bj',
      customerPhone: phone,
      shippingAddress: 'Réservation Hôtel & Pass VIP',
      city: 'Ouidah / Cotonou',
      orderType: 'PACKAGE',
      paymentProvider: provider,
      items: [{ title: selectedPkg.title, quantity: 1, unitPrice: selectedPkg.price }]
    });
    if (res?.ok) {
      notify(
        `Package réservé (${res.order.orderNumber}) !`,
        'Notre conciergerie VIP vous a envoyé vos vouchers par email.',
        'success'
      );
      router.push('/shop/track-order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
          Expériences Tout Compris (Billet VIP + Hôtel + Navette)
        </span>
        <h1 className="text-2xl sm:text-4xl font-black mt-1">Packages &amp; Séjours Événementiels</h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
          Profitez des plus grands festivals du Bénin avec hébergement 4★, transport climatisé et
          accès privilégié aux loges artistes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative h-64">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FF5A1F] text-slate-950 font-black text-xs">
                Plus que {pkg.available} packs disponibles
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-[#FF5A1F] dark:text-[#FF5A1F]">
                  {pkg.subtitle}
                </p>
                <h2 className="text-xl font-black">{pkg.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{pkg.description}</p>

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-extrabold uppercase text-slate-400">Inclus dans ce pack :</p>
                  {pkg.includes.map((inc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
                    {pkg.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  {pkg.originalPrice && (
                    <span className="block text-xs line-through text-slate-400">
                      {pkg.originalPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className="px-6 py-3.5 rounded-2xl bg-[#111827] text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Réserver ce Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaymentModal
        open={Boolean(selectedPkg)}
        onClose={() => setSelectedPkg(null)}
        title={selectedPkg?.title || ''}
        amount={selectedPkg?.price || 0}
        onSuccess={handleBookPackage}
      />
    </div>
  );
}
