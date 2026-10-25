'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Users, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LiveCatalogPage() {
  const { db } = useApp();
  const lives = db?.liveEvents || [];
  const liveTickets = db?.liveTickets || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Clean Light Header */}
      <div className="bg-[#F9FAFB] dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF5A1F]">
            <Radio className="h-4 w-4" />
            <span>Diffusions HD &amp; Pay-Per-View</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Directs &amp; Concerts en ligne
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400 max-w-2xl">
            Suivez les concerts, galas et conférences en direct où que vous soyez. Débloquez votre
            code d&apos;accès personnel en quelques secondes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Active Access Codes */}
        {liveTickets.length > 0 && (
          <div className="p-4 rounded-xl bg-[#FFF4F0] dark:bg-neutral-900 border border-[#FFD8C9] dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#FF5A1F]">
                Vos codes d&apos;accès Live actifs
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {liveTickets.map((lt) => (
                  <span
                    key={lt.id}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-neutral-800 font-mono font-bold text-xs border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white"
                  >
                    {lt.accessCode} ({lt.liveEventTitle.slice(0, 28)}...)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lives.map((lv) => (
            <div
              key={lv.id}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-52 bg-gray-100">
                <img src={lv.coverImage} alt={lv.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 ${
                    lv.status === 'LIVE'
                      ? 'bg-[#FF5A1F] text-white'
                      : 'bg-[#111827] text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {lv.status === 'LIVE' ? 'EN DIRECT' : 'PROGRAMMÉ'}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#111827]/90 text-white text-xs font-medium flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#FF5A1F]" />
                  {lv.viewerCount} spectateurs
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#FF5A1F]">{lv.artistOrHost}</p>
                  <h2 className="font-bold text-base text-gray-900 dark:text-white mt-0.5">
                    {lv.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{lv.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Accès Direct HD</span>
                    <strong className="text-sm font-bold text-gray-900 dark:text-white">
                      {lv.price.toLocaleString('fr-FR')} FCFA
                    </strong>
                  </div>
                  <Link
                    href={`/live/${lv.slug}/watch`}
                    className="px-4 py-2 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Accéder au direct</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
