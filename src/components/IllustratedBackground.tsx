import React from 'react';

export const IllustratedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 bg-dark-bg transition-colors duration-500">
      {/* Sankofa Pattern Mesh */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sankofa-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <g transform="scale(0.8) translate(20, 20)">
              <path 
                d="M50,15 C35,15 25,25 25,40 C25,65 50,85 50,85 C50,85 75,65 75,40 C75,25 65,15 50,15 M50,30 C55,30 60,35 60,40 C60,45 55,50 50,50 C45,50 40,45 40,40 C40,35 45,30 50,30" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-dark-sankofa"
              />
              <path 
                d="M30,40 Q10,40 10,20 Q10,0 30,0 Q50,0 50,20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-dark-sankofa"
              />
              <path 
                d="M70,40 Q90,40 90,20 Q90,0 70,0 Q50,0 50,20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="text-dark-sankofa"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sankofa-pattern)" />
      </svg>

      {/* Line Art Inclusivo - Minimalist Continuous Line Drawings */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {/* Child with Black Power / Afro - More detailed texture */}
        <g className="text-school-yellow">
          <path 
            d="M150,200 C140,180 145,160 165,150 C185,140 205,145 215,165 C225,145 245,140 265,150 C285,160 290,180 280,200 C295,220 290,245 270,255 C250,265 225,260 215,240 C205,260 180,265 160,255 C140,245 135,220 150,200" 
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          />
          <circle cx="215" cy="205" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M215,245 L215,300 M195,300 L235,300" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>

        {/* Child with Braids / Tranças - More detailed */}
        <g className="text-school-yellow">
          <path d="M400,180 Q430,140 460,180" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Braids */}
          <path d="M410,180 L400,260 M420,185 L415,265 M430,188 L430,270 M440,185 L445,265 M450,180 L460,260" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M415,270 L445,270" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>

        {/* Child with Dreadlocks - More detailed */}
        <g className="text-school-yellow">
          <path d="M700,200 Q735,160 770,200" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Dreads */}
          <path d="M710,200 Q700,240 705,280 M720,205 Q720,245 725,285 M745,205 Q750,245 745,285 M760,200 Q770,240 765,280" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <path d="M720,290 L750,290" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>

        {/* Child with Cachos / Curls */}
        <g className="text-school-yellow">
          <path d="M850,350 Q870,320 900,330 Q930,340 920,370" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Curls */}
          <path d="M860,340 Q850,330 840,340 Q830,350 840,360 Q850,370 860,360" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M880,330 Q870,320 860,330 Q850,340 860,350 Q870,360 880,350" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M900,340 Q890,330 880,340 Q870,350 880,360 Q890,370 900,360" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M885,370 L885,420 M865,420 L905,420" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
        
        {/* Abstract Movement Lines */}
        <path d="M50,400 Q150,350 250,400 T450,400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-school-yellow/30" />
        <path d="M600,600 Q750,550 900,600" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10,5" className="text-school-yellow/30" />
      </svg>

      {/* Composição de Comunidade - Flat Design Neighborhood in Footer */}
      <div className="absolute bottom-0 left-0 w-full h-80 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          {/* Ground */}
          <rect x="0" y="280" width="1440" height="40" fill="currentColor" className="text-slate-300 dark:text-slate-800" />
          
          {/* Plural Neighborhood - Houses and Buildings */}
          <g className="transition-colors duration-500">
            {/* House 1 */}
            <rect x="50" y="200" width="80" height="80" fill="#94a3b8" />
            <path d="M50,200 L90,160 L130,200 Z" fill="#64748b" />
            <rect x="80" y="240" width="20" height="40" fill="#475569" />
            
            {/* Building 1 */}
            <rect x="180" y="120" width="100" height="160" fill="#cbd5e1" />
            <rect x="200" y="140" width="20" height="20" fill="white" opacity="0.5" />
            <rect x="240" y="140" width="20" height="20" fill="white" opacity="0.5" />
            <rect x="200" y="180" width="20" height="20" fill="white" opacity="0.5" />
            <rect x="240" y="180" width="20" height="20" fill="white" opacity="0.5" />
            
            {/* House 2 */}
            <rect x="320" y="180" width="120" height="100" fill="#818cf8" />
            <path d="M320,180 L380,130 L440,180 Z" fill="#6366f1" />
            <rect x="365" y="230" width="30" height="50" fill="#4f46e5" />
            
            {/* House 3 - Ubuntu Style */}
            <rect x="1100" y="180" width="100" height="100" fill="#fbbf24" />
            <path d="M1100,180 L1150,130 L1200,180 Z" fill="#d97706" />
            <rect x="1135" y="230" width="30" height="50" fill="#92400e" />

            {/* Trees */}
            <circle cx="480" cy="220" r="30" fill="#22c55e" />
            <rect x="475" y="250" width="10" height="30" fill="#713f12" />
            
            <circle cx="1000" cy="210" r="40" fill="#16a34a" />
            <rect x="995" y="250" width="10" height="30" fill="#713f12" />
            
            <circle cx="1250" cy="230" r="25" fill="#4ade80" />
            <rect x="1245" y="255" width="10" height="25" fill="#713f12" />
          </g>

          {/* Diverse People Holding Hands - Plurality */}
          <g className="text-school-blue dark:text-school-yellow">
            {/* Person 1 */}
            <circle cx="600" cy="240" r="10" fill="currentColor" />
            <path d="M600,250 L600,280 M585,260 L615,260" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            
            {/* Person 2 (Child) */}
            <circle cx="635" cy="250" r="7" fill="currentColor" />
            <path d="M635,257 L635,280 M625,265 L645,265" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Person 3 */}
            <circle cx="670" cy="240" r="10" fill="currentColor" />
            <path d="M670,250 L670,280 M655,260 L685,260" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            
            {/* Person 4 */}
            <circle cx="710" cy="240" r="10" fill="currentColor" />
            <path d="M710,250 L710,280 M695,260 L725,260" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

            {/* Hand connections */}
            <path d="M610,260 L625,265 M645,265 L660,260 M680,260 L700,260" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* School Bus Passing By - Ubuntu Style */}
          <g className="animate-bus-move">
            <rect x="-250" y="220" width="160" height="60" rx="12" fill="#fbbf24" />
            <rect x="-240" y="230" width="40" height="25" rx="4" fill="#1e3a8a" opacity="0.2" />
            <rect x="-190" y="230" width="40" height="25" rx="4" fill="#1e3a8a" opacity="0.2" />
            <rect x="-140" y="230" width="40" height="25" rx="4" fill="#1e3a8a" opacity="0.2" />
            <circle cx="-210" cy="280" r="12" fill="#1f2937" />
            <circle cx="-130" cy="280" r="12" fill="#1f2937" />
            <text x="-240" y="270" fill="#1e3a8a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">UBUNTU</text>
          </g>
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bus-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(1800px); }
        }
        .animate-bus-move {
          animation: bus-move 15s linear infinite;
        }
      `}} />
    </div>
  );
};
