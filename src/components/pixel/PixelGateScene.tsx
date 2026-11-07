'use client';

import React, { useState, useEffect } from 'react';
import { PixelDiponegoroStatue } from './PixelDiponegoroStatue';

interface PixelGateSceneProps {
  scale?: number;
  zoomLevel?: number;
  className?: string;
}

export function PixelGateScene({
  scale = 1,
  zoomLevel = 1,
  className = '',
}: PixelGateSceneProps) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pixelated flex items-center justify-center bg-gradient-to-b from-[#3F1D2C] via-[#832B13] to-[#15803D] ${className}`}
      style={{
        transform: `translate3d(0, 0, 0) scale(${scale * zoomLevel})`,
        WebkitTransform: `translate3d(0, 0, 0) scale(${scale * zoomLevel})`,
        transformOrigin: isPortrait ? '50% 50%' : '50% 55%',
        WebkitTransformOrigin: isPortrait ? '50% 50%' : '50% 55%',
        transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
        WebkitTransition: '-webkit-transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
    >
      <svg
        viewBox={isPortrait ? "165 -250 470 980" : "0 0 800 450"}
        className="w-full h-full object-cover"
        style={{ shapeRendering: 'crispEdges' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Pixel Bricks Pattern (Warm Morning Terracotta) */}
          <pattern id="gate-bricks" width="8" height="4" patternUnits="userSpaceOnUse">
            <rect width="8" height="4" fill="#991B1B" />
            <rect x="0" y="0" width="7" height="2" fill="#B91C1C" />
            <rect x="0" y="2" width="3" height="2" fill="#7F1D1D" />
            <rect x="4" y="2" width="4" height="2" fill="#C2410C" />
          </pattern>

          {/* Road Asphalt Texture */}
          <pattern id="gate-road" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#334155" />
            <rect x="0" y="0" width="2" height="2" fill="#475569" />
            <rect x="2" y="2" width="2" height="2" fill="#1E293B" />
          </pattern>

          {/* Vibrant Morning Grass Dither */}
          <pattern id="gate-grass" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#15803D" />
            <rect x="0" y="0" width="2" height="2" fill="#22C55E" />
            <rect x="2" y="2" width="2" height="2" fill="#16A34A" />
          </pattern>
        </defs>

        {/* 0. EXTENDED SKY & GROUND FOR PORTRAIT MOBILE */}
        <rect x="0" y="-350" width="800" height="350" fill="#2E1220" />
        <rect x="0" y="-180" width="800" height="100" fill="#3F1D2C" />
        <rect x="0" y="-80" width="800" height="80" fill="#5C2323" />
        <polygon points="70,450 730,450 850,850 -50,850" fill="url(#gate-road)" />
        <rect x="392" y="450" width="16" height="400" fill="#FACC15" />

        {/* 1. COHESIVE GOLDEN-HOUR SUNSET SKY GRADIENT (Warm, Rich Pixel Dither Bands) */}
        <rect x="0" y="0" width="800" height="35" fill="#3F1D2C" />
        <rect x="0" y="35" width="800" height="35" fill="#5C2323" />
        <rect x="0" y="70" width="800" height="40" fill="#832B13" />
        <rect x="0" y="110" width="800" height="40" fill="#B44310" />
        <rect x="0" y="150" width="800" height="40" fill="#D97706" />
        <rect x="0" y="190" width="800" height="40" fill="#F59E0B" />
        <rect x="0" y="230" width="800" height="35" fill="#FDE68A" />
        <rect x="0" y="265" width="800" height="30" fill="#FEF08A" />

        {/* Radiant Sunset Sun Over Tembalang Hills */}
        <g>
          {/* Sun Core */}
          <rect x="350" y="125" width="100" height="100" fill="#FEF08A" opacity="0.85" />
          <rect x="365" y="110" width="70" height="130" fill="#FDE047" opacity="0.9" />
          <rect x="380" y="95" width="40" height="160" fill="#FFFFFF" />
          {/* Golden Sunset Light Beams */}
          <polygon points="400,100 280,0 340,0" fill="#FEF08A" opacity="0.25" />
          <polygon points="400,100 460,0 520,0" fill="#FEF08A" opacity="0.25" />
          <polygon points="400,140 0,100 0,160" fill="#FDE047" opacity="0.15" />
          <polygon points="400,140 800,100 800,160" fill="#FDE047" opacity="0.15" />
        </g>

        {/* Pixel Sunset Clouds (Amber & Peach Highlights) */}
        <g fill="#FFFBEB" opacity="0.9">
          {/* Left Cloud */}
          <rect x="50" y="65" width="130" height="18" fill="#FDE68A" />
          <rect x="70" y="55" width="90" height="10" fill="#FEF3C7" />
          <rect x="90" y="48" width="50" height="8" fill="#FFFFFF" />
          <rect x="40" y="75" width="150" height="12" fill="#F59E0B" opacity="0.6" />

          {/* Right Cloud */}
          <rect x="550" y="80" width="160" height="20" fill="#FDE68A" />
          <rect x="580" y="70" width="100" height="10" fill="#FEF3C7" />
          <rect x="600" y="62" width="60" height="8" fill="#FFFFFF" />
          <rect x="530" y="90" width="190" height="14" fill="#F59E0B" opacity="0.6" />
        </g>

        {/* 2. DISTANT SEMARANG HILLS / MOUNT UNGARAN SILHOUETTES (Warm Sunset Atmospherics) */}
        <polygon points="0,265 130,195 280,235 400,185 540,235 700,180 800,215 800,285 0,285" fill="#7C2D12" opacity="0.6" />
        <polygon points="0,270 90,225 210,255 360,220 500,250 640,210 800,240 800,290 0,290" fill="#854D0E" opacity="0.75" />
        <polygon points="0,280 140,245 260,270 420,235 580,265 720,230 800,255 800,300 0,300" fill="#4B5826" />
        <polygon points="0,270 90,225 210,255 360,220 500,250 640,210 800,240 800,290 0,290" fill="#0D9488" opacity="0.7" />
        <polygon points="0,280 140,245 260,270 420,235 580,265 720,230 800,255 800,300 0,300" fill="#15803D" />

        {/* Green Canopy of Campus Forest */}
        <g fill="#166534">
          {Array.from({ length: 28 }).map((_, i) => (
            <rect
              key={`bg-canopy-${i}`}
              x={i * 30 - 10}
              y={255 + (i % 3) * 4}
              width="26"
              height="30"
              fill={i % 2 === 0 ? '#16A34A' : '#15803D'}
            />
          ))}
        </g>

        {/* 3. GROUND / VIBRANT MORNING MEADOW */}
        <rect x="0" y="275" width="800" height="175" fill="url(#gate-grass)" />

        {/* 4. THE CENTRAL ROAD (Perspective Dual-Lane entering Campus) */}
        <polygon points="290,275 510,275 730,450 70,450" fill="url(#gate-road)" />
        {/* Curbs with morning sunlight */}
        <polygon points="284,275 290,275 70,450 62,450" fill="#E2E8F0" />
        <polygon points="510,275 516,275 738,450 730,450" fill="#E2E8F0" />
        {/* Golden Center Line */}
        <rect x="398" y="280" width="4" height="12" fill="#FACC15" />
        <rect x="397" y="305" width="6" height="18" fill="#FACC15" />
        <rect x="396" y="335" width="8" height="26" fill="#FACC15" />
        <rect x="395" y="375" width="10" height="36" fill="#FACC15" />
        <rect x="393" y="425" width="14" height="25" fill="#FACC15" />

        {/* Road Median Island with Flowerbed */}
        <polygon points="386,275 414,275 417,290 383,290" fill="#CBD5E1" />
        <rect x="388" y="277" width="24" height="10" fill="#15803D" />

        {/* ============================================================== */}
        {/* 5. THE PANGERAN DIPONEGORO STATUE (IN THE CENTER OF GATE OPENING) */}
        {/* (Accurate pointing arm, no spear, precisely centered in the opening!) */}
        {/* ============================================================== */}
        <g id="opening-statue" transform="translate(400, 246) scale(0.18) translate(-450, -320)">
          {/* Subtle Golden Morning Aura around Statue */}
          <circle cx="450" cy="240" r="140" fill="#FDE047" opacity="0.3" />
          <PixelDiponegoroStatue lighting="golden" showPedestal={true} />
        </g>

        {/* 6. GERBANG UNDIP TEMBALANG (Iconic Architectural Pylons & Overhead Arch) */}
        
        {/* Left Monumental Red-Brick Tower / Pylon */}
        <g id="gate-left-pylon">
          {/* Pedestal Base */}
          <rect x="175" y="245" width="85" height="45" fill="#450A0A" />
          <rect x="180" y="240" width="75" height="5" fill="#B45309" />
          {/* Main Tower Body */}
          <rect x="185" y="150" width="65" height="95" fill="url(#gate-bricks)" />
          {/* Shadow & Morning Sunlit Edge */}
          <rect x="185" y="150" width="10" height="95" fill="#450A0A" opacity="0.4" />
          <rect x="240" y="150" width="10" height="95" fill="#FDE047" opacity="0.4" />
          {/* Stepped Tiers */}
          <rect x="190" y="135" width="55" height="15" fill="#78350F" />
          <rect x="195" y="120" width="45" height="15" fill="url(#gate-bricks)" />
          <rect x="200" y="110" width="35" height="10" fill="#450A0A" />
          <rect x="208" y="100" width="19" height="10" fill="#FACC15" />
        </g>

        {/* Right Monumental Red-Brick Tower / Pylon */}
        <g id="gate-right-pylon">
          {/* Pedestal Base */}
          <rect x="540" y="245" width="85" height="45" fill="#450A0A" />
          <rect x="545" y="240" width="75" height="5" fill="#B45309" />
          {/* Main Tower Body */}
          <rect x="550" y="150" width="65" height="95" fill="url(#gate-bricks)" />
          {/* Shadow & Morning Sunlit Edge */}
          <rect x="550" y="150" width="10" height="95" fill="#450A0A" opacity="0.4" />
          <rect x="605" y="150" width="10" height="95" fill="#FDE047" opacity="0.4" />
          {/* Stepped Tiers */}
          <rect x="555" y="135" width="55" height="15" fill="#78350F" />
          <rect x="560" y="120" width="45" height="15" fill="url(#gate-bricks)" />
          <rect x="565" y="110" width="35" height="10" fill="#450A0A" />
          <rect x="573" y="100" width="19" height="10" fill="#FACC15" />
        </g>

        {/* The Overhead White Connecting Portal / Bridge Structure */}
        {/* Cross Beams */}
        <rect x="245" y="160" width="310" height="14" fill="#0C2340" />
        <rect x="240" y="155" width="320" height="8" fill="#FFFFFF" />
        <rect x="240" y="148" width="320" height="7" fill="#F8FAFC" />
        {/* Morning Sun Highlight on Arch Rim */}
        <rect x="240" y="148" width="320" height="2" fill="#FDE047" />

        {/* Sweeping Upper Arch Structure */}
        <polygon points="255,148 545,148 505,115 295,115" fill="#FFFFFF" />
        <polygon points="255,148 265,148 300,115 290,115" fill="#E2E8F0" />
        <polygon points="535,148 545,148 510,115 500,115" fill="#CBD5E1" />

        {/* UNDIP Deep Blue Signboard Band */}
        <rect x="275" y="125" width="250" height="24" fill="#0C2340" />
        <rect x="277" y="127" width="246" height="20" fill="#102A56" />
        <rect x="279" y="129" width="242" height="2" fill="#3B82F6" />

        {/* Signage: "UNIVERSITAS DIPONEGORO" (Retro Pixel Typography) */}
        <text
          x="400"
          y="142"
          fontFamily="'Press Start 2P', monospace, sans-serif"
          fontSize="9.5"
          fill="#FFFFFF"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="1"
        >
          UNIVERSITAS DIPONEGORO
        </text>

        {/* University Crest / Emblem atop Arch */}
        <rect x="390" y="98" width="20" height="20" fill="#0C2340" />
        <rect x="392" y="100" width="16" height="16" fill="#F59E0B" />
        <rect x="395" y="103" width="10" height="10" fill="#102A56" />
        <rect x="397" y="105" width="6" height="6" fill="#FDE047" />

        {/* Side Guard Posts & Security Booths */}
        <rect x="135" y="255" width="35" height="32" fill="#FFFFFF" />
        <rect x="133" y="250" width="39" height="5" fill="#1D4ED8" />
        <rect x="140" y="260" width="12" height="12" fill="#7DD3FC" />
        <rect x="155" y="260" width="10" height="27" fill="#475569" />

        <rect x="630" y="255" width="35" height="32" fill="#FFFFFF" />
        <rect x="628" y="250" width="39" height="5" fill="#1D4ED8" />
        <rect x="648" y="260" width="12" height="12" fill="#7DD3FC" />
        <rect x="635" y="260" width="10" height="27" fill="#475569" />

        {/* 7. FRESH TROPICAL PALM TREES & BLOOMING FLOWERBEDS */}
        {/* Left Palms */}
        <g>
          {/* Trunk */}
          <rect x="65" y="210" width="8" height="110" fill="#78350F" />
          <rect x="67" y="210" width="4" height="110" fill="#A16207" />
          {/* Palm Fronds in fresh morning emerald greens */}
          <rect x="35" y="190" width="35" height="10" fill="#15803D" />
          <rect x="20" y="200" width="40" height="12" fill="#16A34A" />
          <rect x="70" y="185" width="45" height="12" fill="#22C55E" />
          <rect x="65" y="170" width="16" height="25" fill="#4ADE80" />
          <rect x="55" y="160" width="28" height="16" fill="#16A34A" />
          <rect x="75" y="198" width="40" height="12" fill="#15803D" />
        </g>

        {/* Right Palms */}
        <g>
          {/* Trunk */}
          <rect x="725" y="210" width="8" height="110" fill="#78350F" />
          <rect x="727" y="210" width="4" height="110" fill="#A16207" />
          {/* Palm Fronds */}
          <rect x="695" y="190" width="35" height="10" fill="#15803D" />
          <rect x="680" y="200" width="40" height="12" fill="#16A34A" />
          <rect x="730" y="185" width="45" height="12" fill="#22C55E" />
          <rect x="725" y="170" width="16" height="25" fill="#4ADE80" />
          <rect x="715" y="160" width="28" height="16" fill="#16A34A" />
          <rect x="735" y="198" width="40" height="12" fill="#15803D" />
        </g>

        {/* Colorful Roadside Flowerbeds (Morning Blossoms) */}
        <g>
          <rect x="85" y="310" width="65" height="8" fill="#DC2626" />
          <rect x="90" y="307" width="55" height="4" fill="#F87171" />
          <rect x="95" y="318" width="75" height="6" fill="#F59E0B" />

          <rect x="650" y="310" width="65" height="8" fill="#DC2626" />
          <rect x="655" y="307" width="55" height="4" fill="#F87171" />
          <rect x="630" y="318" width="75" height="6" fill="#F59E0B" />
        </g>

        {/* Victorian Street Lamps */}
        <g fill="#1E293B">
          <rect x="165" y="240" width="3" height="40" />
          <rect x="161" y="237" width="11" height="3" />
          <rect x="163" y="233" width="7" height="4" fill="#FEF08A" />

          <rect x="632" y="240" width="3" height="40" />
          <rect x="628" y="237" width="11" height="3" />
          <rect x="630" y="233" width="7" height="4" fill="#FEF08A" />
        </g>

        {/* Subtle Pixel Vignette Borders */}
        <rect x="0" y="0" width="800" height="4" fill="#000000" opacity="0.4" />
        <rect x="0" y="446" width="800" height="4" fill="#000000" opacity="0.4" />
        <rect x="0" y="0" width="4" height="450" fill="#000000" opacity="0.4" />
        <rect x="796" y="0" width="4" height="450" fill="#000000" opacity="0.4" />
      </svg>
    </div>
  );
}
