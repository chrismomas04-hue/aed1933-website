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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TransferData {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  positionShort: string;
  club: string;
  age: number;
  nationality: string;
  type: string; // "IN" | "OUT"
  imageUrl?: string | null;
}

// ─── Transfer Card ────────────────────────────────────────────────────────────
function TransferCard({ transfer, index }: { transfer: TransferData; index: number }) {
  const isIn = transfer.type === "IN";
  const accentColor  = isIn ? "34,197,94"   : "239,68,68";
  const borderIdle   = isIn ? "rgba(34,197,94,0.12)"  : "rgba(239,68,68,0.12)";
  const borderHover  = isIn ? "rgba(34,197,94,0.4)"   : "rgba(239,68,68,0.4)";
  const badgeBg      = isIn ? "rgba(34,197,94,0.10)"  : "rgba(239,68,68,0.10)";
  const badgeBorder  = isIn ? "rgba(34,197,94,0.28)"  : "rgba(239,68,68,0.28)";
  const badgeColor   = isIn ? "#4ade80"                : "#f87171";
  const iconBg       = isIn ? "rgba(34,197,94,0.10)"  : "rgba(239,68,68,0.10)";
  const iconBorder   = isIn ? "rgba(34,197,94,0.25)"  : "rgba(239,68,68,0.25)";
  const iconColor    = isIn ? "#4ade80"                : "#f87171";
  const fromTo       = isIn ? "Από" : "Προς";

  return (
    <motion.div
      className="group relative rounded-2xl border overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: borderIdle,
        boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.09 }}
      whileHover={{
        borderColor: borderHover,
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${borderHover}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 10% 50%, rgba(${accentColor},0.06) 0%, transparent 70%)` }}
      />

      <div className="relative flex items-center gap-4 px-5 py-4">
        {/* Avatar / direction icon */}
        {transfer.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={transfer.imageUrl} alt={`${transfer.firstName} ${transfer.lastName}`} className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
            <span className="font-oswald font-bold text-lg leading-none" style={{ color: iconColor }}>{isIn ? "↓" : "↑"}</span>
          </div>
        )}

        {/* Player info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-oswald font-bold text-white text-base leading-tight tracking-wide">{transfer.lastName}</p>
            <p className="font-oswald text-white/40 text-sm leading-tight">{transfer.firstName}</p>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className="font-oswald text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-md"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor }}
            >
              {transfer.positionShort}
            </span>
            <span className="font-oswald text-[11px] text-white/35 tracking-wide">{transfer.position}</span>
          </div>
        </div>

        {/* Club */}
        <div className="text-right shrink-0">
          <p className="font-oswald text-[9px] tracking-[0.2em] uppercase text-white/25 mb-0.5">{fromTo}</p>
          <p className="font-oswald font-bold text-white/60 text-sm leading-tight">{transfer.club}</p>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, rgba(${accentColor},0.5), transparent)` }}
      />
    </motion.div>
  );
}

// ─── Column Header ────────────────────────────────────────────────────────────
function ColumnHeader({ label, count, type, delay }: { label: string; count: number; type: "IN" | "OUT"; delay: number }) {
  const isIn     = type === "IN";
  const color    = isIn ? "#4ade80"               : "#f87171";
  const bg       = isIn ? "rgba(34,197,94,0.10)"  : "rgba(239,68,68,0.10)";
  const border   = isIn ? "rgba(34,197,94,0.25)"  : "rgba(239,68,68,0.25)";

  return (
    <motion.div
      className="flex items-center justify-between mb-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full" style={{ background: color }} />
        <h2 className="font-oswald text-xl font-bold text-white uppercase tracking-widest">{label}</h2>
      </div>
      <span className="font-oswald font-bold text-sm px-3 py-1 rounded-lg" style={{ background: bg, border: `1px solid ${border}`, color }}>
        {count}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT UI
// ═══════════════════════════════════════════════════════════════════════════════
export default function TransfersClientUI({ transfers }: { transfers: TransferData[] }) {
  useLenis();

  const arrivals   = transfers.filter((t) => t.type === "IN");
  const departures = transfers.filter((t) => t.type === "OUT");

  return (
    <div className="bg-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,60,20,0.45) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="mb-14">
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <Link href="/" className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors duration-200">Αρχική</Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">Μεταγραφές</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              ΜΕΤΑΓΡΑΦΕΣ
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-[#C9A227]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            >
              2026–27
            </motion.h1>
          </div>

          <motion.div
            className="mt-8 h-px"
            style={{ background: "linear-gradient(to right, rgba(201,162,39,0.6), rgba(201,162,39,0.1), transparent)" }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />

          <motion.div
            className="flex flex-wrap gap-10 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.62 }}
          >
            {[
              { value: String(transfers.length), label: "Σύνολο",      color: "#C9A227" },
              { value: String(arrivals.length),  label: "Αφίξεις",     color: "#4ade80" },
              { value: String(departures.length),label: "Αποχωρήσεις", color: "#f87171" },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-oswald font-bold text-2xl leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="font-oswald text-[10px] tracking-[0.22em] uppercase text-white/35 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── TWO-COLUMN GRID ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* ARRIVALS */}
          <div>
            <ColumnHeader label="Αφίξεις" count={arrivals.length} type="IN" delay={0.15} />
            <div className="space-y-3">
              {arrivals.map((t, i) => <TransferCard key={t.id} transfer={t} index={i} />)}
            </div>
            {arrivals.length === 0 && (
              <div className="rounded-2xl border border-white/5 px-6 py-8 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="font-oswald text-white/25 text-sm tracking-widest uppercase">Δεν υπάρχουν αφίξεις</p>
              </div>
            )}
          </div>

          {/* DEPARTURES */}
          <div>
            <ColumnHeader label="Αποχωρήσεις" count={departures.length} type="OUT" delay={0.25} />
            <div className="space-y-3">
              {departures.map((t, i) => <TransferCard key={t.id} transfer={t} index={i} />)}
            </div>
            {departures.length === 0 && (
              <div className="rounded-2xl border border-white/5 px-6 py-8 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="font-oswald text-white/25 text-sm tracking-widest uppercase">Δεν υπάρχουν αποχωρήσεις</p>
              </div>
            )}
          </div>
        </div>

        {/* ── INFO BANNER ──────────────────────────────────────────────── */}
        <motion.div
          className="mt-14 rounded-2xl border border-white/6 px-6 py-5 flex items-start gap-4"
          style={{ background: "rgba(201,162,39,0.04)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
            <span className="text-[#C9A227] text-xs font-oswald font-bold">i</span>
          </div>
          <div>
            <p className="font-oswald font-bold text-[#C9A227]/80 text-sm tracking-wider mb-1">Μεταγραφική Περίοδος 2024–25</p>
            <p className="font-oswald text-white/35 text-xs leading-relaxed tracking-wide">
              Τα στοιχεία ανανεώνονται με κάθε επίσημη ανακοίνωση του συλλόγου. Για επιβεβαίωση μεταγραφών επικοινωνήστε με τη διοίκηση.
            </p>
          </div>
        </motion.div>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo2.png" alt="ΑΕΔ" width={44} height={44} />
            <div>
              <p className="font-oswald font-bold text-white tracking-wide text-sm group-hover:text-[#C9A227] transition-colors duration-200">Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ</p>
              <p className="text-white/25 text-[10px] font-oswald tracking-widest">ΙΔΡΥΘΗΚΕ 1933</p>
            </div>
          </Link>
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
