'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchReasonsBlockProps {
  reasons: string[];
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Renders 2-3 concise, personalized reasons explaining why a program matches the user's profile.
 * Strictly adheres to specifications:
 * - Tone: neutral, encouraging, no career promises or admission chance claims.
 * - Max 2 lines per reason on phones.
 * - Hides completely (returns null) when reasons are empty (no placeholder).
 */
export function MatchReasonsBlock({
  reasons,
  variant = 'compact',
  className = '',
}: MatchReasonsBlockProps) {
  if (!reasons || reasons.length === 0) {
    return null;
  }

  if (variant === 'full') {
    return (
      <div
        className={`bg-[#190E08] p-3.5 sm:p-5 rounded-2xl border border-[#78350F] space-y-2.5 ${className}`}
      >
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-pixel">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Kenapa prodi ini cocok untukmu?</span>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-100/95 leading-relaxed">
          {reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="break-words line-clamp-2">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Compact variant for result card rows and faculty list
  return (
    <div
      className={`mt-2.5 pt-2 border-t border-[#78350F]/50 space-y-1 text-left ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-pixel">
        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
        <span>Kenapa cocok untukmu:</span>
      </div>
      <ul className="space-y-0.5 text-xs text-amber-100/90 leading-snug">
        {reasons.slice(0, 2).map((reason, idx) => (
          <li key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs">
            <span className="text-amber-400 font-bold shrink-0">•</span>
            <span className="break-words line-clamp-2">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
