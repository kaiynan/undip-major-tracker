'use client';

import React from 'react';

export interface BuildingProps {
  className?: string;
  isHighlighted?: boolean;
  scale?: number;
  mode?: 'overview' | 'hero'; // 'overview' for map pin, 'hero' for large zoomed-in display
}

// =============================================================================
// 1. FAKULTAS TEKNIK (FT) — Gedung Dekanat & Skybridge Penghubung
// =============================================================================
export function BuildingFT({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Ground shadow & plaza */}
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        <rect x="40" y="240" width="380" height="20" fill="#3E2012" />
        <rect x="60" y="245" width="340" height="12" fill="#542B18" />

        {/* Left Wing: Departemen Teknik Sipil & Mesin (Multi-tier Terracotta) */}
        <rect x="40" y="80" width="120" height="165" fill="#7F1D1D" />
        <rect x="44" y="84" width="112" height="16" fill="#991B1B" />
        <rect x="40" y="74" width="120" height="10" fill="#450A0A" />
        {/* Left Windows Grid (4 floors) */}
        {[0, 1, 2, 3].map((floor) => (
          <g key={floor} fill="#1E293B">
            <rect x="52" y={105 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="54" y={107 + floor * 32} width="20" height="16" fill="#BAE6FD" />
            <rect x="86" y={105 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="88" y={107 + floor * 32} width="20" height="16" fill="#BAE6FD" />
            <rect x="120" y={105 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="122" y={107 + floor * 32} width="20" height="16" fill="#BAE6FD" />
          </g>
        ))}

        {/* Right Wing: Departemen Arsitektur & Elektro */}
        <rect x="300" y="70" width="120" height="175" fill="#7F1D1D" />
        <rect x="304" y="74" width="112" height="16" fill="#991B1B" />
        <rect x="300" y="64" width="120" height="10" fill="#450A0A" />
        {/* Right Windows Grid */}
        {[0, 1, 2, 3].map((floor) => (
          <g key={floor} fill="#1E293B">
            <rect x="312" y={95 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="314" y={97 + floor * 32} width="20" height="16" fill="#BAE6FD" />
            <rect x="346" y={95 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="348" y={97 + floor * 32} width="20" height="16" fill="#BAE6FD" />
            <rect x="380" y={95 + floor * 32} width="24" height="20" fill="#0284C7" />
            <rect x="382" y={97 + floor * 32} width="20" height="16" fill="#BAE6FD" />
          </g>
        ))}

        {/* Central Hub: Dekanat FT & Iconic Glass Skybridge */}
        <rect x="150" y="50" width="160" height="195" fill="#B45309" />
        <rect x="154" y="54" width="152" height="14" fill="#D97706" />
        <rect x="150" y="42" width="160" height="12" fill="#78350F" />

        {/* The Glass Skybridge Crossing Between Wings */}
        <rect x="156" y="96" width="148" height="48" fill="#0284C7" />
        <rect x="160" y="100" width="40" height="40" fill="#E0F2FE" />
        <rect x="210" y="100" width="40" height="40" fill="#E0F2FE" />
        <rect x="260" y="100" width="40" height="40" fill="#E0F2FE" />
        {/* Steel Cross Truss Bracing */}
        <line x1="160" y1="100" x2="200" y2="140" stroke="#0F172A" strokeWidth="3" />
        <line x1="200" y1="100" x2="160" y2="140" stroke="#0F172A" strokeWidth="3" />
        <line x1="210" y1="100" x2="250" y2="140" stroke="#0F172A" strokeWidth="3" />
        <line x1="250" y1="100" x2="210" y2="140" stroke="#0F172A" strokeWidth="3" />
        <line x1="260" y1="100" x2="300" y2="140" stroke="#0F172A" strokeWidth="3" />
        <line x1="300" y1="100" x2="260" y2="140" stroke="#0F172A" strokeWidth="3" />

        {/* Grand Entrance Atrium & Stairs */}
        <rect x="195" y="175" width="70" height="70" fill="#1E293B" />
        <rect x="202" y="182" width="56" height="63" fill="#F8FAFC" opacity="0.9" />
        <rect x="228" y="182" width="4" height="63" fill="#94A3B8" />
        <rect x="175" y="245" width="110" height="8" fill="#D97706" />

        {/* Monumen Gir Teknik FT on Plaza */}
        <g transform="translate(230, 28)">
          <circle cx="0" cy="0" r="14" fill="#F59E0B" />
          <circle cx="0" cy="0" r="7" fill="#1E293B" />
          <rect x="-3" y="-18" width="6" height="36" fill="#F59E0B" />
          <rect x="-18" y="-3" width="36" height="6" fill="#F59E0B" />
        </g>

        {/* Campus Trees on Flanks */}
        <g transform="translate(18, 200)">
          <rect x="8" y="20" width="6" height="28" fill="#451A03" />
          <circle cx="11" cy="14" r="18" fill="#15803D" />
          <circle cx="11" cy="8" r="12" fill="#22C55E" />
        </g>
        <g transform="translate(425, 195)">
          <rect x="8" y="20" width="6" height="28" fill="#451A03" />
          <circle cx="11" cy="14" r="18" fill="#15803D" />
          <circle cx="11" cy="8" r="12" fill="#22C55E" />
        </g>

        {/* Name Banner */}
        <rect x="120" y="260" width="220" height="26" fill="#190E08" rx="6" stroke="#F59E0B" strokeWidth="2" />
        <text x="230" y="278" fill="#FDE68A" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Dekanat FT UNDIP
        </text>
      </svg>
    );
  }

  // Overview map marker mode
  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="88" width="160" height="12" fill="#1C1917" opacity="0.4" />
      <rect x="16" y="36" width="46" height="54" fill="#991B1B" />
      <rect x="18" y="38" width="42" height="6" fill="#DC2626" />
      <g fill="#1E293B">
        <rect x="22" y="48" width="10" height="8" fill="#38BDF8" />
        <rect x="36" y="48" width="10" height="8" fill="#38BDF8" />
        <rect x="22" y="60" width="10" height="8" fill="#38BDF8" />
        <rect x="36" y="60" width="10" height="8" fill="#38BDF8" />
      </g>
      <rect x="114" y="32" width="52" height="58" fill="#7F1D1D" />
      <rect x="116" y="34" width="48" height="6" fill="#B91C1C" />
      <g fill="#1E293B">
        <rect x="120" y="44" width="12" height="8" fill="#38BDF8" />
        <rect x="136" y="44" width="12" height="8" fill="#38BDF8" />
        <rect x="120" y="56" width="12" height="8" fill="#38BDF8" />
        <rect x="136" y="56" width="12" height="8" fill="#38BDF8" />
      </g>
      <rect x="56" y="24" width="64" height="66" fill="#B45309" />
      <rect x="58" y="26" width="60" height="8" fill="#D97706" />
      <rect x="58" y="42" width="60" height="18" fill="#0284C7" />
      <rect x="62" y="44" width="14" height="14" fill="#BAE6FD" />
      <rect x="80" y="44" width="16" height="14" fill="#BAE6FD" />
      <rect x="100" y="44" width="14" height="14" fill="#BAE6FD" />
      <rect x="74" y="74" width="28" height="16" fill="#1E293B" />
      <rect x="78" y="76" width="20" height="14" fill="#F8FAFC" />
      <circle cx="88" cy="18" r="6" fill="#D97706" />
      <circle cx="88" cy="18" r="3" fill="#1E293B" />
      {isHighlighted && (
        <rect x="12" y="14" width="158" height="84" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 2. FAKULTAS SAINS DAN MATEMATIKA (FSM) — Gedung Acintyacunyata
// =============================================================================
export function BuildingFSM({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        <rect x="30" y="240" width="400" height="20" fill="#334155" />

        {/* Acintyacunyata Science Main Block */}
        <rect x="40" y="60" width="380" height="185" fill="#F1F5F9" />
        <rect x="36" y="48" width="388" height="14" fill="#0284C7" />
        <rect x="46" y="42" width="368" height="8" fill="#38BDF8" />

        {/* 4 Levels of Continuous Laboratory Glass Ribbons */}
        {[0, 1, 2, 3].map((lvl) => (
          <g key={lvl}>
            <rect x="56" y={80 + lvl * 38} width="348" height="22" fill="#0284C7" />
            <rect x="62" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
            <rect x="110" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
            <rect x="158" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
            <rect x="206" y={84 + lvl * 38} width="48" height="14" fill="#BAE6FD" />
            <rect x="262" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
            <rect x="310" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
            <rect x="358" y={84 + lvl * 38} width="40" height="14" fill="#BAE6FD" />
          </g>
        ))}

        {/* Astronomical Observatory Dome on Roof */}
        <circle cx="120" cy="36" r="22" fill="#E2E8F0" />
        <circle cx="120" cy="36" r="14" fill="#0284C7" />
        <rect x="104" y="36" width="32" height="10" fill="#38BDF8" />

        {/* Central Entrance & Scientific Solar Louvre */}
        <rect x="195" y="165" width="70" height="80" fill="#0F172A" />
        <rect x="205" y="175" width="50" height="70" fill="#38BDF8" opacity="0.9" />

        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#38BDF8" strokeWidth="2" />
        <text x="230" y="278" fill="#BAE6FD" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Acintyacunyata FSM
        </text>
      </svg>
    );
  }

  // Overview map marker mode
  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="12" y="86" width="156" height="14" fill="#1C1917" opacity="0.4" />
      <rect x="20" y="30" width="140" height="60" fill="#F1F5F9" />
      <rect x="20" y="26" width="140" height="6" fill="#0284C7" />
      <rect x="24" y="24" width="132" height="4" fill="#38BDF8" />
      <rect x="26" y="38" width="128" height="10" fill="#0284C7" />
      <rect x="26" y="54" width="128" height="10" fill="#0284C7" />
      <g fill="#BAE6FD">
        <rect x="30" y="40" width="16" height="6" />
        <rect x="52" y="40" width="16" height="6" />
        <rect x="74" y="40" width="16" height="6" />
        <rect x="96" y="40" width="16" height="6" />
        <rect x="118" y="40" width="16" height="6" />
      </g>
      <circle cx="50" cy="22" r="10" fill="#E2E8F0" />
      <circle cx="50" cy="22" r="6" fill="#0284C7" />
      <rect x="76" y="68" width="28" height="22" fill="#0F172A" />
      <rect x="80" y="70" width="20" height="18" fill="#38BDF8" opacity="0.9" />
      {isHighlighted && (
        <rect x="16" y="12" width="148" height="82" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 3. FAKULTAS KEDOKTERAN (FK) — Kompleks RSND & Sayap Kedokteran
// =============================================================================
export function BuildingFK({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />

        {/* Hospital Tower (RSND) */}
        <rect x="40" y="40" width="200" height="205" fill="#FFFFFF" />
        <rect x="36" y="30" width="208" height="12" fill="#047857" />
        {/* Medical Cross Sign */}
        <rect x="125" y="48" width="30" height="30" fill="#047857" rx="4" />
        <rect x="135" y="44" width="10" height="38" fill="#FFFFFF" />
        <rect x="121" y="58" width="38" height="10" fill="#FFFFFF" />

        {/* Emergency Drop-Off Canopy */}
        <polygon points="30,195 140,185 140,205 30,215" fill="#047857" />
        <rect x="50" y="210" width="8" height="35" fill="#1E293B" />
        <rect x="110" y="200" width="8" height="45" fill="#1E293B" />

        {/* FK Academic Wing */}
        <rect x="240" y="70" width="180" height="175" fill="#F8FAFC" />
        <rect x="236" y="60" width="188" height="12" fill="#065F46" />
        {[0, 1, 2, 3].map((fl) => (
          <g key={fl} fill="#38BDF8">
            <rect x="256" y={90 + fl * 36} width="28" height="18" fill="#10B981" />
            <rect x="296" y={90 + fl * 36} width="28" height="18" fill="#10B981" />
            <rect x="336" y={90 + fl * 36} width="28" height="18" fill="#10B981" />
            <rect x="376" y={90 + fl * 36} width="28" height="18" fill="#10B981" />
          </g>
        ))}

        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#10B981" strokeWidth="2" />
        <text x="230" y="278" fill="#A7F3D0" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Kompleks FK & RSND UNDIP
        </text>
      </svg>
    );
  }

  // Overview map marker mode
  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="8" y="90" width="164" height="12" fill="#1C1917" opacity="0.4" />
      <rect x="16" y="22" width="80" height="70" fill="#FFFFFF" />
      <rect x="16" y="18" width="80" height="6" fill="#047857" />
      <rect x="50" y="26" width="12" height="12" fill="#047857" />
      <rect x="54" y="24" width="4" height="16" fill="#FFFFFF" />
      <rect x="50" y="30" width="12" height="4" fill="#FFFFFF" />
      <polygon points="12,78 48,74 48,82 12,86" fill="#047857" />
      <rect x="96" y="36" width="68" height="56" fill="#F8FAFC" />
      <rect x="96" y="32" width="68" height="6" fill="#065F46" />
      {isHighlighted && (
        <rect x="12" y="14" width="156" height="84" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 4. FAKULTAS EKONOMIKA DAN BISNIS (FEB) — Hall Pertamina & Dekanat
// =============================================================================
export function BuildingFEB({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />

        {/* Pertamina Hall Copper Dome */}
        <path d="M 150 70 Q 230 18 310 70 Z" fill="#B45309" />
        <rect x="226" y="12" width="8" height="16" fill="#78350F" />
        <circle cx="230" cy="10" r="5" fill="#F59E0B" />

        {/* Main Hall Body (Terracotta) */}
        <rect x="40" y="70" width="380" height="175" fill="#92400E" />
        <rect x="36" y="66" width="388" height="8" fill="#FDE68A" />

        {/* Grand Classical Portico with 6 Tall Columns */}
        <polygon points="120,70 230,36 340,70" fill="#78350F" />
        <rect x="130" y="70" width="200" height="175" fill="#FEF3C7" />
        {[0, 1, 2, 3, 4, 5].map((col) => (
          <rect key={col} x={140 + col * 32} y="74" width="12" height="166" fill="#F59E0B" />
        ))}

        {/* Grand Entry Door */}
        <rect x="210" y="170" width="40" height="75" fill="#451A03" />

        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#F59E0B" strokeWidth="2" />
        <text x="230" y="278" fill="#FDE68A" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Hall Pertamina & Dekanat FEB
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="88" width="160" height="14" fill="#1C1917" opacity="0.4" />
      <path d="M 64 32 Q 90 14 116 32 Z" fill="#B45309" />
      <rect x="20" y="32" width="140" height="58" fill="#92400E" />
      <rect x="52" y="32" width="76" height="58" fill="#FEF3C7" />
      <polygon points="48,32 90,18 132,32" fill="#78350F" />
      <g fill="#D97706">
        <rect x="56" y="36" width="6" height="50" fill="#F59E0B" />
        <rect x="68" y="36" width="6" height="50" fill="#F59E0B" />
        <rect x="80" y="36" width="6" height="50" fill="#F59E0B" />
        <rect x="94" y="36" width="6" height="50" fill="#F59E0B" />
        <rect x="106" y="36" width="6" height="50" fill="#F59E0B" />
        <rect x="118" y="36" width="6" height="50" fill="#F59E0B" />
      </g>
      <rect x="82" y="62" width="16" height="24" fill="#451A03" />
      {isHighlighted && (
        <rect x="14" y="6" width="152" height="90" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 5. FAKULTAS HUKUM (FH) — Gedung Prof. Satjipto Rahardjo
// =============================================================================
export function BuildingFH({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />

        {/* Traditional Judicial Tajuk Roof */}
        <polygon points="140,54 230,16 320,54" fill="#7F1D1D" />
        <polygon points="90,80 230,44 370,80" fill="#991B1B" />
        <rect x="90" y="76" width="280" height="8" fill="#FDE68A" />

        {/* Courthouse Main Building */}
        <rect x="60" y="80" width="340" height="165" fill="#FEF3C7" />
        <rect x="50" y="240" width="360" height="12" fill="#64748B" />

        {/* Colonnade of Justice (Classical Pillars) */}
        {[0, 1, 2, 3, 4, 5, 6].map((p) => (
          <rect key={p} x={80 + p * 44} y="84" width="16" height="156" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
        ))}

        {/* Scales of Justice Symbol on Pediment */}
        <polygon points="215,64 230,52 245,64" fill="#F59E0B" />
        <rect x="228" y="58" width="4" height="14" fill="#F59E0B" />

        {/* Central Entrance */}
        <rect x="205" y="145" width="50" height="95" fill="#451A03" />

        {/* Banner */}
        <rect x="90" y="260" width="280" height="26" fill="#190E08" rx="6" stroke="#EF4444" strokeWidth="2" />
        <text x="230" y="278" fill="#FCA5A5" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Satjipto Rahardjo FH
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="12" y="88" width="156" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="50,28 90,8 130,28" fill="#7F1D1D" />
      <polygon points="36,40 90,24 144,40" fill="#991B1B" />
      <rect x="28" y="40" width="124" height="50" fill="#FEF3C7" />
      <g fill="#F8FAFC">
        <rect x="38" y="42" width="8" height="44" fill="#E2E8F0" />
        <rect x="54" y="42" width="8" height="44" fill="#E2E8F0" />
        <rect x="70" y="42" width="8" height="44" fill="#E2E8F0" />
        <rect x="102" y="42" width="8" height="44" fill="#E2E8F0" />
        <rect x="118" y="42" width="8" height="44" fill="#E2E8F0" />
        <rect x="134" y="42" width="8" height="44" fill="#E2E8F0" />
      </g>
      <rect x="82" y="52" width="16" height="34" fill="#451A03" />
      {isHighlighted && (
        <rect x="18" y="6" width="144" height="90" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 6. FISIP — Gedung Dekanat & Ruang Kuliah Bersama
// =============================================================================
export function BuildingFISIP({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Stepped Terracotta Roofs */}
        <polygon points="50,70 140,36 230,70" fill="#C2410C" />
        <polygon points="210,70 300,36 390,70" fill="#9A3412" />
        {/* Main Walls */}
        <rect x="40" y="70" width="380" height="175" fill="#EA580C" />
        {/* Amphitheater Courtyard */}
        <rect x="170" y="120" width="120" height="125" fill="#FED7AA" />
        <rect x="180" y="160" width="100" height="10" fill="#C2410C" />
        <rect x="190" y="180" width="80" height="10" fill="#C2410C" />
        <rect x="200" y="200" width="60" height="10" fill="#C2410C" />
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#F97316" strokeWidth="2" />
        <text x="230" y="278" fill="#FDBA74" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Dekanat FISIP
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="86" width="160" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="26,36 60,20 94,36" fill="#C2410C" />
      <polygon points="86,36 120,20 154,36" fill="#9A3412" />
      <rect x="20" y="36" width="140" height="52" fill="#EA580C" />
      <rect x="76" y="52" width="28" height="36" fill="#FED7AA" />
      {isHighlighted && (
        <rect x="14" y="16" width="152" height="80" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 7. FAKULTAS ILMU BUDAYA (FIB) — Pendopo Seni & Joglo Tradisional
// =============================================================================
export function BuildingFIB({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Grand Joglo Lambang Gantung */}
        <polygon points="160,50 230,12 300,50" fill="#451A03" />
        <polygon points="80,95 230,44 380,95" fill="#78350F" />
        <rect x="80" y="92" width="300" height="8" fill="#D97706" />
        {/* Teak Wood Structure & Soko Guru */}
        <rect x="90" y="96" width="280" height="150" fill="#FEF3C7" />
        {[0, 1, 2, 3].map((col) => (
          <rect key={col} x={110 + col * 75} y="96" width="16" height="150" fill="#451A03" />
        ))}
        {/* Cultural Stage */}
        <rect x="80" y="235" width="300" height="15" fill="#B45309" />
        <circle cx="210" cy="180" r="14" fill="#F59E0B" />
        <circle cx="245" cy="180" r="10" fill="#F59E0B" />
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#D97706" strokeWidth="2" />
        <text x="230" y="278" fill="#FDE68A" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Pendopo Seni Budaya FIB
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="88" width="160" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="65,22 90,6 115,22" fill="#451A03" />
      <polygon points="35,46 90,20 145,46" fill="#78350F" />
      <rect x="44" y="48" width="92" height="42" fill="#FEF3C7" />
      <rect x="52" y="48" width="6" height="42" fill="#451A03" />
      <rect x="122" y="48" width="6" height="42" fill="#451A03" />
      {isHighlighted && (
        <rect x="14" y="4" width="152" height="92" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 8. FAKULTAS KESEHATAN MASYARAKAT (FKM) — Dekanat & Lab Terpadu
// =============================================================================
export function BuildingFKM({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        <polygon points="60,70 230,30 400,70" fill="#0F766E" />
        <rect x="60" y="66" width="340" height="8" fill="#5EEAD4" />
        <rect x="70" y="74" width="320" height="170" fill="#F0FDFA" />
        {[0, 1, 2].map((fl) => (
          <g key={fl} fill="#0D9488">
            <rect x="90" y={95 + fl * 45} width="50" height="24" />
            <rect x="160" y={95 + fl * 45} width="50" height="24" />
            <rect x="250" y={95 + fl * 45} width="50" height="24" />
            <rect x="320" y={95 + fl * 45} width="50" height="24" />
          </g>
        ))}
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#14B8A6" strokeWidth="2" />
        <text x="230" y="278" fill="#99F6E4" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Dekanat FKM
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="12" y="86" width="156" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="24,34 90,16 156,34" fill="#0F766E" />
      <rect x="28" y="36" width="124" height="52" fill="#F0FDFA" />
      <rect x="84" y="32" width="12" height="56" fill="#115E59" />
      {isHighlighted && (
        <rect x="16" y="12" width="148" height="84" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 9. FPIK (PERIKANAN & ILMU KELAUTAN) — Gedung Bahari & Hatchery
// =============================================================================
export function BuildingFPIK({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Ship-Bow Wave Roof */}
        <path d="M 40 70 Q 230 20 420 70 L 400 84 L 60 84 Z" fill="#0284C7" />
        <rect x="50" y="84" width="360" height="160" fill="#E0F2FE" />
        {/* Porthole Windows */}
        {[0, 1, 2, 3].map((w) => (
          <circle key={w} cx={100 + w * 70} cy="130" r="16" fill="#0284C7" />
        ))}
        {/* Aquaculture Basin */}
        <rect x="80" y="195" width="180" height="40" fill="#0284C7" />
        <rect x="90" y="202" width="160" height="26" fill="#38BDF8" opacity="0.9" />
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#0284C7" strokeWidth="2" />
        <text x="230" y="278" fill="#BAE6FD" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Marine Center FPIK
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="88" width="160" height="14" fill="#1C1917" opacity="0.4" />
      <path d="M 20 38 Q 90 14 160 38 L 152 44 L 28 44 Z" fill="#0284C7" />
      <rect x="28" y="44" width="124" height="44" fill="#E0F2FE" />
      <rect x="38" y="74" width="60" height="14" fill="#0284C7" />
      {isHighlighted && (
        <rect x="12" y="10" width="156" height="88" fill="none" stroke="#0284C7" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 10. FPP (PETERNAKAN & PERTANIAN) — Agro-Kompleks & Greenhouse
// =============================================================================
export function BuildingFPP({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Triple Gable Greenhouse Roof */}
        <polygon points="50,75 100,35 150,75" fill="#4ADE80" opacity="0.8" />
        <polygon points="150,75 200,35 250,75" fill="#4ADE80" opacity="0.8" />
        <polygon points="250,75 330,35 410,75" fill="#15803D" />
        <rect x="50" y="75" width="200" height="170" fill="#DCFCE7" />
        <rect x="250" y="75" width="160" height="170" fill="#166534" />
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#22C55E" strokeWidth="2" />
        <text x="230" y="278" fill="#BBF7D0" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Agro-Kompleks FPP UNDIP
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="86" width="160" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="18,36 38,18 58,36" fill="#4ADE80" opacity="0.8" />
      <polygon points="58,36 78,18 98,36" fill="#4ADE80" opacity="0.8" />
      <polygon points="98,36 122,18 146,36" fill="#15803D" />
      <rect x="20" y="36" width="80" height="52" fill="#DCFCE7" />
      <rect x="98" y="36" width="62" height="52" fill="#166534" />
      {isHighlighted && (
        <rect x="12" y="12" width="154" height="84" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 11. FAKULTAS PSIKOLOGI (FPsi) — Gedung Humanistik & Zen Garden
// =============================================================================
export function BuildingFPsi({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        <polygon points="70,70 230,40 390,70" fill="#9A3412" />
        <rect x="70" y="66" width="320" height="8" fill="#FDBA74" />
        <rect x="80" y="74" width="300" height="170" fill="#FFEDD5" />
        {/* Inner Zen Garden */}
        <rect x="270" y="125" width="90" height="110" fill="#EA580C" opacity="0.3" rx="8" />
        <circle cx="315" cy="170" r="24" fill="#16A34A" />
        {/* Banner */}
        <rect x="110" y="260" width="240" height="26" fill="#190E08" rx="6" stroke="#EA580C" strokeWidth="2" />
        <text x="230" y="278" fill="#FED7AA" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Dekanat FPsi
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="12" y="86" width="156" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="30,30 90,18 150,30" fill="#9A3412" />
      <rect x="32" y="32" width="116" height="54" fill="#FFEDD5" />
      {isHighlighted && (
        <rect x="16" y="12" width="148" height="84" fill="none" stroke="#EA580C" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 12. SEKOLAH VOKASI (SV) — Menara Vokasi & Teaching Factory
// =============================================================================
export function BuildingSV({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Menara Vokasi High-Rise Tower */}
        <rect x="50" y="20" width="180" height="225" fill="#1E3A8A" />
        <rect x="46" y="14" width="188" height="10" fill="#60A5FA" />
        <rect x="136" y="2" width="8" height="16" fill="#94A3B8" />
        {/* Glass Grid */}
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row} fill="#93C5FD">
            <rect x="68" y={35 + row * 38} width="36" height="22" />
            <rect x="122" y={35 + row * 38} width="36" height="22" />
            <rect x="176" y={35 + row * 38} width="36" height="22" />
          </g>
        ))}
        {/* Teaching Factory Workshop Bay */}
        <polygon points="230,105 315,75 400,105" fill="#2563EB" />
        <rect x="235" y="105" width="165" height="140" fill="#CBD5E1" />
        <rect x="260" y="150" width="50" height="95" fill="#334155" />
        <rect x="330" y="150" width="50" height="95" fill="#334155" />
        {/* Banner */}
        <rect x="90" y="260" width="280" height="26" fill="#190E08" rx="6" stroke="#2563EB" strokeWidth="2" />
        <text x="230" y="278" fill="#BFDBFE" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Menara Vokasi & Teaching Factory SV
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="12" y="90" width="156" height="14" fill="#1C1917" opacity="0.4" />
      <rect x="24" y="12" width="68" height="80" fill="#1E3A8A" />
      <polygon points="92,42 124,30 156,42" fill="#2563EB" />
      <rect x="94" y="42" width="62" height="50" fill="#CBD5E1" />
      {isHighlighted && (
        <rect x="14" y="4" width="152" height="96" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// 13. GEDUNG REKTORAT & WIDYA PURAYA (CENTRAL CORE)
// =============================================================================
export function BuildingRektorat({ className = '', isHighlighted = false, mode = 'overview' }: BuildingProps) {
  if (mode === 'hero') {
    return (
      <svg
        viewBox="0 0 460 300"
        className={`w-full max-w-xl h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${className}`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="20" y="250" width="420" height="30" fill="#1C1917" opacity="0.5" />
        {/* Top Tajuk Peak */}
        <polygon points="215,16 230,4 245,16 238,30 222,30" fill="#F59E0B" />
        <polygon points="180,50 230,26 280,50" fill="#451A03" />
        {/* Tier 2 */}
        <polygon points="130,85 230,48 330,85" fill="#78350F" />
        <rect x="130" y="81" width="200" height="8" fill="#F59E0B" />
        {/* Tier 3 */}
        <polygon points="70,128 230,80 390,128" fill="#9A3412" />
        <rect x="70" y="124" width="320" height="8" fill="#FDE68A" />
        {/* Main Body */}
        <rect x="95" y="128" width="270" height="100" fill="#FEF3C7" />
        {/* Columns */}
        {[0, 1, 2, 3].map((c) => (
          <rect key={c} x={120 + c * 65} y="136" width="18" height="88" fill="#451A03" />
        ))}
        {/* Grand Steps */}
        <rect x="60" y="228" width="340" height="12" fill="#E2E8F0" />
        <rect x="80" y="240" width="300" height="10" fill="#CBD5E1" />
        {/* Banner */}
        <rect x="90" y="260" width="280" height="26" fill="#190E08" rx="6" stroke="#F59E0B" strokeWidth="2" />
        <text x="230" y="278" fill="#FDE68A" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Gedung Rektorat & Widya Puraya
        </text>
      </svg>
    );
  }

  return (
    <g className={className} style={{ shapeRendering: 'crispEdges' }}>
      <rect x="10" y="90" width="180" height="14" fill="#1C1917" opacity="0.4" />
      <polygon points="76,22 100,10 124,22" fill="#451A03" />
      <polygon points="56,36 100,18 144,36" fill="#78350F" />
      <polygon points="32,54 100,32 168,54" fill="#9A3412" />
      <rect x="44" y="54" width="112" height="40" fill="#FEF3C7" />
      <rect x="90" y="64" width="20" height="30" fill="#1E3A8A" />
      <circle cx="100" cy="58" r="4" fill="#F59E0B" />
      {isHighlighted && (
        <rect x="24" y="2" width="152" height="98" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
      )}
    </g>
  );
}

// =============================================================================
// Universal Building Lookup Component
// =============================================================================
export function FacultyBuildingIllustration({
  facultyId,
  isHighlighted = false,
  className = '',
  mode = 'overview',
}: {
  facultyId: string;
  isHighlighted?: boolean;
  className?: string;
  mode?: 'overview' | 'hero';
}) {
  switch (facultyId.toLowerCase()) {
    case 'ft':
      return <BuildingFT isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fsm':
      return <BuildingFSM isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fk':
      return <BuildingFK isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'feb':
      return <BuildingFEB isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fh':
      return <BuildingFH isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fisip':
      return <BuildingFISIP isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fib':
      return <BuildingFIB isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fkm':
      return <BuildingFKM isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fpik':
      return <BuildingFPIK isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fpp':
      return <BuildingFPP isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'fpsi':
      return <BuildingFPsi isHighlighted={isHighlighted} className={className} mode={mode} />;
    case 'sv':
      return <BuildingSV isHighlighted={isHighlighted} className={className} mode={mode} />;
    default:
      return <BuildingRektorat isHighlighted={isHighlighted} className={className} mode={mode} />;
  }
}
