import React from "react";

interface DestinationArtworkProps {
  variant: string;
  className?: string;
}

export function DestinationArtwork({
  variant,
  className = "h-full w-full",
}: DestinationArtworkProps) {
  switch (variant) {
    case "solang":
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skySolang" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#072c50" />
              <stop offset="55%" stopColor="#1c5c8c" />
              <stop offset="100%" stopColor="#8ec5e8" />
            </linearGradient>
            <linearGradient id="snowRidge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cde3f4" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#skySolang)" />
          <circle cx="620" cy="105" r="46" fill="#ffd45a" opacity="0.92" />
          <circle cx="620" cy="105" r="78" fill="#ffd45a" opacity="0.2" />
          {/* Distant Snow Peaks */}
          <polygon points="0,330 165,125 320,315" fill="#9bc5e3" />
          <polygon points="165,125 225,200 185,215 155,190 120,210" fill="#ffffff" />
          <polygon points="210,340 430,90 650,335" fill="url(#snowRidge)" />
          <polygon points="430,90 520,195 475,215 430,185 385,220 345,195" fill="#e6f2fa" />
          <polygon points="510,350 700,145 830,350" fill="#b7d9f0" />
          <polygon points="700,145 755,205 710,220 675,200" fill="#ffffff" />
          {/* Foreground Ski Slope & Pine Trees */}
          <path d="M0,330 Q350,275 800,365 L800,500 L0,500 Z" fill="#eaf5fc" />
          <path d="M0,375 Q420,335 800,405 L800,500 L0,500 Z" fill="#d3e8f6" />
          {/* Pine Silhouettes */}
          {[80, 125, 660, 715, 755].map((x, i) => (
            <g key={x} transform={`translate(${x}, ${325 + (i % 2) * 18})`}>
              <polygon points="0,-42 -16,0 16,0" fill="#0b3a63" />
              <polygon points="0,-24 -20,18 20,18" fill="#062847" />
            </g>
          ))}
          {/* Paraglider */}
          <path d="M275,148 Q305,122 335,148 Q305,140 275,148 Z" fill="#ffd45a" />
          <line x1="283" y1="148" x2="305" y2="174" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="327" y1="148" x2="305" y2="174" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="305" cy="176" r="3.5" fill="#062847" />
        </svg>
      );

    case "atal":
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skyAtal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#062847" />
              <stop offset="60%" stopColor="#1b5684" />
              <stop offset="100%" stopColor="#65a8d6" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#skyAtal)" />
          {/* Dramatic Lahaul Cliffs */}
          <polygon points="0,500 0,140 270,85 450,260 450,500" fill="#184770" />
          <polygon points="80,124 270,85 340,155 240,175 180,150" fill="#e8f4fc" />
          <polygon points="360,500 520,120 800,175 800,500" fill="#103659" />
          {/* Sissu Cascading Waterfall */}
          <path
            d="M595,165 Q612,250 585,345 Q605,360 622,345 Q638,255 615,165 Z"
            fill="#d9f0ff"
            opacity="0.92"
          />
          {/* Atal Tunnel Archway & Scenic Highway */}
          <path d="M120,390 Q245,235 370,390 Z" fill="#071e34" stroke="#ffd45a" strokeWidth="4" />
          <path d="M155,390 Q245,275 335,390 Z" fill="#03111f" />
          <polygon points="150,390 340,390 520,500 40,500" fill="#233b52" />
          <line x1="245" y1="395" x2="275" y2="495" stroke="#ffd45a" strokeWidth="4" strokeDasharray="16 12" />
        </svg>
      );

    case "balcony":
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="twilightBalcony" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#041c36" />
              <stop offset="50%" stopColor="#143f6b" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#twilightBalcony)" />
          {/* Stars */}
          {[
            [110, 75],
            [210, 50],
            [330, 88],
            [490, 62],
            [640, 80],
            [720, 48],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="2.2" fill="#ffd45a" opacity="0.85" />
          ))}
          {/* Himalayan Dusk Silhouette */}
          <polygon points="0,340 190,175 390,320 580,150 800,325 800,500 0,500" fill="#0a2e4f" />
          <polygon points="580,150 645,205 595,215 555,195" fill="#cde4f5" opacity="0.7" />
          {/* Wooden Balcony Deck & Railing */}
          <rect x="0" y="345" width="800" height="155" fill="#2d1b14" />
          <rect x="0" y="295" width="800" height="12" fill="#4a2e22" />
          {[60, 160, 260, 360, 460, 560, 660, 760].map((x) => (
            <rect key={x} x={x} y="305" width="10" height="55" fill="#3b241a" />
          ))}
          {/* Warm String Lights */}
          <path d="M0,45 Q200,115 400,55 Q600,115 800,45" fill="none" stroke="#ffd45a" strokeWidth="2" opacity="0.75" />
          {[95, 195, 300, 400, 505, 610, 710].map((cx, i) => (
            <circle key={cx} cx={cx} cy={72 + (i % 2) * 14} r="5.5" fill="#ffd45a" />
          ))}
          {/* Candlelight Dinner Table */}
          <ellipse cx="400" cy="375" rx="95" ry="24" fill="#ffffff" />
          <rect x="392" y="375" width="16" height="85" fill="#1e120d" />
          <rect x="396" y="345" width="8" height="24" fill="#fffbeb" />
          <ellipse cx="400" cy="338" rx="5" ry="9" fill="#ffd45a" />
          <circle cx="400" cy="338" r="24" fill="#ffd45a" opacity="0.25" />
        </svg>
      );

    case "cafes":
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cafeSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082e52" />
              <stop offset="100%" stopColor="#266899" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#cafeSky)" />
          <polygon points="0,310 240,145 500,295 720,160 800,235 800,500 0,500" fill="#113e66" />
          {/* Beas / Manalsu River */}
          <path d="M0,375 Q300,340 800,395 L800,500 L0,500 Z" fill="#1d6fa3" />
          <path d="M80,415 Q260,400 440,420" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M470,445 Q620,430 760,450" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.7" />
          {/* Cozy Cedar Cafe Cabin */}
          <polygon points="150,245 310,165 470,245" fill="#ffd45a" />
          <rect x="175" y="245" width="270" height="125" fill="#3d261c" />
          <rect x="205" y="270" width="65" height="55" rx="6" fill="#ffd45a" opacity="0.9" />
          <rect x="350" y="270" width="65" height="55" rx="6" fill="#ffd45a" opacity="0.9" />
          <rect x="285" y="285" width="48" height="85" fill="#23140e" />
        </svg>
      );

    case "hidimba":
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#072c4d" />
              <stop offset="100%" stopColor="#1e628f" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#forestSky)" />
          {/* Sunbeams */}
          <polygon points="150,0 280,0 520,500 320,500" fill="#ffd45a" opacity="0.1" />
          {/* Tall Deodar Cedar Trees */}
          {[70, 155, 645, 730].map((x) => (
            <g key={x} transform={`translate(${x}, 420)`}>
              <rect x="-8" y="-330" width="16" height="330" fill="#1e130c" />
              <polygon points="0,-360 -55,-240 55,-240" fill="#0b3b36" />
              <polygon points="0,-290 -65,-160 65,-160" fill="#082f2b" />
              <polygon points="0,-210 -75,-70 75,-70" fill="#062421" />
            </g>
          ))}
          {/* Pagoda Style Temple */}
          <rect x="315" y="290" width="170" height="120" fill="#3c2419" />
          <polygon points="275,295 400,235 525,295" fill="#1f3b4d" />
          <polygon points="300,245 400,190 500,245" fill="#264b61" />
          <polygon points="325,198 400,150 475,198" fill="#2e5c75" />
          <polygon points="365,152 400,105 435,152" fill="#ffd45a" />
          <rect x="382" y="335" width="36" height="75" fill="#1a0f0a" />
          <rect x="0" y="405" width="800" height="95" fill="#0c332d" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="joginiSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#062847" />
              <stop offset="100%" stopColor="#2c7ab0" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#joginiSky)" />
          <polygon points="0,500 0,130 330,220 420,500" fill="#123d63" />
          <polygon points="390,500 470,175 800,115 800,500" fill="#0d3152" />
          {/* Waterfall Stream */}
          <path
            d="M365,165 C395,245 350,315 390,415 L445,415 C415,315 445,245 415,165 Z"
            fill="#e0f2fe"
          />
          {/* Turquoise Pool */}
          <ellipse cx="415" cy="435" rx="230" ry="45" fill="#38bdf8" opacity="0.75" />
          <ellipse cx="415" cy="435" rx="140" ry="22" fill="#bae6fd" opacity="0.8" />
        </svg>
      );
  }
}
