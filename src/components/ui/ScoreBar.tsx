import React from 'react';

interface ScoreBarProps {
  label: string;
  score: number; // 0-100
  subLabel?: string;
  color?: string; // Tailwind color class or hex
  showPercentage?: boolean;
  isDark?: boolean;
}

export function ScoreBar({
  label,
  score,
  subLabel,
  color = 'bg-[#F59E0B]',
  showPercentage = true,
  isDark = true,
}: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className={`font-medium truncate mr-2 ${isDark ? 'text-amber-100' : 'text-slate-700'}`}>
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {subLabel && (
            <span className={`text-[10px] ${isDark ? 'text-amber-300/70' : 'text-slate-400'}`}>
              {subLabel}
            </span>
          )}
          {showPercentage && (
            <span className={`font-mono font-bold ${isDark ? 'text-[#FDE68A]' : 'text-slate-900'}`}>
              {clampedScore}%
            </span>
          )}
        </div>
      </div>
      <div
        className={`w-full rounded-full h-2 overflow-hidden border ${
          isDark ? 'bg-[#140B07] border-[#78350F]/70' : 'bg-slate-100 border-slate-200/50'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
}
