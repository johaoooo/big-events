'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, Calendar, MapPin, QrCode, Copy, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MyTicketsPage() {
  const { db, notify } = useApp();
  const tickets = db?.tickets || [];

  const copyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    notify('Code billet copié !', `Vous pouvez tester "${code}" dans le Scanner QR (/access-scan).`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] dark:text-[#FF5A1F]">
            Portefeuille Électronique
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-1">Mes Billets QR Officiels</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/access-scan"
            className="px-4 py-2.5 rounded-xl bg-[#FF5A1F]/15 text-amber-600 dark:text-[#FF5A1F] text-xs font-bold flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            <span>Tester le Contrôle d&apos;Accès</span>
          </Link>
          <Link
            href="/events"
            className="px-4 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center gap-2"
          >
            <Ticket className="h-4 w-4" />
            <span>Acheter un autre billet</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col sm:flex-row"
          >
            {/* Left Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] dark:text-[#FF5A1F] text-[11px] font-black uppercase">
                    {tkt.ticketTypeName}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                      tkt.status === 'VALID'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-[#FF5A1F]'
                        : 'bg-[#FF5A1F]/15 text-amber-600'
                    }`}
                  >
                    {tkt.status === 'VALID' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> VALIDE
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" /> DÉJÀ SCANNÉ
                      </>
                    )}
                  </span>
                </div>

                <Link href={`/events/${tkt.eventSlug}`}>
                  <h2 className="font-extrabold text-base hover:text-[#FF5A1F] leading-snug">
                    {tkt.eventTitle}
                  </h2>
                </Link>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#FF5A1F]" />
                    <span>
                      {new Date(tkt.eventDate).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    <span>{tkt.eventLocation}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Titulaire</span>
                  <strong className="text-slate-800 dark:text-white">{tkt.buyerName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Montant payé ({tkt.paymentProvider})</span>
                  <strong className="text-[#FF5A1F] dark:text-[#FF5A1F]">
                    {tkt.pricePaid === 0 ? 'Gratuit' : `${tkt.pricePaid.toLocaleString('fr-FR')} FCFA`}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Perforated QR Stub */}
            <div className="sm:w-52 bg-slate-50 dark:bg-slate-800/60 border-t sm:border-t-0 sm:border-l-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200">
                <DeterministicQrSvg seed={tkt.ticketCode} />
              </div>
              <p className="font-mono font-black text-xs tracking-wider text-slate-800 dark:text-slate-200">
                {tkt.ticketCode}
              </p>
              <button
                type="button"
                onClick={() => copyCode(tkt.ticketCode)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 text-[#FF5A1F] dark:text-[#FF5A1F] text-[11px] font-bold cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Copier le code</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeterministicQrSvg({ seed }: { seed: string }) {
  const size = 9;
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    const ch = seed.charCodeAt(i % seed.length) + i * 17;
    cells.push(ch % 2 === 0);
  }
  return (
    <svg width="96" height="96" viewBox="0 0 90 90" className="text-slate-950">
      <rect width="90" height="90" fill="white" />
      {cells.map((on, idx) => {
        const x = (idx % size) * 10;
        const y = Math.floor(idx / size) * 10;
        const isCorner = (x < 30 && y < 30) || (x >= 60 && y < 30) || (x < 30 && y >= 60);
        if (isCorner || on) {
          return <rect key={idx} x={x + 1} y={y + 1} width="8" height="8" rx="1.5" fill="#FF5A1F" />;
        }
        return null;
      })}
    </svg>
  );
}
