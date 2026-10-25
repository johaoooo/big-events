'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Search, Ticket, Users, SlidersHorizontal, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function EventsPage() {
  const { db } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [sortBy, setSortBy] = useState<'DATE' | 'PRICE_ASC' | 'POPULAR'>('DATE');

  const events = (db?.events || [])
    .filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'ALL' || e.category === category;
      const matchCity = city === 'ALL' || e.city.toLowerCase() === city.toLowerCase();
      return matchSearch && matchCat && matchCity;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') {
        return (
          Math.min(...a.ticketTypes.map((t) => t.price)) -
          Math.min(...b.ticketTypes.map((t) => t.price))
        );
      }
      if (sortBy === 'POPULAR') {
        return b.jySeraiCount - a.jySeraiCount;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const categories = ['ALL', 'CONCERT', 'FESTIVAL', 'SOIREE', 'SPORT', 'HUMOUR', 'CONFERENCE'];

  return (
    <div className="space-y-8 pb-16">
      {/* Clean Light Eventbrite-Style Header */}
      <div className="bg-[#F9FAFB] dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F]">
              Agenda &amp; Billetterie Officielle
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
              Tous les événements à venir
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1 max-w-2xl">
              Concerts, festivals, soirées, sport et conférences. Réservez vos billets QR vérifiés
              et créez votre badge photo officiel.
            </p>
          </div>

          {/* Structured Filter Box */}
          <div className="p-2 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-5 flex items-center gap-2.5 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un artiste, festival, salle..."
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 px-3 py-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-neutral-800">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm font-semibold text-gray-800 dark:text-neutral-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">Toutes les villes</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Ouidah">Ouidah</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Parakou">Parakou</option>
              </select>
            </div>

            <div className="md:col-span-4 px-3 py-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-neutral-800 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#FF5A1F] flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'DATE' | 'PRICE_ASC' | 'POPULAR')}
                className="w-full text-sm font-semibold text-gray-800 dark:text-neutral-200 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="DATE">Trier par : Date la plus proche</option>
                <option value="POPULAR">Trier par : Popularité</option>
                <option value="PRICE_ASC">Trier par : Prix croissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-[#111827] dark:bg-[#FF5A1F] text-white'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-300 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'Tous les événements' : cat}
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {events.length} événement(s) trouvé(s)
          </span>
        </div>

        {/* Clean 3-Column Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const minPrice = Math.min(...evt.ticketTypes.map((t) => t.price));
            return (
              <div
                key={evt.id}
                className="group rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white text-gray-900 text-[11px] font-semibold">
                    {evt.category}
                  </span>
                  {evt.jySeraiEnabled && (
                    <Link
                      href={`/events/${evt.slug}/jy-serai`}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#111827]/90 text-white text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Users className="h-3 w-3 text-[#FF5A1F]" />
                      <span>J&apos;y serai ({evt.jySeraiCount})</span>
                    </Link>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
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
                      <h2 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                        {evt.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">
                        {evt.location} • {evt.city}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block">À partir de</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {minPrice === 0 ? 'Gratuit' : `${minPrice.toLocaleString('fr-FR')} FCFA`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {evt.jySeraiEnabled && (
                        <Link
                          href={`/events/${evt.slug}/jy-serai`}
                          className="px-2.5 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-[#FF5A1F] hover:text-[#FF5A1F] text-xs font-semibold"
                        >
                          Badge
                        </Link>
                      )}
                      <Link
                        href={`/events/${evt.slug}`}
                        className="px-3.5 py-2 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        <span>Réserver</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
