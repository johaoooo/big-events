'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function AssistantWidget({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { db } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Bonjour ! Comment puis-je vous aider à trouver un événement, un concours ou une commande sur bigevents ?'
    }
  ]);

  const handleSend = (customQuery?: string) => {
    const q = (customQuery ?? input).trim();
    if (!q) return;
    setInput('');
    const lower = q.toLowerCase();

    let reply =
      'Vous pouvez réserver vos billets, voter aux concours ou commander sur la boutique par Mobile Money (MTN, Moov, Celtiis) ou carte bancaire.';

    if (
      lower.includes('concert') ||
      lower.includes('festival') ||
      lower.includes('événement') ||
      lower.includes('evenement')
    ) {
      const titles = db?.events
        .filter((e) => e.status === 'PUBLISHED')
        .slice(0, 3)
        .map((e) => `• ${e.title} (${e.city})`)
        .join('\n');
      reply = `Voici les événements à venir :\n${titles}`;
    } else if (lower.includes('vote') || lower.includes('concours')) {
      reply =
        "Deux concours sont en cours dans l'onglet 'Concours & Votes' : Miss Campus & Leadership Bénin 2026 et Bénin Urban Music Awards.";
    } else if (lower.includes('maillot') || lower.includes('boutique')) {
      reply =
        'Rendez-vous dans les onglets Boutique et Maillots pour commander vos articles officiels (code promo : BENIN229).';
    }

    setMessages((prev) => [...prev, { sender: 'user', text: q }, { sender: 'bot', text: reply }]);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[9995] w-[92vw] max-w-sm rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col max-h-[480px]">
      <div className="bg-[#111827] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF5A1F] text-white flex items-center justify-center">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Aide &amp; Support bigevents</h4>
            <p className="text-[11px] text-gray-400">Réponse instantanée</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMessages([{ sender: 'bot', text: 'Comment puis-je vous aider ?' }])
            }
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-300"
            title="Réinitialiser"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-300"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs max-h-72">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#FF5A1F] text-white'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-100'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-gray-100 dark:border-neutral-800">
        {['Prochains événements', 'Concours & Votes', 'Maillots'].map((sug) => (
          <button
            key={sug}
            onClick={() => handleSend(sug)}
            className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 text-[11px] font-medium whitespace-nowrap hover:bg-gray-200 cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Écrivez votre message..."
          className="flex-1 text-xs bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5A1F]"
        />
        <button
          onClick={() => handleSend()}
          className="p-2 rounded-lg bg-[#FF5A1F] text-white hover:bg-[#E04812] cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
