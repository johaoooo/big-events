'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Trophy,
  Tv,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Moon,
  Ticket,
  Gift,
  Share2,
  LayoutDashboard,
  QrCode,
  Shirt,
  Package,
  ChevronDown,
  Compass,
  Menu
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BigEventsLogo } from './BigEventsLogo';

export function Navbar({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme, cart, currentUser, setCurrentUserByEmail, db } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Only 4 main navigation items for a clean, uncluttered header
  const mainLinks = [
    { href: '/events', label: 'Événements' },
    { href: '/contests', label: 'Concours' },
    { href: '/live', label: 'Directs' },
    { href: '/shop/products', label: 'Boutique' }
  ];

  const menuLinks = [
    { href: '/my-tickets', label: 'Mes billets QR', icon: Ticket },
    { href: '/jerseys', label: 'Maillots personnalisés', icon: Shirt },
    { href: '/packages', label: 'Packages & Séjours', icon: Package },
    { href: '/loyalty', label: 'Programme fidélité', icon: Gift },
    { href: '/affiliation', label: 'Affiliation', icon: Share2 },
    { href: '/access-scan', label: 'Scanner QR (Entrées)', icon: QrCode },
    { href: '/dashboard', label: 'Espace Organisateur', icon: LayoutDashboard }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Minimal Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <BigEventsLogo size={32} />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                big<span className="text-[#FF5A1F]">events</span>
              </span>
            </Link>

            {/* Center: 4 Clean Links with Breathing Room */}
            <nav className="hidden md:flex items-center gap-8">
              {mainLinks.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors py-1 ${
                      active
                        ? 'text-[#FF5A1F] font-semibold'
                        : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Clean Actions (Theme Toggle, Cart, Primary CTA, Account Menu) */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                aria-label="Basculer entre le mode clair et sombre"
                title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                className="p-2 rounded-full text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                href="/shop/cart"
                className="relative p-2 rounded-full text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 min-w-[16px] px-1 rounded-full bg-[#FF5A1F] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard"
                className="hidden sm:inline-flex px-4 py-2 rounded-full bg-[#FF5A1F] hover:bg-[#E04812] text-white text-xs font-semibold transition-colors"
              >
                Organiser
              </Link>

              {/* Single Clean Account & More Dropdown (Airbnb style pill) */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 hover:border-gray-300 bg-white dark:bg-neutral-900 text-gray-700 dark:text-white transition-colors cursor-pointer"
                >
                  <Menu className="h-4 w-4 text-gray-500" />
                  <div className="w-6 h-6 rounded-full bg-[#111827] dark:bg-[#FF5A1F] text-white font-bold flex items-center justify-center text-[11px]">
                    {currentUser ? currentUser.name.charAt(0) : 'U'}
                  </div>
                </button>

                {menuOpen && (
                  <div
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 py-2 z-50"
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-gray-500">{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      {menuLinks.map((s) => {
                        const SIcon = s.icon;
                        return (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800"
                          >
                            <SIcon className="h-4 w-4 text-gray-400" />
                            <span>{s.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 py-1.5 px-4 flex items-center justify-between">
                      <button
                        onClick={toggleTheme}
                        className="text-xs font-medium text-gray-600 dark:text-neutral-300 hover:text-gray-900 flex items-center gap-2 cursor-pointer"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="h-3.5 w-3.5" /> Mode clair
                          </>
                        ) : (
                          <>
                            <Moon className="h-3.5 w-3.5" /> Mode sombre
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenAssistant();
                        }}
                        className="text-xs font-semibold text-[#FF5A1F] hover:underline cursor-pointer"
                      >
                        Aide &amp; Support
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-2 px-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-1 mb-1">
                        Profil actif (Démo)
                      </p>
                      {db?.users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUserByEmail(u.email);
                            setMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                            currentUser?.email === u.email
                              ? 'bg-[#FFF4F0] dark:bg-neutral-800 text-[#FF5A1F] font-semibold'
                              : 'text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[10px] text-gray-400">{u.role}</span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-800 mt-2 pt-2 px-3 flex gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-neutral-700 hover:bg-gray-50"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-center py-1.5 rounded-lg text-xs font-semibold bg-[#111827] text-white"
                      >
                        Inscription
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-around h-14">
          {[
            { href: '/', label: 'Accueil', icon: Compass },
            { href: '/events', label: 'Événements', icon: Calendar },
            { href: '/contests', label: 'Concours', icon: Trophy },
            { href: '/live', label: 'Directs', icon: Tv },
            { href: '/shop/products', label: 'Boutique', icon: ShoppingBag }
          ].map((m) => {
            const MIcon = m.icon;
            const active = m.href === '/' ? pathname === '/' : pathname.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  active ? 'text-[#FF5A1F] font-semibold' : 'text-gray-500 dark:text-neutral-400'
                }`}
              >
                <MIcon className="h-5 w-5" />
                <span className="text-[10px] mt-0.5">{m.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
