'use client';

import React from 'react';
import { Share2, Copy, Wallet, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AffiliationPage() {
  const { currentUser, notify } = useApp();
  const refCode = currentUser?.referralCode || 'KOFFI229';
  const refLink = `https://bigevents.bj/?ref=${refCode}`;

  const copyReferral = () => {
    try {
      navigator.clipboard.writeText(refLink);
    } catch {}
    notify('Lien de parrainage copié !', refLink, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
          Programme Ambassadeurs & Parrainage Multi-Niveaux
        </span>
        <h1 className="text-2xl sm:text-4xl font-black mt-1">
          Gagnez jusqu&apos;à 10% de commission sur chaque billet vendu
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-2xl">
          Partagez votre lien d&apos;affiliation unique sur WhatsApp, TikTok ou Facebook. Vous
          touchez une commission instantanée sur chaque billet, pack de vote ou maillot acheté via
          votre lien !
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] dark:text-[#FF5A1F] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold">Filleuls actifs</span>
            <h2 className="text-2xl font-black">{currentUser?.referralCount ?? 14}</h2>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold">Gains disponibles</span>
            <h2 className="text-2xl font-black text-emerald-600">
              {(currentUser?.referralEarnings ?? 28500).toLocaleString('fr-FR')} FCFA
            </h2>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold">Taux de commission</span>
            <h2 className="text-2xl font-black">10% Direct + 3% Niv. 2</h2>
          </div>
        </div>
      </div>

      {/* Share Link Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-extrabold text-lg">Votre Lien &amp; Code Ambassadeur</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            readOnly
            value={refLink}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold"
          />
          <button
            onClick={copyReferral}
            className="px-6 py-3 rounded-xl bg-[#FF5A1F] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy className="h-4 w-4" />
            <span>Copier mon lien</span>
          </button>
          <button
            onClick={() =>
              notify(
                'Demande de retrait Mobile Money envoyée !',
                'Transfert vers votre numéro MTN MoMo sous 15 minutes.',
                'success'
              )
            }
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Retirer mes gains MoMo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
