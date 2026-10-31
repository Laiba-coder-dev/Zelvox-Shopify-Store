"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type Localized } from "@/lib/content";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Props = {
  dict: Dict;
  locale: Locale;
  title: Localized;
  subtitle: Localized;
  note: Localized;
  image: string;
};

/* ─── Slide data ─────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: "textiles",
    accent: "#14a678",
    accentLight: "#b7ead8",
    gradientFrom: "from-[#050f1e]",
    gradientVia: "via-[#071a2f]/90",
    gradientTo: "to-[#0f8f66]/25",
    badge: { en: "🇬🇧 UK · 🇩🇪 Germany", de: "🇬🇧 UK · 🇩🇪 Deutschland" },
    headline: {
      en: "Premium Textiles & Apparel — Bulk Ready",
      de: "Hochwertige Textilien & Bekleidung — Bulk bereit",
    },
    subline: {
      en: "Export-grade fabrics, garments and apparel sourced directly from Pakistan's leading mills — packed to your specification.",
      de: "Exportfähige Stoffe, Kleidung und Bekleidung direkt aus Pakistans führenden Werken – nach Ihrer Spezifikation verpackt.",
    },
    visual: "textiles",
  },
  {
    id: "food",
    accent: "#f59e0b",
    accentLight: "#fde68a",
    gradientFrom: "from-[#050f1e]",
    gradientVia: "via-[#0b1a0a]/90",
    gradientTo: "to-[#1a4a10]/25",
    badge: { en: "🌾 Food & Agro", de: "🌾 Lebensmittel & Agrar" },
    headline: {
      en: "Rice, Wheat & Agro Commodities — Container Load",
      de: "Reis, Weizen & Agrarprodukte — Containerladung",
    },
    subline: {
      en: "Basmati, long-grain and specialty rice; wheat flour and agro staples shipped with full documentation and phytosanitary certificates.",
      de: "Basmati-, Langkorn- und Spezialsorten; Weizenmehl und Agrar-Grundnahrungsmittel mit vollständiger Dokumentation.",
    },
    visual: "food",
  },
  {
    id: "leather",
    accent: "#b45309",
    accentLight: "#fef3c7",
    gradientFrom: "from-[#050f1e]",
    gradientVia: "via-[#1a0b00]/90",
    gradientTo: "to-[#78350f]/25",
    badge: { en: "🧳 Leather Goods", de: "🧳 Lederwaren" },
    headline: {
      en: "Leather Goods & Accessories — Private Label",
      de: "Lederwaren & Accessoires — Eigenmarke",
    },
    subline: {
      en: "Genuine leather bags, wallets, belts and accessories with private-label and OEM options available from Sialkot's renowned craftsmen.",
      de: "Echte Ledertaschen, Geldbörsen, Gürtel und Accessoires mit Eigenmarken- und OEM-Optionen.",
    },
    visual: "leather",
  },
  {
    id: "sports",
    accent: "#7c3aed",
    accentLight: "#ddd6fe",
    gradientFrom: "from-[#050f1e]",
    gradientVia: "via-[#0d0b2a]/90",
    gradientTo: "to-[#3730a3]/25",
    badge: { en: "⚽ Sports & Equipment", de: "⚽ Sport & Ausrüstung" },
    headline: {
      en: "Sports Goods & Equipment — Wholesale Supply",
      de: "Sportartikel & Ausrüstung — Großhandel",
    },
    subline: {
      en: "FIFA-approved footballs, cricket bats, boxing gear and fitness equipment produced in Pakistan's sports manufacturing capital.",
      de: "FIFA-geprüfte Fußbälle, Kricketschläger, Boxausrüstung und Fitnessgeräte aus Pakistans Sportartikelhauptstadt.",
    },
    visual: "sports",
  },
] as const;

const AUTOPLAY_MS = 5500;

/* ─── Product visual components ──────────────────────────────────────────── */

function TextilesVisual() {
  return (
    <div className="hero-scene" aria-hidden="true">
      {/* back fabric bolt */}
      <div
        className="hero-obj hero-obj--back"
        style={{ "--tx": "8rem", "--ty": "-1rem", "--rot": "12deg", "--depth": "1" } as React.CSSProperties}
      >
        <svg viewBox="0 0 160 220" className="drop-shadow-2xl" style={{ width: 140 }}>
          <defs>
            <linearGradient id="fab1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f8f66" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <pattern id="weave1" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect rx="8" width="160" height="220" fill="url(#fab1)" />
          <rect rx="8" width="160" height="220" fill="url(#weave1)" />
          <rect x="12" y="12" rx="4" width="136" height="196" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <text x="80" y="118" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="system-ui">100% COTTON</text>
        </svg>
      </div>
      {/* center folded fabric stack */}
      <div
        className="hero-obj hero-obj--main"
        style={{ "--tx": "0rem", "--ty": "0rem", "--rot": "-4deg", "--depth": "2" } as React.CSSProperties}
      >
        <svg viewBox="0 0 200 240" className="drop-shadow-2xl" style={{ width: 180 }}>
          <defs>
            <linearGradient id="fab2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <pattern id="stripe2" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="12" y2="12" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
            </pattern>
          </defs>
          {/* fabric layers */}
          <rect y="40" rx="6" width="200" height="200" fill="#1e3a5f" />
          <rect y="28" rx="6" width="200" height="200" fill="#2563eb" opacity="0.6" />
          <rect y="16" rx="6" width="200" height="200" fill="url(#fab2)" />
          <rect y="16" rx="6" width="200" height="200" fill="url(#stripe2)" />
          <rect x="20" y="30" rx="3" width="160" height="180" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* label */}
          <rect x="60" y="52" rx="4" width="80" height="24" fill="rgba(255,255,255,0.9)" />
          <text x="100" y="68" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="700" fontFamily="system-ui">MERIDIAN</text>
        </svg>
      </div>
      {/* measurement tape */}
      <div
        className="hero-obj hero-obj--fore"
        style={{ "--tx": "-7rem", "--ty": "4rem", "--rot": "-18deg", "--depth": "3" } as React.CSSProperties}
      >
        <svg viewBox="0 0 240 30" style={{ width: 200 }}>
          <rect rx="4" width="240" height="30" fill="#fbbf24" />
          {Array.from({ length: 25 }, (_, i) => (
            <g key={i}>
              <line x1={i * 9.6 + 4} y1="0" x2={i * 9.6 + 4} y2={i % 5 === 0 ? 14 : 9} stroke="#92400e" strokeWidth="1" />
              {i % 5 === 0 && (
                <text x={i * 9.6 + 4} y="25" textAnchor="middle" fill="#92400e" fontSize="7" fontFamily="monospace">{i * 5}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      {/* floating tag */}
      <div
        className="hero-obj hero-obj--tag"
        style={{ "--tx": "7rem", "--ty": "5rem", "--rot": "6deg", "--depth": "2" } as React.CSSProperties}
      >
        <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md text-white text-xs font-semibold leading-relaxed shadow-2xl">
          <div className="text-[10px] text-emerald-300 uppercase tracking-wider mb-1">Export Grade</div>
          <div>MOQ: 500 units</div>
          <div className="text-white/60">OEM & Private Label</div>
        </div>
      </div>
    </div>
  );
}

function FoodVisual() {
  return (
    <div className="hero-scene" aria-hidden="true">
      {/* back sack */}
      <div
        className="hero-obj hero-obj--back"
        style={{ "--tx": "6rem", "--ty": "-2rem", "--rot": "10deg", "--depth": "1" } as React.CSSProperties}
      >
        <svg viewBox="0 0 140 200" style={{ width: 120 }}>
          <defs>
            <linearGradient id="sack1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <pattern id="burlap" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="6" y2="6" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <line x1="6" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <ellipse cx="70" cy="185" rx="60" ry="15" fill="rgba(0,0,0,0.3)" />
          <path d="M20,60 Q10,120 15,185 Q70,200 125,185 Q130,120 120,60 Q70,45 20,60Z" fill="url(#sack1)" />
          <path d="M20,60 Q10,120 15,185 Q70,200 125,185 Q130,120 120,60 Q70,45 20,60Z" fill="url(#burlap)" />
          <ellipse cx="70" cy="60" rx="50" ry="20" fill="#f59e0b" />
          <path d="M45,42 Q70,22 95,42" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
          <text x="70" y="125" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="700" fontFamily="system-ui">BASMATI</text>
          <text x="70" y="140" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="system-ui">EXTRA LONG GRAIN</text>
        </svg>
      </div>
      {/* center grain bowl */}
      <div
        className="hero-obj hero-obj--main"
        style={{ "--tx": "0rem", "--ty": "0rem", "--rot": "-3deg", "--depth": "2" } as React.CSSProperties}
      >
        <svg viewBox="0 0 200 200" style={{ width: 180 }}>
          <defs>
            <radialGradient id="bowl1" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="165" rx="85" ry="22" fill="rgba(0,0,0,0.25)" />
          <path d="M15,90 Q15,175 100,175 Q185,175 185,90 Q185,60 100,55 Q15,60 15,90Z" fill="url(#bowl1)" />
          <ellipse cx="100" cy="90" rx="85" ry="35" fill="#fde68a" />
          {/* rice grains */}
          {Array.from({ length: 30 }, (_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const r = 10 + (i % 3) * 22;
            const cx = 100 + Math.cos(angle) * r;
            const cy = 90 + Math.sin(angle) * r * 0.42;
            return (
              <ellipse key={i} cx={cx} cy={cy} rx="6" ry="2.5"
                transform={`rotate(${(angle * 180) / Math.PI + 90}, ${cx}, ${cy})`}
                fill="rgba(255,255,255,0.7)" />
            );
          })}
          <text x="100" y="96" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="700" fontFamily="system-ui">Premium Grade</text>
        </svg>
      </div>
      {/* wheat stalks */}
      <div
        className="hero-obj hero-obj--fore"
        style={{ "--tx": "-6rem", "--ty": "0rem", "--rot": "-15deg", "--depth": "3" } as React.CSSProperties}
      >
        <svg viewBox="0 0 60 180" style={{ width: 50, opacity: 0.85 }}>
          {[0, 12, 24].map((x) => (
            <g key={x} transform={`translate(${x}, 0)`}>
              <line x1="10" y1="180" x2="10" y2="20" stroke="#d97706" strokeWidth="2.5" />
              {[30, 50, 70, 90, 110].map((y) => (
                <g key={y}>
                  <path d={`M10,${y} Q2,${y - 10} 6,${y - 22}`} fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                  <path d={`M10,${y} Q18,${y - 10} 14,${y - 22}`} fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
      {/* floating cert badge */}
      <div
        className="hero-obj hero-obj--tag"
        style={{ "--tx": "7rem", "--ty": "4rem", "--rot": "5deg", "--depth": "2" } as React.CSSProperties}
      >
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/60 px-4 py-3 backdrop-blur-md text-amber-200 text-xs font-semibold leading-relaxed shadow-2xl">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Certified Export</div>
          <div>Phytosanitary Cert.</div>
          <div className="text-amber-200/60">CODEX Compliant</div>
        </div>
      </div>
    </div>
  );
}

function LeatherVisual() {
  return (
    <div className="hero-scene" aria-hidden="true">
      {/* back bag silhouette */}
      <div
        className="hero-obj hero-obj--back"
        style={{ "--tx": "7rem", "--ty": "-1rem", "--rot": "8deg", "--depth": "1" } as React.CSSProperties}
      >
        <svg viewBox="0 0 160 200" style={{ width: 140 }}>
          <defs>
            <linearGradient id="leather1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="188" rx="65" ry="12" fill="rgba(0,0,0,0.3)" />
          {/* strap */}
          <path d="M55,30 Q55,5 80,5 Q105,5 105,30" fill="none" stroke="#b45309" strokeWidth="12" strokeLinecap="round" />
          {/* bag body */}
          <rect x="10" y="30" rx="12" width="140" height="155" fill="url(#leather1)" />
          {/* texture */}
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 5 }, (_, col) => (
              <rect key={`${row}-${col}`} x={10 + col * 28} y={30 + row * 26} width="26" height="24"
                rx="3" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))
          )}
          {/* clasp */}
          <rect x="60" y="92" rx="6" width="40" height="20" fill="#d97706" />
          <rect x="74" y="97" rx="3" width="12" height="10" fill="#92400e" />
        </svg>
      </div>
      {/* center wallet open */}
      <div
        className="hero-obj hero-obj--main"
        style={{ "--tx": "0rem", "--ty": "0rem", "--rot": "-5deg", "--depth": "2" } as React.CSSProperties}
      >
        <svg viewBox="0 0 220 160" style={{ width: 200 }}>
          <defs>
            <linearGradient id="leather2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="leather3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="155" rx="100" ry="8" fill="rgba(0,0,0,0.3)" />
          {/* left flap */}
          <rect rx="10" width="108" height="150" fill="url(#leather2)" />
          {/* right flap */}
          <rect x="112" rx="10" width="108" height="150" fill="url(#leather3)" />
          {/* card slot */}
          <rect x="122" y="20" rx="4" width="88" height="48" fill="rgba(255,255,255,0.12)" />
          <rect x="122" y="72" rx="4" width="88" height="48" fill="rgba(255,255,255,0.08)" />
          {/* stitching */}
          <rect x="6" y="6" rx="6" width="96" height="138" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
          <rect x="118" y="6" rx="6" width="96" height="138" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="54" y="82" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="system-ui" fontWeight="700">GENUINE</text>
          <text x="54" y="94" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="system-ui" fontWeight="700">LEATHER</text>
        </svg>
      </div>
      {/* foreground belt */}
      <div
        className="hero-obj hero-obj--fore"
        style={{ "--tx": "-6rem", "--ty": "5rem", "--rot": "-12deg", "--depth": "3" } as React.CSSProperties}
      >
        <svg viewBox="0 0 260 40" style={{ width: 220 }}>
          <rect rx="6" width="260" height="40" fill="#92400e" />
          <rect x="2" y="2" rx="5" width="256" height="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 3" />
          {/* buckle */}
          <rect x="5" y="6" rx="4" width="38" height="28" fill="#d97706" />
          <rect x="11" y="12" rx="2" width="14" height="16" fill="#92400e" />
          <rect x="28" y="10" rx="1.5" width="3" height="20" fill="#78350f" />
          {/* holes */}
          {[100, 120, 140, 160, 180].map((x) => (
            <circle key={x} cx={x} cy="20" r="3" fill="#5c2900" />
          ))}
        </svg>
      </div>
      {/* tag */}
      <div
        className="hero-obj hero-obj--tag"
        style={{ "--tx": "8rem", "--ty": "5rem", "--rot": "8deg", "--depth": "2" } as React.CSSProperties}
      >
        <div className="rounded-xl border border-amber-700/40 bg-amber-950/70 px-4 py-3 backdrop-blur-md text-amber-200 text-xs font-semibold leading-relaxed shadow-2xl">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Sialkot Crafted</div>
          <div>OEM / Private Label</div>
          <div className="text-amber-200/60">Full-grain & PU options</div>
        </div>
      </div>
    </div>
  );
}

function SportsVisual() {
  return (
    <div className="hero-scene" aria-hidden="true">
      {/* back cricket bat */}
      <div
        className="hero-obj hero-obj--back"
        style={{ "--tx": "7rem", "--ty": "-2rem", "--rot": "10deg", "--depth": "1" } as React.CSSProperties}
      >
        <svg viewBox="0 0 80 240" style={{ width: 70 }}>
          <defs>
            <linearGradient id="bat1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          {/* blade */}
          <rect x="10" y="20" rx="8" width="60" height="170" fill="url(#bat1)" />
          <line x1="20" y1="40" x2="60" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="20" y1="60" x2="60" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* handle */}
          <rect x="28" y="190" rx="5" width="24" height="50" fill="#374151" />
          <path d="M30,192 Q40,196 50,192" fill="none" stroke="#6b7280" strokeWidth="2" />
          {/* sticker */}
          <rect x="15" y="80" rx="3" width="50" height="30" fill="rgba(255,255,255,0.15)" />
          <text x="40" y="99" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="700" fontFamily="system-ui">MERIDIAN</text>
        </svg>
      </div>
      {/* center football */}
      <div
        className="hero-obj hero-obj--main"
        style={{ "--tx": "0rem", "--ty": "0rem", "--rot": "0deg", "--depth": "2" } as React.CSSProperties}
      >
        <svg viewBox="0 0 200 200" style={{ width: 180 }}>
          <defs>
            <radialGradient id="ball1" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#f9fafb" />
              <stop offset="50%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </radialGradient>
            <radialGradient id="ballGlow" cx="35%" cy="30%">
              <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
              <stop offset="100%" stopColor="rgba(109,40,217,0)" />
            </radialGradient>
            <clipPath id="ballClip">
              <circle cx="100" cy="100" r="88" />
            </clipPath>
          </defs>
          <circle cx="100" cy="170" r="88" fill="rgba(0,0,0,0.25)" />
          <circle cx="100" cy="100" r="88" fill="url(#ball1)" />
          <circle cx="100" cy="100" r="88" fill="url(#ballGlow)" />
          {/* pentagon panels */}
          <g clipPath="url(#ballClip)" fill="#1f2937" fillOpacity="0.85">
            <polygon points="100,28 118,48 110,72 90,72 82,48" />
            <polygon points="46,66 70,60 82,80 66,96 44,88" />
            <polygon points="34,122 56,116 66,136 52,154 30,144" />
            <polygon points="72,162 88,148 112,148 128,162 106,180" />
            <polygon points="148,154 134,136 146,116 168,122 170,144" />
            <polygon points="156,88 134,96 118,80 130,60 154,66" />
          </g>
          {/* shine */}
          <ellipse cx="72" cy="66" rx="22" ry="16" fill="rgba(255,255,255,0.45)" />
          {/* FIFA stamp */}
          <circle cx="100" cy="100" r="18" fill="rgba(124,58,237,0.8)" />
          <text x="100" y="98" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="system-ui">FIFA</text>
          <text x="100" y="108" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="system-ui">APPROVED</text>
        </svg>
      </div>
      {/* boxing glove */}
      <div
        className="hero-obj hero-obj--fore"
        style={{ "--tx": "-7rem", "--ty": "2rem", "--rot": "-20deg", "--depth": "3" } as React.CSSProperties}
      >
        <svg viewBox="0 0 100 130" style={{ width: 80 }}>
          <defs>
            <linearGradient id="glove1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          {/* glove body */}
          <path d="M20,50 Q10,70 15,100 Q50,120 85,100 Q90,70 80,50 Q70,30 50,28 Q30,30 20,50Z" fill="url(#glove1)" />
          {/* thumb */}
          <path d="M20,50 Q5,44 8,32 Q16,22 28,34 Q32,44 26,52Z" fill="url(#glove1)" />
          {/* wrist strap */}
          <rect x="25" y="98" rx="5" width="50" height="30" fill="#374151" />
          <rect x="27" y="102" rx="3" width="46" height="10" fill="#fbbf24" />
          {/* shine */}
          <ellipse cx="45" cy="50" rx="16" ry="10" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>
      {/* tag */}
      <div
        className="hero-obj hero-obj--tag"
        style={{ "--tx": "7rem", "--ty": "5rem", "--rot": "5deg", "--depth": "2" } as React.CSSProperties}
      >
        <div className="rounded-xl border border-violet-500/30 bg-violet-950/70 px-4 py-3 backdrop-blur-md text-violet-200 text-xs font-semibold leading-relaxed shadow-2xl">
          <div className="text-[10px] text-violet-400 uppercase tracking-wider mb-1">Sialkot, Pakistan</div>
          <div>FIFA · ICC Certified</div>
          <div className="text-violet-200/60">MOQ from 500 pcs</div>
        </div>
      </div>
    </div>
  );
}

const VISUALS = { textiles: TextilesVisual, food: FoodVisual, leather: LeatherVisual, sports: SportsVisual };

/* ─── Carousel ───────────────────────────────────────────────────────────── */

export default function Hero({ dict, locale, title, subtitle, note, image }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = SLIDES.length;

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent((idx + total) % total);
      setTimeout(() => setTransitioning(false), 600);
    },
    [transitioning, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Autoplay */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, next]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const slide = SLIDES[current];
  const Visual = VISUALS[slide.visual];

  return (
    <section
      className="hero-root"
      aria-label="Hero carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Animated gradient atmosphere ─── */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg__base" />
        <div
          className="hero-bg__accent"
          style={{ background: `radial-gradient(ellipse 55% 55% at 68% 50%, ${slide.accent}28 0%, transparent 70%)` }}
        />
        <div className="hero-bg__grid" />
        <div className="hero-bg__vignette" />
        {/* atmospheric orbs */}
        <div className="hero-orb hero-orb--1" style={{ background: `radial-gradient(circle, ${slide.accent}18 0%, transparent 70%)` }} />
        <div className="hero-orb hero-orb--2" style={{ background: `radial-gradient(circle, ${slide.accentLight}10 0%, transparent 70%)` }} />
      </div>

      {/* ── Slide content ─── */}
      <div className="hero-slide" key={slide.id} data-transitioning={transitioning}>
        <div className="container-x hero-inner">
          {/* Left: text */}
          <div className="hero-text">
            {/* Badge */}
            <div className="hero-badge">
              <span>{locale === "de" ? slide.badge.de : slide.badge.en}</span>
              {pick(note, locale) && (
                <>
                  <span className="hero-badge__sep">·</span>
                  <span className="hero-badge__note">{pick(note, locale)}</span>
                </>
              )}
            </div>

            {/* Headline */}
            <h1 className="hero-headline" style={{ "--accent": slide.accent } as React.CSSProperties}>
              {locale === "de" ? slide.headline.de : slide.headline.en}
            </h1>

            {/* Sub-line */}
            <p className="hero-subline">
              {locale === "de" ? slide.subline.de : slide.subline.en}
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <Link href="/quote" className="hero-cta-primary" id={`hero-cta-quote-${slide.id}`}>
                {dict.common.requestQuote}
                <ArrowRight className="hero-cta-primary__icon" aria-hidden="true" />
              </Link>
              <Link href="/products" className="hero-cta-secondary" id={`hero-cta-products-${slide.id}`}>
                {dict.common.exploreProducts}
              </Link>
            </div>

            {/* Chips */}
            <div className="hero-chips" role="list" aria-label="Service highlights">
              {[dict.hero.chip1, dict.hero.chip2, dict.hero.chip3].map((chip) => (
                <span key={chip} role="listitem" className="hero-chip">
                  <span className="hero-chip__dot" style={{ background: slide.accent }} />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right: 3D product visual */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual__glow" style={{ background: `radial-gradient(circle, ${slide.accent}30 0%, transparent 65%)` }} />
            <div className="hero-visual__stage">
              <Visual />
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ─── */}
      <div className="hero-controls" aria-label="Carousel controls">
        {/* Prev */}
        <button
          id="hero-prev"
          onClick={prev}
          className="hero-arrow hero-arrow--prev"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="hero-dots" role="tablist" aria-label="Slide selector">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              id={`hero-dot-${i}`}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
              style={i === current ? { background: slide.accent } : undefined}
            >
              {/* progress bar for active dot */}
              {i === current && !paused && (
                <span
                  className="hero-dot__progress"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Pause/Play */}
        <button
          id="hero-pause"
          onClick={() => setPaused((p) => !p)}
          className="hero-playpause"
          aria-label={paused ? "Play autoplay" : "Pause autoplay"}
          aria-pressed={paused}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>

        {/* Next */}
        <button
          id="hero-next"
          onClick={next}
          className="hero-arrow hero-arrow--next"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* ── Slide counter ─── */}
      <div className="hero-counter" aria-live="polite" aria-atomic="true">
        <span>{String(current + 1).padStart(2, "0")}</span>
        <span className="hero-counter__sep" />
        <span className="hero-counter__total">{String(total).padStart(2, "0")}</span>
      </div>

      {/* ── Scroll cue ─── */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue__line" />
        <span className="hero-scroll-cue__label">{dict.hero.scroll}</span>
      </div>
    </section>
  );
}
