'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Radio, Users, Send, Lock, Unlock, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function LiveWatchRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { db, performAction, notify } = useApp();
  const live = db?.liveEvents.find((l) => l.slug === slug || l.id === slug) || db?.liveEvents[0];

  const [unlocked, setUnlocked] = useState(true);
  const [accessInput, setAccessInput] = useState('LIVE-GANVIE-2026');
  const [payOpen, setPayOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Clarisse A.', text: 'Le son depuis Ganvié est incroyable 🔥🇧🇯' },
    { user: 'Morel K.', text: 'On suit le direct depuis Paris en 4K !' },
    { user: 'Sèna H.', text: 'Bravo à toute la régie BigEvents Live !' }
  ]);

  if (!live) return null;

  const handleBuyLiveAccess = async (_provider: string, phone: string) => {
    const res = await performAction('BUY_LIVE_ACCESS', {
      liveEventId: live.id,
      buyerName: 'Spectateur VIP',
      buyerPhone: phone
    });
    if (res?.ok) {
      setAccessInput(res.liveTicket.accessCode);
      setUnlocked(true);
      notify('Accès Live Débloqué !', `Code : ${res.liveTicket.accessCode}`, 'success');
    }
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { user: 'Vous (VIP)', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/live"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF5A1F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux Lives</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LIVEKIT ROOM : {live.roomName}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#FF5A1F]" />
            {live.viewerCount} en ligne
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Stream Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-video shadow-2xl border border-slate-800">
            {unlocked ? (
              <video
                src={live.streamUrl}
                poster={live.coverImage}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-950/90 space-y-4">
                <Lock className="h-12 w-12 text-[#FF5A1F]" />
                <h2 className="text-xl font-black">Flux Pay-Per-View Protégé</h2>
                <p className="text-xs text-slate-300 max-w-md">
                  Entrez votre code d&apos;accès Live ou débloquez un ticket instantané ({live.price} FCFA).
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={accessInput}
                    onChange={(e) => setAccessInput(e.target.value)}
                    placeholder="Ex: LIVE-GANVIE-2026"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono"
                  />
                  <button
                    onClick={() => setUnlocked(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Valider le code
                  </button>
                  <button
                    onClick={() => setPayOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-slate-950 text-xs font-black"
                  >
                    Acheter un Pass
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">
                {live.artistOrHost}
              </span>
              <h1 className="text-xl font-black mt-0.5">{live.title}</h1>
              <p className="text-xs text-slate-500 mt-1">{live.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUnlocked(!unlocked)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {unlocked ? <Unlock className="h-4 w-4 text-emerald-500" /> : <Lock className="h-4 w-4" />}
                <span>{unlocked ? 'Salle Déverrouillée' : 'Verrouiller (Test)'}</span>
              </button>
              <button
                onClick={() => setPayOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
              >
                Offrir un Pass Live
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat Sidebar */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col h-[480px] shadow-md overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500" />
              <span>Chat en Direct</span>
            </h3>
            <span className="text-[11px] text-emerald-500 font-bold">Connecté</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">{m.user} : </span>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <form
            onSubmit={sendChat}
            className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Envoyer un message dans le direct..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#FF5A1F] text-white hover:opacity-95 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={`Pass Live HD — ${live.title}`}
        amount={live.price}
        onSuccess={handleBuyLiveAccess}
      />
    </div>
  );
}
