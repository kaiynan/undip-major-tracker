'use client';

import React, { useEffect, useState } from 'react';
import { retroAudio } from '@/lib/retroAudio';
import { Sparkles, Brain, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface PixelCalculationTransitionProps {
  onComplete: () => void;
}

const CALCULATION_STEPS = [
  { label: 'Memvalidasi 36 Respons Profil Jawaban', icon: Database, duration: 400 },
  { label: 'Menghitung Vektor Preferensi RIASEC (Bobot 20%)', icon: Brain, duration: 450 },
  { label: 'Memetakan Keselarasan 12 Rumpun Bidang Ilmu (Bobot 35%)', icon: Cpu, duration: 450 },
  { label: 'Menilai Gaya Belajar & Profil Kurikulum Autentik (Bobot 45%)', icon: Sparkles, duration: 450 },
  { label: 'Menghitung Cosine Similarity 65 Program Studi UNDIP', icon: Database, duration: 450 },
  { label: 'Menyusun Peringkat & Peta Eksplorasi Kampus Tembalang', icon: CheckCircle2, duration: 350 },
];

export function PixelCalculationTransition({ onComplete }: PixelCalculationTransitionProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    try {
      retroAudio.playLevelUp();
    } catch {
      // Audio playback best-effort
    }

    let accumulatedTime = 0;
    const timers: NodeJS.Timeout[] = [];

    CALCULATION_STEPS.forEach((step, idx) => {
      accumulatedTime += step.duration;
      const t = setTimeout(() => {
        setCurrentStepIndex(idx);
        try {
          retroAudio.playSelect();
        } catch {
          // best-effort
        }
      }, accumulatedTime);
      timers.push(t);
    });

    const completionTimer = setTimeout(() => {
      onComplete();
    }, accumulatedTime + 400);
    timers.push(completionTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140B07]/95 backdrop-blur-md select-none text-white animate-fade-in">
      <div className="max-w-md w-full bg-[#24130C] rounded-3xl p-6 sm:p-8 border-2 border-[#F59E0B] shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
        {/* Golden-Hour Ambient Radiance */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#EA580C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 font-pixel text-[9px] bg-[#78350F] text-[#FDE68A] px-3 py-1 rounded-full border border-[#F59E0B] mb-5 shadow-[2px_2px_0_0_#451A03]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] animate-spin-slow" />
            <span>ALGORITMA HMIM MULTI-DIMENSI</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#FFFBEB]">
            Menganalisis Kecocokan Minat
          </h2>
          <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
            Menghitung kecocokan 36 respons kuesioner dengan kurikulum dan profil 65 program studi di peringkat Universitas Diponegoro.
          </p>

          {/* Stepped Process Indicator */}
          <div className="my-6 space-y-2.5 text-left">
            {CALCULATION_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#78350F] border-[#F59E0B] text-[#FFFBEB] font-bold shadow-md scale-[1.02]'
                      : isPast
                      ? 'bg-[#190E08]/70 border-[#78350F]/50 text-emerald-300 font-medium'
                      : 'bg-[#190E08]/30 border-transparent text-stone-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-[#F59E0B] text-[#190E08]'
                        : isPast
                        ? 'bg-emerald-900/60 text-emerald-400'
                        : 'bg-stone-800 text-stone-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 truncate">{step.label}</span>
                  {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-[#190E08] h-2 rounded-full overflow-hidden border border-[#78350F] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FDE68A] rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${Math.round(((currentStepIndex + 1) / CALCULATION_STEPS.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
