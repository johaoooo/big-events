import type { Metadata } from 'next';
import './globals.css';
import { getDb } from '@/lib/store';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'BigEvents — Événements, Concerts, Concours, Lives & Culture au Bénin',
  description:
    'Découvrez et réservez les meilleurs événements au Bénin et en Afrique : concerts, festivals, soirées, concours de votes, maillots officiels, lives HD et boutique BigMarket.'
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = getDb();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <AppProvider initialData={initialData}>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
