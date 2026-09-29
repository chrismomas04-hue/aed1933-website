"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";

// ─── Lenis ────────────────────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Shared animation variants ────────────────────────────────────────────────
const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const, delay } }),
};

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", delay = 0, blurPx = 20 }: { children: React.ReactNode; className?: string; delay?: number; blurPx?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={`rounded-3xl border border-white/10 overflow-hidden ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: `blur(${blurPx}px)`, WebkitBackdropFilter: `blur(${blurPx}px)`, boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}>
      {children}
    </motion.div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className="flex items-center gap-3 mb-6"
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
      <div className="w-1 h-6 bg-[#C9A227] rounded-full" />
      <h2 className="font-oswald text-2xl font-bold text-white uppercase tracking-widest">{label}</h2>
    </motion.div>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = ["Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ 1933", "ΕΘΝΙΚΗ ΚΑΤΗΓΟΡΙΑ", "ΠΡΩΤΑΘΛΗΤΙΣΜΟΣ · ΑΡΕΤΗ · ΠΑΡΑΔΟΣΗ", "ΑΠΟ ΤΟ 1933 ΣΤΗΝ ΚΟΡΥΦΗ"];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-white/8 py-3">
      <motion.div className="flex gap-14 whitespace-nowrap" animate={{ x: ["0%", "-33.33%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
        {items.map((item, i) => (
          <span key={i} className="text-[#C9A227] font-oswald font-bold tracking-[0.22em] text-xs uppercase shrink-0">
            {item}<span className="mx-5 opacity-30">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const pageStats = [
  { value: "18", label: "Αγώνες" },
  { value: "12", label: "Νίκες" },
  { value: "38", label: "Βαθμοί" },
  { value: "1ος", label: "Θέση" },
];

const history = [
  { year: "1933", label: "Ίδρυση του συλλόγου στο Διδυμότειχο" },
  { year: "1958", label: "Πρώτος τίτλος Θράκης — ιστορική κατάκτηση" },
  { year: "1987", label: "Άνοδος σε Γ' Εθνική για πρώτη φορά" },
  { year: "2010", label: "Ολοκλήρωση ανακαίνισης γηπέδου" },
  { year: "2024", label: "Νέα εποχή — είσοδος στην Εθνική Κατηγορία" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewsItem   { id: string; title: string; summary: string; category: string; imageUrl: string | null; createdAt: Date; featured: boolean }
interface MatchItem  { id: string; home: string; away: string; scoreHome: number | null; scoreAway: number | null; done: boolean; result: string | null; date: string; time: string; competition: string; round: string }
interface TransferItem { id: string; firstName: string; lastName: string; position: string; positionShort: string; club: string; type: string; imageUrl: string | null }

interface Props {
  news: NewsItem[];
  matches: MatchItem[];
  transfers: TransferItem[];
}

const categoryColors: Record<string, string> = {
  "Μεταγραφές": "#C9A227", "Προετοιμασία": "#4ade80", "Φιλικά": "#60a5fa", "Σύλλογος": "#c084fc",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOME CLIENT UI
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomeClientUI({ news, matches, transfers }: Props) {
  useLenis();

  const featuredNews = news.filter((n) => n.featured);
  const otherNews = news.filter((n) => !n.featured).slice(0, 4);

  return (
    <div className="bg-black text-white antialiased overflow-x-hidden">
      <Navbar />

      {/* VIDEO BG */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video src="/hero-bg.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-right" style={{ transform: "scale(1.05)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 w-full lg:w-[54%] min-h-screen px-6 md:px-10 lg:pr-8">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col justify-center pt-28 pb-16">
          <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}>
            <motion.div className="relative" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
              <div className="absolute inset-0 rounded-full bg-[#C9A227]/20 blur-xl scale-150" />
              <Image src="/logo2.png" alt="ΑΕΔ 1933" width={72} height={72} priority className="relative drop-shadow-[0_0_20px_rgba(201,162,39,0.4)]" />
            </motion.div>
            <div>
              <p className="font-oswald text-[10px] tracking-[0.35em] text-[#C9A227]/70 uppercase">Εθνική Κατηγορία</p>
              <p className="font-oswald font-bold text-white/60 text-sm tracking-widest">Σεζόν 2024–25</p>
            </div>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1 className="font-oswald font-bold text-[clamp(3.5rem,9vw,7rem)] leading-none tracking-tight text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.30 }}>Α.Ε.</motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 className="font-oswald font-bold text-[clamp(2rem,5.5vw,4.5rem)] leading-none tracking-tight text-[#C9A227]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}>ΔΙΔΥΜΟΤΕΙΧΟΥ</motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h2 className="font-oswald font-bold text-[clamp(3.5rem,9vw,7rem)] leading-none tracking-tight text-white/12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}>1933</motion.h2>
          </div>

          <motion.p className="text-white/45 text-sm md:text-base leading-relaxed max-w-sm font-light tracking-wide mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.70 }}>
            Εννέα δεκαετίες ιστορίας. Ένα πάθος αμείωτο. Η ψυχή του Διδυμοτείχου στον αγωνιστικό χώρο.
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.82 }}>
            <Link href="/team" className="font-oswald uppercase tracking-[0.18em] text-sm px-7 py-3 font-bold rounded-xl transition-all duration-200 hover:brightness-110" style={{ background: "#C9A227", color: "#000" }}>Ομάδα</Link>
            <Link href="/history" className="font-oswald uppercase tracking-[0.18em] text-sm px-7 py-3 rounded-xl transition-all duration-200" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.65)" }}>Ιστορία</Link>
          </motion.div>

          {/* Stats glass */}
          <motion.div className="rounded-3xl border border-white/10 overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.92 }}>
            <div className="grid grid-cols-4 divide-x divide-white/8">
              {pageStats.map((s, i) => (
                <div key={i} className="px-5 py-5 text-center">
                  <p className="font-oswald font-bold text-[#C9A227] text-2xl md:text-3xl leading-none">{s.value}</p>
                  <p className="text-[10px] font-oswald tracking-[0.2em] uppercase text-white/35 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.05 }}>
            <Ticker />
          </motion.div>
        </section>

        {/* ── MATCHES ──────────────────────────────────────────────── */}
        <section className="py-16">
          <SectionHeading label="Αγώνες" />
          <div className="space-y-3">
            {matches.slice(0, 5).map((m, i) => (
              <GlassCard key={m.id} delay={i * 0.07} blurPx={18}>
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {m.done ? (
                      <span className={`text-[9px] font-oswald font-bold tracking-wider px-2 py-0.5 rounded shrink-0 ${m.result === "W" ? "bg-emerald-500/20 text-emerald-400" : m.result === "D" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                        {m.result === "W" ? "ΝΙΚ" : m.result === "D" ? "ΙΣΟ" : "ΗΤΤ"}
                      </span>
                    ) : (
                      <span className="text-[9px] font-oswald tracking-wider px-2 py-0.5 rounded bg-white/8 text-white/30 shrink-0">{m.date}</span>
                    )}
                    <span className="font-oswald text-sm text-white/80 truncate">{m.home}</span>
                  </div>
                  <div className="mx-5 text-center shrink-0">
                    {m.done
                      ? <span className="font-oswald font-bold text-[#C9A227] text-lg">{m.scoreHome}–{m.scoreAway}</span>
                      : <span className="font-oswald text-white/20 text-sm tracking-widest">vs</span>
                    }
                  </div>
                  <span className="font-oswald text-sm text-white/80 flex-1 text-right truncate">{m.away}</span>
                </div>
              </GlassCard>
            ))}
            {matches.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-6">Δεν υπάρχουν αγώνες</p>}
          </div>
          <div className="mt-4 text-right">
            <Link href="/matches" className="font-oswald text-[11px] tracking-[0.2em] uppercase text-[#C9A227]/60 hover:text-[#C9A227] transition-colors">Όλοι οι Αγώνες →</Link>
          </div>
        </section>

        {/* ── TRANSFERS ────────────────────────────────────────────── */}
        <section className="py-16">
          <SectionHeading label="Μεταγραφές" />
          <div className="space-y-3">
            {transfers.slice(0, 4).map((t, i) => (
              <GlassCard key={t.id} delay={i * 0.08} blurPx={22}>
                <div className="flex items-center gap-4 px-5 py-4">
                  {t.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.imageUrl} alt={`${t.firstName} ${t.lastName}`} className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === "IN" ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-red-500/15 border border-red-500/30"}`}>
                      <span className={`font-oswald font-bold text-sm ${t.type === "IN" ? "text-emerald-400" : "text-red-400"}`}>{t.type === "IN" ? "↓" : "↑"}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-oswald font-bold text-white text-sm">{t.firstName} {t.lastName}</p>
                    <p className="text-[11px] text-white/40 font-oswald mt-0.5">{t.position} · {t.club}</p>
                  </div>
                  <span className={`font-oswald text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg shrink-0 ${t.type === "IN" ? "bg-emerald-500/12 text-emerald-400" : "bg-red-500/12 text-red-400"}`}>
                    {t.type === "IN" ? "Απόκτηση" : "Αποχώρηση"}
                  </span>
                </div>
              </GlassCard>
            ))}
            {transfers.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-6">Δεν υπάρχουν μεταγραφές</p>}
          </div>
          <div className="mt-4 text-right">
            <Link href="/transfers" className="font-oswald text-[11px] tracking-[0.2em] uppercase text-[#C9A227]/60 hover:text-[#C9A227] transition-colors">Όλες οι Μεταγραφές →</Link>
          </div>
        </section>

        {/* ── NEWS ─────────────────────────────────────────────────── */}
        <section className="py-16">
          <SectionHeading label="Νέα" />
          <div className="space-y-3">
            {/* Featured articles */}
            {featuredNews.map((n, i) => (
              <GlassCard key={n.id} delay={i * 0.05} blurPx={28}>
                <div className="px-6 py-6">
                  {n.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.imageUrl} alt={n.title} className="w-full h-36 object-cover rounded-xl mb-4 opacity-80" />
                  )}
                  <span className="inline-block font-oswald text-[10px] tracking-[0.25em] uppercase text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/20 px-3 py-1 rounded-lg mb-4">
                    {n.category}
                  </span>
                  <h3 className="font-oswald font-bold text-white text-xl md:text-2xl leading-tight">{n.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-white/30 text-xs font-oswald tracking-wider">{new Date(n.createdAt).toLocaleDateString("el-GR")}</p>
                    <Link href={`/news/${n.id}`} className="font-oswald text-[11px] tracking-widest uppercase text-[#C9A227] hover:text-white transition-colors duration-200">Ανάγνωση →</Link>
                  </div>
                </div>
              </GlassCard>
            ))}
            {/* Other articles */}
            {otherNews.map((n, i) => {
              const accent = categoryColors[n.category] ?? "#C9A227";
              return (
                <GlassCard key={n.id} delay={(i + 1) * 0.07} blurPx={14}>
                  <Link href={`/news/${n.id}`} className="flex items-center gap-4 px-5 py-4 group">
                    {n.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-oswald text-[9px] tracking-[0.22em] uppercase" style={{ color: accent }}>{n.category}</span>
                      <p className="font-oswald font-bold text-white text-sm mt-1 leading-tight group-hover:text-[#C9A227] transition-colors">{n.title}</p>
                    </div>
                    <p className="text-white/25 text-[10px] font-oswald tracking-wider shrink-0 text-right">{new Date(n.createdAt).toLocaleDateString("el-GR")}</p>
                  </Link>
                </GlassCard>
              );
            })}
            {news.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-6">Δεν υπάρχουν άρθρα</p>}
          </div>
          <div className="mt-4 text-right">
            <Link href="/news" className="font-oswald text-[11px] tracking-[0.2em] uppercase text-[#C9A227]/60 hover:text-[#C9A227] transition-colors">Όλα τα Νέα →</Link>
          </div>
        </section>

        {/* ── HISTORY ──────────────────────────────────────────────── */}
        <section className="py-16">
          <SectionHeading label="Ιστορία" />
          <GlassCard delay={0.1} blurPx={20}>
            <div className="p-6">
              {history.map((ev, i) => (
                <motion.div key={i} className="flex gap-5 py-4 border-b border-white/5 last:border-0"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.07 }}>
                  <span className="font-oswald font-bold text-[#C9A227] text-sm tracking-widest w-12 shrink-0 pt-0.5">{ev.year}</span>
                  <p className="text-white/60 text-sm leading-relaxed">{ev.label}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
          <div className="mt-4 text-right">
            <Link href="/history" className="font-oswald text-[11px] tracking-[0.2em] uppercase text-[#C9A227]/60 hover:text-[#C9A227] transition-colors">Πλήρης Ιστορία →</Link>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="py-16 border-t border-white/5">
          <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: "easeOut" }}>
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo2.png" alt="ΑΕΔ" width={44} height={44} />
              <div>
                <p className="font-oswald font-bold text-white tracking-wide text-sm group-hover:text-[#C9A227] transition-colors duration-200">Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ</p>
                <p className="text-white/25 text-[10px] font-oswald tracking-widest">ΙΔΡΥΘΗΚΕ 1933</p>
              </div>
            </Link>
            <div className="flex gap-6 text-[11px] font-oswald tracking-[0.15em] uppercase text-white/30">
              {[{ label: "Ομάδα", href: "/team" }, { label: "Αγώνες", href: "/matches" }, { label: "Νέα", href: "/news" }, { label: "Επικοινωνία", href: "#" }].map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-[#C9A227] transition-colors duration-200">{item.label}</Link>
              ))}
            </div>
            <p className="text-white/20 text-xs font-oswald tracking-wider">© {new Date().getFullYear()} Α.Ε. Διδυμοτείχου 1933</p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
