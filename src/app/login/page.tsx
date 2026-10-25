'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { db, setCurrentUserByEmail } = useApp();
  const [email, setEmail] = useState('koffi@bigevents.bj');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserByEmail(email);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#111827] text-white font-black text-xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="text-2xl font-black">Connexion à BigEvents</h1>
          <p className="text-xs text-slate-500">
            Accédez à vos billets QR, points de fidélité et tableau de bord.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Adresse Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg cursor-pointer"
          >
            Se connecter
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-[#FF5A1F]" />
            <span>Connexion rapide 1-clic (Comptes Démo) :</span>
          </p>
          <div className="space-y-1.5">
            {db?.users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setCurrentUserByEmail(u.email);
                  router.push('/dashboard');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#FF5A1F]/10 text-left text-xs flex items-center justify-between cursor-pointer"
              >
                <span className="font-semibold">{u.name}</span>
                <span className="px-2 py-0.5 rounded bg-[#FF5A1F] text-white text-[10px] font-bold">
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
