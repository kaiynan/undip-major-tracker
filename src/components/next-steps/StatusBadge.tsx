import React from 'react';

export function StatusBadge({ status }: { status: 'official' | 'reference' | 'pending' }) {
  if (status === 'official') {
    return (
      <span className="font-mono text-[10px] text-emerald-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-emerald-900/60 shrink-0">
        Resmi
      </span>
    );
  }
  if (status === 'reference') {
    return (
      <span className="font-mono text-[10px] text-amber-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-amber-800/60 shrink-0">
        Acuan (belum resmi)
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] text-stone-400 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-stone-700/60 shrink-0">
      Perlu verifikasi
    </span>
  );
}
