'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Trophy,
  ShoppingBag,
  Users,
  PlusCircle,
  QrCode,
  BadgeCheck,
  TrendingUp
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { db, currentUser, performAction, notify } = useApp();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVENTS' | 'BADGES' | 'SHOP' | 'VOTES'>(
    'OVERVIEW'
  );

  // Event creation form
  const [evtTitle, setEvtTitle] = useState('');
  const [evtCategory, setEvtCategory] = useState('CONCERT');
  const [evtCity, setEvtCity] = useState('Cotonou');
  const [evtLocation, setEvtLocation] = useState('Palais des Congrès');
  const [evtPriceStd, setEvtPriceStd] = useState('5000');
  const [evtPriceVip, setEvtPriceVip] = useState('20000');

  // Badge creation form
  const [badgeHolder, setBadgeHolder] = useState('');
  const [badgeOrg, setBadgeOrg] = useState('');
  const [badgeLevel, setBadgeLevel] = useState('PRESSE');

  // Product creation form
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('12000');
  const [prodCategory, setProdCategory] = useState('MODE');

  const totalTicketRevenue = (db?.tickets || []).reduce((acc, t) => acc + t.pricePaid, 0);
  const totalOrdersRevenue = (db?.orders || []).reduce((acc, o) => acc + o.totalAmount, 0);
  const totalVotesCount = (db?.contests || []).reduce((acc, c) => acc + c.totalVotes, 0);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    const res = await performAction('CREATE_EVENT', {
      title: evtTitle,
      category: evtCategory,
      city: evtCity,
      location: evtLocation,
      priceStandard: Number(evtPriceStd),
      priceVip: Number(evtPriceVip)
    });
    if (res?.ok) {
      setEvtTitle('');
      notify('Événement publié !', `${res.event.title} est maintenant en ligne.`, 'success');
    }
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeHolder.trim()) return;
    const res = await performAction('CREATE_BADGE', {
      eventId: db?.events[0]?.id,
      holderName: badgeHolder,
      organization: badgeOrg || 'Média / Presse',
      accreditationLevel: badgeLevel
    });
    if (res?.ok) {
      setBadgeHolder('');
      setBadgeOrg('');
      notify('Badge d’accréditation émis !', `Code : ${res.badge.badgeCode}`, 'success');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const res = await performAction('CREATE_PRODUCT', {
      name: prodName,
      price: Number(prodPrice),
      category: prodCategory
    });
    if (res?.ok) {
      setProdName('');
      notify('Produit ajouté au BigMarket !', res.product.name, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#FF5A1F] text-slate-950 text-xs font-black uppercase">
            Rôle Actif : {currentUser?.role || 'ADMIN'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Centre de Pilotage Organisateur, Vendeur &amp; Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Gérez vos événements, billets QR, accréditations, concours de votes et produits BigMarket.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/access-scan"
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-2"
          >
            <QrCode className="h-4 w-4 text-[#FF5A1F]" />
            <span>Terminal Scan QR</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Événements Publiés</span>
          <div className="text-2xl font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
            {db?.events.length || 0}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">+100% Billetterie QR active</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Recettes Billets & BigMarket</span>
          <div className="text-2xl font-black text-emerald-600">
            {(totalTicketRevenue + totalOrdersRevenue).toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[11px] text-slate-400">KkiaPay & PawaPay vérifiés</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Votes Concours Cumulés</span>
          <div className="text-2xl font-black text-amber-500">
            {totalVotesCount.toLocaleString('fr-FR')}
          </div>
          <span className="text-[11px] text-slate-400">Sur {db?.contests.length || 0} concours</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Badges & Accréditations</span>
          <div className="text-2xl font-black">{db?.badges.length || 0}</div>
          <span className="text-[11px] text-slate-400">Presse, Staff, Artistes, VIP</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'OVERVIEW', label: 'Vue Globale & Commandes' },
          { id: 'EVENTS', label: '+ Créer un Événement' },
          { id: 'BADGES', label: 'Badges & Accréditations' },
          { id: 'SHOP', label: '+ Ajouter Produit BigMarket' },
          { id: 'VOTES', label: 'Transactions de Votes' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#FF5A1F] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-extrabold text-base">Derniers Billets QR Émis</h2>
            <div className="space-y-2.5">
              {(db?.tickets || []).slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
                      {t.ticketCode}
                    </span>{' '}
                    — <strong>{t.buyerName}</strong>
                    <p className="text-[11px] text-slate-500">{t.eventTitle}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      t.status === 'VALID'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-[#FF5A1F]/15 text-amber-600'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-extrabold text-base">Dernières Commandes BigMarket & Maillots</h2>
            <div className="space-y-2.5">
              {(db?.orders || []).slice(0, 6).map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-black text-[#FF5A1F] dark:text-[#FF5A1F]">
                      {o.orderNumber}
                    </span>{' '}
                    — <strong>{o.customerName}</strong>
                    <p className="text-[11px] text-slate-500">
                      {o.items[0]?.title} ({o.orderType})
                    </p>
                  </div>
                  <span className="font-black text-emerald-600">
                    {o.totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EVENTS' && (
        <form
          onSubmit={handleCreateEvent}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl space-y-4"
        >
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-[#FF5A1F]" />
            <span>Publier un nouvel événement sur BigEvents</span>
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Titre de l&apos;événement</label>
            <input
              type="text"
              required
              value={evtTitle}
              onChange={(e) => setEvtTitle(e.target.value)}
              placeholder="Ex: Afro-Sunset Concert Cotonou 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Catégorie</label>
              <select
                value={evtCategory}
                onChange={(e) => setEvtCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value="CONCERT">CONCERT</option>
                <option value="FESTIVAL">FESTIVAL</option>
                <option value="SOIREE">SOIREE</option>
                <option value="SPORT">SPORT</option>
                <option value="HUMOUR">HUMOUR</option>
                <option value="CONFERENCE">CONFERENCE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Ville</label>
              <input
                type="text"
                value={evtCity}
                onChange={(e) => setEvtCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Prix Pass Standard (FCFA)</label>
              <input
                type="number"
                value={evtPriceStd}
                onChange={(e) => setEvtPriceStd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Prix Pass VIP (FCFA)</label>
              <input
                type="number"
                value={evtPriceVip}
                onChange={(e) => setEvtPriceVip(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs cursor-pointer"
          >
            Publier l&apos;événement
          </button>
        </form>
      )}

      {activeTab === 'BADGES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleCreateBadge}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h2 className="font-extrabold text-base flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-[#FF5A1F]" />
              <span>Générer un Badge d&apos;Accréditation Officiel</span>
            </h2>
            <input
              type="text"
              required
              value={badgeHolder}
              onChange={(e) => setBadgeHolder(e.target.value)}
              placeholder="Nom du titulaire (ex: Journaliste, Artiste, Sécurité)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
            <input
              type="text"
              value={badgeOrg}
              onChange={(e) => setBadgeOrg(e.target.value)}
              placeholder="Média / Organisation (ex: Canal+ Afrique)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
            <select
              value={badgeLevel}
              onChange={(e) => setBadgeLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
            >
              <option value="PRESSE">PRESSE & MÉDIAS</option>
              <option value="STAFF">STAFF ORGANISATION</option>
              <option value="ARTISTE">ARTISTE & BACKSTAGE</option>
              <option value="VIP">PROTOCOLE VIP</option>
              <option value="SECURITE">SÉCURITÉ</option>
            </select>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs cursor-pointer"
            >
              Émettre le Badge
            </button>
          </form>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-base">Badges Actifs</h3>
            {(db?.badges || []).map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <strong>{b.holderName}</strong> ({b.organization})
                  <p className="text-[11px] text-slate-500">{b.eventTitle}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#FF5A1F] text-white font-mono font-bold text-[10px]">
                  {b.accreditationLevel} • {b.badgeCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SHOP' && (
        <form
          onSubmit={handleCreateProduct}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xl space-y-4"
        >
          <h2 className="font-extrabold text-base">Ajouter un produit au BigMarket</h2>
          <input
            type="text"
            required
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            placeholder="Nom de l'article"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={prodPrice}
              onChange={(e) => setProdPrice(e.target.value)}
              placeholder="Prix (FCFA)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
            <select
              value={prodCategory}
              onChange={(e) => setProdCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
            >
              <option value="MODE">MODE</option>
              <option value="ACCESSOIRES">ACCESSOIRES</option>
              <option value="ELECTRONIQUE">ELECTRONIQUE</option>
              <option value="ART">ART</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs cursor-pointer"
          >
            Mettre en vente
          </button>
        </form>
      )}

      {activeTab === 'VOTES' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="font-extrabold text-base">Journal des Transactions de Votes Mobile Money</h2>
          {(db?.voteTransactions || []).map((vt) => (
            <div
              key={vt.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <strong>+{vt.votesAdded} votes</strong> pour <strong>{vt.candidateName}</strong> ({vt.contestTitle})
                <p className="text-[11px] text-slate-500">
                  Votant : {vt.voterName} ({vt.voterPhone}) • Réf: {vt.paymentRef}
                </p>
              </div>
              <span className="font-black text-amber-600">
                {vt.amountPaid.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
