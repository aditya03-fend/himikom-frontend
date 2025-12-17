// src/components/AchievementSection.tsx
"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Achievement } from "@/types";
import { Trophy, ArrowUpRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface AchievementSectionProps {
  achievements: Achievement[];
}

export default function AchievementSection({ achievements }: AchievementSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useLayoutEffect(() => {
    if (!achievements.length) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      // --- LOGIC DESKTOP (Horizontal Pin) ---
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Hitung jarak geser: Panjang Track - Lebar Layar Kanan + Padding
        const scrollAmount = track.scrollWidth - (window.innerWidth * 0.60);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${track.scrollWidth}`, // Durasi scroll disesuaikan panjang konten
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Update Counter berdasarkan progress scroll
              const progress = self.progress;
              const index = Math.min(
                Math.ceil(progress * achievements.length) || 1, 
                achievements.length
              );
              setActiveIndex(index);
            }
          }
        });

        // 1. Geser Track
        tl.to(track, {
          x: -scrollAmount,
          ease: "none",
        });

        // 2. Parallax Gambar Dalam Kartu (Efek Mewah)
        gsap.utils.toArray<HTMLElement>(".ach-img").forEach((img) => {
           gsap.to(img, {
             x: "20%", // Gambar bergerak sedikit ke kanan saat container ke kiri
             ease: "none",
             scrollTrigger: {
                 trigger: section,
                 start: "top top",
                 end: () => `+=${track.scrollWidth}`,
                 scrub: 1
             }
           });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [achievements]);

  if (!achievements || achievements.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-zinc-950 relative overflow-hidden border-t border-white/5">
      
      {/* WRAPPER UTAMA */}
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
        
        {/* --- KOLOM KIRI: STICKY INFO (35%) --- */}
        <div className="w-full lg:w-[35%] h-auto lg:h-full p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950 z-20">
            
            {/* Top: Header */}
            <div className="mt-10 lg:mt-0">
                <div className="inline-flex items-center gap-3 mb-8">
                    <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Crown size={18} className="text-yellow-500" />
                    </div>
                    <span className="text-xs font-bold text-yellow-600 uppercase tracking-[0.2em]">
                        Hall of Fame
                    </span>
                </div>
                
                <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] mb-6">
                    JEJAK <br/> <span className="text-zinc-700">JUARA.</span>
                </h2>
                
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                    Galeri pencapaian bergengsi mahasiswa HIMIKOM dalam kompetisi teknologi tingkat nasional.
                </p>
            </div>

            {/* Bottom: Dynamic Counter */}
            <div className="hidden lg:block">
                <div className="text-[120px] font-heading font-bold leading-none text-white transition-all duration-300">
                    {String(activeIndex).padStart(2, '0')}
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <div className="h-0.5 w-20 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-500 transition-all duration-500"
                            style={{ width: `${(activeIndex / achievements.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-zinc-600 font-mono text-sm">
                        / {String(achievements.length).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Mobile Hint */}
            <div className="lg:hidden mt-8 flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
                <span>Geser untuk melihat</span>
                <ArrowUpRight size={14} className="rotate-45" />
            </div>
        </div>


        {/* --- KOLOM KANAN: HORIZONTAL GALLERY (65%) --- */}
        <div className="w-full lg:w-[65%] h-[60vh] lg:h-full overflow-hidden flex items-center bg-zinc-950 relative">
            
            {/* Background Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

            {/* MOVING TRACK */}
            <div 
                ref={trackRef} 
                className="flex gap-8 lg:gap-12 px-8 lg:px-16 w-max h-full items-center overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide py-10 lg:py-0"
            >
                {achievements.map((item) => {
                    // Tentukan apakah pakai Link atau Div
                    const CardComponent = (item.link ? Link : 'div') as any;
                    const cardProps = item.link ? { href: item.link, target: "_blank" } : {};

                    return (
                        <CardComponent 
                            key={item.id} 
                            className="group relative w-[80vw] md:w-[400px] lg:w-[450px] aspect-4/5 bg-zinc-900 rounded-4xl overflow-hidden shrink-0 snap-center border border-white/5 hover:border-yellow-500/30 transition-all duration-500 shadow-2xl cursor-pointer block"
                            {...cardProps}
                        >
                            {/* 1. IMAGE CONTAINER (Masking) */}
                            <div className="absolute inset-0 overflow-hidden">
                                <Image 
                                    src={item.image} 
                                    alt={item.title} 
                                    fill 
                                    className="ach-img object-cover scale-125 transition-transform duration-700 group-hover:grayscale-0 grayscale" 
                                />
                                {/* Gradient Overlay Soft */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                            </div>

                            {/* 2. CARD CONTENT */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                
                                {/* Top: Badges */}
                                <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                                        {item.event}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                        <Trophy size={16} />
                                    </div>
                                </div>

                                {/* Bottom: Info */}
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-zinc-500 font-mono text-xs mb-2 block">
                                        {new Date(item.createdAt).getFullYear()} Edition
                                    </span>
                                    <h3 className="font-heading text-3xl font-bold text-white leading-tight mb-6 group-hover:text-yellow-50 transition-colors">
                                        {item.title}
                                    </h3>
                                    
                                    {item.link && (
                                        // Ubah <a> menjadi <span>/div agar tidak nesting error di dalam <Link> parent
                                        <div 
                                            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white border-b border-zinc-700 hover:border-white pb-1 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            LIHAT SERTIFIKAT
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardComponent>
                    );
                })}
                
                {/* Spacer End (Agar kartu terakhir bisa ke tengah) */}
                <div className="w-10 lg:w-40 h-full shrink-0"></div>
            </div>
        </div>

      </div>
    </section>
  );
}