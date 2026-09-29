"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import { createMembershipRequest } from "./actions";

// ─── Lenis ────────────────────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "BASIC",
    name: "ΚΑΡΤΑ ΦΙΛΑΘΛΟΥ",
    price: "20€",
    subtitle: "Οικονομική ενίσχυση",
    color: "#9ca3af",
    glowColor: "rgba(156,163,175,0.15)",
    borderIdle: "rgba(156,163,175,0.2)",
    borderHover: "rgba(156,163,175,0.45)",
    badge: null,
    perks: [
      "Οικονομική ενίσχυση συλλόγου",
      "Κάρτα Μέλους Α.Ε.Δ. 1933",
      "Ενημέρωση για δράσεις ομάδας",
    ],
  },
  {
    id: "GOLD",
    name: "ΚΑΡΤΑ ΔΙΑΡΚΕΙΑΣ GOLD",
    price: "50€",
    subtitle: "Δημοφιλέστερη επιλογή",
    color: "#C9A227",
    glowColor: "rgba(201,162,39,0.18)",
    borderIdle: "rgba(201,162,39,0.35)",
    borderHover: "rgba(201,162,39,0.7)",
    badge: "ΔΗΜΟΦΙΛΕΣΤΕΡΗ",
    perks: [
      "Ελεύθερη είσοδος σε ΟΛΟΥΣ τους εντός έδρας αγώνες",
      "Πρωτάθλημα & Κύπελλο",
      "Ονομαστική κάρτα διαρκείας",
      "Προτεραιότητα σε εκδηλώσεις",
    ],
  },
  {
    id: "VIP",
    name: "ΚΑΡΤΑ VIP / ΧΟΡΗΓΟΣ",
    price: "100€",
    subtitle: "Επίσημος υποστηρικτής",
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,0.15)",
    borderIdle: "rgba(167,139,250,0.25)",
    borderHover: "rgba(167,139,250,0.55)",
    badge: "VIP",
    perks: [
      "Είσοδος σε όλους τους αγώνες",
      "Διακεκριμένη θέση",
      "Συλλεκτικό δώρο / κασκόλ ομάδας",
      "Ευχαριστήριο ως επίσημος υποστηρικτής",
    ],
  },
] as const;

type TierId = "BASIC" | "GOLD" | "VIP";

// ─── Tier Card ────────────────────────────────────────────────────────────────
function TierCard({ tier, selected, onSelect }: { tier: typeof TIERS[number]; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      className="relative flex flex-col rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: selected ? tier.glowColor : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${selected ? tier.borderHover : tier.borderIdle}`,
        boxShadow: selected
          ? `0 0 0 1px ${tier.borderHover}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onSelect}
    >
      {tier.badge && (
        <div className="absolute top-4 right-4">
          <span className="font-oswald text-[9px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded-lg"
            style={{ background: `${tier.color}20`, border: `1px solid ${tier.color}50`, color: tier.color }}>
            {tier.badge}
          </span>
        </div>
      )}

      {/* Card visual */}
      <div className="relative h-44 flex flex-col justify-between p-6 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${tier.glowColor} 0%, rgba(0,0,0,0.5) 100%)` }}>
        {/* Watermark number */}
        <div className="absolute right-4 bottom-0 font-oswald font-bold text-[6rem] leading-none select-none pointer-events-none"
          style={{ color: `${tier.color}08` }}>AED</div>

        {/* Logo + chip line */}
        <div className="flex items-center justify-between">
          <Image src="/logo2.png" alt="ΑΕΔ" width={40} height={40} className="opacity-80" />
          <div className="w-10 h-7 rounded-md opacity-40" style={{ background: `linear-gradient(135deg, ${tier.color}60, ${tier.color}20)`, border: `1px solid ${tier.color}40` }} />
        </div>

        {/* Price */}
        <div>
          <p className="font-oswald font-bold leading-none" style={{ color: tier.color, fontSize: "clamp(2rem,5vw,2.8rem)" }}>{tier.price}</p>
          <p className="font-oswald text-[10px] tracking-[0.3em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{tier.subtitle}</p>
        </div>

        {/* Card shimmer */}
        {selected && (
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${tier.color}80, transparent)` }} />
        )}
      </div>

      {/* Perks */}
      <div className="flex flex-col flex-1 px-6 py-5 gap-2.5">
        <p className="font-oswald font-bold text-white text-sm tracking-wide uppercase mb-1">{tier.name}</p>
        {tier.perks.map((perk, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-sm" style={{ color: tier.color }}>✓</span>
            <span className="font-oswald text-[12px] leading-relaxed text-white/55">{perk}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={onSelect}
          className="w-full font-oswald font-bold text-[11px] tracking-[0.2em] uppercase py-3 rounded-xl transition-all duration-200"
          style={selected
            ? { background: tier.color, color: tier.id === "GOLD" ? "#000" : "#fff" }
            : { background: `${tier.color}12`, border: `1px solid ${tier.color}30`, color: tier.color }
          }
        >
          {selected ? "✓ Επιλεγμένο" : "Επιλογή Πακέτου"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-oswald placeholder-white/20 focus:outline-none focus:border-[#C9A227]/50 transition-colors";
const selectCls = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-oswald focus:outline-none focus:border-[#C9A227]/50 transition-colors";
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-oswald text-[10px] tracking-[0.22em] uppercase text-white/35 mb-1.5 block">
      {children}{required && <span className="text-[#C9A227] ml-1">*</span>}
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
interface SuccessData {
  id: number;
  fullName: string;
  email: string;
  tier: TierId;
  deliveryMethod: string;
  address?: string;
}

function expiryDateGR(): string {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  return d.toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" });
}

export default function MembershipClientUI() {
  useLenis();
  const formRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedTier, setSelectedTier] = useState<TierId>("GOLD");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryMethod: "PICKUP",
    street: "",
    city: "",
    postalCode: "",
    floorBell: "",
    notes: "",
  });

  function selectTier(id: TierId) {
    setSelectedTier(id);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const snapshot = { ...form, tier: selectedTier };
    const combinedAddress = snapshot.deliveryMethod === "SHIPPING"
      ? `${snapshot.street}, ${snapshot.city}, Τ.Κ. ${snapshot.postalCode}${snapshot.floorBell ? ` (${snapshot.floorBell})` : ""}`
      : undefined;
    startTransition(async () => {
      const { id } = await createMembershipRequest({
        fullName: snapshot.fullName,
        phone: snapshot.phone,
        email: snapshot.email,
        tier: snapshot.tier,
        deliveryMethod: snapshot.deliveryMethod,
        address: combinedAddress,
        notes: snapshot.notes || undefined,
      });
      setSuccessData({ id, fullName: snapshot.fullName, email: snapshot.email, tier: snapshot.tier, deliveryMethod: snapshot.deliveryMethod, address: combinedAddress });
      setForm({ fullName: "", phone: "", email: "", deliveryMethod: "PICKUP", street: "", city: "", postalCode: "", floorBell: "", notes: "" });
    });
  }

  const tierCfg = TIERS.find((t) => t.id === selectedTier)!
  const success = successData !== null;

  return (
    <div className="bg-gradient-to-b from-green-950/60 via-black to-black text-white antialiased min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,50,20,0.5) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="mb-16 text-center">
          <motion.div className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Link href="/" className="font-oswald text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-[#C9A227] transition-colors">Αρχική</Link>
            <span className="text-white/20">›</span>
            <span className="font-oswald text-[10px] tracking-[0.3em] uppercase text-[#C9A227]/70">Κάρτες Μέλους</span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1 className="font-oswald font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-tight text-white"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
              ΓΙΝΕ ΜΕΛΟΣ
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h2 className="font-oswald font-bold text-[clamp(1.5rem,4vw,3rem)] leading-none tracking-tight text-[#C9A227]"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.33 }}>
              ΤΗΣ Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ 1933
            </motion.h2>
          </div>

          <motion.p className="mt-6 font-oswald text-sm text-white/40 max-w-lg mx-auto leading-relaxed tracking-wide"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}>
            Στήριξε την ομάδα σου. Απόκτησε την κάρτα διαρκείας ή κάρτα μέλους και ζήσε κάθε αγώνα από κοντά.
          </motion.p>

          <motion.div className="mt-8 h-px max-w-xs mx-auto" style={{ background: "linear-gradient(to right, transparent, rgba(201,162,39,0.5), transparent)" }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }} />
        </div>

        {/* ── TIER CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} selected={selectedTier === tier.id} onSelect={() => selectTier(tier.id as TierId)} />
          ))}
        </div>

        {/* ── FORM ───────────────────────────────────────────────── */}
        <div ref={formRef} className="scroll-mt-28">
          <motion.div className="max-w-2xl mx-auto rounded-3xl p-8 md:p-10"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${tierCfg.borderIdle}`, boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>

            {success && successData ? (
              /* ── SUCCESS / RECEIPT ── */
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                {/* Top check */}
                <div className="flex flex-col items-center mb-7">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.4)" }}>
                    <span className="text-2xl text-[#C9A227]">✓</span>
                  </div>
                  <h3 className="font-oswald font-bold text-white text-xl tracking-wide text-center">Η κράτησή σας καταχωρήθηκε!</h3>
                  <p className="font-oswald text-white/40 text-xs tracking-widest mt-1 text-center">Στάλθηκε email επιβεβαίωσης στο <span className="text-[#C9A227]">{successData.email}</span></p>
                </div>

                {/* Receipt card */}
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(201,162,39,0.25)" }}>
                  {/* Card header */}
                  <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg,rgba(201,162,39,0.12) 0%,rgba(0,0,0,0.5) 100%)", borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
                    <div>
                      <p className="font-oswald text-[9px] tracking-[0.3em] uppercase text-white/30">Κωδικός Κράτησης</p>
                      <p className="font-oswald font-bold text-[#C9A227] text-xl tracking-widest mt-0.5">#AED-{successData.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-oswald text-[9px] tracking-[0.3em] uppercase text-white/30">Πακέτο</p>
                      <p className="font-oswald font-bold text-white text-sm mt-0.5">{TIERS.find((t) => t.id === successData.tier)?.name}</p>
                      <p className="font-oswald font-bold text-[#C9A227]">{TIERS.find((t) => t.id === successData.tier)?.price}</p>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="px-5 py-4 space-y-3" style={{ background: "rgba(0,0,0,0.35)" }}>
                    {successData.deliveryMethod !== "SHIPPING" ? (
                      <>
                        <div>
                          <p className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227]/70 mb-1">Σημείο Παραλαβής</p>
                          <p className="font-oswald font-bold text-white text-sm">Γραφεία Α.Ε.Δ. 1933</p>
                          <p className="font-oswald text-white/40 text-xs">Δημοτικό Στάδιο Διδυμοτείχου</p>
                        </div>
                        <div>
                          <p className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227]/70 mb-1">Ωράριο Παραλαβής</p>
                          <p className="font-oswald text-white/60 text-xs">Δευτέρα – Παρασκευή: <span className="text-white">18:00 – 20:30</span></p>
                          <p className="font-oswald text-white/60 text-xs">Ημέρες εντός έδρας αγώνων (εκδοτήριο γηπέδου)</p>
                        </div>
                        <div className="rounded-xl px-4 py-3" style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.2)" }}>
                          <p className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227] mb-1">Προθεσμία Παραλαβής</p>
                          <p className="font-oswald text-white/60 text-xs">Η κράτηση ισχύει για <span className="text-white font-bold">10 ημέρες</span> — έως <span className="text-[#C9A227] font-bold">{expiryDateGR()}</span></p>
                          <p className="font-oswald text-white/40 text-xs mt-1">Εξόφληση κατά την παραλαβή.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="font-oswald text-[9px] tracking-[0.25em] uppercase text-[#C9A227]/70 mb-1">Αποστολή Ταχυδρομικώς</p>
                          <p className="font-oswald font-bold text-white text-sm">{successData.address || "—"}</p>
                        </div>
                        <div className="rounded-xl px-4 py-3" style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.2)" }}>
                          <p className="font-oswald text-white/55 text-xs">Η διοίκηση της Α.Ε.Δ. θα επικοινωνήσει τηλεφωνικά εντός <span className="text-white font-bold">2 εργάσιμων ημερών</span> για επιβεβαίωση και αποστολή.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button onClick={() => setSuccessData(null)}
                  className="mt-6 w-full font-oswald text-[11px] tracking-[0.2em] uppercase px-6 py-2.5 rounded-xl border border-white/10 text-white/40 hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-colors">
                  Νέα Κράτηση
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-0.5 h-5 rounded-full" style={{ background: tierCfg.color }} />
                  <h3 className="font-oswald font-bold text-white text-lg uppercase tracking-widest">Φόρμα Κράτησης</h3>
                  <span className="font-oswald text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-lg ml-2"
                    style={{ background: `${tierCfg.color}15`, border: `1px solid ${tierCfg.color}40`, color: tierCfg.color }}>
                    {tierCfg.name} — {tierCfg.price}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>Ονοματεπώνυμο</Label>
                      <input className={inputCls} required placeholder="π.χ. Γιάννης Παπαδόπουλος" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div>
                      <Label required>Τηλέφωνο</Label>
                      <input className={inputCls} required type="tel" placeholder="π.χ. 6971234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <Label required>Email</Label>
                    <input className={inputCls} type="email" required placeholder="yourmail@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <p className="font-oswald text-[10px] text-white/25 mt-1.5">Εκεί θα σταλεί το email επιβεβαίωσης με τις οδηγίες παραλαβής.</p>
                  </div>

                  {/* Tier selector */}
                  <div>
                    <Label required>Πακέτο</Label>
                    <select className={selectCls} value={selectedTier} onChange={(e) => setSelectedTier(e.target.value as TierId)}>
                      {TIERS.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.price}</option>)}
                    </select>
                  </div>

                  {/* Delivery */}
                  <div>
                    <Label required>Τρόπος Παραλαβής</Label>
                    <div className="flex gap-3">
                      {[{ val: "PICKUP", label: "Παραλαβή από Γραφεία/Γήπεδο" }, { val: "SHIPPING", label: "Αποστολή ταχυδρομικώς" }].map(({ val, label }) => (
                        <button key={val} type="button"
                          onClick={() => setForm({ ...form, deliveryMethod: val })}
                          className="flex-1 font-oswald text-[11px] tracking-[0.15em] uppercase py-2.5 px-3 rounded-xl transition-all duration-200 text-center"
                          style={form.deliveryMethod === val
                            ? { background: tierCfg.color, color: tierCfg.id === "GOLD" ? "#000" : "#fff", fontWeight: 700 }
                            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                          }>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.deliveryMethod === "SHIPPING" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-2xl p-5 space-y-4"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <p className="font-oswald text-[10px] tracking-[0.28em] uppercase text-[#C9A227]/70">Στοιχεία Αποστολής</p>

                      <div>
                        <Label required>Οδός &amp; Αριθμός</Label>
                        <input
                          className={inputCls}
                          required
                          placeholder="π.χ. Ελευθερίας 12"
                          value={form.street}
                          onChange={(e) => setForm({ ...form, street: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label required>Πόλη / Περιοχή</Label>
                          <input
                            className={inputCls}
                            required
                            placeholder="π.χ. Διδυμότειχο"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label required>Τ.Κ.</Label>
                          <input
                            className={inputCls}
                            required
                            placeholder="π.χ. 68300"
                            maxLength={5}
                            inputMode="numeric"
                            pattern="[0-9]{5}"
                            value={form.postalCode}
                            onChange={(e) => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, "") })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Όροφος / Κουδούνι <span className="font-oswald text-[9px] tracking-wide text-white/25 ml-1 normal-case">(προαιρετικό)</span></Label>
                        <input
                          className={inputCls}
                          placeholder="π.χ. 2ος όροφος, Παπαδόπουλος"
                          value={form.floorBell}
                          onChange={(e) => setForm({ ...form, floorBell: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label>Σημειώσεις (προαιρετικό)</Label>
                    <textarea className={`${inputCls} resize-none h-20`} placeholder="Οποιαδήποτε επιπλέον πληροφορία..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>

                  <button type="submit" disabled={isPending}
                    className="w-full font-oswald font-bold text-sm tracking-[0.22em] uppercase py-4 rounded-xl transition-all duration-200 disabled:opacity-50 mt-2"
                    style={{ background: tierCfg.color, color: tierCfg.id === "GOLD" ? "#000" : "#fff" }}>
                    {isPending ? "Αποστολή..." : "Υποβολή Κράτησης"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
