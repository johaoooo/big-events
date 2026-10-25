'use client';

import React from 'react';
import { Gift, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoyaltyPage() {
  const { db, currentUser, performAction, notify } = useApp();
  const rewards = db?.rewards || [];
  const redemptions = db?.redemptions || [];
  const points = currentUser?.loyaltyPoints ?? 640;

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (points < cost) {
      notify('Solde de points insuffisant', 'Achetez un billet ou un article BigMarket pour gagner plus de points !', 'error');
      return;
    }
    const res = await performAction('REDEEM_REWARD', {
      rewardId,
      userEmail: currentUser?.email || 'koffi@bigevents.bj'
    });
    if (res?.ok) {
      notify(
        'Récompense débloquée !',
        `Votre code avantage : ${res.redemption.couponCode}`,
        'success'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-[#FF5A1F]" />
            <span>Club Privilège BigEvents</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Programme de Fidélité &amp; Récompenses</h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Cumulez automatiquement des points à chaque achat de billet, vote ou commande BigMarket et
            échangez-les contre des Pass VIP et du merchandising officiel.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[210px]">
          <span className="text-xs uppercase font-bold text-[#FF5A1F] block">Votre Solde Actuel</span>
          <span className="text-4xl font-black mt-1 block">{points} pts</span>
          <span className="text-[11px] text-gray-300">Statut : Membre Gold</span>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((rew) => (
          <div
            key={rew.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md flex flex-col justify-between"
          >
            <div className="relative h-48">
              <img src={rew.image} alt={rew.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FF5A1F] text-slate-950 text-xs font-black">
                {rew.pointsCost} points
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#FF5A1F] dark:text-[#FF5A1F]">
                  {rew.category}
                </span>
                <h2 className="font-extrabold text-base mt-1">{rew.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{rew.description}</p>
              </div>
              <button
                onClick={() => handleRedeem(rew.id, rew.pointsCost)}
                className={`w-full py-3 rounded-xl font-bold text-xs cursor-pointer ${
                  points >= rew.pointsCost
                    ? 'bg-[#FF5A1F] text-white hover:bg-[#E04812]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {points >= rew.pointsCost
                  ? `Échanger contre ${rew.pointsCost} pts`
                  : `Il vous manque ${rew.pointsCost - points} pts`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Redemptions History */}
      {redemptions.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-lg">Mes Récompenses &amp; Coupons Débloqués</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {redemptions.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs">{r.rewardTitle}</p>
                  <p className="text-[11px] text-slate-500">-{r.pointsSpent} pts</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-mono font-black text-xs text-emerald-600">
                  {r.couponCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
