'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Ticket,
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { db, currentUser, performAction, notify } = useApp();

  const event = db?.events.find((e) => e.slug === slug || e.id === slug);

  const [selectedTtId, setSelectedTtId] = useState<string>(event?.ticketTypes[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState(currentUser?.name || 'Koffi Mensah');
  const [buyerEmail, setBuyerEmail] = useState(currentUser?.email || 'koffi@bigevents.bj');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '+229 97 00 11 22');
  const [payOpen, setPayOpen] = useState(false);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Événement introuvable</h1>
        <Link href="/events" className="inline-block px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-sm font-bold">
          Retour aux événements
        </Link>
      </div>
    );
  }

  const selectedTt = event.ticketTypes.find((t) => t.id === selectedTtId) || event.ticketTypes[0];
  const totalAmount = (selectedTt?.price || 0) * quantity;

  const handlePaymentSuccess = async (provider: string, phone: string) => {
    const res = await performAction('BUY_TICKET', {
      eventId: event.id,
      ticketTypeId: selectedTt.id,
      quantity,
      buyerName,
      buyerEmail,
      buyerPhone: phone || buyerPhone,
      paymentProvider: provider
    });

    if (res?.ok) {
      notify(
        'Billet(s) généré(s) avec succès !',
        `Code billet : ${res.tickets[0]?.ticketCode}. Retrouvez-les dans "Mes Billets".`,
        'success'
      );
      router.push('/my-tickets');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF5A1F]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour au catalogue des événements</span>
      </Link>

      {/* Hero Cover */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl">
        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FF5A1F] text-white text-xs font-black uppercase">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#FF5A1F]" />
                {new Date(event.date).toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-sky-400" />
                {event.location}, {event.city} ({event.country})
              </span>
            </div>
          </div>

          {event.jySeraiEnabled && (
            <Link
              href={`/events/${event.slug}/jy-serai`}
              className="px-5 py-3 rounded-2xl bg-[#FF5A1F] hover:bg-[#E04812] text-white font-bold text-xs flex items-center gap-2 shadow-lg self-start md:self-end"
            >
              <Sparkles className="h-4 w-4" />
              <span>Générer mon affiche &laquo; J&apos;y serai &raquo; ({event.jySeraiCount})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content + Ticket Checkout Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Description & Organizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-extrabold">À propos de l&apos;événement</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <span>
                Organisé par : <strong className="text-slate-800 dark:text-white">{event.organizerName}</strong>
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-[#FF5A1F] font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Organisateur vérifié BigEvents
              </span>
            </div>
          </div>

          {/* Ticket Categories List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-extrabold">Catégories de billets disponibles</h2>
            <div className="space-y-3">
              {event.ticketTypes.map((tt) => {
                const remaining = Math.max(0, tt.quantity - tt.sold);
                const selected = selectedTt?.id === tt.id;
                return (
                  <div
                    key={tt.id}
                    onClick={() => setSelectedTtId(tt.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      selected
                        ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 dark:bg-sky-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">{tt.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {remaining} places restantes
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{tt.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
                        {tt.price === 0 ? 'Gratuit' : `${tt.price.toLocaleString('fr-FR')} FCFA`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Réservation</span>
              <h3 className="font-extrabold text-lg">{selectedTt?.name}</h3>
            </div>
            <Ticket className="h-6 w-6 text-[#FF5A1F] dark:text-[#FF5A1F]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Nombre de billets</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-lg"
              >
                -
              </button>
              <span className="flex-1 text-center font-extrabold text-lg">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Nom & Prénom sur le billet</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Email de réception</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Téléphone WhatsApp / MoMo</label>
              <input
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total à payer</span>
            <span className="text-xl font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
              {totalAmount === 0 ? 'GRATUIT' : `${totalAmount.toLocaleString('fr-FR')} FCFA`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPayOpen(true)}
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg hover:opacity-95 cursor-pointer"
          >
            Obtenir mon Billet QR
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Billet QR instantané + Points de fidélité offerts</span>
          </div>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={`${quantity}x ${selectedTt?.name} — ${event.title}`}
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
