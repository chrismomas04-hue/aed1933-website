import React from "react";
import { Oswald, Inter } from "next/font/google";
import "./globals.css"; 
import { Analytics } from "@vercel/analytics/next";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin", "greek"], 
  display: "swap" 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${oswald.variable} ${inter.className}`}>
      <body>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}