'use client';

import React, { useState } from 'react';
import { ShieldCheck, Smartphone, CreditCard, CheckCircle2, X, Loader2 } from 'lucide-react';

export function PaymentModal({
  open,
  onClose,
  title,
  amount,
  onSuccess
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  onSuccess: (provider: string, phone: string) => Promise<void>;
}) {
  const [provider, setProvider] = useState<'KKIAPAY' | 'PAWAPAY' | 'DEMO'>('KKIAPAY');
  const [network, setNetwork] = useState<'MTN MoMo' | 'Moov Money' | 'Celtiis Cash' | 'Carte Visa/Mastercard'>('MTN MoMo');
  const [phone, setPhone] = useState('+229 97 00 11 22');
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await onSuccess(provider, phone);
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
        {/* Flat Solid Header */}
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF5A1F]">
              Paiement Sécurisé
            </span>
            <h3 className="font-bold text-base leading-snug mt-0.5 line-clamp-1">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
              Total à régler
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {amount === 0 ? 'GRATUIT' : `${amount.toLocaleString('fr-FR')} FCFA`}
            </span>
          </div>

          {/* Gateway Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-2">
              Mode de règlement
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['KKIAPAY', 'PAWAPAY', 'DEMO'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    provider === p
                      ? 'border-[#FF5A1F] bg-[#FFF4F0] text-[#FF5A1F] dark:bg-neutral-800'
                      : 'border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-400'
                  }`}
                >
                  {p === 'DEMO' ? 'Démo Instant' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-2">
              Opérateur
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['MTN MoMo', 'Moov Money', 'Celtiis Cash', 'Carte Visa/Mastercard'] as const).map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`p-2.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-colors cursor-pointer ${
                    network === net
                      ? 'border-gray-900 dark:border-white bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300'
                  }`}
                >
                  {net.includes('Carte') ? (
                    <CreditCard className="h-4 w-4 text-[#FF5A1F]" />
                  ) : (
                    <Smartphone className="h-4 w-4 text-[#FF5A1F]" />
                  )}
                  <span className="truncate">{net}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-neutral-300 mb-1.5">
              Numéro de téléphone ({network})
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <button
            type="button"
            disabled={processing}
            onClick={handleConfirm}
            className="w-full py-3 rounded-lg bg-[#FF5A1F] hover:bg-[#E04812] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Validation en cours...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Payer {amount === 0 ? 'Gratuitement' : `${amount.toLocaleString('fr-FR')} FCFA`}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Paiement sécurisé et émission immédiate du billet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
