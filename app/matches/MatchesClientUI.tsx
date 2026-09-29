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
export interface MatchData {
  id: string;
  date: string;
  time: string;
  competition: string;
  round: string;
  home: string;
  away: string;
  homeShort: string;
  awayShort: string;
  scoreHome: number | null;
  scoreAway: number | null;
  done: boolean;
  result: string | null;
  venue: string;
  imageUrl?: string | null;
}

// ─── Result Badge ─────────────────────────────────────────────────────────────
function ResultBadge({ result }: { result: string | null }) {
  if (!result) return null;
  const map: Record<string, { label: string; bg: string; border: string; color: string }> = {
    W: { label: "ΝΙΚΗ",      bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.35)",  color: "#4ade80" },
    D: { label: "ΙΣΟΠΑΛΙΑ", bg: "rgba(234,179,8,0.15)",  border: "rgba(234,179,8,0.35)",  color: "#facc15" },
    L: { label: "ΗΤΤΑ",      bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.35)",  color: "#f87171" },
  };
  const s = map[result];
  if (!s) return null;
  return (
    <span
      className="font-oswald font-bold text-[10px] tracking-[0.22em] uppercase px-3 py-1 rounded-lg"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({ match, index }: { match: MatchData; index: number }) {
  const isHome = match.home === "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ";

  return (
    <motion.div
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: match.done ? "rgba(255,255,255,0.08)" : "rgba(201,162,39,0.2)",
        boxShadow: match.done
          ? "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,39,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{
        borderColor: "rgba(201,162,39,0.3)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Image banner (if available) */}
      {match.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={match.imageUrl} alt={`${match.home} vs ${match.away}`} className="w-full h-32 object-cover" />
      )}

      {/* Top meta bar */}
      <div className="flex items-center justify-between px-5 md:px-8 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <span className="font-oswald text-[10px] tracking-[0.22em] uppercase text-[#C9A227]/70">{match.competition}</span>
          <span className="text-white/15 text-xs">·</span>
          <span className="font-oswald text-[10px] tracking-[0.18em] uppercase text-white/35">{match.round}</span>
        </div>
        <ResultBadge result={match.result} />
      </div>

      {/* Main match row */}
      <div className="flex items-center justify-between px-5 md:px-8 py-6 md:py-8 gap-4">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-start gap-1 min-w-0">
          <span
            className="font-oswald font-bold text-base md:text-xl lg:text-2xl leading-tight tracking-wide truncate w-full"
            style={{ color: match.home === "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)" }}
          >
            {match.home}
          </span>
          {match.home === "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ" && (
            <span className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227]/60">Εντός έδρας</span>
          )}
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center shrink-0 mx-2 md:mx-6">
          {match.done ? (
            <>
              <div className="flex items-center gap-2 md:gap-4">
                <span
                  className="font-oswald font-bold text-4xl md:text-6xl leading-none"
                  style={{ color: (match.result === "W" && isHome) || (match.result === "L" && !isHome) ? "#C9A227" : "rgba(255,255,255,0.9)" }}
                >
                  {match.scoreHome}
                </span>
                <span className="font-oswald text-white/20 text-2xl md:text-4xl font-light">—</span>
                <span
                  className="font-oswald font-bold text-4xl md:text-6xl leading-none"
                  style={{ color: (match.result === "W" && !isHome) || (match.result === "L" && isHome) ? "#C9A227" : "rgba(255,255,255,0.9)" }}
                >
                  {match.scoreAway}
                </span>
              </div>
              <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-white/25 mt-2">Τελικό</span>
            </>
          ) : (
            <>
              <div className="px-5 py-2 rounded-xl mb-1" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}>
                <span className="font-oswald font-bold text-[#C9A227] text-2xl md:text-3xl tracking-widest leading-none">{match.time}</span>
              </div>
              <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-white/25">Ώρα έναρξης</span>
            </>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-end gap-1 min-w-0">
          <span
            className="font-oswald font-bold text-base md:text-xl lg:text-2xl leading-tight tracking-wide truncate w-full text-right"
            style={{ color: match.away === "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)" }}
          >
            {match.away}
          </span>
          {match.away === "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ" && (
            <span className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227]/60">Εκτός έδρας</span>
          )}
        </div>
      </div>

      {/* Bottom venue bar */}
      <div className="flex items-center justify-between px-5 md:px-8 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2 text-white/25">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="font-oswald text-[10px] tracking-[0.18em] uppercase">{match.venue}</span>
        </div>
        <span className="font-oswald text-[10px] tracking-[0.18em] uppercase text-white/20">{match.date}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT UI
// ═══════════════════════════════════════════════════════════════════════════════
export default function MatchesClientUI({ matches }: { matches: MatchData[] }) {
  useLenis();

  const played   = matches.filter((m) => m.done);
  const upcoming = matches.filter((m) => !m.done);
  const wins     = played.filter((m) => m.result === "W").length;
  const draws    = played.filter((m) => m.result === "D").length;
  const losses   = played.filter((m) => m.result === "L").length;

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,60,20,0.45) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">

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
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">Αγώνες</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              ΠΡΟΓΡΑΜΜΑ &
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-[#C9A227]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            >
              ΑΠΟΤΕΛΕΣΜΑΤΑ
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
            className="flex flex-wrap gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          >
            {[
              { value: String(played.length),   label: "Αγώνες" },
              { value: String(wins),             label: "Νίκες",     color: "#4ade80" },
              { value: String(draws),            label: "Ισοπαλίες", color: "#facc15" },
              { value: String(losses),           label: "Ήττες",     color: "#f87171" },
              { value: String(upcoming.length),  label: "Επόμενοι" },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-oswald font-bold text-2xl leading-none" style={{ color: s.color ?? "#C9A227" }}>{s.value}</p>
                <p className="font-oswald text-[10px] tracking-[0.22em] uppercase text-white/35 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── PLAYED ───────────────────────────────────────────────────── */}
        {played.length > 0 && (
          <div className="mb-12">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-1 h-6 bg-[#C9A227] rounded-full" />
              <h2 className="font-oswald text-xl font-bold text-white uppercase tracking-widest">Αποτελέσματα</h2>
            </motion.div>
            <div className="space-y-4">
              {played.map((match, i) => <MatchCard key={match.id} match={match} index={i} />)}
            </div>
          </div>
        )}

        {/* ── UPCOMING ─────────────────────────────────────────────────── */}
        {upcoming.length > 0 && (
          <div>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-1 h-6 bg-[#C9A227] rounded-full" />
              <h2 className="font-oswald text-xl font-bold text-white uppercase tracking-widest">Επόμενοι Αγώνες</h2>
            </motion.div>
            <div className="space-y-4">
              {upcoming.map((match, i) => <MatchCard key={match.id} match={match} index={played.length + i} />)}
            </div>
          </div>
        )}

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo2.png" alt="ΑΕΔ" width={60} height={60} />
            <div>
              <p className="font-oswald font-bold text-white tracking-wide text-sm group-hover:text-[#C9A227] transition-colors duration-200">Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ</p>
              <p className="text-white/25 text-[10px] font-oswald tracking-widest">ΙΔΡΥΘΗΚΕ 1933</p>
            </div>
          </Link>
          <div className="flex gap-6 text-[11px] font-oswald tracking-[0.15em] uppercase text-white/30">
            {[
              { label: "Ομάδα",   href: "/team" },
              { label: "Αγώνες",  href: "/matches" },
              { label: "Νέα",     href: "/news" },
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
