'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AssistantWidget } from '../assistant/AssistantWidget';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100">
      <Navbar onOpenAssistant={() => setAssistantOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <AssistantWidget open={assistantOpen} setOpen={setAssistantOpen} />
    </div>
  );
}
