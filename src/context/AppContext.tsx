'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { DatabaseSchema, UserRecord } from '@/lib/store';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  type: 'PRODUCT' | 'JERSEY' | 'PACKAGE';
  meta?: Record<string, string>;
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextValue {
  db: DatabaseSchema | null;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: 'FR' | 'EN';
  setLang: (l: 'FR' | 'EN') => void;
  currentUser: UserRecord | null;
  setCurrentUserByEmail: (email: string) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  performAction: (action: string, payload: Record<string, unknown>) => Promise<any>;
  refreshDb: () => Promise<void>;
  notify: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData: DatabaseSchema;
}) {
  const [db, setDb] = useState<DatabaseSchema>(initialData);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLangState] = useState<'FR' | 'EN'>('FR');
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(initialData.users[0] || null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('bigevents_theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
      const savedLang = localStorage.getItem('bigevents_language') as 'FR' | 'EN' | null;
      if (savedLang === 'FR' || savedLang === 'EN') {
        setLangState(savedLang);
      }
      const savedCart = localStorage.getItem('bigevents_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedUserEmail = localStorage.getItem('bigevents_user_email');
      if (savedUserEmail && initialData.users) {
        const found = initialData.users.find((u) => u.email === savedUserEmail);
        if (found) setCurrentUser(found);
      }
    } catch {
      // ignore storage errors
    }
  }, [initialData.users]);

  const notify = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('bigevents_theme', next);
    } catch {}
  };

  const setLang = (l: 'FR' | 'EN') => {
    setLangState(l);
    try {
      localStorage.setItem('bigevents_language', l);
    } catch {}
  };

  const setCurrentUserByEmail = (email: string) => {
    const found = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem('bigevents_user_email', found.email);
      } catch {}
      notify(`Connecté en tant que ${found.name}`, `Rôle actif : ${found.role}`, 'info');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bigevents_user_email');
    } catch {}
    notify('Déconnexion réussie', 'À très bientôt sur BigEvents !', 'info');
  };

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    try {
      localStorage.setItem('bigevents_cart', JSON.stringify(next));
    } catch {}
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const next = existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { ...item, quantity: qty }];
      try {
        localStorage.setItem('bigevents_cart', JSON.stringify(next));
      } catch {}
      return next;
    });
    notify('Ajouté au panier BigMarket', item.title, 'success');
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((i) => i.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => saveCart([]);

  const refreshDb = async () => {
    try {
      const res = await fetch('/api/v1/state', { cache: 'no-store' });
      if (res.ok) {
        const nextDb = await res.json();
        setDb(nextDb);
        if (currentUser) {
          const updatedUser = nextDb.users.find((u: UserRecord) => u.email === currentUser.email);
          if (updatedUser) setCurrentUser(updatedUser);
        }
      }
    } catch {}
  };

  const performAction = async (action: string, payload: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const data = await res.json();
      if (data.db) {
        setDb(data.db);
        if (currentUser) {
          const updatedUser = data.db.users.find((u: UserRecord) => u.email === currentUser.email);
          if (updatedUser) setCurrentUser(updatedUser);
        }
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        db,
        loading,
        theme,
        toggleTheme,
        lang,
        setLang,
        currentUser,
        setCurrentUserByEmail,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        performAction,
        refreshDb,
        notify
      }}
    >
      {children}
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 ${
              t.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-white'
                : t.type === 'info'
                ? 'bg-[#FF5A1F]/95 border-blue-400/40 text-white'
                : 'bg-emerald-950/95 border-emerald-400/40 text-white'
            }`}
          >
            <p className="font-bold text-sm">{t.title}</p>
            {t.description && <p className="text-xs text-white/80 mt-0.5">{t.description}</p>}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
