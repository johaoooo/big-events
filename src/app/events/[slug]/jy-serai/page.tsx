'use client';

import React, { useState, useRef, use } from 'react';
import Link from 'next/link';
import { Sparkles, Download, Users, ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function JySeraiGeneratorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { db, performAction, notify } = useApp();
  const event = db?.events.find((e) => e.slug === slug || e.id === slug) || db?.events[0];

  const [participantName, setParticipantName] = useState('Koffi Mensah');
  const [roleBadge, setRoleBadge] = useState('FESTIVALIER VIP');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  );
  const [confirmed, setConfirmed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!event) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPoster = async () => {
    await performAction('INCREMENT_JY_SERAI', { eventId: event.id });
    setConfirmed(true);
    notify(
      'Affiche "J’y serai" générée !',
      'Partagez votre visuel officiel sur WhatsApp, Instagram et TikTok.',
      'success'
    );

    // Draw a simple downloadable badge via Canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 800;
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, 800, 800);

        ctx.fillStyle = '#FF5A1F';
        ctx.fillRect(0, 0, 800, 16);

        ctx.fillStyle = '#FF5A1F';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText("J'Y SERAI OFFICIELLEMENT !", 60, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(event.title.slice(0, 36), 60, 150);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '24px sans-serif';
        ctx.fillText(`${event.location} • ${event.city}`, 60, 200);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText(participantName, 60, 660);

        ctx.fillStyle = '#FF5A1F';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(`BADGE : ${roleBadge} • bigevents`, 60, 710);

        const link = document.createElement('a');
        link.download = `jy-serai-${event.slug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href={`/events/${event.slug}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF5A1F]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour à {event.title}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Form Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/15 text-amber-600 dark:text-[#FF5A1F] text-xs font-bold">
            <Sparkles className="h-4 w-4" />
            <span>Campagne Virale &laquo; J&apos;y serai &raquo;</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{event.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Rejoignez les <strong>{event.jySeraiCount} participants</strong> qui ont déjà généré
            leur visuel officiel pour cet événement !
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Votre Nom ou Pseudo</label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Votre Statut sur l&apos;affiche</label>
              <select
                value={roleBadge}
                onChange={(e) => setRoleBadge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              >
                <option value="FESTIVALIER VIP">FESTIVALIER VIP</option>
                <option value="INVITÉ D'HONNEUR">INVITÉ D&apos;HONNEUR</option>
                <option value="AMBASSADEUR OFFICIEL">AMBASSADEUR OFFICIEL</option>
                <option value="TEAM CARRÉ OR">TEAM CARRÉ OR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Votre Photo</label>
              <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#FF5A1F]/40 hover:border-[#FF5A1F] cursor-pointer text-xs font-bold text-[#FF5A1F] dark:text-[#FF5A1F]">
                <Camera className="h-4 w-4" />
                <span>Importer ma photo depuis mon appareil</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <button
              type="button"
              onClick={handleDownloadPoster}
              className="w-full py-3.5 rounded-xl bg-[#111827] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger mon affiche &laquo; J&apos;y serai &raquo;</span>
            </button>

            {confirmed && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Compteur mis à jour : {event.jySeraiCount} participants inscrits !</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Poster Preview */}
        <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl border-4 border-[#FF5A1F] bg-slate-950 flex flex-col justify-between p-6 text-white">
          <img
            src={event.coverImage}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full bg-[#FF5A1F] text-slate-950 font-black text-xs uppercase tracking-wider">
              J&apos;Y SERAI OFFICIELLEMENT !
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md">
              BigEvents.bj
            </span>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center text-center space-y-3">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-[#111827] shadow-2xl">
              <img
                src={avatarUrl}
                alt={participantName}
                className="w-full h-full rounded-full object-cover border-4 border-slate-950"
              />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF5A1F] border border-sky-400/40 text-[11px] font-extrabold uppercase tracking-wider text-gray-300">
              {roleBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{participantName}</h2>
          </div>

          <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#FF5A1F] font-bold uppercase">{event.category}</p>
              <h3 className="font-extrabold text-sm line-clamp-1">{event.title}</h3>
              <p className="text-[11px] text-slate-300">
                {event.location} • {event.city}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#FF5A1F]">
              <Users className="h-4 w-4" />
              <span>{event.jySeraiCount}</span>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
