'use client';

import { ReactNode } from 'react';
import Sidebar, { TerritoryProvider } from './Sidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <TerritoryProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#0a0a0f]">
          {children}
        </main>
      </div>
    </TerritoryProvider>
  );
}
