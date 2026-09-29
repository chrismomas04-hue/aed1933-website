"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import {
  createNews, updateNews, deleteNews,
  createPlayer, updatePlayer, deletePlayer,
  createCoach, updateCoach, deleteCoach,
  createMatch, updateMatch, deleteMatch,
  createTransfer, updateTransfer, deleteTransfer,
  toggleMembershipStatus, deleteMembershipRequest,
  verifyAdminPin,
} from "./actions";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NewsRow     { id: string; title: string; summary: string; content: string | null; imageUrl: string | null; category: string; featured: boolean; createdAt: Date }
interface PlayerRow   { id: string; no: number; firstName: string; lastName: string; position: string; positionEn: string; age: number; nationality: string; imageUrl: string | null }
interface CoachRow    { id: number; firstName: string; lastName: string; role: string; age: number | null; nationality: string; imageUrl: string | null }
interface MatchRow    { id: string; date: string; time: string; competition: string; round: string; home: string; away: string; homeShort: string; awayShort: string; scoreHome: number | null; scoreAway: number | null; done: boolean; result: string | null; venue: string; imageUrl: string | null }
interface TransferRow    { id: string; firstName: string; lastName: string; position: string; positionShort: string; club: string; age: number; nationality: string; type: string; imageUrl: string | null }
interface MembershipRow { id: number; fullName: string; phone: string; email: string | null; tier: string; deliveryMethod: string; address: string | null; notes: string | null; status: string; createdAt: Date }

interface Props { news: NewsRow[]; players: PlayerRow[]; coaches: CoachRow[]; matches: MatchRow[]; transfers: TransferRow[]; memberships: MembershipRow[] }

// ── Constants ─────────────────────────────────────────────────────────────────

const NEWS_CATEGORIES = ["ΝΕΑ", "Μεταγραφές", "Προετοιμασία", "Φιλικά", "Σύλλογος"];
const COACH_ROLES = ["Προπονητής", "Βοηθός Προπονητή", "Προπονητής Τερματοφυλάκων", "Γυμναστής", "Αναλυτής"];
const POSITION_OPTIONS = [
  { en: "GK", gr: "Τερματοφύλακας" }, { en: "CB", gr: "Αμυντικός" },
  { en: "LB", gr: "Αριστερός Μπακ" }, { en: "RB", gr: "Δεξί Μπακ" },
  { en: "DM", gr: "Αμυντικός Μέσος" }, { en: "CM", gr: "Κεντρικός Μέσος" },
  { en: "AM", gr: "Επιθετικός Μέσος" }, { en: "LW", gr: "Αριστερό Εξτρέμ" },
  { en: "RW", gr: "Δεξί Εξτρέμ" }, { en: "ST", gr: "Επιθετικός" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const glass: React.CSSProperties = { background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)" };
const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-oswald placeholder-white/25 focus:outline-none focus:border-[#C9A227]/50 transition-colors";
const selectCls = "w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-oswald focus:outline-none focus:border-[#C9A227]/50 transition-colors";
const btnGold = "font-oswald text-[11px] tracking-[0.2em] uppercase px-4 py-2 rounded-lg bg-[#C9A227] text-black font-bold hover:bg-[#d4b040] transition-colors disabled:opacity-50";
const btnDanger = "font-oswald text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50";
const btnOutline = "font-oswald text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-colors disabled:opacity-50";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="font-oswald text-[10px] tracking-[0.2em] uppercase text-white/35 mb-1 block">{children}</label>;
}
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-0.5 h-5 bg-[#C9A227] rounded-full" />
      <h3 className="font-oswald text-base font-bold text-white uppercase tracking-widest">{children}</h3>
    </div>
  );
}

// ── ImageUploadField ──────────────────────────────────────────────────────────
function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const MAX = 900;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        onChange(dataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div>
      <Label>Φωτογραφία</Label>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-2">
        {(["upload", "url"] as const).map((t) => (
          <button key={t} type="button"
            onClick={() => setTab(t)}
            className="font-oswald text-[9px] tracking-[0.18em] uppercase px-3 py-1 rounded-md transition-colors"
            style={tab === t ? { background: "#C9A227", color: "#000", fontWeight: 700 } : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
          >
            {t === "upload" ? "Αρχείο" : "URL"}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <div
          className="relative rounded-lg border-2 border-dashed transition-colors cursor-pointer"
          style={{ borderColor: dragging ? "#C9A227" : "rgba(255,255,255,0.12)", background: dragging ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.02)" }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
          <div className="py-4 px-3 text-center">
            <p className="font-oswald text-[10px] tracking-[0.15em] text-white/30 uppercase">
              {dragging ? "Άφησε εδώ" : "Κλικ ή σύρε εικόνα"}
            </p>
            <p className="font-oswald text-[9px] text-white/18 mt-0.5">JPG, PNG, WebP · max 900px · συμπιέζεται αυτόματα</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input className={inputCls} placeholder="https://..." value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)} />
          <button type="button" className={btnOutline} onClick={() => { if (urlInput) { onChange(urlInput); setUrlInput(""); } }}>
            Εφαρμογή
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white/80 text-[10px] flex items-center justify-center hover:bg-red-500/80 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PIN GATE
// ══════════════════════════════════════════════════════════════════════
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState(""); const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const ok = await verifyAdminPin(pin);
      if (ok) { onUnlock(); }
      else { setError(true); setPin(""); setTimeout(() => setError(false), 1500); }
    });
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-8" style={glass}>
        <div className="text-center mb-8">
          <p className="font-oswald font-bold text-[#C9A227] text-3xl tracking-widest mb-1">ΑΕΔ</p>
          <p className="font-oswald text-white/30 text-xs tracking-[0.3em] uppercase">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Κωδικός Πρόσβασης</Label>
            <input type="password" className={`${inputCls} text-center tracking-[0.3em]`} value={pin}
              onChange={(e) => setPin(e.target.value)} placeholder="••••••••" autoFocus />
          </div>
          {error && <p className="font-oswald text-red-400 text-xs tracking-widest text-center">Λάθος κωδικός</p>}
          <button type="submit" disabled={isPending} className={`${btnGold} w-full py-3 disabled:opacity-50`}>{isPending ? "..." : "Είσοδος"}</button>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// NEWS TAB
// ══════════════════════════════════════════════════════════════════════
function NewsTab({ news }: { news: NewsRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { title: "", summary: "", category: "ΝΕΑ", featured: false, imageUrl: "" };
  const [form, setForm] = useState(blank);

  function startEdit(r: NewsRow) { setEditId(r.id); setForm({ title: r.title, summary: r.summary, category: r.category, featured: r.featured, imageUrl: r.imageUrl ?? "" }); }
  function cancelEdit() { setEditId(null); setForm(blank); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, imageUrl: form.imageUrl || undefined };
    startTransition(async () => {
      if (editId) { await updateNews(editId, payload); cancelEdit(); }
      else { await createNews(payload); setForm(blank); }
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6" style={glass}>
        <SectionHeading>{editId ? "Επεξεργασία Άρθρου" : "Νέο Άρθρο"}</SectionHeading>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Label>Τίτλος</Label><input className={inputCls} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Τίτλος άρθρου..." /></div>
          <div className="md:col-span-2"><Label>Περίληψη</Label><textarea className={`${inputCls} resize-none h-20`} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Σύντομη περιγραφή..." /></div>
          <div><Label>Κατηγορία</Label><select className={selectCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="flex items-end gap-3 pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#C9A227]" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span className="font-oswald text-[11px] tracking-[0.18em] uppercase text-white/40">Προτεινόμενο</span></label></div>
          <div className="md:col-span-2"><ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={btnGold} disabled={isPending}>{isPending ? "Αποθήκευση..." : editId ? "Αποθήκευση" : "Προσθήκη"}</button>
            {editId && <button type="button" className={btnOutline} onClick={cancelEdit}>Ακύρωση</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {news.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/7 px-5 py-4 flex items-start justify-between gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {r.imageUrl && <img src={r.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-oswald text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(201,162,39,0.12)", color: "#C9A227" }}>{r.category}</span>
                  {r.featured && <span className="font-oswald text-[9px] text-green-400">★</span>}
                </div>
                <p className="font-oswald font-bold text-white text-sm truncate">{r.title}</p>
                <p className="font-oswald text-white/30 text-xs truncate">{r.summary}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className={btnOutline} onClick={() => startEdit(r)}>Επεξεργασία</button>
              <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deleteNews(r.id))}>Διαγραφή</button>
            </div>
          </div>
        ))}
        {news.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-8">Δεν υπάρχουν άρθρα</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PLAYERS TAB
// ══════════════════════════════════════════════════════════════════════
function PlayersTab({ players }: { players: PlayerRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { no: 1, firstName: "", lastName: "", positionEn: "GK", age: 20, nationality: "Ελλάδα", imageUrl: "" };
  const [form, setForm] = useState(blank);

  function getPositionGr(en: string) { return POSITION_OPTIONS.find((p) => p.en === en)?.gr ?? en; }
  function startEdit(r: PlayerRow) { setEditId(r.id); setForm({ no: r.no, firstName: r.firstName, lastName: r.lastName, positionEn: r.positionEn, age: r.age, nationality: r.nationality, imageUrl: r.imageUrl ?? "" }); }
  function cancelEdit() { setEditId(null); setForm(blank); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, position: getPositionGr(form.positionEn), imageUrl: form.imageUrl || undefined };
    startTransition(async () => {
      if (editId) { await updatePlayer(editId, payload); cancelEdit(); }
      else { await createPlayer(payload); setForm(blank); }
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6" style={glass}>
        <SectionHeading>{editId ? "Επεξεργασία Παίκτη" : "Νέος Παίκτης"}</SectionHeading>
        <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Νούμερο</Label><input type="number" className={inputCls} required min={1} max={99} value={form.no} onChange={(e) => setForm({ ...form, no: Number(e.target.value) })} /></div>
          <div><Label>Όνομα</Label><input className={inputCls} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
          <div><Label>Επώνυμο</Label><input className={inputCls} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <div><Label>Θέση</Label><select className={selectCls} value={form.positionEn} onChange={(e) => setForm({ ...form, positionEn: e.target.value })}>{POSITION_OPTIONS.map((p) => <option key={p.en} value={p.en}>{p.en} — {p.gr}</option>)}</select></div>
          <div><Label>Ηλικία</Label><input type="number" className={inputCls} required min={15} max={45} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></div>
          <div><Label>Εθνικότητα</Label><input className={inputCls} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
          <div className="col-span-2 md:col-span-3"><ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></div>
          <div className="col-span-2 md:col-span-3 flex gap-3">
            <button type="submit" className={btnGold} disabled={isPending}>{isPending ? "Αποθήκευση..." : editId ? "Αποθήκευση" : "Προσθήκη"}</button>
            {editId && <button type="button" className={btnOutline} onClick={cancelEdit}>Ακύρωση</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {players.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/7 px-5 py-4 flex items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-4">
              {r.imageUrl
                ? <img src={r.imageUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-white/10" />
                : <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}><span className="font-oswald font-bold text-[#C9A227]">{r.no}</span></div>
              }
              <div>
                <p className="font-oswald font-bold text-white text-sm">{r.firstName} {r.lastName}</p>
                <p className="font-oswald text-white/30 text-xs">{r.positionEn} · {r.position} · {r.age} ετών</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={btnOutline} onClick={() => startEdit(r)}>Επεξεργασία</button>
              <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deletePlayer(r.id))}>Διαγραφή</button>
            </div>
          </div>
        ))}
        {players.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-8">Δεν υπάρχουν παίκτες</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// COACHES TAB
// ══════════════════════════════════════════════════════════════════════
function CoachesTab({ coaches }: { coaches: CoachRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<number | null>(null);
  const blank = { firstName: "", lastName: "", role: "Προπονητής", age: "" as string, nationality: "Ελλάδα", imageUrl: "" };
  const [form, setForm] = useState(blank);

  function startEdit(r: CoachRow) { setEditId(r.id); setForm({ firstName: r.firstName, lastName: r.lastName, role: r.role, age: r.age !== null ? String(r.age) : "", nationality: r.nationality, imageUrl: r.imageUrl ?? "" }); }
  function cancelEdit() { setEditId(null); setForm(blank); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { firstName: form.firstName, lastName: form.lastName, role: form.role, age: form.age !== "" ? Number(form.age) : undefined, nationality: form.nationality, imageUrl: form.imageUrl || undefined };
    startTransition(async () => {
      if (editId !== null) { await updateCoach(editId, payload); cancelEdit(); }
      else { await createCoach(payload); setForm(blank); }
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6" style={glass}>
        <SectionHeading>{editId !== null ? "Επεξεργασία Προπονητή" : "Νέος Προπονητής"}</SectionHeading>
        <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Όνομα</Label><input className={inputCls} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
          <div><Label>Επώνυμο</Label><input className={inputCls} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <div><Label>Ρόλος</Label><select className={selectCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{COACH_ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
          <div><Label>Ηλικία (προαιρετική)</Label><input type="number" className={inputCls} min={20} max={80} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          <div><Label>Εθνικότητα</Label><input className={inputCls} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
          <div className="col-span-2 md:col-span-3"><ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></div>
          <div className="col-span-2 md:col-span-3 flex gap-3">
            <button type="submit" className={btnGold} disabled={isPending}>{isPending ? "Αποθήκευση..." : editId !== null ? "Αποθήκευση" : "Προσθήκη"}</button>
            {editId !== null && <button type="button" className={btnOutline} onClick={cancelEdit}>Ακύρωση</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {coaches.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/7 px-5 py-4 flex items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-4">
              {r.imageUrl
                ? <img src={r.imageUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-white/10" />
                : <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}><span className="font-oswald font-bold text-[#C9A227] text-sm">{r.firstName.charAt(0)}</span></div>
              }
              <div>
                <p className="font-oswald font-bold text-white text-sm">{r.firstName} {r.lastName}</p>
                <p className="font-oswald text-white/30 text-xs">{r.role}{r.age ? ` · ${r.age} ετών` : ""}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={btnOutline} onClick={() => startEdit(r)}>Επεξεργασία</button>
              <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deleteCoach(r.id))}>Διαγραφή</button>
            </div>
          </div>
        ))}
        {coaches.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-8">Δεν υπάρχουν προπονητές</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MATCHES TAB
// ══════════════════════════════════════════════════════════════════════
function MatchesTab({ matches }: { matches: MatchRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { date: "", time: "17:00", competition: "Α' ΕΠΣ Έβρου", round: "", home: "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ", away: "", homeShort: "ΑΕΔ", awayShort: "", scoreHome: "" as string, scoreAway: "" as string, done: false, result: "" as string, venue: "", imageUrl: "" };
  const [form, setForm] = useState(blank);

  function toPayload(f: typeof blank) {
    return { date: f.date, time: f.time, competition: f.competition, round: f.round, home: f.home, away: f.away, homeShort: f.homeShort, awayShort: f.awayShort, scoreHome: f.scoreHome !== "" ? Number(f.scoreHome) : null, scoreAway: f.scoreAway !== "" ? Number(f.scoreAway) : null, done: f.done, result: f.result || null, venue: f.venue, imageUrl: f.imageUrl || undefined };
  }
  function startEdit(r: MatchRow) { setEditId(r.id); setForm({ date: r.date, time: r.time, competition: r.competition, round: r.round, home: r.home, away: r.away, homeShort: r.homeShort, awayShort: r.awayShort, scoreHome: r.scoreHome !== null ? String(r.scoreHome) : "", scoreAway: r.scoreAway !== null ? String(r.scoreAway) : "", done: r.done, result: r.result ?? "", venue: r.venue, imageUrl: r.imageUrl ?? "" }); }
  function cancelEdit() { setEditId(null); setForm(blank); }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (editId) { await updateMatch(editId, toPayload(form)); cancelEdit(); }
      else { await createMatch(toPayload(form)); setForm(blank); }
    });
  }

  const rLabel: Record<string, string> = { W: "ΝΙΚΗ", D: "ΙΣΟΠΑΛΙΑ", L: "ΗΤΤΑ" };
  const rColor: Record<string, string> = { W: "#4ade80", D: "#facc15", L: "#f87171" };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6" style={glass}>
        <SectionHeading>{editId ? "Επεξεργασία Αγώνα" : "Νέος Αγώνας"}</SectionHeading>
        <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Ημερομηνία</Label><input className={inputCls} required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Κυριακή, 06 Ιουλ 2025" /></div>
          <div><Label>Ώρα</Label><input className={inputCls} required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="17:00" /></div>
          <div><Label>Πρωτάθλημα</Label><input className={inputCls} required value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} /></div>
          <div><Label>Αγωνιστική</Label><input className={inputCls} required value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} placeholder="Αγωνιστική 20" /></div>
          <div><Label>Γήπεδο</Label><input className={inputCls} required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
          <div><Label>Γηπεδούχος</Label><input className={inputCls} required value={form.home} onChange={(e) => setForm({ ...form, home: e.target.value })} /></div>
          <div><Label>Σύντμηση Γηπ.</Label><input className={inputCls} required value={form.homeShort} onChange={(e) => setForm({ ...form, homeShort: e.target.value })} placeholder="ΑΕΔ" /></div>
          <div><Label>Φιλοξενούμενος</Label><input className={inputCls} required value={form.away} onChange={(e) => setForm({ ...form, away: e.target.value })} /></div>
          <div><Label>Σύντμηση Φιλ.</Label><input className={inputCls} required value={form.awayShort} onChange={(e) => setForm({ ...form, awayShort: e.target.value })} /></div>
          <div><Label>Γκολ Γηπ.</Label><input type="number" className={inputCls} min={0} value={form.scoreHome} onChange={(e) => setForm({ ...form, scoreHome: e.target.value })} placeholder="—" /></div>
          <div><Label>Γκολ Φιλ.</Label><input type="number" className={inputCls} min={0} value={form.scoreAway} onChange={(e) => setForm({ ...form, scoreAway: e.target.value })} placeholder="—" /></div>
          <div><Label>Αποτέλεσμα (ΑΕΔ)</Label><select className={selectCls} value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}><option value="">Εκκρεμεί</option><option value="W">W — Νίκη</option><option value="D">D — Ισοπαλία</option><option value="L">L — Ήττα</option></select></div>
          <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#C9A227]" checked={form.done} onChange={(e) => setForm({ ...form, done: e.target.checked })} /><span className="font-oswald text-[11px] tracking-[0.15em] uppercase text-white/40">Ολοκλήρωσε</span></label></div>
          <div className="col-span-2 md:col-span-3"><ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></div>
          <div className="col-span-2 md:col-span-3 flex gap-3">
            <button type="submit" className={btnGold} disabled={isPending}>{isPending ? "Αποθήκευση..." : editId ? "Αποθήκευση" : "Προσθήκη"}</button>
            {editId && <button type="button" className={btnOutline} onClick={cancelEdit}>Ακύρωση</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {matches.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/7 px-5 py-4 flex items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {r.imageUrl && <img src={r.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-oswald text-[9px] tracking-widest uppercase text-[#C9A227]/60">{r.competition} · {r.round}</span>
                  {r.result && <span className="font-oswald text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded" style={{ color: rColor[r.result], background: `${rColor[r.result]}18` }}>{rLabel[r.result]}</span>}
                </div>
                <p className="font-oswald font-bold text-white text-sm truncate">{r.home} {r.done ? `${r.scoreHome}–${r.scoreAway}` : "vs"} {r.away}</p>
                <p className="font-oswald text-white/30 text-xs">{r.date} · {r.time}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className={btnOutline} onClick={() => startEdit(r)}>Επεξεργασία</button>
              <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deleteMatch(r.id))}>Διαγραφή</button>
            </div>
          </div>
        ))}
        {matches.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-8">Δεν υπάρχουν αγώνες</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TRANSFERS TAB
// ══════════════════════════════════════════════════════════════════════
function TransfersTab({ transfers }: { transfers: TransferRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);
  const blank = { firstName: "", lastName: "", positionShort: "ST", age: 22, club: "", nationality: "GR", type: "IN", imageUrl: "" };
  const [form, setForm] = useState(blank);

  function getPositionGr(short: string) { return POSITION_OPTIONS.find((p) => p.en === short)?.gr ?? short; }
  function startEdit(r: TransferRow) { setEditId(r.id); setForm({ firstName: r.firstName, lastName: r.lastName, positionShort: r.positionShort, age: r.age, club: r.club, nationality: r.nationality, type: r.type, imageUrl: r.imageUrl ?? "" }); }
  function cancelEdit() { setEditId(null); setForm(blank); }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, position: getPositionGr(form.positionShort), imageUrl: form.imageUrl || undefined };
    startTransition(async () => {
      if (editId) { await updateTransfer(editId, payload); cancelEdit(); }
      else { await createTransfer(payload); setForm(blank); }
    });
  }

  const arrivals = transfers.filter((t) => t.type === "IN");
  const departures = transfers.filter((t) => t.type === "OUT");

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6" style={glass}>
        <SectionHeading>{editId ? "Επεξεργασία Μεταγραφής" : "Νέα Μεταγραφή"}</SectionHeading>
        <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label>Τύπος</Label><select className={selectCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="IN">↓ Άφιξη (IN)</option><option value="OUT">↑ Αποχώρηση (OUT)</option></select></div>
          <div><Label>Όνομα</Label><input className={inputCls} required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
          <div><Label>Επώνυμο</Label><input className={inputCls} required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <div><Label>Θέση</Label><select className={selectCls} value={form.positionShort} onChange={(e) => setForm({ ...form, positionShort: e.target.value })}>{POSITION_OPTIONS.map((p) => <option key={p.en} value={p.en}>{p.en} — {p.gr}</option>)}</select></div>
          <div><Label>Ηλικία</Label><input type="number" className={inputCls} required min={15} max={45} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></div>
          <div><Label>Σύλλογος</Label><input className={inputCls} required value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} /></div>
          <div className="col-span-2 md:col-span-3"><ImageUploadField value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} /></div>
          <div className="col-span-2 md:col-span-3 flex gap-3">
            <button type="submit" className={btnGold} disabled={isPending}>{isPending ? "Αποθήκευση..." : editId ? "Αποθήκευση" : "Προσθήκη"}</button>
            {editId && <button type="button" className={btnOutline} onClick={cancelEdit}>Ακύρωση</button>}
          </div>
        </form>
      </div>

      {[{ label: "Αφίξεις", color: "#4ade80", bg: "rgba(34,197,94,0.04)", border: "rgba(34,197,94,0.12)", rows: arrivals },
        { label: "Αποχωρήσεις", color: "#f87171", bg: "rgba(239,68,68,0.04)", border: "rgba(239,68,68,0.12)", rows: departures }].map(({ label, color, bg, border, rows }) => (
        <div key={label}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
            <p className="font-oswald text-sm font-bold uppercase tracking-widest" style={{ color }}>{label} ({rows.length})</p>
          </div>
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border px-5 py-3 flex items-center justify-between gap-4" style={{ background: bg, borderColor: border }}>
                <div className="flex items-center gap-3">
                  {r.imageUrl && <img src={r.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />}
                  <div>
                    <p className="font-oswald font-bold text-white text-sm">{r.firstName} {r.lastName} <span className="text-[11px] opacity-50">({r.positionShort})</span></p>
                    <p className="font-oswald text-white/30 text-xs">{r.type === "IN" ? "Από" : "Προς"}: {r.club} · {r.age} ετών</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={btnOutline} onClick={() => startEdit(r)}>Επεξεργασία</button>
                  <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deleteTransfer(r.id))}>Διαγραφή</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <p className="font-oswald text-white/20 text-xs text-center py-3">Κανένα</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════
// MEMBERSHIPS TAB
// ══════════════════════════════════════════════════════════════════════
const TIER_LABELS: Record<string, { label: string; color: string }> = {
  BASIC: { label: "ΦΙΛΑΘΛΟΥ",  color: "#9ca3af" },
  GOLD:  { label: "GOLD",       color: "#C9A227" },
  VIP:   { label: "VIP",        color: "#a78bfa" },
};

function MembershipsTab({ memberships }: { memberships: MembershipRow[] }) {
  const [isPending, startTransition] = useTransition();
  const pending = memberships.filter((m) => m.status === "PENDING");
  const completed = memberships.filter((m) => m.status === "COMPLETED");

  function renderRow(r: MembershipRow) {
    const tier = TIER_LABELS[r.tier] ?? { label: r.tier, color: "#C9A227" };
    const isCompleted = r.status === "COMPLETED";
    return (
      <div key={r.id} className="rounded-xl border border-white/7 px-5 py-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-oswald font-bold text-white text-sm">{r.fullName}</p>
              <span className="font-oswald text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded"
                style={{ background: `${tier.color}15`, border: `1px solid ${tier.color}40`, color: tier.color }}>
                {tier.label}
              </span>
              <span className={`font-oswald text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${isCompleted ? "bg-green-500/15 text-green-400" : "bg-yellow-500/10 text-yellow-300"}`}>
                {isCompleted ? "Ολοκληρώθηκε ✅" : "Σε Εκκρεμότητα"}
              </span>
            </div>
            <p className="font-oswald text-white/40 text-xs">{r.phone}{r.email ? ` · ${r.email}` : ""}</p>
            <p className="font-oswald text-white/30 text-xs">
              {r.deliveryMethod === "SHIPPING" ? `Αποστολή → ${r.address ?? "—"}` : "Παραλαβή από Γραφεία/Γήπεδο"}
            </p>
            {r.notes && <p className="font-oswald text-white/25 text-xs italic">{r.notes}</p>}
            <p className="font-oswald text-white/20 text-[10px]">{new Date(r.createdAt).toLocaleDateString("el-GR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className={btnOutline} disabled={isPending} onClick={() => startTransition(() => toggleMembershipStatus(r.id, r.status))}>
              {isCompleted ? "Επαναφορά" : "Ολοκλήρωση"}
            </button>
            <button className={btnDanger} disabled={isPending} onClick={() => startTransition(() => deleteMembershipRequest(r.id))}>Διαγραφή</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-0.5 h-4 rounded-full bg-yellow-400" />
          <p className="font-oswald text-sm font-bold uppercase tracking-widest text-yellow-300">Σε Εκκρεμότητα ({pending.length})</p>
        </div>
        <div className="space-y-3">
          {pending.map(renderRow)}
          {pending.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-6">Καμία εκκρεμής αίτηση</p>}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-0.5 h-4 rounded-full bg-green-400" />
          <p className="font-oswald text-sm font-bold uppercase tracking-widest text-green-400">Ολοκληρωμένες ({completed.length})</p>
        </div>
        <div className="space-y-3">
          {completed.map(renderRow)}
          {completed.length === 0 && <p className="font-oswald text-white/20 text-sm text-center py-6">Καμία ολοκληρωμένη αίτηση</p>}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════
type Tab = "news" | "players" | "coaches" | "matches" | "transfers" | "memberships";

export default function AdminClientUI({ news, players, coaches, matches, transfers, memberships }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("news");

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "news",        label: "Νέα",          count: news.length },
    { key: "players",     label: "Ρόστερ",       count: players.length },
    { key: "coaches",     label: "Προπονητές",   count: coaches.length },
    { key: "matches",     label: "Αγώνες",       count: matches.length },
    { key: "transfers",   label: "Μεταγραφές",   count: transfers.length },
    { key: "memberships", label: "Διαρκείας",    count: memberships.filter((m) => m.status === "PENDING").length },
  ];

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(40,30,5,0.5) 0%, transparent 70%)" }} />
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 pt-12 pb-24">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-oswald text-[10px] tracking-[0.35em] uppercase text-[#C9A227]/60 mb-1">Α.Ε. Διδυμοτείχου 1933</p>
            <h1 className="font-oswald font-bold text-4xl md:text-5xl leading-none text-white tracking-tight">ADMIN PANEL</h1>
          </div>
          <button className="font-oswald text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-lg border border-white/10 text-white/30 hover:border-red-500/30 hover:text-red-400 transition-colors" onClick={() => setUnlocked(false)}>
            Αποσύνδεση
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl overflow-x-auto" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-oswald text-[10px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200"
              style={tab === t.key ? { background: "#C9A227", color: "#000", fontWeight: 700 } : { color: "rgba(255,255,255,0.4)" }}
            >
              {t.label}
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={tab === t.key ? { background: "rgba(0,0,0,0.2)" } : { background: "rgba(255,255,255,0.08)" }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {tab === "news"        && <NewsTab        news={news} />}
        {tab === "players"     && <PlayersTab     players={players} />}
        {tab === "coaches"     && <CoachesTab     coaches={coaches} />}
        {tab === "matches"     && <MatchesTab     matches={matches} />}
        {tab === "transfers"   && <TransfersTab   transfers={transfers} />}
        {tab === "memberships" && <MembershipsTab memberships={memberships} />}
      </div>
    </div>
  );
}
