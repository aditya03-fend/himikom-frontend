// src/components/portfolio/WorksGrid.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Pastikan import Image
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Work } from "@/types";
import { Code2, ArrowUpRight, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WorksGrid({ works }: { works: Work[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Helper: Hapus tag HTML dari deskripsi
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, ''); 
  };

  useLayoutEffect(() => {
    if (works.length === 0) return;

    const ctx = gsap.context(() => {
      // ENTRANCE ANIMATION
      gsap.from(cardsRef.current, {
        y: 100,
        opacity: 0,
        rotateX: 15,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [works]);

  // --- INTERAKSI MOUSE (3D Tilt) ---
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotasi halus
    const rotateX = ((y - centerY) / centerY) * -5; 
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    // Gerakkan Glow
    const glow = card.querySelector(".hover-glow") as HTMLElement;
    if(glow) {
        gsap.to(glow, {
            x: x,
            y: y,
            opacity: 0.4, // Lebih subtle
            duration: 0.2,
            ease: "power2.out"
        });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    
    const glow = card.querySelector(".hover-glow") as HTMLElement;
    if(glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
  };

  if (works.length === 0) return null;

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden">
      
      {/* Background Grid Tech */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Cpu className="text-blue-500 animate-pulse" size={20} />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">System Projects</span>
                </div>
                <h2 className="font-heading text-5xl md:text-7xl font-bold text-white">
                    PROJECT <span className="text-gray-700">LABS.</span>
                </h2>
            </div>
            <div className="hidden md:block text-right">
                <span className="block text-4xl font-bold text-white/10">{String(works.length).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500 uppercase">Deployed Systems</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {works.map((work, i) => (
                <Link 
                    href={`/work/${work.id}`} 
                    key={work.id}
                    ref={(el) => { if(el) cardsRef.current[i] = el; }}
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                    className="group relative bg-zinc-900/80 border border-white/10 rounded-2xl min-h-[320px] flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-sm transform-style-3d will-change-transform block"
                >
                    {/* LIQUID NEON GLOW */}
                    <div 
                        className="hover-glow absolute w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity duration-300 z-0"
                        style={{ top: 0, left: 0 }}
                    ></div>

                    {/* CARD CONTENT */}
                    <div className="card-content relative z-10 p-8 flex flex-col h-full justify-between transform-style-3d">
                        <div>
                            {/* Icon Box */}
                            <div className="w-14 h-14 bg-zinc-950 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-blue-400 group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
                                <Code2 size={28} />
                            </div>
                            
                            {/* Title */}
                            <h3 className="font-heading text-3xl font-bold text-white mb-3 leading-tight group-hover:text-blue-100 transition-colors">
                                {work.title}
                            </h3>
                            
                            {/* Desc */}
                            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                {stripHtml(work.content)}
                            </p>
                        </div>
                        
                        {/* Footer Info */}
                        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
                                    {work.studentName}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <ArrowUpRight size={14} />
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