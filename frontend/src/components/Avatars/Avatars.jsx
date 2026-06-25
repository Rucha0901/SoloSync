import React from "react";

export const AVATARS = [
  {
    id: "cyberpunk-star",
    name: "Cyberpunk Star",
    color: "#d946ef",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#d946ef" strokeWidth="3" />
        <path d="M50 15L61 40L86 40L66 55L74 80L50 64L26 80L34 55L14 40L39 40L50 15Z" fill="url(#cyber-grad)" />
        <circle cx="50" cy="51" r="8" fill="#ffffff" />
        <defs>
          <linearGradient id="cyber-grad" x1="14" y1="15" x2="86" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "cosmic-planet",
    name: "Cosmic Planet",
    color: "#f97316",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
        <circle cx="50" cy="50" r="22" fill="url(#planet-grad)" />
        <path d="M15 62C25 55 45 42 70 45C85 47 90 54 85 57C75 62 55 68 30 65C15 63 10 57 15 62Z" fill="url(#ring-grad)" fillOpacity="0.8" />
        <defs>
          <linearGradient id="planet-grad" x1="28" y1="28" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="ring-grad" x1="15" y1="45" x2="85" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb7185" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "geo-shield",
    name: "Geo Shield",
    color: "#10b981",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
        <path d="M50 20C65 20 72 24 72 38C72 60 56 75 50 80C44 75 28 60 28 38C28 24 35 20 50 20Z" fill="url(#shield-grad)" />
        <path d="M50 30L62 42H56V62H44V42H38L50 30Z" fill="#ffffff" />
        <defs>
          <linearGradient id="shield-grad" x1="28" y1="20" x2="72" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "neon-helix",
    name: "Neon Helix",
    color: "#06b6d4",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#082f49" stroke="#06b6d4" strokeWidth="3" />
        <path d="M25 50C25 35 35 25 50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50Z" stroke="url(#helix-grad)" strokeWidth="4" strokeDasharray="6 6" />
        <circle cx="50" cy="50" r="10" fill="#06b6d4" />
        <circle cx="33" cy="33" r="5" fill="#38bdf8" />
        <circle cx="67" cy="67" r="5" fill="#38bdf8" />
        <circle cx="67" cy="33" r="5" fill="#38bdf8" />
        <circle cx="33" cy="67" r="5" fill="#38bdf8" />
        <defs>
          <linearGradient id="helix-grad" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "retro-sunset",
    name: "Retro Sunset",
    color: "#f43f5e",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#180018" stroke="#f43f5e" strokeWidth="3" />
        <circle cx="50" cy="45" r="26" fill="url(#sunset-grad)" />
        <path d="M20 70H80V73H20V70ZM20 76H80V78H20V76ZM20 81H80V82H20V81ZM20 65H80V67H20V65Z" fill="#180018" />
        <path d="M50 45L50 85" stroke="#f43f5e" strokeWidth="2" strokeOpacity="0.3" />
        <defs>
          <linearGradient id="sunset-grad" x1="50" y1="19" x2="50" y2="71" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb7185" />
            <stop offset="0.5" stopColor="#f43f5e" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "quantum-node",
    name: "Quantum Node",
    color: "#3b82f6",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#3b82f6" strokeWidth="3" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="#3b82f6" strokeWidth="2" />
        <line x1="70" y1="30" x2="30" y2="70" stroke="#3b82f6" strokeWidth="2" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="30" cy="30" r="7" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="70" cy="70" r="7" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="70" cy="30" r="7" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="30" cy="70" r="7" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="50" cy="50" r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
        <circle cx="30" cy="50" r="6" fill="#93c5fd" />
        <circle cx="70" cy="50" r="6" fill="#93c5fd" />
      </svg>
    )
  },
  {
    id: "virtual-prism",
    name: "Virtual Prism",
    color: "#a855f7",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#a855f7" strokeWidth="3" />
        <path d="M50 22L78 70H22L50 22Z" fill="url(#prism-grad)" />
        <path d="M50 22L50 70" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M22 70L50 46" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M78 70L50 46" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" />
        <defs>
          <linearGradient id="prism-grad" x1="22" y1="22" x2="78" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: "digital-oracle",
    name: "Digital Oracle",
    color: "#84cc16",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#14532d" stroke="#84cc16" strokeWidth="3" />
        <rect x="34" y="32" width="32" height="32" rx="4" fill="url(#oracle-grad)" />
        <circle cx="43" cy="42" r="3" fill="#ffffff" />
        <circle cx="57" cy="42" r="3" fill="#ffffff" />
        <path d="M42 52C45 55 55 55 58 52" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 22H28M22 78H28M78 22H72M78 78H72" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="oracle-grad" x1="34" y1="32" x2="66" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a3e635" />
            <stop offset="1" stopColor="#65a30d" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

export default function Avatar({ id, size = 40, className = "" }) {
  const avatar = AVATARS.find((a) => a.id === id) || AVATARS[0];

  return (
    <div
      className={`avatar-container ${className}`}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}
      title={avatar.name}
    >
      {React.cloneElement(avatar.svg, {
        width: "100%",
        height: "100%",
        style: { display: "block" }
      })}
    </div>
  );
}
