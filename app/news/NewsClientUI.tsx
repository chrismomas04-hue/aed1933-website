// app/news/NewsClientUI.tsx
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

// ─── Placeholder gradient per category ───────────────────────────────────────
const categoryGradients: Record<string, string> = {
  "Μεταγραφές":  "linear-gradient(135deg, rgba(201,162,39,0.18) 0%, rgba(20,20,20,1) 100%)",
  "Προετοιμασία":"linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(20,20,20,1) 100%)",
  "Φιλικά":      "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(20,20,20,1) 100%)",
  "Σύλλογος":    "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(20,20,20,1) 100%)",
};

const categoryColors: Record<string, string> = {
  "Μεταγραφές":  "#C9A227",
  "Προετοιμασία":"#4ade80",
  "Φιλικά":      "#60a5fa",
  "Σύλλογος":    "#c084fc",
};

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: any; index: number }) {
  const categoryName = article.category || "ΝΕΑ";
  const accent  = typeof categoryColors !== 'undefined' && categoryColors[categoryName] ? categoryColors[categoryName] : "#C9A227";
  const gradBg  = typeof categoryGradients !== 'undefined' && categoryGradients[categoryName] ? categoryGradients[categoryName] : "linear-gradient(135deg, rgba(40,40,40,1) 0%, rgba(20,20,20,1) 100%)";

  return (
    <motion.article
      className="group relative flex flex-col rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{
        y: -6,
        borderColor: `rgba(${accent === "#C9A227" ? "201,162,39" : accent === "#4ade80" ? "74,222,128" : accent === "#60a5fa" ? "96,165,250" : "192,132,252"},0.3)`,
        boxShadow: `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)`,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
    >
      <div className="relative w-full h-48 overflow-hidden shrink-0" style={{ background: gradBg }}>
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Image src="/logo2.png" alt="" width={80} height={80} />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className="font-oswald text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: `1px solid ${accent}40`,
              color: accent,
              backdropFilter: "blur(8px)",
            }}
          >
            {categoryName}
          </span>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(12,12,12,0.9) 0%, transparent 100%)" }}
        />
      </div>

      <div className="flex flex-col flex-1 px-5 py-4">
        <p className="font-oswald text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.28)" }}>
          {new Date(article.createdAt).toLocaleDateString('el-GR')}
        </p>
        <h2 className="font-oswald font-bold text-white text-base leading-snug tracking-wide mb-3 group-hover:text-[#C9A227] transition-colors duration-300">
          {article.title}
        </h2>
        <p className="font-oswald text-[13px] leading-relaxed flex-1 mb-5" style={{ color: "rgba(255,255,255,0.32)" }}>
          {article.summary}
        </p>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <Link
            href={`/news/${article.id}`}
            className="font-oswald text-[11px] tracking-[0.18em] uppercase flex items-center gap-2 transition-colors duration-200"
            style={{ color: accent }}
          >
            Διαβάστε περισσότερα
            <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, ${accent}70, transparent)` }}
      />
    </motion.article>
  );
}

// ─── Main UI Component ────────────────────────────────────────────────────────
export default function NewsClientUI({ newsArticles }: { newsArticles: any[] }) {
  useLenis(); 

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,30,10,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24">
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
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">
              Νέα
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              ΤΕΛΕΥΤΑΙΑ
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-oswald font-bold text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight text-[#C9A227]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
            >
              ΝΕΑ
            </motion.h1>
          </div>

          <motion.div
            className="mt-8 h-px"
            style={{ background: "linear-gradient(to right, rgba(201,162,39,0.6), rgba(201,162,39,0.1), transparent)" }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />

          <motion.p
            className="font-oswald text-[11px] tracking-[0.25em] uppercase text-white/25 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            {newsArticles.length} ανακοινώσεις
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"> 
          {newsArticles.map((article: any, i: number) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <button
            className="font-oswald text-[11px] tracking-[0.25em] uppercase px-8 py-3 rounded-xl border border-white/10 text-white/35 hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            Περισσότερα άρθρα
          </button>
        </motion.div>

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