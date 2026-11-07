'use client';

import React from 'react';

interface PixelDiponegoroStatueProps {
  className?: string;
  lighting?: 'golden' | 'twilight';
  showPedestal?: boolean;
}

/**
 * Pangeran Diponegoro Equestrian Statue (Universitas Diponegoro - Widya Puraya)
 * Full-white stone monument appearance with subtle ivory/light-gray pixel shading,
 * soft golden-hour highlights, and structurally connected anatomy.
 * Right hand points forward (no spear/weapon).
 */
export function PixelDiponegoroStatue({
  className = '',
  lighting = 'golden',
  showPedestal = true,
}: PixelDiponegoroStatueProps) {
  // Unified Full-White Stone Monument Palette
  // Pure highlights, warm ivory golden-hour rim, light grays, medium slate shadows for form depth
  const stoneWhite = '#FFFFFF';
  const stoneIvory = '#FFFBEB';
  const stoneLight = '#F8FAFC';
  const stoneMid = '#E2E8F0';
  const stoneShade = '#CBD5E1';
  const stoneDarkShade = '#94A3B8';
  const stoneCrevice = '#64748B';

  // Golden-hour sunset specular rim & ambient reflection
  const goldenRim = '#FEF3C7';
  const goldenHighlight = '#FDE68A';
  const goldenGlow = '#F59E0B';

  return (
    <g className={`pixel-diponegoro-statue ${className}`}>
      {/* ============================================================== */}
      {/* 1. MONUMENTAL MULTI-TIERED WHITE & GRANITE PEDESTAL */}
      {/* ============================================================== */}
      {showPedestal && (
        <g id="pedestal">
          {/* Ground Contact Foundation Shadow */}
          <rect x="270" y="488" width="360" height="12" fill="#1C1917" opacity="0.6" />

          {/* Stepped Base Tier 1 (Lowest Plinth) */}
          <polygon points="290,488 610,488 595,472 305,472" fill="#475569" />
          <polygon points="305,472 595,472 590,470 310,470" fill={stoneShade} />
          <rect x="290" y="484" width="320" height="4" fill="#334155" />

          {/* Stepped Base Tier 2 (Middle Tier) */}
          <polygon points="318,470 582,470 570,446 330,446" fill="#64748B" />
          <polygon points="330,446 570,446 565,444 335,444" fill={stoneMid} />
          <rect x="318" y="466" width="264" height="4" fill="#475569" />

          {/* Main Monument Plinth Shaft (White/Light Granite) */}
          <rect x="350" y="340" width="200" height="104" fill={stoneLight} />
          {/* Front face shadow & golden-hour sunlit corner */}
          <rect x="350" y="340" width="24" height="104" fill={stoneShade} opacity="0.5" />
          <rect x="526" y="340" width="24" height="104" fill={goldenHighlight} opacity="0.35" />
          <line x1="350" y1="340" x2="350" y2="444" stroke={stoneDarkShade} strokeWidth="2" />
          <line x1="550" y1="340" x2="550" y2="444" stroke={goldenRim} strokeWidth="2" />

          {/* Top Cornice Molding & Cap */}
          <rect x="336" y="334" width="228" height="6" fill={stoneShade} />
          <rect x="330" y="328" width="240" height="6" fill={stoneWhite} />
          {/* Sunset golden-hour top rim line on plinth cap */}
          <rect x="330" y="328" width="240" height="2" fill={goldenHighlight} />

          {/* Commemorative Dedication Plaque (Polished Bronze/Gold with Navy Center) */}
          <rect x="375" y="362" width="150" height="52" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <rect x="379" y="366" width="142" height="44" fill="#0F172A" />
          <rect x="382" y="369" width="136" height="1" fill="#FDE68A" />
          <text
            x="450"
            y="384"
            fontFamily="'Press Start 2P', monospace"
            fontSize="6.5"
            fill="#FDE68A"
            textAnchor="middle"
            fontWeight="bold"
          >
            PANGERAN DIPONEGORO
          </text>
          <text
            x="450"
            y="397"
            fontFamily="'Press Start 2P', monospace"
            fontSize="5"
            fill="#F8FAFC"
            textAnchor="middle"
          >
            UNIVERSITAS DIPONEGORO
          </text>
          <text
            x="450"
            y="406"
            fontFamily="'Press Start 2P', monospace"
            fontSize="4.2"
            fill="#CBD5E1"
            textAnchor="middle"
          >
            WIDYA PURAYA - TEMBALANG
          </text>
        </g>
      )}

      {/* ============================================================== */}
      {/* 2. THE EQUESTRIAN STATUE (FULL-WHITE MONUMENT AS ONE SOLID STRUCTURE) */}
      {/* ============================================================== */}
      <g id="full-white-monument">
        {/* --- A. HORSE HIND LEGS & ANCHOR TO PEDESTAL --- */}
        {/* Far Rear Leg (fully connected into flank and pedestal) */}
        <polygon points="388,290 412,285 408,330 384,330" fill={stoneDarkShade} />
        <rect x="382" y="326" width="26" height="4" fill={stoneCrevice} />

        {/* Near Rear Leg (powerful muscular hock planted on plinth) */}
        <polygon points="418,275 452,270 442,330 412,330" fill={stoneShade} />
        <polygon points="428,275 452,270 442,330 422,330" fill={stoneLight} />
        <polygon points="440,272 452,270 442,330 435,330" fill={stoneWhite} />
        {/* Hock joint & hoof */}
        <rect x="412" y="324" width="30" height="6" fill={stoneShade} />
        <rect x="424" y="324" width="18" height="6" fill={stoneWhite} />

        {/* --- B. HORSE DYNAMIC BILLOWING TAIL (Continuous stone sculpture) --- */}
        <polygon points="355,250 380,245 372,320 338,300" fill={stoneShade} />
        <polygon points="360,250 376,247 368,318 348,295" fill={stoneMid} />
        <polygon points="345,275 365,262 355,330 326,305" fill={stoneLight} />
        <polygon points="338,285 352,275 346,325 328,310" fill={stoneWhite} />
        {/* Golden-hour rim light on crest of tail */}
        <polygon points="355,250 370,246 365,260 350,265" fill={goldenHighlight} opacity="0.8" />

        {/* --- C. HORSE TORSO, FLANK, AND BELLY (Seamlessly supporting Rider) --- */}
        <polygon points="365,248 450,238 468,288 375,296" fill={stoneMid} />
        <polygon points="370,248 442,240 458,282 380,290" fill={stoneLight} />
        <polygon points="380,250 435,242 448,278 390,285" fill={stoneWhite} />

        {/* Horse Ribcage & Muscular Chest */}
        <polygon points="420,235 528,210 548,260 442,285" fill={stoneMid} />
        <polygon points="430,238 520,215 538,255 448,278" fill={stoneLight} />
        <polygon points="445,240 512,218 528,250 460,270" fill={stoneWhite} />

        {/* Sculpted Stone Saddle & Blanket (Integrated monument relief in white stone) */}
        <polygon points="420,234 478,228 472,268 416,262" fill={stoneShade} />
        <polygon points="424,236 474,230 468,264 420,258" fill={stoneMid} />
        <polygon points="428,238 470,232 464,260 424,256" fill={stoneLight} />
        <rect x="444" y="232" width="6" height="36" fill={stoneShade} />

        {/* --- D. HORSE FRONT REARING LEGS (Rising skyward in monumental pose) --- */}
        {/* Far Front Leg (raised, angled) */}
        <polygon points="485,225 525,168 545,178 505,235" fill={stoneDarkShade} />
        <polygon points="525,168 560,182 554,198 520,185" fill={stoneShade} />
        <rect x="552" y="182" width="14" height="14" fill={stoneMid} />

        {/* Near Front Leg (highest elevation, powerful bend, fully attached) */}
        <polygon points="502,232 546,186 566,196 522,248" fill={stoneShade} />
        <polygon points="510,228 546,186 558,192 526,242" fill={stoneMid} />
        <polygon points="518,225 548,186 556,190 530,238" fill={stoneLight} />
        {/* Lower Leg & Forearm reaching forward */}
        <polygon points="546,186 585,202 580,218 542,202" fill={stoneLight} />
        <polygon points="552,188 584,202 581,212 550,198" fill={stoneWhite} />
        <polygon points="556,188 584,202 582,206 554,192" fill={goldenRim} />
        <rect x="578" y="202" width="14" height="12" fill={stoneShade} />
        <rect x="580" y="204" width="10" height="8" fill={stoneLight} />

        {/* --- E. HORSE ARCHED NECK & SCULPTED MANE --- */}
        <polygon points="488,222 542,142 582,168 530,235" fill={stoneShade} />
        <polygon points="496,218 542,148 572,172 534,226" fill={stoneMid} />
        <polygon points="508,212 542,154 566,176 538,218" fill={stoneLight} />
        {/* Sunset golden-hour rim light along horse's muscular neck crest */}
        <polygon points="538,142 546,142 582,168 576,168" fill={goldenHighlight} />

        {/* Sculpted Stone Mane (Folds of wind-blown mane) */}
        <polygon points="508,178 478,198 528,148" fill={stoneDarkShade} />
        <polygon points="522,158 492,178 538,133" fill={stoneShade} />
        <polygon points="538,142 512,162 552,128" fill={stoneMid} />
        <polygon points="542,138 520,156 552,128" fill={stoneLight} />

        {/* --- F. HORSE HEAD, MUZZLE & EARS --- */}
        <polygon points="540,142 602,156 618,182 575,178" fill={stoneMid} />
        <polygon points="575,155 625,166 618,190 578,182" fill={stoneLight} />
        <polygon points="585,158 624,166 620,185 585,178" fill={stoneWhite} />
        {/* Muzzle and sculpted nostrils */}
        <rect x="618" y="174" width="7" height="6" fill={stoneDarkShade} />
        <rect x="620" y="175" width="4" height="4" fill={stoneCrevice} />

        {/* Horse Alert Ears */}
        <polygon points="548,132 558,112 566,135" fill={stoneShade} />
        <polygon points="552,132 559,114 564,134" fill={stoneLight} />
        <polygon points="560,135 570,118 576,137" fill={stoneMid} />
        <polygon points="562,135 570,120 574,136" fill={stoneWhite} />
        {/* Subtle stone eye indentation */}
        <rect x="584" y="155" width="5" height="5" fill={stoneDarkShade} />
        <rect x="585" y="156" width="3" height="3" fill={stoneCrevice} />
        <rect x="585" y="155" width="2" height="1" fill={goldenHighlight} />

        {/* Sculpted Stone Bridle & Reins (Solid white monument feature with soft shading) */}
        <polygon points="562,142 615,172 611,177 558,147" fill={stoneShade} />
        <polygon points="564,144 614,172 612,175 560,147" fill={stoneWhite} />
        <polygon points="458,202 562,152 560,147 455,198" fill={stoneShade} />
        <polygon points="459,203 561,152 560,149 457,199" fill={stoneLight} />

        {/* ============================================================== */}
        {/* 3. PANGERAN DIPONEGORO (SOLID WHITE MONUMENT ANATOMY) */}
        {/* ============================================================== */}
        {/* --- A. SEAT & LEGS FIRMLY JOINED TO SADDLE AND HORSE --- */}
        {/* Right Thigh & Leg hugging horse flank (eliminating any gaps) */}
        <polygon points="440,225 478,222 470,272 436,270" fill={stoneMid} />
        <polygon points="445,226 476,223 468,268 440,266" fill={stoneLight} />
        <polygon points="450,228 474,225 466,264 445,262" fill={stoneWhite} />
        {/* Lower Leg & Boot touching stirrup */}
        <polygon points="452,260 472,258 465,286 448,284" fill={stoneShade} />
        <rect x="450" y="278" width="18" height="8" fill={stoneLight} />

        {/* Flowing Jubah (Robe) Draping over Horse's Flank */}
        <polygon points="405,228 485,222 492,278 385,274" fill={stoneLight} />
        <polygon points="412,230 480,225 486,274 395,270" fill={stoneWhite} />
        {/* Deep fabric folds in shaded white stone */}
        <polygon points="426,236 448,232 466,278 444,278" fill={stoneShade} />
        <polygon points="385,256 422,246 418,274 375,278" fill={stoneDarkShade} />
        {/* Golden-hour soft glow on upper robe rim */}
        <polygon points="405,228 435,225 430,230 405,232" fill={goldenHighlight} opacity="0.6" />

        {/* --- B. BILLOWING CAPE / MANTLE (Solid white stone folds attached to shoulders) --- */}
        <polygon points="432,168 335,172 316,234 416,222" fill={stoneDarkShade} />
        <polygon points="428,170 345,178 328,228 410,218" fill={stoneShade} />
        <polygon points="422,174 360,184 344,218 402,214" fill={stoneMid} />
        <polygon points="418,176 375,188 360,210 398,210" fill={stoneLight} />
        <polygon points="414,178 388,192 376,204 394,206" fill={stoneWhite} />
        {/* Wind-blown top edge illuminated by sunset golden hour */}
        <polygon points="432,168 335,172 338,175 430,171" fill={goldenHighlight} opacity="0.85" />

        {/* --- C. WARRIOR TORSO & SASH (Fully connected to neck and hips) --- */}
        <polygon points="438,168 490,162 498,228 432,230" fill={stoneShade} />
        <polygon points="442,170 486,165 494,224 438,226" fill={stoneMid} />
        <polygon points="448,172 482,167 488,220 444,222" fill={stoneLight} />
        <polygon points="454,174 480,169 484,216 450,218" fill={stoneWhite} />

        {/* Royal Sash draped diagonally across chest (carved in white stone relief) */}
        <polygon points="444,172 458,168 494,218 480,222" fill={stoneWhite} />
        <polygon points="446,174 456,170 490,216 482,218" fill={goldenRim} />

        {/* --- D. HEAD, PROFILE & ICONIC TURBAN (SERBAN) --- */}
        {/* Strong neck connecting shoulders to head */}
        <polygon points="460,158 480,156 482,172 458,172" fill={stoneMid} />
        <polygon points="464,159 478,157 480,170 462,170" fill={stoneLight} />

        {/* Head & Noble Profile (Carved White Monument Stone) */}
        <rect x="464" y="128" width="24" height="26" fill={stoneShade} />
        <rect x="466" y="130" width="20" height="22" fill={stoneLight} />
        <rect x="470" y="132" width="16" height="18" fill={stoneWhite} />
        {/* Sculpted jawline and beard in white stone relief */}
        <polygon points="470,146 484,146 482,154 472,154" fill={stoneMid} />
        <polygon points="472,148 482,148 480,152 474,152" fill={stoneShade} />
        {/* Eye indentation */}
        <rect x="478" y="140" width="4" height="3" fill={stoneDarkShade} />
        <rect x="479" y="141" width="2" height="1" fill={stoneCrevice} />
        <rect x="478" y="139" width="4" height="1" fill={goldenHighlight} />

        {/* The Iconic White Turban (Serban Diponegoro) */}
        <ellipse cx="476" cy="124" rx="21" ry="16" fill={stoneShade} />
        <ellipse cx="476" cy="123" rx="19" ry="14" fill={stoneLight} />
        <ellipse cx="476" cy="122" rx="17" ry="12" fill={stoneWhite} />
        {/* Turban fold contours */}
        <rect x="458" y="120" width="36" height="4" fill={stoneMid} />
        <rect x="460" y="121" width="32" height="2" fill={stoneWhite} />
        {/* Turban tail draped down side meeting mantle */}
        <polygon points="458,128 446,160 454,163 462,131" fill={stoneMid} />
        <polygon points="460,130 448,160 452,162 462,131" fill={stoneLight} />
        <polygon points="450,138 444,166 450,168 456,140" fill={stoneWhite} />
        {/* Sunset golden-hour crown highlight atop serban */}
        <ellipse cx="476" cy="116" rx="14" ry="4" fill={goldenHighlight} opacity="0.8" />

        {/* --- E. LEFT ARM & HAND HOLDING REINS --- */}
        <polygon points="454,180 474,198 466,210 446,192" fill={stoneShade} />
        <polygon points="456,182 472,198 468,206 450,192" fill={stoneLight} />
        <rect x="466" y="196" width="10" height="10" fill={stoneWhite} />

        {/* --- F. RIGHT ARM & EXTENDED POINTING HAND (NO WEAPON!) --- */}
        {/* Seamless anatomical connection: Shoulder -> Upper Arm -> Forearm -> Extended Hand */}
        {/* Shoulder & Deltoid (firmly anchored to torso) */}
        <polygon points="484,166 544,148 546,164 486,182" fill={stoneShade} />
        <polygon points="486,168 540,152 542,162 488,178" fill={stoneLight} />
        <polygon points="492,170 538,154 540,160 494,174" fill={stoneWhite} />
        {/* Sunset golden-hour top highlight on shoulder and bicep */}
        <polygon points="484,166 544,148 542,151 486,169" fill={goldenHighlight} opacity="0.8" />

        {/* Forearm angled proudly forward and upward */}
        <polygon points="542,150 608,133 610,146 546,164" fill={stoneShade} />
        <polygon points="544,152 606,135 608,143 546,158" fill={stoneLight} />
        <polygon points="548,154 604,137 606,141 548,154" fill={stoneWhite} />
        {/* Golden-hour highlight along forearm edge */}
        <polygon points="542,150 608,133 607,135 544,152" fill={goldenHighlight} opacity="0.85" />

        {/* White sleeve cuff carved in relief */}
        <rect x="602" y="132" width="8" height="16" fill={stoneWhite} stroke={stoneMid} strokeWidth="1" />

        {/* THE FAMOUS POINTING HAND (INDEX FINGER EXTENDED TO THE HORIZON) */}
        {/* Palm & Knuckles in white monument stone */}
        <rect x="610" y="133" width="14" height="14" fill={stoneLight} />
        <rect x="612" y="135" width="10" height="10" fill={stoneWhite} />
        {/* Folded fingers (thumb, middle, ring, pinky) carved in relief */}
        <rect x="612" y="141" width="10" height="6" fill={stoneShade} />
        <rect x="614" y="142" width="7" height="4" fill={stoneLight} />
        {/* The Extended Index Finger Pointing Forward with Authority */}
        <rect x="622" y="135" width="18" height="4" fill={stoneLight} />
        <rect x="622" y="135" width="18" height="2" fill={stoneWhite} />
        <rect x="622" y="137" width="18" height="2" fill={stoneShade} />
        {/* Golden sunset specular gleam on the pointing fingertip */}
        <rect x="637" y="134" width="4" height="5" fill={goldenHighlight} />
        <rect x="639" y="135" width="2" height="3" fill="#FFFFFF" />
      </g>

      {/* ============================================================== */}
      {/* 4. SOFT GOLDEN-HOUR SUNSET AMBIENT SPECULAR PARTICLES */}
      {/* ============================================================== */}
      {lighting === 'golden' && (
        <g fill="#FDE68A" opacity="0.75">
          <rect x="644" y="133" width="3" height="3" />
          <rect x="652" y="129" width="2" height="2" />
          <rect x="580" y="104" width="3" height="3" />
          <rect x="442" y="98" width="3" height="3" />
          <rect x="360" y="148" width="2" height="2" />
        </g>
      )}
    </g>
  );
}
