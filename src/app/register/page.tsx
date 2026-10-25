'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { notify, setCurrentUserByEmail } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+229 ');
  const [role, setRole] = useState('USER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserByEmail('koffi@bigevents.bj');
    notify(
      `Bienvenue ${name || 'sur BigEvents'} !`,
      '250 points de fidélité ont été crédités sur votre nouveau compte.',
      'success'
    );
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black">Créer un compte BigEvents</h1>
          <p className="text-xs text-slate-500">
            Recevez 250 points de fidélité dès votre inscription.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Nom complet</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sèna Hounkpatin"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.bj"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Téléphone WhatsApp / MoMo</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Type de profil souhaité</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold"
            >
              <option value="USER">Participant / Festivalier</option>
              <option value="ORGANIZER">Organisateur d&apos;événements</option>
              <option value="SELLER">Marchand BigMarket</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg cursor-pointer"
          >
            S&apos;inscrire gratuitement
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Déjà inscrit ?{' '}
          <Link href="/login" className="font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
