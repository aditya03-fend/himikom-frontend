// src/components/articlesection/ProgramGrid.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Pastikan import Link ada
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Program } from "@/types";
import { ArrowUpRight, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProgramGrid({ programs }: { programs: Program[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // PERUBAHAN 1: Ubah tipe ref ke HTMLAnchorElement (karena sekarang pakai Link/<a>) atau HTMLElement (universal)
  const cardsRef = useRef<HTMLElement[]>([]);

  // Filter hanya yang published
  const publishedPrograms = programs.filter((p) => p.status === "PUBLISHED");

  useLayoutEffect(() => {
    if (publishedPrograms.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. ENTRANCE ANIMATION (Muncul bergelombang)
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Mulai saat section masuk layar
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [publishedPrograms]);

  // 2. SPOTLIGHT & PARALLAX HOVER EFFECT
  // PERUBAHAN 2: Sesuaikan tipe event handler ke HTMLElement
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Gerakkan Spotlight (Cahaya Gradient)
    const spotlight = card.querySelector(".spotlight") as HTMLElement;
    if (spotlight) {
      spotlight.style.opacity = "1";
      spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 40%)`;
    }

    // Gerakkan Border Glow
    const border = card.querySelector(".border-glow") as HTMLElement;
    if (border) {
      border.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.6), transparent 40%)`;
    }

    // Efek Parallax Gambar (Gambar gerak dikit berlawanan mouse)
    const img = card.querySelector(".card-img") as HTMLElement;
    if (img) {
      const xPos = (x / rect.width - 0.5) * 20; // Max geser 10px
      const yPos = (y / rect.height - 0.5) * 20;
      gsap.to(img, { x: -xPos, y: -yPos, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    // Reset Spotlight
    const spotlight = card.querySelector(".spotlight") as HTMLElement;
    if (spotlight) spotlight.style.opacity = "0";

    // Reset Gambar
    const img = card.querySelector(".card-img") as HTMLElement;
    if (img) gsap.to(img, { x: 0, y: 0, duration: 0.5 });
  };

  if (publishedPrograms.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-20 border-b border-white/10 relative overflow-hidden"
    >
      {/* Background Grid Halus */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              PROGRAM <span className="text-gray-600">UNGGULAN.</span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Wadah pengembangan skill teknis melalui proyek nyata.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold border border-white/20 px-4 py-2 rounded-full text-gray-400 uppercase tracking-widest">
              Featured
            </span>
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPrograms.map((item, i) => (
            // PERUBAHAN 3: Ganti div terluar menjadi Link
            <Link
              href={`/program/${item.id}`} // Pastikan URL ini sesuai dengan halaman detail Anda
              key={item.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              className="group relative bg-black/40 rounded-3xl overflow-hidden cursor-pointer block" // Tambahkan 'block' agar Link full width
            >
              {/* 1. GLOWING BORDER CONTAINER */}
              <div className="absolute inset-0 z-0 bg-white/10 rounded-3xl p-[1px] transition-all">
                <div
                  className="border-glow absolute inset-0 rounded-3xl"
                  style={{ background: "transparent" }}
                ></div>
                <div className="absolute inset-0 bg-zinc-950 rounded-3xl"></div>
              </div>

              {/* 2. CARD CONTENT WRAPPER */}
              <div className="relative z-10 h-full flex flex-col rounded-3xl overflow-hidden bg-transparent">
                {/* Spotlight Inner Effect */}
                <div className="spotlight absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-20"></div>

                {/* Image Area */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="card-img object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90"></div>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-gray-300">
                    <Calendar size={12} />
                    {/* Tambahkan suppressHydrationWarning jaga-jaga beda timezone server/client */}
                    <span suppressHydrationWarning>
                      {new Date(item.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-8 pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <div
                      className="line-clamp-3 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-8 [&_h1]:bg-transparent!
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&_h2]:bg-transparent!
                
                /* Style untuk Paragraf & List */
                [&>p]:mb-6 [&_p]:bg-transparent!
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6
                
                /* Style Pembersih Background Putih (PENTING) */
                [&>span]:bg-transparent! [&>span]:text-gray-300!
                [&_span]:bg-transparent! [&_span]:text-gray-300!"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Explore Program
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
