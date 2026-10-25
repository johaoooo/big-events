'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AccessScanPage() {
  const { db, performAction } = useApp();
  const [codeInput, setCodeInput] = useState(db?.tickets[0]?.ticketCode || 'BIG-2026-8841');
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const targetCode = customCode ?? codeInput;
    if (!targetCode.trim()) return;
    const res = await performAction('SCAN_TICKET', { codeOrQr: targetCode });
    setScanResult(res);
  };

  const validCount = (db?.tickets || []).filter((t) => t.status === 'VALID').length;
  const usedCount = (db?.tickets || []).filter((t) => t.status === 'USED').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-[#111827] text-white p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
            Terminal Contrôleur d&apos;Accès
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Scanner &amp; Vérification de Billets QR</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Saisissez ou sélectionnez un code billet (ex: <strong>BIG-2026-8841</strong>) pour
            vérifier son authenticité et enregistrer l&apos;entrée du participant en temps réel.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-3 rounded-2xl bg-white/10 text-center">
            <span className="block text-2xl font-black text-emerald-400">{validCount}</span>
            <span className="text-[11px] text-gray-300">À scanner</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 text-center">
            <span className="block text-2xl font-black text-[#FF5A1F]">{usedCount}</span>
            <span className="text-[11px] text-gray-300">Déjà entrés</span>
          </div>
        </div>
      </div>

      {/* Scanner Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={(e) => handleScan(e)}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] dark:text-[#FF5A1F] flex items-center justify-center">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">Vérifier un Billet ou QR Payload</h2>
              <p className="text-xs text-slate-500">Contrôle instantané anti-doublon</p>
            </div>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Ex: BIG-2026-8841"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg cursor-pointer"
          >
            Scanner et Valider l&apos;Entrée
          </button>

          {/* Quick Test Pills */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-2">
              Billets disponibles pour test rapide :
            </p>
            <div className="flex flex-wrap gap-2">
              {(db?.tickets || []).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setCodeInput(t.ticketCode);
                    handleScan(undefined, t.ticketCode);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF5A1F]/10 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.ticketCode}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      t.status === 'VALID' ? 'bg-emerald-500' : 'bg-[#FF5A1F]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Scan Result Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          {!scanResult ? (
            <div className="text-center space-y-3 py-8 text-slate-400">
              <QrCode className="h-14 w-14 mx-auto opacity-40" />
              <p className="text-sm font-semibold">
                En attente de lecture d&apos;un QR Code ou numéro de billet...
              </p>
            </div>
          ) : scanResult.result === 'VALID' ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 text-center space-y-3">
              <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-black text-emerald-600 dark:text-[#FF5A1F]">
                ACCÈS AUTORISÉ
              </h3>
              <p className="text-xs font-semibold">{scanResult.message}</p>
              {scanResult.ticket && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 text-left text-xs space-y-1">
                  <p>
                    <strong>Participant :</strong> {scanResult.ticket.buyerName}
                  </p>
                  <p>
                    <strong>Catégorie :</strong> {scanResult.ticket.ticketTypeName}
                  </p>
                  <p>
                    <strong>Événement :</strong> {scanResult.ticket.eventTitle}
                  </p>
                </div>
              )}
            </div>
          ) : scanResult.result === 'ALREADY_USED' ? (
            <div className="p-6 rounded-2xl bg-[#FF5A1F]/10 border-2 border-[#FF5A1F] text-center space-y-3">
              <AlertTriangle className="h-14 w-14 text-amber-500 mx-auto" />
              <h3 className="text-xl font-black text-amber-600 dark:text-[#FF5A1F]">
                BILLET DÉJÀ UTILISÉ
              </h3>
              <p className="text-xs font-semibold">{scanResult.message}</p>
              {scanResult.ticket && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 text-left text-xs space-y-1">
                  <p>
                    <strong>Titulaire :</strong> {scanResult.ticket.buyerName}
                  </p>
                  <p>
                    <strong>Code :</strong> {scanResult.ticket.ticketCode}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500 text-center space-y-3">
              <XCircle className="h-14 w-14 text-red-500 mx-auto" />
              <h3 className="text-xl font-black text-red-600">BILLET INVALIDE / INCONNU</h3>
              <p className="text-xs font-semibold">{scanResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
