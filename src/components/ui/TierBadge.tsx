import React from 'react';
import { Award, Sparkles, Check, HelpCircle, Minus } from 'lucide-react';

interface TierBadgeProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showHelpText?: boolean;
}

const TIER_CONFIG: Record<
  string,
  {
    badgeClass: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
  }
> = {
  S: {
    badgeClass: 'bg-amber-400 text-stone-950 border-amber-300 font-black shadow-xs',
    label: 'Sangat Cocok',
    icon: Award,
    iconColor: 'text-stone-950',
  },
  A: {
    badgeClass: 'bg-blue-600 text-white border-blue-400 font-bold',
    label: 'Rekomendasi Utama',
    icon: Sparkles,
    iconColor: 'text-blue-100',
  },
  B: {
    badgeClass: 'bg-emerald-600 text-white border-emerald-400 font-bold',
    label: 'Cukup Cocok',
    icon: Check,
    iconColor: 'text-emerald-100',
  },
  C: {
    badgeClass: 'bg-[#78350F] text-[#FDE68A] border-[#F59E0B]/60 font-semibold',
    label: 'Potensi Alternatif',
    icon: HelpCircle,
    iconColor: 'text-amber-300',
  },
  D: {
    badgeClass: 'bg-stone-800 text-stone-300 border-stone-600 font-medium',
    label: 'Eksplorasi Alternatif',
    icon: Minus,
    iconColor: 'text-stone-400',
  },
};

export function TierBadge({ tier, size = 'md', showLabel = true, showHelpText = false }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.D;
  const Icon = config.icon;
  const helpText = tier === 'D' ? 'Bukan berarti tidak bisa — jelajahi alasan dan pilihan lainnya.' : undefined;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-extrabold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span className="inline-flex flex-col">
      <span
        title={helpText}
        className={`inline-flex items-center rounded-lg border transition-all ${config.badgeClass} ${sizeClasses}`}
      >
        <Icon className={`${iconSizes} ${config.iconColor} shrink-0`} />
        <span className="tracking-wide uppercase font-black">Tier {tier}</span>
        {showLabel && (
          <>
            <span className="opacity-40">•</span>
            <span className="font-medium text-[0.9em]">{config.label}</span>
          </>
        )}
      </span>
      {showHelpText && helpText && (
        <span className="text-[10px] text-amber-200/70 italic mt-0.5 max-w-[220px] leading-tight">
          {helpText}
        </span>
      )}
    </span>
  );
}
