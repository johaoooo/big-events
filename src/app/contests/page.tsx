'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ContestsPage() {
  const { db } = useApp();
  const [search, setSearch] = useState('');
  const contests = (db?.contests || []).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.candidates.some((cand) => cand.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Clean Light Header */}
      <div className="bg-[#F9FAFB] dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F]">
              Votes Publics Certifiés
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
              Concours &amp; Votes en direct
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1 max-w-2xl">
              Soutenez vos candidats favoris par Mobile Money ou carte bancaire. Classement public
              actualisé en temps réel.
            </p>
          </div>

          <div className="w-full md:w-80 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher un concours ou candidat..."
              className="w-full text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {contests.map((cnt) => {
          const sortedCandidates = [...cnt.candidates].sort((a, b) => b.votesCount - a.votesCount);
          return (
            <div
              key={cnt.id}
              className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-5">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFF4F0] text-[#FF5A1F] text-xs font-semibold">
                    {cnt.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
                    {cnt.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                    {cnt.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-[#F9FAFB] dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-center">
                    <span className="block text-lg font-bold text-gray-900 dark:text-white">
                      {cnt.totalVotes.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-gray-500">
                      Votes totaux
                    </span>
                  </div>
                  <Link
                    href={`/contests/${cnt.slug}`}
                    className="px-5 py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Voter &amp; Packs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {sortedCandidates.map((cand, idx) => {
                  const pct =
                    cnt.totalVotes > 0 ? Math.round((cand.votesCount / cnt.totalVotes) * 100) : 0;
                  return (
                    <div
                      key={cand.id}
                      className="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4 bg-[#F9FAFB] dark:bg-neutral-950"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex-shrink-0">
                          <img
                            src={cand.photo}
                            alt={cand.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                            #{idx + 1}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-[#FF5A1F]">
                            N°{cand.number} • {cand.city}
                          </span>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                            {cand.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{cand.bio}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-800 dark:text-neutral-200">
                            {cand.votesCount.toLocaleString('fr-FR')} votes
                          </span>
                          <span className="text-[#FF5A1F]">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-[#FF5A1F] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <Link
                          href={`/contests/${cnt.slug}`}
                          className="mt-1 block w-full py-2 rounded-lg bg-[#111827] dark:bg-[#FF5A1F] hover:opacity-95 text-white text-center text-xs font-semibold"
                        >
                          Voter pour {cand.name.split(' ')[0]}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
