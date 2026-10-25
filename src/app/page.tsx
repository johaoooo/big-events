'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Ticket,
  Trophy,
  Tv,
  ArrowRight,
  Shirt,
  Search,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  ShieldCheck,
  Calculator,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { EventItem } from '@/lib/store';

export default function HomePage() {
  const { db, addToCart, notify, performAction, currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'UNDER_10K' | 'VIP'>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'DATE' | 'PRICE_ASC'>('POPULAR');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Quick-Book Modal state
  const [quickBookEvent, setQuickBookEvent] = useState<EventItem | null>(null);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>('');
  const [ticketQty, setTicketQty] = useState(1);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Organizer Revenue Calculator state
  const [calcAttendees, setCalcAttendees] = useState(500);
  const [calcTicketPrice, setCalcTicketPrice] = useState(10000);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bigevents_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (eventId: string, title: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(eventId);
      const next = exists ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('bigevents_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      notify(
        exists ? 'Retiré des favoris' : 'Ajouté aux favoris',
        exists
          ? `${title} a été retiré de votre sélection.`
          : `${title} a été enregistré dans vos favoris.`,
        'info'
      );
      return next;
    });
  };

  const publishedEvents = (db?.events || []).filter((e) => e.status === 'PUBLISHED');
  const featuredEvents = publishedEvents.filter((e) => e.featured);
  const currentFeatured =
    featuredEvents[featuredIndex % Math.max(1, featuredEvents.length)] || publishedEvents[0];

  const filteredEvents = publishedEvents
    .filter((e) => {
      const matchCat = activeCategory === 'ALL' || e.category === activeCategory;
      const matchCity =
        selectedCity === 'ALL' || e.city.toLowerCase() === selectedCity.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase());
      const minPrice = Math.min(...e.ticketTypes.map((t) => t.price));
      const matchPrice =
        priceFilter === 'ALL' ||
        (priceFilter === 'UNDER_10K' && minPrice <= 10000) ||
        (priceFilter === 'VIP' && minPrice > 10000);
      const matchFav = !onlyFavorites || favorites.includes(e.id);
      return matchCat && matchCity && matchQuery && matchPrice && matchFav;
    })
    .sort((a, b) => {
      if (sortBy === 'DATE') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'PRICE_ASC') {
        const minA = Math.min(...a.ticketTypes.map((t) => t.price));
        const minB = Math.min(...b.ticketTypes.map((t) => t.price));
        return minA - minB;
      }
      return b.jySeraiCount - a.jySeraiCount;
    });

  const contests = db?.contests || [];
  const liveEvents = db?.liveEvents || [];
  const products = db?.products || [];

  const categories = [
    { id: 'ALL', label: 'Tous les événements' },
    { id: 'FESTIVAL', label: 'Festivals' },
    { id: 'CONCERT', label: 'Concerts' },
    { id: 'SOIREE', label: 'Soirées & Clubs' },
    { id: 'SPORT', label: 'Sport' },
    { id: 'HUMOUR', label: 'Humour & Stand-up' },
    { id: 'CONFERENCE', label: 'Conférences' }
  ];

  const cities = [
    {
      name: 'Cotonou',
      subtitle: 'Concerts, galas & plages',
      count: publishedEvents.filter((e) => e.city.toLowerCase() === 'cotonou').length
    },
    {
      name: 'Ouidah',
      subtitle: 'Festivals & patrimoine',
      count: publishedEvents.filter((e) => e.city.toLowerCase() === 'ouidah').length
    },
    {
      name: 'Porto-Novo',
      subtitle: 'Culture & arts vivants',
      count: Math.max(1, publishedEvents.filter((e) => e.city.toLowerCase() === 'porto-novo').length)
    },
    {
      name: 'Parakou',
      subtitle: 'Grands shows & jeunesse',
      count: Math.max(1, publishedEvents.filter((e) => e.city.toLowerCase() === 'parakou').length)
    }
  ];

  const openQuickBook = (evt: EventItem) => {
    setQuickBookEvent(evt);
    setSelectedTicketTypeId(evt.ticketTypes[0]?.id || '');
    setTicketQty(1);
  };

  const selectedTicketObj = quickBookEvent?.ticketTypes.find((t) => t.id === selectedTicketTypeId);
  const quickTotal = (selectedTicketObj?.price || 0) * ticketQty;

  const handleConfirmQuickPurchase = async (provider: string, phone: string) => {
    if (!quickBookEvent || !selectedTicketObj) return;
    await performAction('BUY_TICKET', {
      eventId: quickBookEvent.id,
      ticketTypeId: selectedTicketObj.id,
      quantity: ticketQty,
      buyerName: currentUser?.name || 'Visiteur bigevents',
      buyerEmail: currentUser?.email || 'client@bigevents.bj',
      buyerPhone: phone,
      paymentProvider: provider
    });
    setPaymentOpen(false);
    setQuickBookEvent(null);
    notify(
      'Billet QR généré !',
      `Vos ${ticketQty} billet(s) pour ${quickBookEvent.title} sont disponibles dans "Mes Billets".`,
      'success'
    );
  };

  const estimatedGross = calcAttendees * calcTicketPrice;
  const estimatedNet = Math.round(estimatedGross * 0.95);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. ULTRA-CLEAN MINIMAL CENTERED HERO (Airbnb / Dice Style, Zero Clutter) */}
      <section className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Trouvez votre prochain événement.
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 max-w-xl mx-auto">
            Concerts, festivals, soirées et concours au Bénin. Réservez vos billets QR en quelques secondes.
          </p>

          {/* Sleek Centered Pill Search Bar */}
          <div className="max-w-2xl mx-auto p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 shadow-xs flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2.5 pl-4 py-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement, artiste, lieu..."
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none"
              />
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2">
              <MapPin className="h-4 w-4 text-[#FF5A1F] flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-sm font-medium text-gray-700 dark:text-neutral-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">Toutes les villes</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Ouidah">Ouidah</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
              </select>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('events-directory');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-full bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* 2. ÉVÉNEMENTS À VENIR */}
      <section id="events-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#111827] dark:bg-[#FF5A1F] text-white'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Filter Controls (Price, Sort, Favorites) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as 'ALL' | 'UNDER_10K' | 'VIP')}
                className="font-semibold text-gray-700 dark:text-neutral-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tous les tarifs</option>
                <option value="UNDER_10K">Moins de 10 000 FCFA</option>
                <option value="VIP">Événements VIP (&gt; 10 000 FCFA)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs">
              <span className="text-gray-400">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'POPULAR' | 'DATE' | 'PRICE_ASC')}
                className="font-semibold text-gray-700 dark:text-neutral-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="POPULAR">Popularité</option>
                <option value="DATE">Date la plus proche</option>
                <option value="PRICE_ASC">Prix croissant</option>
              </select>
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyFavorites
                  ? 'bg-[#FFF4F0] border-[#FF5A1F] text-[#FF5A1F]'
                  : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-200'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${onlyFavorites ? 'fill-[#FF5A1F] text-[#FF5A1F]' : ''}`} />
              <span>Favoris ({favorites.length})</span>
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-xl bg-[#F9FAFB] dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-10 text-center space-y-3">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Aucun événement ne correspond à ces filtres.
            </p>
            <p className="text-xs text-gray-500">
              Essayez de modifier la ville, la catégorie ou le filtre de budget.
            </p>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setSelectedCity('ALL');
                setPriceFilter('ALL');
                setSearchQuery('');
                setOnlyFavorites(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#FF5A1F] text-white text-xs font-semibold cursor-pointer"
            >
              Afficher tous les événements
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const minPrice = Math.min(...evt.ticketTypes.map((t) => t.price));
              const totalSold = evt.ticketTypes.reduce((acc, t) => acc + t.sold, 0);
              const totalCap = evt.ticketTypes.reduce((acc, t) => acc + t.quantity, 0);
              const soldPct = totalCap > 0 ? Math.min(100, Math.round((totalSold / totalCap) * 100)) : 0;
              const isFav = favorites.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  className="group rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden hover:border-gray-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-gray-900 text-[11px] font-semibold shadow-2xs">
                      {evt.category}
                    </span>

                    {/* Airbnb Heart Button */}
                    <button
                      onClick={() => toggleFavorite(evt.id, evt.title)}
                      aria-label="Ajouter aux favoris"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-gray-700 shadow-2xs cursor-pointer"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isFav ? 'fill-[#FF5A1F] text-[#FF5A1F]' : 'text-gray-700'
                        }`}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#111827]/90 text-white text-[11px] font-medium flex items-center gap-1">
                      <Users className="h-3 w-3 text-[#FF5A1F]" />
                      <span>{evt.jySeraiCount} participants inscrits</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#FF5A1F] flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(evt.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(evt.date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <Link href={`/events/${evt.slug}`}>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                          {evt.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {evt.location} • {evt.city}
                        </span>
                      </p>

                      {/* Clean Availability Bar */}
                      <div className="pt-1 space-y-1">
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span>Disponibilité</span>
                          <span className="font-semibold text-gray-700 dark:text-neutral-300">
                            {soldPct}% réservé
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-[#FF5A1F] rounded-full"
                            style={{ width: `${soldPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">À partir de</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {minPrice === 0 ? 'Gratuit' : `${minPrice.toLocaleString('fr-FR')} FCFA`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openQuickBook(evt)}
                          className="px-3 py-2 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Réserver
                        </button>
                        <Link
                          href={`/events/${evt.slug}`}
                          className="px-2.5 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-gray-400 text-xs font-semibold"
                        >
                          Fiche
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. CONCOURS & VOTES DU PUBLIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Concours &amp; Votes officiels
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Classements vérifiés et votes Mobile Money instantanés
            </p>
          </div>
          <Link
            href="/contests"
            className="text-sm font-semibold text-[#FF5A1F] hover:underline flex items-center gap-1"
          >
            <span>Tous les concours</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contests.map((cnt) => (
            <div
              key={cnt.id}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 flex flex-col justify-between space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFF4F0] text-[#FF5A1F] text-[11px] font-semibold">
                    {cnt.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5">
                    {cnt.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cnt.description}</p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-200 font-bold text-xs whitespace-nowrap">
                  {cnt.totalVotes.toLocaleString('fr-FR')} votes
                </span>
              </div>

              <div className="space-y-3">
                {cnt.candidates.slice(0, 3).map((cand, idx) => {
                  const pct =
                    cnt.totalVotes > 0 ? Math.round((cand.votesCount / cnt.totalVotes) * 100) : 0;
                  return (
                    <div key={cand.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-900 dark:text-neutral-200 font-semibold">
                          {idx + 1}. {cand.name}{' '}
                          <span className="text-gray-400 font-normal">({cand.number})</span>
                        </span>
                        <span className="text-gray-600 dark:text-neutral-400 font-semibold">
                          {cand.votesCount.toLocaleString('fr-FR')} votes ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-[#FF5A1F] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Tarif du vote : <strong className="text-gray-900 dark:text-white">{cnt.votePrice} FCFA</strong>
                </span>
                <Link
                  href={`/contests/${cnt.slug}`}
                  className="px-4 py-2 rounded-lg bg-[#111827] dark:bg-[#FF5A1F] text-white text-xs font-semibold hover:opacity-95"
                >
                  Voter pour un candidat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DIRECTS LIVE & BOUTIQUE APERÇU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Directs Live &amp; Boutique officielle
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Suivez les événements à distance ou commandez les articles officiels
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/jerseys"
              className="text-xs font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#FF5A1F] flex items-center gap-1"
            >
              <Shirt className="h-4 w-4 text-[#FF5A1F]" />
              <span>Maillots personnalisés</span>
            </Link>
            <Link
              href="/shop/products"
              className="text-xs font-semibold text-[#FF5A1F] hover:underline flex items-center gap-1"
            >
              <span>Boutique complète</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((prd) => (
            <div
              key={prd.id}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 bg-gray-100">
                <img src={prd.image} alt={prd.name} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-white text-gray-800 text-[10px] font-semibold">
                  {prd.category}
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] text-gray-400">{prd.shopName}</p>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mt-0.5 line-clamp-2">
                    {prd.name}
                  </h3>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {prd.price.toLocaleString('fr-FR')} FCFA
                  </span>
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
                    className="px-3 py-1.5 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-semibold cursor-pointer"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SIMULATEUR ORGANISATEUR & CTA (Flat #111827 + Interactive Calculator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111827] text-white p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FF5A1F]">
              <Calculator className="h-4 w-4" />
              <span>Espace Organisateurs &amp; Promoteurs</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              Publiez votre événement et encaissez vos ventes en temps réel.
            </h2>
            <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
              Billetterie QR, création de concours de votes, contrôle d&apos;accès mobile aux portes
              et reversement rapide sur votre compte Mobile Money ou bancaire.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-xs transition-colors"
              >
                Créer un événement
              </Link>
              <Link
                href="/access-scan"
                className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition-colors"
              >
                Application Scanner QR
              </Link>
            </div>
          </div>

          {/* Interactive Revenue Simulator Card */}
          <div className="lg:col-span-5 rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Simulateur de recettes
              </span>
              <span className="text-[11px] text-[#FF5A1F] font-semibold">Reversement 95%</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Participants estimés</span>
                  <span className="font-bold text-white">{calcAttendees} billets</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={calcAttendees}
                  onChange={(e) => setCalcAttendees(Number(e.target.value))}
                  className="w-full accent-[#FF5A1F] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Prix moyen du billet</span>
                  <span className="font-bold text-white">
                    {calcTicketPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={50000}
                  step={1000}
                  value={calcTicketPrice}
                  onChange={(e) => setCalcTicketPrice(Number(e.target.value))}
                  className="w-full accent-[#FF5A1F] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Revenu net estimé</span>
                <span className="text-xl font-bold text-[#FF5A1F]">
                  {estimatedNet.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-lg bg-white text-gray-900 text-xs font-bold hover:bg-gray-100"
              >
                Lancer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK-BOOK DRAWER / MODAL */}
      {quickBookEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-xl">
            <div className="p-5 bg-[#111827] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A1F]">
                  Réservation Express
                </span>
                <h3 className="font-bold text-base line-clamp-1">{quickBookEvent.title}</h3>
              </div>
              <button
                onClick={() => setQuickBookEvent(null)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300">
                  Choisissez votre catégorie de billet
                </label>
                {quickBookEvent.ticketTypes.map((tt) => (
                  <button
                    key={tt.id}
                    onClick={() => setSelectedTicketTypeId(tt.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                      selectedTicketTypeId === tt.id
                        ? 'border-[#FF5A1F] bg-[#FFF4F0] dark:bg-neutral-800'
                        : 'border-gray-200 dark:border-neutral-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{tt.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {tt.description}
                      </p>
                    </div>
                    <span className="font-bold text-sm text-[#FF5A1F]">
                      {tt.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                  Quantité
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-bold text-sm w-6 text-center">{ticketQty}</span>
                  <button
                    onClick={() => setTicketQty(Math.min(10, ticketQty + 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Total à payer</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {quickTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <button
                  onClick={() => setPaymentOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-xs cursor-pointer"
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={quickTotal}
        title={
          quickBookEvent && selectedTicketObj
            ? `${ticketQty}x ${selectedTicketObj.name} — ${quickBookEvent.title}`
            : 'Réservation Billet'
        }
        onSuccess={handleConfirmQuickPurchase}
      />
    </div>
  );
}
