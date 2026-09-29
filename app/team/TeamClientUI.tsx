"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";

// ─── Lenis ────────────────────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Accent colours derived from positionEn ──────────────────────────────────
function getAccent(positionEn: string): { accent: string; accentBorder: string } {
  switch (positionEn) {
    case "GK":
      return { accent: "rgba(59,130,246,0.15)",  accentBorder: "rgba(59,130,246,0.3)" };
    case "CB":
    case "LB":
    case "RB":
      return { accent: "rgba(34,197,94,0.12)",   accentBorder: "rgba(34,197,94,0.28)" };
    case "CM":
    case "DM":
      return { accent: "rgba(234,179,8,0.12)",   accentBorder: "rgba(234,179,8,0.28)" };
    case "LW":
    case "RW":
    case "AM":
      return { accent: "rgba(249,115,22,0.12)",  accentBorder: "rgba(249,115,22,0.28)" };
    case "ST":
    default:
      return { accent: "rgba(239,68,68,0.12)",   accentBorder: "rgba(239,68,68,0.28)" };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PlayerData {
  id: string;
  no: number;
  firstName: string;
  lastName: string;
  position: string;
  positionEn: string;
  age: number;
  nationality: string;
  imageUrl?: string | null;
}

export interface CoachData {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  age?: number | null;
  nationality: string;
  imageUrl?: string | null;
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({ player, index }: { player: PlayerData; index: number }) {
  const { accent, accentBorder } = getAccent(player.positionEn);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{
        y: -8,
        borderColor: "rgba(201,162,39,0.35)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,162,39,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {/* Jersey number watermark */}
      <div
        className="absolute -right-3 -top-2 font-oswald font-bold text-[7rem] leading-none select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.04)" }}
      >
        {player.no}
      </div>

      {/* Photo */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${accent} 0%, rgba(0,0,0,0.6) 100%)` }}
      >
        {player.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.imageUrl} alt={`${player.firstName} ${player.lastName}`} className="absolute inset-0 w-full h-full object-cover object-top" />
        ) : (
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <svg viewBox="0 0 120 160" className="w-4/5 opacity-10" fill="white">
              <circle cx="60" cy="32" r="20" />
              <path d="M30 72 Q30 55 60 52 Q90 55 90 72 L95 130 L70 130 L65 95 L55 95 L50 130 L25 130 Z" />
              <path d="M30 72 L10 105 L18 108 L36 80" />
              <path d="M90 72 L110 105 L102 108 L84 80" />
            </svg>
          </div>
        )}

        {/* Position badge */}
        <div className="absolute top-3 left-3">
          <span
            className="font-oswald font-bold text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-md"
            style={{ background: accent, border: `1px solid ${accentBorder}`, color: "rgba(255,255,255,0.85)" }}
          >
            {player.positionEn}
          </span>
        </div>

        {/* Number overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="font-oswald font-bold text-4xl leading-none" style={{ color: "rgba(201,162,39,0.6)" }}>
            {player.no}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <p className="font-oswald text-white/50 text-xs tracking-widest uppercase">{player.firstName}</p>
        <p className="font-oswald font-bold text-white text-lg leading-tight mt-0.5 tracking-wide">{player.lastName}</p>
        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-oswald text-[11px] text-white/40 tracking-wider">{player.position}</span>
          <span className="font-oswald text-[11px] text-white/30 tracking-wider">{player.age} ετών</span>
        </div>
      </div>

      {/* Gold shimmer on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,162,39,0.6), transparent)" }}
      />
    </motion.div>
  );
}

const FILTERS = ["Όλοι", "Τερματοφύλακες", "Αμυντικοί", "Μέσοι", "Επιθετικοί"];

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT UI
// ═══════════════════════════════════════════════════════════════════════════════
export default function TeamClientUI({ players, coaches }: { players: PlayerData[]; coaches: CoachData[] }) {
  useLenis();

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,60,20,0.45) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="mb-14">
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <Link href="/" className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors duration-200">
              Αρχική
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">Ομάδα</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(3rem,8vw,6.5rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              ΤΟ ΡΟΣΤΕΡ
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.p
              className="font-oswald text-[clamp(1.2rem,3vw,2rem)] text-[#C9A227]/60 font-medium tracking-widest mt-1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            >
              ΣΕΖΟΝ 2024–25
            </motion.p>
          </div>

          <motion.div
            className="mt-8 h-px"
            style={{ background: "linear-gradient(to right, rgba(201,162,39,0.5), rgba(201,162,39,0.1), transparent)" }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />

          <motion.div
            className="flex flex-wrap gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          >
            {[
              { value: `${players.length}`, label: "Παίκτες" },
              { value: "4",                 label: "Θέσεις" },
              { value: String(Math.round(players.reduce((s, p) => s + p.age, 0) / (players.length || 1) * 10) / 10), label: "Μέσος Όρος" },
              { value: "1933",              label: "Ίδρυση" },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-oswald font-bold text-[#C9A227] text-2xl leading-none">{s.value}</p>
                <p className="font-oswald text-[10px] tracking-[0.22em] uppercase text-white/35 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Filter tabs (cosmetic) */}
          <motion.div
            className="flex flex-wrap gap-2 mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.72 }}
          >
            {FILTERS.map((f, i) => (
              <button
                key={f}
                className="font-oswald text-[11px] tracking-[0.18em] uppercase px-4 py-2 rounded-lg transition-all duration-200"
                style={i === 0
                  ? { background: "#C9A227", color: "#000", fontWeight: 700 }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }
                }
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── PLAYER GRID ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {players.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i} />
          ))}
        </div>

        {/* ── COACHING STAFF ───────────────────────────────────────────── */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#C9A227] rounded-full" />
            <h2 className="font-oswald text-2xl font-bold text-white uppercase tracking-widest">Τεχνική Ηγεσία</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coaches.map((coach, i) => (
              <motion.div
                key={coach.id}
                className="rounded-2xl border px-5 py-5 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.07)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                whileHover={{ y: -4, borderColor: "rgba(201,162,39,0.25)", transition: { duration: 0.2 } }}
              >
                {coach.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coach.imageUrl} alt={`${coach.firstName} ${coach.lastName}`} className="w-11 h-11 rounded-full shrink-0 object-cover border border-white/10" />
                ) : (
                  <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center" style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
                    <span className="font-oswald font-bold text-[#C9A227] text-sm">{coach.firstName.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-oswald text-[10px] tracking-[0.22em] uppercase text-[#C9A227]/60 mb-0.5">{coach.role}</p>
                  <p className="font-oswald font-bold text-white text-sm tracking-wide">{coach.firstName} {coach.lastName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo2.png" alt="ΑΕΔ" width={60} height={60} />
            <div>
              <p className="font-oswald font-bold text-white tracking-wide text-sm">Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ</p>
              <p className="text-white/25 text-[10px] font-oswald tracking-widest">ΙΔΡΥΘΗΚΕ 1933</p>
            </div>
          </div>
          <div className="flex gap-6 text-[11px] font-oswald tracking-[0.15em] uppercase text-white/30">
            {[
              { label: "Ομάδα",      href: "/team" },
              { label: "Αγώνες",     href: "/matches" },
              { label: "Μεταγραφές", href: "/transfers" },
              { label: "Νέα",        href: "/news" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-[#C9A227] transition-colors duration-200">{item.label}</Link>
            ))}
          </div>
          <p className="text-white/20 text-xs font-oswald tracking-wider">© {new Date().getFullYear()} Α.Ε. Διδυμοτείχου 1933</p>
        </footer>

      </div>
    </div>
  );
}
