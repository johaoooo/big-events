'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function JerseysPage() {
  const router = useRouter();
  const { db, addToCart, performAction, notify } = useApp();
  const jerseys = db?.jerseys || [];

  const [selectedJerseyId, setSelectedJerseyId] = useState(jerseys[0]?.id || '');
  const [size, setSize] = useState('L');
  const [customName, setCustomName] = useState('MENSAH');
  const [customNumber, setCustomNumber] = useState('10');
  const [withFlocking, setWithFlocking] = useState(true);
  const [payOpen, setPayOpen] = useState(false);

  const selected = jerseys.find((j) => j.id === selectedJerseyId) || jerseys[0];
  if (!selected) return null;

  const finalPrice = selected.price + (withFlocking ? selected.customPrice : 0);

  const handleDirectOrder = async (provider: string, phone: string) => {
    const label = withFlocking
      ? `${selected.title} (Taille ${size} • Flocage: ${customName || 'SANS'} #${customNumber || '00'})`
      : `${selected.title} (Taille ${size})`;

    const res = await performAction('CREATE_ORDER', {
      customerName: customName || 'Supporter Guépards',
      customerEmail: 'koffi@bigevents.bj',
      customerPhone: phone,
      shippingAddress: 'Cotonou Haie Vive',
      city: 'Cotonou',
      orderType: 'JERSEY',
      paymentProvider: provider,
      customMeta: { size, customName, customNumber },
      items: [{ title: label, quantity: 1, unitPrice: finalPrice }]
    });

    if (res?.ok) {
      notify(
        `Maillot commandé (${res.order.orderNumber}) !`,
        'Votre maillot personnalisé entre en atelier de flocage.',
        'success'
      );
      router.push('/shop/track-order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl">
        <span className="text-xs font-black uppercase tracking-wider">
          Atelier Flocage Officiel BigEvents
        </span>
        <h1 className="text-2xl sm:text-4xl font-black mt-1">
          Maillots Officiels &amp; Personnalisation en Direct
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
          Choisissez votre maillot des Guépards du Bénin ou du Festival WeLovEya et prévisualisez
          votre flocage (Nom + Numéro) au dos avant de commander.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Live Visual Jersey Back Preview */}
        <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold">
            Aperçu du Flocage au Dos — {selected.teamOrEvent}
          </span>

          {/* Stylized Jersey Back Card */}
          <div className="relative w-64 h-72 rounded-3xl bg-[#111827] text-slate-950 shadow-2xl flex flex-col items-center justify-center p-6 border-4 border-white/20">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              BIGEVENTS OFFICIAL KIT
            </span>
            <div className="text-2xl font-black tracking-widest uppercase">
              {withFlocking ? customName || 'VOTRE NOM' : 'SANS FLOCAGE'}
            </div>
            <div className="text-7xl font-black leading-none mt-2 tracking-tighter">
              {withFlocking ? customNumber || '10' : ''}
            </div>
            <span className="mt-4 px-2.5 py-0.5 rounded bg-slate-950 text-[#FF5A1F] text-[10px] font-extrabold">
              TAILLE : {size}
            </span>
          </div>

          {/* Model Selector Thumbnails */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {jerseys.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelectedJerseyId(j.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selected.id === j.id
                    ? 'border-[#FF5A1F] bg-white/10'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={j.image} alt={j.title} className="w-full h-20 rounded-xl object-cover mb-2" />
                <p className="text-[11px] font-bold line-clamp-2">{j.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
          <div>
            <span className="text-xs font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">
              {selected.teamOrEvent}
            </span>
            <h2 className="text-xl font-black mt-0.5">{selected.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{selected.description}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Taille du maillot</label>
            <div className="flex gap-2">
              {selected.availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSize(sz)}
                  className={`w-12 h-11 rounded-xl font-extrabold text-xs border cursor-pointer ${
                    size === sz
                      ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div>
              <span className="font-bold text-xs block">Ajouter le flocage officiel (Nom + Numéro)</span>
              <span className="text-[11px] text-slate-500">
                +{selected.customPrice.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <input
              type="checkbox"
              checked={withFlocking}
              onChange={(e) => setWithFlocking(e.target.checked)}
              className="h-5 w-5 accent-[#FF5A1F]"
            />
          </div>

          {withFlocking && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Nom au dos (MAX 12 car.)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Numéro (1-99)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={customNumber}
                  onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-black text-center"
                />
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Prix Total</span>
            <span className="text-2xl font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
              {finalPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  id: `${selected.id}-${size}-${customName}-${customNumber}`,
                  title: `${selected.title} (${size} • ${customName} #${customNumber})`,
                  price: finalPrice,
                  image: selected.image,
                  type: 'JERSEY'
                })
              }
              className="flex-1 py-3.5 rounded-xl border-2 border-[#FF5A1F] text-[#FF5A1F] dark:text-[#FF5A1F] font-bold text-xs cursor-pointer"
            >
              + Ajouter au Panier
            </button>
            <button
              type="button"
              onClick={() => setPayOpen(true)}
              className="flex-1 py-3.5 rounded-xl bg-[#111827] text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Commander en 1-Clic
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={`Maillot ${selected.title} (${size})`}
        amount={finalPrice}
        onSuccess={handleDirectOrder}
      />
    </div>
  );
}
