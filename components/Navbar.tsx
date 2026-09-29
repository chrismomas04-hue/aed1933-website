// components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Ομάδα",      href: "/team" },
  { label: "Αγώνες",     href: "/matches" },
  { label: "Μεταγραφές", href: "/transfers" },
  { label: "Νέα",        href: "/news" },
  { label: "Ιστορία",    href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
      initial={{ opacity: 0, y: -72 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      {/* Logo → Αρχική */}
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src="/logo2.png"
          alt="ΑΕΔ 1933"
          width={100}
          height={100}
          className="object-contain"
        />
      </Link>

      {/* Nav links */}
      <ul className="hidden lg:flex gap-8 text-[11px] tracking-[0.18em] font-oswald uppercase">
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className="relative transition-colors duration-200"
                style={{ color: isActive ? "#C9A227" : "rgba(255,255,255,0.5)" }}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A227]"
                    layoutId="nav-underline"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <Link
        href="/membership"
        className="font-oswald uppercase tracking-[0.18em] text-[11px] px-5 py-2 rounded-lg transition-all duration-200 hover:brightness-110 shrink-0"
        style={{
          background: "rgba(201,162,39,0.12)",
          border: "1px solid rgba(201,162,39,0.4)",
          color: "#C9A227",
        }}
      >
        Γίνε Μέλος
      </Link>
    </motion.nav>
  );
}