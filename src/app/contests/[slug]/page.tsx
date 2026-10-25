'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Trophy, Sparkles, ArrowLeft, CheckCircle2, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function ContestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { db, performAction, notify } = useApp();
  const contest = db?.contests.find((c) => c.slug === slug || c.id === slug) || db?.contests[0];

  const [selectedCandidateId, setSelectedCandidateId] = useState(contest?.candidates[0]?.id || '');
  const [selectedPackId, setSelectedPackId] = useState(contest?.votePacks[1]?.id || contest?.votePacks[0]?.id || '');
  const [voterName, setVoterName] = useState('Ulrich Dossou');
  const [payOpen, setPayOpen] = useState(false);

  if (!contest) return null;

  const selectedCandidate =
    contest.candidates.find((c) => c.id === selectedCandidateId) || contest.candidates[0];
  const selectedPack =
    contest.votePacks.find((p) => p.id === selectedPackId) || contest.votePacks[0];

  const totalVotesToAdd = (selectedPack?.votes || 1) + (selectedPack?.bonusVotes || 0);
  const totalPrice = selectedPack?.price || contest.votePrice;

  const handleVotePayment = async (provider: string, phone: string) => {
    const res = await performAction('CAST_VOTE', {
      contestId: contest.id,
      candidateId: selectedCandidate.id,
      votes: totalVotesToAdd,
      amountPaid: totalPrice,
      voterName,
      voterPhone: phone,
      provider
    });
    if (res?.ok) {
      notify(
        `+${totalVotesToAdd} votes crédités pour ${selectedCandidate.name} !`,
        `Référence : ${res.transaction.paymentRef}`,
        'success'
      );
    }
  };

  const sortedCandidates = [...contest.candidates].sort((a, b) => b.votesCount - a.votesCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/contests"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF5A1F]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour à tous les concours</span>
      </Link>

      {/* Contest Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-10 shadow-xl">
        <img
          src={contest.coverImage}
          alt={contest.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-[#FF5A1F] text-slate-950 font-black text-xs uppercase">
              {contest.category} • {contest.status}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">{contest.title}</h1>
            <p className="text-xs sm:text-sm text-slate-200">{contest.description}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <span className="text-3xl font-black text-[#FF5A1F]">
              {contest.totalVotes.toLocaleString('fr-FR')}
            </span>
            <span className="block text-xs text-gray-300 font-bold uppercase mt-1">
              Votes enregistrés
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Select Candidate */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <span>Choisissez votre candidat(e)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedCandidates.map((cand, idx) => {
              const pct =
                contest.totalVotes > 0
                  ? Math.round((cand.votesCount / contest.totalVotes) * 100)
                  : 0;
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all space-y-4 ${
                    isSelected
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 dark:bg-sky-500/10 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={cand.photo}
                      alt={cand.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#FF5A1F] text-white text-[10px] font-black">
                          Rang #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          N°{cand.number} • {cand.city}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base mt-1">{cand.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{cand.bio}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span>{cand.votesCount.toLocaleString('fr-FR')} votes</span>
                      <span className="text-[#FF5A1F] dark:text-[#FF5A1F]">{pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-[#FF5A1F] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Vote Pack & Pay */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5 h-fit sticky top-24">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white text-xs font-black flex items-center justify-center">
              2
            </span>
            <span>Sélectionnez un Pack de Votes</span>
          </h2>

          <div className="p-3.5 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] dark:text-sky-300 text-xs font-bold flex items-center justify-between">
            <span>Candidat sélectionné :</span>
            <span className="font-black">{selectedCandidate?.name}</span>
          </div>

          <div className="space-y-2.5">
            {contest.votePacks.map((vp) => {
              const active = selectedPack?.id === vp.id;
              return (
                <div
                  key={vp.id}
                  onClick={() => setSelectedPackId(vp.id)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">{vp.name}</span>
                      {vp.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-black flex items-center gap-0.5">
                          <Flame className="h-3 w-3" /> POPULAIRE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {vp.votes} votes{' '}
                      {vp.bonusVotes > 0 && (
                        <strong className="text-emerald-600 dark:text-[#FF5A1F]">
                          + {vp.bonusVotes} votes BONUS offerts
                        </strong>
                      )}
                    </p>
                  </div>
                  <span className="font-black text-sm text-[#FF5A1F] dark:text-[#FF5A1F]">
                    {vp.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Votre nom de supporter (optionnel)
            </label>
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            />
          </div>

          <button
            type="button"
            onClick={() => setPayOpen(true)}
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-black text-sm shadow-lg cursor-pointer"
          >
            Envoyer +{totalVotesToAdd} Votes ({totalPrice.toLocaleString('fr-FR')} FCFA)
          </button>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={`+${totalVotesToAdd} votes pour ${selectedCandidate?.name}`}
        amount={totalPrice}
        onSuccess={handleVotePayment}
      />
    </div>
  );
}
