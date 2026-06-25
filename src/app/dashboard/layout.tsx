import type { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      {/*
        Offsets to clear the chrome:
        - md+: 240px sidebar on the left
        - <md: 60px top bar on the top
      */}
      <main className="overflow-x-clip pt-[60px] md:ml-60 md:pt-0">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
