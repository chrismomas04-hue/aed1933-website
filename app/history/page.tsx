// app/history/page.tsx
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

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Era {
  id: number;
  year: string;
  title: string;
  description: string;
  accent: "gold" | "green" | "blue" | "purple";
}

const eras: Era[] = [
  {
    id: 1,
    year: "1933",
    title: "Η Ίδρυση",
    description:
      "Ιδρύεται η Αθλητική Ένωση Διδυμοτείχου από μια ομάδα παθιασμένων νέων της πόλης. Το πρώτο γήπεδο στήνεται σε χωράφι στα περίχωρα — ένα όνειρο παίρνει σάρκα και οστά.",
    accent: "gold",
  },
  {
    id: 2,
    year: "1960",
    title: "Τα Πρώτα Τρόπαια",
    description:
      "Η ομάδα κατακτά τον τίτλο πρωταθλητή Θράκης για πρώτη φορά. Χιλιάδες κάτοικοι γεμίζουν τους δρόμους σε αυθόρμητο πανηγυρισμό — μια πόλη ολόκληρη γιορτάζει.",
    accent: "gold",
  },
  {
    id: 3,
    year: "1980",
    title: "Η Χρυσή Δεκαετία",
    description:
      "Η πιο λαμπρή περίοδος στην ιστορία του συλλόγου. Τρεις συνεχόμενες διακρίσεις, ανάδειξη ταλαντούχων παικτών που συνεχίζουν καριέρα σε επαγγελματικές ομάδες της χώρας.",
    accent: "green",
  },
  {
    id: 4,
    year: "2005",
    title: "Νέες Εγκαταστάσεις",
    description:
      "Εγκαινιάζεται το ανακαινισμένο δημοτικό γήπεδο με φυσικό χλοοτάπητα και νέες κερκίδες. Ο σύλλογος επενδύει στις υποδομές και στην ακαδημία νέων αθλητών.",
    accent: "blue",
  },
  {
    id: 5,
    year: "2024",
    title: "Επιστροφή στις Επιτυχίες",
    description:
      "Με νέα διοίκηση, ενισχυμένο ρόστερ και αναζωπυρωμένο πάθος, η ΑΕΔ επιστρέφει δυναμικά. Στόχος η άνοδος στην επόμενη κατηγορία και η επανεύρεση της ένδοξης ιστορίας της.",
    accent: "gold",
  },
];

// ─── Accent helpers ───────────────────────────────────────────────────────────
const accentMap = {
  gold:   { color: "#C9A227", rgb: "201,162,39",  border: "rgba(201,162,39,0.22)", glow: "rgba(201,162,39,0.08)" },
  green:  { color: "#4ade80", rgb: "74,222,128",  border: "rgba(74,222,128,0.22)", glow: "rgba(74,222,128,0.08)" },
  blue:   { color: "#60a5fa", rgb: "96,165,250",  border: "rgba(96,165,250,0.22)", glow: "rgba(96,165,250,0.08)" },
  purple: { color: "#c084fc", rgb: "192,132,252", border: "rgba(192,132,252,0.22)", glow: "rgba(192,132,252,0.08)" },
};

// ─── Timeline Node ────────────────────────────────────────────────────────────
function TimelineNode({ era, index }: { era: Era; index: number }) {
  const isLeft  = index % 2 === 0;
  const accent  = accentMap[era.accent];

  // slide from left or right
  const xFrom = isLeft ? -60 : 60;

  return (
    <div className="relative flex items-center w-full">

      {/* ── DESKTOP: left / right alternating layout ── */}
      <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] w-full items-center gap-0">

        {/* Left slot */}
        <div className={isLeft ? "flex justify-end pr-8" : ""}>
          {isLeft && (
            <motion.div
              className="max-w-sm w-full"
              initial={{ opacity: 0, x: xFrom }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <EraCard era={era} accent={accent} />
            </motion.div>
          )}
        </div>

        {/* Center: dot + line segment handled by parent */}
        <div className="flex flex-col items-center relative z-10">
          {/* Dot */}
          <motion.div
            className="w-4 h-4 rounded-full border-2 shrink-0"
            style={{
              background: accent.color,
              borderColor: accent.color,
              boxShadow: `0 0 14px ${accent.color}80`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: "backOut", delay: 0.15 }}
          />
        </div>

        {/* Right slot */}
        <div className={!isLeft ? "flex justify-start pl-8" : ""}>
          {!isLeft && (
            <motion.div
              className="max-w-sm w-full"
              initial={{ opacity: 0, x: xFrom }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <EraCard era={era} accent={accent} />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MOBILE: all cards below the line on the right ── */}
      <div className="flex md:hidden items-start w-full gap-5">
        {/* Dot */}
        <div className="flex flex-col items-center shrink-0 mt-1">
          <motion.div
            className="w-3.5 h-3.5 rounded-full border-2 shrink-0"
            style={{
              background: accent.color,
              borderColor: accent.color,
              boxShadow: `0 0 10px ${accent.color}80`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "backOut" }}
          />
        </div>

        {/* Card */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <EraCard era={era} accent={accent} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Era Card ─────────────────────────────────────────────────────────────────
function EraCard({
  era,
  accent,
}: {
  era: Era;
  accent: { color: string; rgb: string; border: string; glow: string };
}) {
  return (
    <div
      className="group relative rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        background: `radial-gradient(ellipse 120% 80% at 0% 0%, ${accent.glow} 0%, rgba(255,255,255,0.025) 60%)`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: accent.border,
        boxShadow: "0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 inset-y-0 w-0.5"
        style={{
          background: `linear-gradient(to bottom, ${accent.color}, ${accent.color}30)`,
        }}
      />

      <div className="px-6 py-5">
        {/* Year */}
        <p
          className="font-oswald font-bold text-[clamp(2.8rem,6vw,4rem)] leading-none tracking-tight mb-2"
          style={{ color: accent.color }}
        >
          {era.year}
        </p>

        {/* Title */}
        <h3 className="font-oswald font-bold text-white text-lg tracking-widest uppercase mb-3 leading-tight">
          {era.title}
        </h3>

        {/* Divider */}
        <div
          className="h-px w-12 mb-4"
          style={{ background: `linear-gradient(to right, ${accent.color}60, transparent)` }}
        />

        {/* Description */}
        <p
          className="font-oswald text-[13px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {era.description}
        </p>
      </div>

      {/* Hover top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${accent.color}80, transparent)`,
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function HistoryPage() {
  useLenis();

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Ambient radial glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(40,30,5,0.55) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-32 pb-28">

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="mb-20">

          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <Link
              href="/"
              className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors duration-200"
            >
              Αρχική
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">
              Ιστορία
            </span>
          </motion.div>

          {/* Title lines */}
          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.4rem,7vw,6rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            >
              Η ΙΣΤΟΡΙΑ ΜΑΣ
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.4rem,7vw,6rem)] leading-none tracking-tight text-[#C9A227]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
            >
              ΑΠΟ ΤΟ 1933
            </motion.h1>
          </div>

          {/* Gold divider */}
          <motion.div
            className="mt-8 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(201,162,39,0.6), rgba(201,162,39,0.1), transparent)",
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />

          {/* Subtitle */}
          <motion.p
            className="font-oswald text-[13px] leading-relaxed text-white/30 mt-6 max-w-lg tracking-wide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.62 }}
          >
            Εννέα δεκαετίες πάθους, αγώνων και αφοσίωσης στα χρώματα
            του Διδυμοτείχου. Αυτή είναι η ιστορία μας.
          </motion.p>
        </div>

        {/* ── TIMELINE ─────────────────────────────────────────────────── */}
        <div className="relative">

          {/* ── Vertical center line (desktop) ── */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.10) 92%, transparent 100%)",
            }}
          />

          {/* ── Vertical left line (mobile) ── */}
          <div
            className="md:hidden absolute left-[7px] top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.10) 92%, transparent 100%)",
            }}
          />

          {/* ── Nodes ── */}
          <div className="flex flex-col gap-14 md:gap-16 pl-8 md:pl-0">
            {eras.map((era, i) => (
              <TimelineNode key={era.id} era={era} index={i} />
            ))}
          </div>

          {/* End cap dot */}
          <motion.div
            className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </div>

        {/* ── CLOSING QUOTE ────────────────────────────────────────────── */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div
            className="inline-block rounded-2xl border border-white/6 px-10 py-8"
            style={{
              background: "rgba(201,162,39,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <p className="font-oswald text-[#C9A227]/60 text-xs tracking-[0.3em] uppercase mb-3">
              Παραμένουμε πιστοί στο παρελθόν μας
            </p>
            <p className="font-oswald font-bold text-white/70 text-xl md:text-2xl tracking-wide leading-snug">
              "Ο σύλλογος δεν είναι μόνο αποτελέσματα —
              <br className="hidden md:block" />
              είναι η ψυχή μιας ολόκληρης πόλης."
            </p>
          </div>
        </motion.div>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo2.png" alt="ΑΕΔ" width={60} height={60} />
            <div>
              <p className="font-oswald font-bold text-white tracking-wide text-sm group-hover:text-[#C9A227] transition-colors duration-200">
                Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ
              </p>
              <p className="text-white/25 text-[10px] font-oswald tracking-widest">
                ΙΔΡΥΘΗΚΕ 1933
              </p>
            </div>
          </Link>
          <div className="flex gap-6 text-[11px] font-oswald tracking-[0.15em] uppercase text-white/30">
            {[
              { label: "Ομάδα",      href: "/team" },
              { label: "Αγώνες",     href: "/matches" },
              { label: "Μεταγραφές", href: "/transfers" },
              { label: "Νέα",        href: "/news" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-[#C9A227] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-white/20 text-xs font-oswald tracking-wider">
            © {new Date().getFullYear()} Α.Ε. Διδυμοτείχου 1933
          </p>
        </footer>

      </div>
    </div>
  );
}