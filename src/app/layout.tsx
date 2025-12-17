// src/app/layout.tsx
"use client";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <html lang="id" className="no-scrollbar">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-black text-white antialiased`}>
        {/* Pasang Background di sini */}
        
        {/* Noise Texture (Tetap dipertahankan untuk tekstur premium) */}
        <div className="fixed inset-0 z-9999 pointer-events-none opacity-[0.05] bg-[url('/noise.png')] mix-blend-overlay"></div>
        
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}