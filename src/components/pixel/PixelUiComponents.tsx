'use client';

import React from 'react';
import { retroAudio } from '@/lib/retroAudio';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'emerald' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  onClick,
  onMouseEnter,
  ...props
}: PixelButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[#F59E0B] text-[#0A1128] hover:bg-[#FBBF24] border-2 border-[#78350F] shadow-[3px_3px_0_0_#78350F] active:shadow-none';
      case 'emerald':
        return 'bg-[#059669] text-white hover:bg-[#10B981] border-2 border-[#064E3B] shadow-[3px_3px_0_0_#064E3B] active:shadow-none';
      case 'danger':
        return 'bg-[#DC2626] text-white hover:bg-[#EF4444] border-2 border-[#7F1D1D] shadow-[3px_3px_0_0_#7F1D1D] active:shadow-none';
      case 'ghost':
        return 'bg-[#1E293B]/80 text-[#93C5FD] hover:bg-[#334155] border-2 border-[#475569] shadow-[3px_3px_0_0_#0F172A] active:shadow-none';
      case 'primary':
      default:
        return 'bg-[#1D4ED8] text-white hover:bg-[#2563EB] border-2 border-[#0C2340] shadow-[3px_3px_0_0_#0C2340] active:shadow-none';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] py-1.5 px-3 gap-1.5';
      case 'lg':
        return 'text-xs sm:text-sm py-3.5 px-6 gap-3';
      case 'md':
      default:
        return 'text-xs py-2.5 px-4 gap-2';
    }
  };

  return (
    <button
      onClick={(e) => {
        retroAudio.playSelect();
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        retroAudio.playBlip(550);
        onMouseEnter?.(e);
      }}
      className={`font-pixel uppercase tracking-wider inline-flex items-center justify-center font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer select-none rounded-none pixelated ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

interface PixelBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'navy' | 'gold' | 'dialog';
  title?: string;
  badge?: string;
}

export function PixelBox({
  children,
  className = '',
  variant = 'navy',
  title,
  badge,
}: PixelBoxProps) {
  const getStyles = () => {
    switch (variant) {
      case 'gold':
        return 'bg-[#1E1B18] border-4 border-[#F59E0B] text-[#FEF3C7] shadow-[4px_4px_0_0_#78350F]';
      case 'dark':
        return 'bg-[#0B132B] border-4 border-[#334155] text-slate-100 shadow-[4px_4px_0_0_#020617]';
      case 'dialog':
        return 'bg-[#0D1B2A] border-4 border-[#60A5FA] text-blue-50 shadow-[4px_4px_0_0_#08162E]';
      case 'navy':
      default:
        return 'bg-[#102A56] border-4 border-[#3B82F6] text-white shadow-[4px_4px_0_0_#08162E]';
    }
  };

  return (
    <div className={`relative p-5 sm:p-6 pixelated ${getStyles()} ${className}`}>
      {/* Retro Corner Accents */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

      {(title || badge) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-white/20">
          {title && (
            <h3 className="font-pixel text-xs sm:text-sm text-[#FCD34D] tracking-wide flex items-center gap-2">
              <span className="text-[#38BDF8]">◆</span>
              <span>{title}</span>
            </h3>
          )}
          {badge && (
            <span className="font-pixel text-[9px] bg-white/20 text-[#FEF08A] px-2 py-0.5 border border-white/30">
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function PixelBadge({
  children,
  color = 'blue',
}: {
  children: React.ReactNode;
  color?: 'blue' | 'gold' | 'emerald' | 'purple';
}) {
  const colorMap = {
    blue: 'bg-[#1D4ED8] text-white border-[#93C5FD]',
    gold: 'bg-[#D97706] text-white border-[#FDE68A]',
    emerald: 'bg-[#059669] text-white border-[#A7F3D0]',
    purple: 'bg-[#7C3AED] text-white border-[#DDD6FE]',
  };

  return (
    <span
      className={`font-pixel text-[9px] uppercase tracking-wider px-2.5 py-1 border-2 inline-flex items-center gap-1.5 shadow-[2px_2px_0_0_#000] ${colorMap[color]}`}
    >
      <span className="w-1.5 h-1.5 bg-current" />
      <span>{children}</span>
    </span>
  );
}
