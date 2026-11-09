'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { isContactReady, buildWaLink } from '@/config/contact';

interface SeradipContactButtonProps {
  message: string;
  label?: string;
  className?: string;
}

export function SeradipContactButton({
  message,
  label = 'Konsultasi dengan SERADIP',
  className = '',
}: SeradipContactButtonProps) {
  if (!isContactReady()) {
    return null;
  }

  const link = buildWaLink(message);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#24130C] hover:bg-[#341A10] text-emerald-400 hover:text-emerald-300 border-2 border-emerald-600/70 hover:border-emerald-500 font-pixel text-[9px] sm:text-[10px] transition-all min-h-[44px] cursor-pointer shadow-[2px_2px_0_0_#000] ${className}`}
      aria-label={`${label} via WhatsApp`}
    >
      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{label}</span>
    </a>
  );
}
