'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Smartphone, CreditCard } from 'lucide-react';
import { BigEventsLogo } from './BigEventsLogo';

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 border-t border-gray-800 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <BigEventsLogo size={34} />
              <span className="text-xl font-bold text-white lowercase">
                big<span className="text-[#FF5A1F]">events</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-5">
              La plateforme de billetterie, de concours de votes, de streaming live et de
              merchandising officiel en Afrique de l&apos;Ouest.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FF5A1F]" />
                <span>Haie Vive, Cotonou, Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#FF5A1F]" />
                <span>+229 96 42 74 34</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FF5A1F]" />
                <span>contact@bigevents.bj</span>
              </div>
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Explorer</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Tous les Événements
                </Link>
              </li>
              <li>
                <Link href="/contests" className="hover:text-white transition-colors">
                  Concours &amp; Votes
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-white transition-colors">
                  Directs Live
                </Link>
              </li>
              <li>
                <Link href="/shop/products" className="hover:text-white transition-colors">
                  Boutique Officielle
                </Link>
              </li>
              <li>
                <Link href="/jerseys" className="hover:text-white transition-colors">
                  Maillots Personnalisés
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  Packages &amp; Séjours
                </Link>
              </li>
            </ul>
          </div>

          {/* Espace Membre */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Espace Membre</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/my-tickets" className="hover:text-white transition-colors">
                  Mes Billets QR
                </Link>
              </li>
              <li>
                <Link href="/shop/track-order" className="hover:text-white transition-colors">
                  Suivi de Commande
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="hover:text-white transition-colors">
                  Programme Fidélité
                </Link>
              </li>
              <li>
                <Link href="/affiliation" className="hover:text-white transition-colors">
                  Affiliation
                </Link>
              </li>
              <li>
                <Link href="/access-scan" className="hover:text-white transition-colors">
                  Scanner d&apos;Accès
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Espace Organisateur
                </Link>
              </li>
            </ul>
          </div>

          {/* Paiements */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Paiements sécurisés</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-4">
              <div className="p-2.5 rounded-lg bg-gray-800 border border-gray-700 flex items-center gap-2 text-white">
                <Smartphone className="h-4 w-4 text-[#FF5A1F]" />
                <span>MTN MoMo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-800 border border-gray-700 flex items-center gap-2 text-white">
                <Smartphone className="h-4 w-4 text-[#FF5A1F]" />
                <span>Moov Money</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-800 border border-gray-700 flex items-center gap-2 text-white">
                <Smartphone className="h-4 w-4 text-[#FF5A1F]" />
                <span>Celtiis Cash</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-800 border border-gray-700 flex items-center gap-2 text-white">
                <CreditCard className="h-4 w-4 text-[#FF5A1F]" />
                <span>Visa / Master</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/80 border border-gray-700 flex items-start gap-2.5 text-xs text-gray-300">
              <ShieldCheck className="h-4 w-4 text-[#FF5A1F] flex-shrink-0 mt-0.5" />
              <span>Transactions protégées et billets QR vérifiés aux entrées.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 bigevents. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link href="/events" className="hover:text-gray-300">
              Conditions
            </Link>
            <Link href="/events" className="hover:text-gray-300">
              Confidentialité
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300">
              Organisateurs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
