"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

const categoryColors: Record<string, string> = {
  "Μεταγραφές":   "#C9A227",
  "Προετοιμασία": "#4ade80",
  "Φιλικά":       "#60a5fa",
  "Σύλλογος":     "#c084fc",
};
const categoryGradients: Record<string, string> = {
  "Μεταγραφές":   "linear-gradient(135deg, rgba(201,162,39,0.18) 0%, rgba(20,20,20,1) 100%)",
  "Προετοιμασία": "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(20,20,20,1) 100%)",
  "Φιλικά":       "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(20,20,20,1) 100%)",
  "Σύλλογος":     "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(20,20,20,1) 100%)",
};

interface ArticleData {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  createdAt: Date;
}

function SmallCard({ article, index }: { article: ArticleData; index: number }) {
  const accent = categoryColors[article.category] ?? "#C9A227";
  return (
    <motion.article
      className="group rounded-2xl border overflow-hidden flex flex-col"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{ y: -4, borderColor: "rgba(201,162,39,0.25)", transition: { duration: 0.2 } }}
    >
      <div className="relative h-32 overflow-hidden" style={{ background: categoryGradients[article.category] ?? "linear-gradient(135deg,rgba(40,40,40,1),rgba(20,20,20,1))" }}>
        {article.imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center opacity-8"><Image src="/logo2.png" alt="" width={48} height={48} /></div>
        }
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="flex flex-col flex-1 px-4 py-4">
        <span className="font-oswald text-[9px] tracking-[0.22em] uppercase mb-2" style={{ color: accent }}>{article.category}</span>
        <p className="font-oswald font-bold text-white text-sm leading-snug flex-1 group-hover:text-[#C9A227] transition-colors duration-200">{article.title}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-oswald text-[10px] text-white/25">{new Date(article.createdAt).toLocaleDateString("el-GR")}</span>
          <Link href={`/news/${article.id}`} className="font-oswald text-[10px] tracking-widest uppercase" style={{ color: accent }}>Διαβάστε →</Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ArticleClientUI({ article, related }: { article: ArticleData; related: ArticleData[] }) {
  useLenis();
  const accent = categoryColors[article.category] ?? "#C9A227";
  const gradBg = categoryGradients[article.category] ?? "linear-gradient(135deg,rgba(40,40,40,1),rgba(20,20,20,1))";

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,30,10,0.5) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* Breadcrumb + back */}
        <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex items-center gap-2">
            <Link href="/" className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors">Αρχική</Link>
            <span className="text-white/20">›</span>
            <Link href="/news" className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors">Νέα</Link>
            <span className="text-white/20">›</span>
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70 truncate max-w-[140px]">{article.title}</span>
          </div>
          <Link href="/news" className="font-oswald text-[10px] tracking-[0.18em] uppercase text-white/35 hover:text-[#C9A227] transition-colors hidden sm:block">
            ← Όλα τα Νέα
          </Link>
        </motion.div>

        {/* Category + date */}
        <motion.div className="flex items-center gap-3 mb-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}>
          <span className="font-oswald font-bold text-[10px] tracking-[0.22em] uppercase px-3 py-1 rounded-lg" style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}>
            {article.category}
          </span>
          {article.featured && <span className="font-oswald text-[10px] tracking-widest text-[#C9A227]/60">★ Προτεινόμενο</span>}
          <span className="font-oswald text-[10px] tracking-[0.2em] uppercase text-white/25">{new Date(article.createdAt).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" })}</span>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-8">
          <motion.h1 className="font-oswald font-bold text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight text-white"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}>
            {article.title}
          </motion.h1>
        </div>

        {/* Hero image */}
        <motion.div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: "16/7" }}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradBg }}>
              <Image src="/logo2.png" alt="" width={80} height={80} className="opacity-10" />
            </div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
        </motion.div>

        {/* Divider */}
        <motion.div className="h-px mb-10" style={{ background: `linear-gradient(to right, ${accent}60, ${accent}10, transparent)` }}
          initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }} />

        {/* Lead / Summary */}
        <motion.p className="font-oswald text-lg md:text-xl leading-relaxed text-white/70 mb-8 font-medium"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
          {article.summary}
        </motion.p>

        {/* Body content */}
        {(article.content || article.summary) && (
          <motion.div className="font-oswald text-[15px] leading-loose text-white/55 whitespace-pre-line"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
            {article.content ?? article.summary}
          </motion.div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <motion.div className="mt-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-5 bg-[#C9A227] rounded-full" />
              <h2 className="font-oswald text-xl font-bold text-white uppercase tracking-widest">Περισσότερα Νέα</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r, i) => <SmallCard key={r.id} article={r} index={i} />)}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo2.png" alt="ΑΕΔ" width={44} height={44} />
            <div>
              <p className="font-oswald font-bold text-white text-sm group-hover:text-[#C9A227] transition-colors">Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ</p>
              <p className="font-oswald text-white/25 text-[10px] tracking-widest">ΙΔΡΥΘΗΚΕ 1933</p>
            </div>
          </Link>
          <div className="flex gap-5 font-oswald text-[11px] tracking-[0.15em] uppercase text-white/30">
            {[{ label: "Ομάδα", href: "/team" }, { label: "Αγώνες", href: "/matches" }, { label: "Νέα", href: "/news" }].map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-[#C9A227] transition-colors">{l.label}</Link>
            ))}
          </div>
          <p className="font-oswald text-white/20 text-xs tracking-wider">© {new Date().getFullYear()} Α.Ε. Διδυμοτείχου 1933</p>
        </footer>
      </div>
    </div>
  );
}
