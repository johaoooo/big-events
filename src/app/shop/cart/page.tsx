'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQty, removeFromCart, clearCart, db, currentUser, performAction, notify } =
    useApp();

  const [promoCode, setPromoCode] = useState('BENIN229');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Koffi Mensah');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'koffi@bigevents.bj');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+229 97 00 11 22');
  const [shippingAddress, setShippingAddress] = useState('Haie Vive, Rue des Cocotiers');
  const [city, setCity] = useState('Cotonou');
  const [payOpen, setPayOpen] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const matchedPromo = db?.promoCodes.find(
    (p) => p.code.toUpperCase() === promoCode.trim().toUpperCase() && p.active
  );
  const discount = matchedPromo ? Math.round((subtotal * matchedPromo.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckoutSuccess = async (provider: string, phone: string) => {
    const res = await performAction('CREATE_ORDER', {
      customerName,
      customerEmail,
      customerPhone: phone || customerPhone,
      shippingAddress,
      city,
      orderType: 'SHOP',
      promoCode: matchedPromo?.code,
      paymentProvider: provider,
      items: cart.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.price
      }))
    });
    if (res?.ok) {
      clearCart();
      notify(
        `Commande ${res.order.orderNumber} confirmée !`,
        'Suivez la livraison en temps réel.',
        'success'
      );
      router.push('/shop/track-order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="h-14 w-14 text-slate-400 mx-auto" />
        <h1 className="text-2xl font-black">Votre panier BigMarket est vide</h1>
        <p className="text-xs text-slate-500">
          Découvrez nos produits officiels, maillots personnalisés et packages VIP.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/shop/products"
            className="px-5 py-3 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold"
          >
            Explorer le BigMarket
          </Link>
          <Link
            href="/shop/track-order"
            className="px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
          >
            Suivre mes commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black">Mon Panier BigMarket</h1>
        <Link
          href="/shop/track-order"
          className="text-xs font-bold text-[#FF5A1F] dark:text-[#FF5A1F] hover:underline"
        >
          Suivre une commande existante →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {item.type}
                  </span>
                  <h3 className="font-bold text-sm mt-1">{item.title}</h3>
                  <p className="text-xs font-extrabold text-[#FF5A1F] dark:text-[#FF5A1F] mt-1">
                    {item.price.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateCartQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Shipping */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 h-fit">
          <h2 className="font-extrabold text-lg">Livraison &amp; Code Promo</h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Code Promo</label>
            <div className="relative">
              <Tag className="h-4 w-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="BENIN229"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold uppercase"
              />
            </div>
            {matchedPromo && (
              <p className="text-[11px] text-emerald-600 dark:text-[#FF5A1F] font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Remise de -{matchedPromo.discountPercent}% appliquée !
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nom complet"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Adresse de livraison"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Réduction ({matchedPromo?.code})</span>
                <span>-{discount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black pt-2">
              <span>Total à payer</span>
              <span className="text-[#FF5A1F] dark:text-[#FF5A1F]">
                {total.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPayOpen(true)}
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg cursor-pointer"
          >
            Payer la commande
          </button>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={`Commande BigMarket (${cart.length} article(s))`}
        amount={total}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
