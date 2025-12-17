// src/components/Footer.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Animasi Parallax pada Teks Raksasa "HIMIKOM"
      gsap.to(textRef.current, {
        y: -50, // Bergerak sedikit ke atas saat scroll mentok
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", // Mulai saat footer masuk viewport
          end: "bottom bottom",
          scrub: 1,
        },
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      ref={footerRef}
      className="relative h-screen w-full bg-zinc-950 text-white flex flex-col justify-between pt-20 pb-10 px-8 md:px-20 overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      
      {/* 1. TOP SECTION: LINKS & INFO */}
      <div className="flex flex-col md:flex-row justify-between gap-12 z-10">
        
        {/* Kiri: Identitas */}
        <div className="max-w-sm">
          <h3 className="font-heading text-2xl font-bold mb-6">JANGAN RAGU MENYAPA.</h3>
          <p className="text-gray-400 font-light leading-relaxed mb-8">
            Kami terbuka untuk kolaborasi, pertanyaan, atau sekadar diskusi ringan tentang teknologi.
          </p>
          <a 
            href="mailto:halo@himikom.id" 
            className="inline-block border-b border-white/30 pb-1 text-xl hover:text-gray-300 hover:border-white transition-colors"
          >
            halo@himikom.id
          </a>
        </div>

        {/* Kanan: Navigasi Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Menu</span>
            <Link href="/program" className="hover:text-gray-400 transition-colors">Program</Link>
            <Link href="/article" className="hover:text-gray-400 transition-colors">Artikel</Link>
            <Link href="/work" className="hover:text-gray-400 transition-colors">Karya</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">Tentang</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Sosial</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-gray-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-gray-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Twitter / X</a>
          </div>

          {/* Column 3 (Button Top) */}
          <div className="flex flex-col justify-end">
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gray-400 transition-colors text-left"
            >
              Back to Top
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                ↑
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. BOTTOM SECTION: GIANT TYPOGRAPHY */}
      <div className="relative mt-auto pt-20 border-t border-white/10">
        <div className="flex justify-between items-end mb-4">
            <span className="text-xs text-gray-600">© 2024 HIMIKOM. ALL RIGHTS RESERVED.</span>
            <span className="text-xs text-gray-600">DESIGNED WITH NEXT.JS 14</span>
        </div>
        
        {/* TEKS RAKSASA */}
        <h1 
            ref={textRef}
            className="font-heading text-[12vw] leading-[0.8] font-bold tracking-tighter text-center text-white/5 select-none"
        >
            HIMIKOM.
        </h1>
      </div>

    </div>
  );
}