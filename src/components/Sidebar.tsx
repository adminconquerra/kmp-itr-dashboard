'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Menu, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(href + '/');
}

function Logo() {
  return (
    <div className="flex flex-col">
      <span className="text-[18px] font-bold leading-tight tracking-[-0.02em] text-white">
        KMP
      </span>
      <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-neutral-300">
        ITR Dashboard
      </span>
    </div>
  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-4">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'relative flex h-10 items-center gap-2 rounded-md px-3 text-sm transition',
              active
                ? 'bg-navy-800 text-white'
                : 'text-neutral-300 hover:bg-navy-800 hover:text-white',
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-sm bg-brand-500"
              />
            )}
            <Icon size={16} strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
    <div className="px-4 py-3 text-[11px] text-neutral-400">
      v1.0 · Powered by Conquerra
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop fixed sidebar — md+ */}
      <aside
        className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-navy-900 shadow-[1px_0_0_rgba(0,0,0,0.06)] md:flex"
      >
        <div className="flex h-16 items-center px-4">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavList pathname={pathname} />
        </div>
        <Footer />
      </aside>

      {/* Mobile top bar — < md */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-[60px] items-center justify-between bg-navy-900 px-4 md:hidden">
        <span className="text-[18px] font-bold tracking-[-0.02em] text-white">
          KMP
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="-mr-2 rounded-md p-2 text-white transition hover:bg-navy-800"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-navy-900"
            role="dialog"
            aria-label="Navigation"
          >
            <div className="flex h-16 items-center justify-between pl-4 pr-2">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-2 text-neutral-300 transition hover:bg-navy-800 hover:text-white"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <NavList
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            </div>
            <Footer />
          </aside>
        </div>
      )}
    </>
  );
}
