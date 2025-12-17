// src/components/ArticleSection.tsx
"use client";
import React, { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Article } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ArticleSectionProps {
  articles: Article[];
}

export default function ArticleSection({ articles }: ArticleSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // DEBUGGING: Cek apakah data masuk
  console.log("Data Artikel di ArticleSection:", articles);

  useLayoutEffect(() => {
    // Jika tidak ada artikel, jangan jalankan animasi GSAP
    if (!articles || articles.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. ANIMASI MUNCUL (Staggered Fade Up)
      gsap.from(".article-row", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. SETUP CURSOR FOLLOWER
      // Setup Initial State (Hidden)
      gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      gsap.set(cursorLabelRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

      const moveCursor = (e: MouseEvent) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power3.out",
        });

        gsap.to(cursorLabelRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", moveCursor);

      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [articles]);

  // Handler Mouse
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
    gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    gsap.to(cursorLabelRef.current, { scale: 1, opacity: 1, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    gsap.to(cursorLabelRef.current, { scale: 0, opacity: 0, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="relative bg-transparent text-white py-32 px-6 md:px-20 overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/10 pb-8">
        <div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold mb-2">
            ARTIKEL <span className="text-gray-600">TERBARU.</span>
          </h2>
          <p className="text-gray-400 max-w-md mt-4">
            Tulisan, tutorial, dan wawasan teknologi dari anggota HIMIKOM.
          </p>
        </div>
        
        <Link 
          href="/article" 
          className="hidden md:flex items-center gap-2 text-sm font-bold border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all"
        >
          LIHAT ARSIP
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>

      {/* CONDITIONAL RENDERING: Cek apakah ada data */}
      {(!articles || articles.length === 0) ? (
        // TAMPILAN JIKA KOSONG
        <div className="py-20 text-center border-t border-white/10">
            <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
        </div>
      ) : (
        // TAMPILAN JIKA ADA DATA
        <div className="flex flex-col" onMouseLeave={handleMouseLeave}>
            {articles.map((article, index) => (
            <Link 
                key={article.id} 
                href={`/article/${article.id}`} 
                onMouseEnter={() => handleMouseEnter(index)}
                className="article-row group relative flex items-center justify-between border-t border-white/10 py-12 hover:bg-white/5 transition-colors px-4"
            >
                {/* Kiri: Nomor & Judul */}
                <div className="flex items-baseline gap-6 md:gap-16 transition-transform duration-500 group-hover:translate-x-4">
                <span className="text-xs font-bold text-gray-600 font-mono">
                    0{index + 1}
                </span>
                <h3 className="font-heading text-2xl md:text-4xl font-bold text-gray-300 group-hover:text-white transition-colors uppercase leading-tight">
                    {article.title}
                </h3>
                </div>

                {/* Kanan: Tanggal & Kategori */}
                <div className="hidden md:flex flex-col items-end gap-2 text-right transition-transform duration-500 group-hover:-translate-x-4">
                <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded text-white tracking-widest">
                    TEKNOLOGI
                </span>
                <span className="text-sm text-gray-500 font-mono">
                    {/* Pakai suppressHydrationWarning jaga-jaga beda timezone */}
                    <span suppressHydrationWarning>
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </span>
                </span>
                </div>
            </Link>
            ))}
            {/* Garis penutup bawah */}
            <div className="border-t border-white/10" />
        </div>
      )}

      {/* --- FLOATING ELEMENTS (Hanya dirender jika ada artikel) --- */}
      {articles && articles.length > 0 && (
          <>
            <div 
                ref={cursorRef} 
                className="pointer-events-none fixed top-0 left-0 z-50 w-[300px] h-[200px] rounded-lg overflow-hidden border border-white/20 shadow-2xl hidden md:block opacity-0 scale-0"
                style={{ transform: "translate(-50%, -50%)" }}
            >
                {articles.map((article, index) => (
                    <div 
                        key={article.id}
                        className={cn(
                            "absolute inset-0 w-full h-full transition-opacity duration-300 bg-zinc-900",
                            activeIndex === index ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            <div
                ref={cursorLabelRef}
                className="pointer-events-none fixed top-0 left-0 z-50 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs mix-blend-difference md:flex backdrop-blur-sm opacity-0 scale-0"
                style={{ transform: "translate(-50%, -50%)" }}
            >
                BACA
            </div>
          </>
      )}

    </section>
  );
}