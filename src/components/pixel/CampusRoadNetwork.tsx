'use client';

import React from 'react';

/**
 * 16-Bit Pixel Art Campus Road & Pathway Network for Universitas Diponegoro Tembalang.
 * Completely reconstructed according to verified route specifications and official GIS layout:
 * - Entrance (North): UPT Lab (right), Jogging Track & PMB (left).
 * - North-East branch to Student Centre and UNDIP Tower.
 * - Arterial to FISIP, Architecture, Civil Engineering, and PWK.
 * - Main entrance road continuing to Geology and Bundaran Pertama.
 * - Bundaran Pertama connecting GSG, Geodesy, Computer Engineering, and Naval Architecture.
 * - Continuation south to Faculty of Engineering Dean's Office, Taman Inspirasi, and Widya Puraya.
 * - Widya Puraya core (Taman Widya Puraya, White Prince Diponegoro Horse Statue, Rectorate).
 * - Left branch to Art Centre, FISIP, Law (FH), Humanities (FIB), and Vocational School (SV).
 * - Right branch from Widya Puraya to Electrical Engineering, then Three-Way Junction.
 * - Three-Way Junction branching left to Psychology (FPsi) and right to FEB & FSM.
 * - Right turn to Medicine (FK) and RSND (behind FK).
 * - Southern sector road through Public Health (FKM), Marine & Fisheries (FPIK),
 *   Mechanical, Industrial, Environmental, Chemical Engineering, and Animal/Agro Sciences (FPP).
 * - Continuous perimeter loop connecting back to the Engineering complex.
 */
export function CampusRoadNetwork() {
  return (
    <g id="campus-road-network" style={{ shapeRendering: 'crispEdges' }}>
      {/* 1. Road Base Shadow / Foundation (Dark Earth Trench) */}
      <g fill="none" stroke="#23140C" strokeLinecap="round" strokeLinejoin="round">
        {/* Entrance from North (Jl. Prof. Soedarto) */}
        <path d="M 800 20 L 800 150 L 800 340" strokeWidth="48" />

        {/* Junction at (800, 150) branching East to Student Centre & UNDIP Tower */}
        <path d="M 800 150 L 1000 150 L 1220 150 L 1340 150" strokeWidth="44" />

        {/* Road curving from SC/Tower to FISIP */}
        <path d="M 1340 150 L 1460 200 L 1520 300 L 1520 440" strokeWidth="42" />

        {/* Branch to Architecture, Civil Engineering, & PWK */}
        <path d="M 1460 200 L 1320 230 L 1180 230" strokeWidth="38" />

        {/* Connector from PWK area down to Computer Engineering */}
        <path d="M 1180 230 L 1060 280 L 980 340" strokeWidth="36" />

        {/* Bundaran Pertama (First Roundabout) */}
        <circle cx="800" cy="340" r="50" strokeWidth="46" />

        {/* Bundaran Pertama branch to GSG Prof. Soedarto (West) */}
        <path d="M 750 340 L 600 340" strokeWidth="42" />

        {/* Bundaran Pertama branch to Teknik Geodesi (Southwest) */}
        <path d="M 770 375 L 660 420" strokeWidth="38" />

        {/* Bundaran Pertama branch to Teknik Komputer (East) */}
        <path d="M 850 340 L 980 340" strokeWidth="40" />

        {/* Bundaran Pertama branch to Teknik Perkapalan (Southeast) */}
        <path d="M 830 375 L 940 420" strokeWidth="38" />

        {/* Main Road from Bundaran Pertama south past Dekanat FT to Widya Puraya junction */}
        <path d="M 800 390 L 800 500 L 800 580" strokeWidth="46" />

        {/* Taman Inspirasi branch (West) */}
        <path d="M 800 580 L 730 600" strokeWidth="38" />

        {/* Boulevard into Widya Puraya Plaza (East) */}
        <path d="M 800 580 L 980 580" strokeWidth="48" />

        {/* Bundaran Widya Puraya (Prince Diponegoro White Horse Statue & Rectorate Plaza) */}
        <circle cx="980" cy="580" r="65" strokeWidth="48" />

        {/* Left Road from Widya Puraya to Art Centre, FISIP, FH, FIB, and Sekolah Vokasi */}
        <path d="M 980 520 L 1140 450 L 1320 400 L 1480 400 L 1520 440" strokeWidth="42" />
        <path d="M 1320 400 L 1320 500" strokeWidth="38" />
        <path d="M 1520 440 L 1720 460 L 1760 500" strokeWidth="42" />

        {/* Right Road from Widya Puraya to Teknik Elektro */}
        <path d="M 800 620 L 860 700" strokeWidth="42" />

        {/* Connector from Teknik Elektro to Three-Way Junction */}
        <path d="M 860 700 L 980 760 L 1080 800" strokeWidth="42" />

        {/* Three-Way Junction at (1080, 800): Left to Psychology (FPsi) */}
        <path d="M 1080 800 L 1240 760 L 1440 740" strokeWidth="40" />

        {/* Three-Way Junction: Right to FEB (left) and FSM (right) */}
        <path d="M 1080 800 L 1160 880 L 1220 960" strokeWidth="42" />

        {/* Right Turn after FEB/FSM toward FK & RSND */}
        <path d="M 1220 960 L 1220 1060 L 1460 1080" strokeWidth="42" />

        {/* Southern Sector Road through FKM, FPIK, and Engineering complex */}
        <path d="M 1220 1060 L 1100 1140 L 960 1140 L 760 1140 L 480 1140" strokeWidth="42" />

        {/* Connectors for Mesin, Industri, Lingkungan, & Kimia */}
        <path d="M 760 1140 L 760 1000 L 620 1000 L 480 1000 L 480 1140" strokeWidth="38" />
        <path d="M 620 1000 L 620 860" strokeWidth="36" />

        {/* Perimeter Loop connecting Chemical Engineering back to FT Dekanat */}
        <path d="M 480 1000 L 420 840 L 460 660 L 680 520 L 720 500" strokeWidth="38" />
      </g>

      {/* 2. Primary Road Asphalt Surface (Warm Charcoal Retro Asphalt) */}
      <g fill="none" stroke="#422818" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 800 20 L 800 150 L 800 340" strokeWidth="36" />
        <path d="M 800 150 L 1000 150 L 1220 150 L 1340 150" strokeWidth="32" />
        <path d="M 1340 150 L 1460 200 L 1520 300 L 1520 440" strokeWidth="30" />
        <path d="M 1460 200 L 1320 230 L 1180 230" strokeWidth="26" />
        <path d="M 1180 230 L 1060 280 L 980 340" strokeWidth="26" />
        <circle cx="800" cy="340" r="50" strokeWidth="34" />
        <path d="M 750 340 L 600 340" strokeWidth="30" />
        <path d="M 770 375 L 660 420" strokeWidth="26" />
        <path d="M 850 340 L 980 340" strokeWidth="28" />
        <path d="M 830 375 L 940 420" strokeWidth="26" />
        <path d="M 800 390 L 800 500 L 800 580" strokeWidth="34" />
        <path d="M 800 580 L 730 600" strokeWidth="26" />
        <path d="M 800 580 L 980 580" strokeWidth="36" />
        <circle cx="980" cy="580" r="65" strokeWidth="36" />
        <path d="M 980 520 L 1140 450 L 1320 400 L 1480 400 L 1520 440" strokeWidth="30" />
        <path d="M 1320 400 L 1320 500" strokeWidth="26" />
        <path d="M 1520 440 L 1720 460 L 1760 500" strokeWidth="30" />
        <path d="M 800 620 L 860 700" strokeWidth="30" />
        <path d="M 860 700 L 980 760 L 1080 800" strokeWidth="30" />
        <path d="M 1080 800 L 1240 760 L 1440 740" strokeWidth="28" />
        <path d="M 1080 800 L 1160 880 L 1220 960" strokeWidth="30" />
        <path d="M 1220 960 L 1220 1060 L 1460 1080" strokeWidth="30" />
        <path d="M 1220 1060 L 1100 1140 L 960 1140 L 760 1140 L 480 1140" strokeWidth="30" />
        <path d="M 760 1140 L 760 1000 L 620 1000 L 480 1000 L 480 1140" strokeWidth="26" />
        <path d="M 620 1000 L 620 860" strokeWidth="24" />
        <path d="M 480 1000 L 420 840 L 460 660 L 680 520 L 720 500" strokeWidth="26" />
      </g>

      {/* 3. Road Surface Centerlines / Markings (Golden Yellow Striping) */}
      <g stroke="#FDE68A" strokeWidth="3" strokeDasharray="14 14" fill="none" opacity="0.8">
        <path d="M 800 20 L 800 150 L 800 320" />
        <path d="M 800 150 L 1000 150 L 1220 150 L 1340 150" />
        <path d="M 1340 150 L 1460 200 L 1520 300 L 1520 440" />
        <circle cx="800" cy="340" r="50" />
        <path d="M 800 390 L 800 500 L 800 580" />
        <path d="M 800 580 L 980 580" />
        <circle cx="980" cy="580" r="65" />
        <path d="M 980 520 L 1140 450 L 1320 400 L 1480 400 L 1520 440" />
        <path d="M 1520 440 L 1720 460 L 1760 500" />
        <path d="M 800 620 L 860 700 L 980 760 L 1080 800" />
        <path d="M 1080 800 L 1240 760 L 1440 740" />
        <path d="M 1080 800 L 1160 880 L 1220 960 L 1220 1060 L 1460 1080" />
        <path d="M 1220 1060 L 1100 1140 L 960 1140 L 760 1140 L 480 1140" />
        <path d="M 480 1000 L 420 840 L 460 660 L 680 520 L 720 500" />
      </g>

      {/* 4. Pedestrian Pathways & Campus Promenades (Paved Sidewalks) */}
      <g stroke="#78350F" strokeWidth="6" fill="none" opacity="0.75" strokeDasharray="6 4">
        {/* Widya Puraya Ceremonial Plaza Promenade */}
        <rect x="860" y="500" width="240" height="160" rx="12" />
        {/* Pedestrian connections between departments */}
        <line x1="640" y1="100" x2="780" y2="120" />
        <line x1="820" y1="120" x2="960" y2="100" />
        <line x1="1180" y1="230" x2="1320" y2="230" />
        <line x1="1320" y1="500" x2="1520" y2="440" />
        <line x1="1000" y1="920" x2="1200" y2="920" />
        <line x1="760" y1="1020" x2="760" y2="1140" />
      </g>
    </g>
  );
}
