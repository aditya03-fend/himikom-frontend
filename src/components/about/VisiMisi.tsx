// src/components/aboutsection/VisiMisi.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbulb, Target, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisi() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Animasi Desktop: Pinning & Slide In
      // Menggunakan matchMedia agar animasi berat ini hanya jalan di layar besar
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",   // Mulai saat section nyentuh atas
            end: "+=150%",      // Durasi scroll (1.5x tinggi layar)
            pin: true,          // TAHAN layar
            scrub: 1,           // Halus
            anticipatePin: 1,
          }
        });

        // Visi dari kiri, Misi dari kanan
        tl.from(".visi-card", { xPercent: -120, opacity: 0, rotationY: 45, duration: 1 })
          .from(".misi-card", { xPercent: 120, opacity: 0, rotationY: -45, duration: 1 }, "<") // "<" artinya bersamaan
          .from(".vm-connector", { scale: 0, opacity: 0, duration: 0.5 });
      });

      // Animasi Mobile: Simple Fade Up (Tanpa Pinning agar tidak buggy di HP)
      mm.add("(max-width: 767px)", () => {
        gsap.from(".visi-card", {
          scrollTrigger: { trigger: ".visi-card", start: "top 80%" },
          y: 50, opacity: 0, duration: 0.8
        });
        gsap.from(".misi-card", {
          scrollTrigger: { trigger: ".misi-card", start: "top 80%" },
          y: 50, opacity: 0, duration: 0.8
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- INTERACTIVE 3D TILT ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Hitung rotasi (Maksimal 15 derajat)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
      scale: 1.02,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden py-20 px-6">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Connector Line (Garis Tengah) */}
      <div className="vm-connector absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[80%] bg-gradient-to-b from-transparent via-gray-700 to-transparent hidden md:block"></div>
      <div className="vm-connector absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border border-white/20 rounded-full flex items-center justify-center z-10 hidden md:flex">
         <span className="font-bold text-white/50 text-xs">VS</span>
      </div>

      <div ref={containerRef} className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 relative z-20">
        
        {/* --- KARTU VISI (Kiri) --- */}
        <div 
          className="visi-card group bg-zinc-900/40 border border-blue-500/20 p-8 md:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden cursor-default"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow Effect */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Lightbulb className="text-blue-500 w-8 h-8" />
            </div>
            
            <h2 className="text-sm font-bold text-blue-500 tracking-widest uppercase mb-4">Visi Kami</h2>
            <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Pusat Inovasi <br /> Digital Masa Depan.
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Menjadi organisasi kemahasiswaan terdepan yang mencetak talenta digital berkarakter, 
              unggul dalam riset teknologi, dan siap memimpin transformasi digital di Indonesia.
            </p>
          </div>
        </div>

        {/* --- KARTU MISI (Kanan) --- */}
        <div 
          className="misi-card group bg-zinc-900/40 border border-purple-500/20 p-8 md:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden cursor-default"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow Effect */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-600/30 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Target className="text-purple-500 w-8 h-8" />
            </div>

            <h2 className="text-sm font-bold text-purple-500 tracking-widest uppercase mb-4">Misi Kami</h2>
            <ul className="space-y-6">
                {[
                    "Menyelenggarakan pendidikan teknologi adaptif industri.",
                    "Membangun jejaring kolaborasi profesional.",
                    "Menciptakan produk teknologi berdampak sosial."
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                        <CheckCircle2 className="w-6 h-6 text-purple-500/50 group-hover/item:text-purple-400 transition-colors mt-1 flex-shrink-0" />
                        <span className="text-xl text-gray-300 font-light group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}