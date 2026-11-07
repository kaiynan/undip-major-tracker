'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { retroAudio } from '@/lib/retroAudio';
import { Home, Compass, Trophy, SlidersHorizontal } from 'lucide-react';

const subscribeNoop = () => () => {};

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isComplete, progressPercentage } = useQuestionnaire();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const navItems = [
    {
      label: 'BERANDA',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'QUEST',
      href: '/questionnaire',
      icon: Compass,
      isActive: pathname === '/questionnaire',
      badge:
        mounted && progressPercentage > 0 && progressPercentage < 100
          ? `${progressPercentage}%`
          : null,
    },
    {
      label: 'HASIL',
      href: '/results',
      icon: Trophy,
      isActive: pathname === '/results' || pathname.startsWith('/program/'),
      badge: mounted && isComplete ? 'SIAP' : null,
    },
    {
      label: 'ALGORITMA',
      href: '/admin',
      icon: SlidersHorizontal,
      isActive: pathname === '/admin',
    },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Mobile dan Tablet"
      className="2xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A0E08]/95 backdrop-blur-md border-t-2 border-[#78350F] shadow-[0_-4px_16px_rgba(0,0,0,0.6)] px-2 py-1.5 select-none pixelated"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => retroAudio.playSelect()}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all relative min-h-[48px] ${
                active
                  ? 'text-[#FDE68A] font-bold'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 border transition-all ${
                    active
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#000]'
                      : 'bg-transparent text-amber-200/70 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-2 font-pixel text-[8px] bg-[#DC2626] text-white px-1 py-0.2 border border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`font-pixel text-[8px] mt-1 tracking-tight ${active ? 'text-[#FDE68A]' : 'text-amber-200/70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
