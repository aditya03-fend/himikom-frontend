// src/components/Hero.tsx
"use client";
import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Mendaftarkan Plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- UTILITY: Pemecah Teks Manual (Agar bisa animasi per huruf) ---
const SplitText = ({ children, className }: { children: string; className?: string }) => {
  return (
    <span className={className}>
      {children.split("").map((char, index) => (
        <span
          key={index}
          className="char inline-block" // Class 'char' ini target GSAP kita
          style={{ whiteSpace: "pre" }} // Agar spasi terbaca
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ----------------------------------------------------
      // 1. ANIMASI INTRO (Saat website dimuat)
      // ----------------------------------------------------
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Huruf masuk satu per satu dari bawah
      tl.fromTo(
        ".char", 
        { 
          y: 100, 
          opacity: 0, 
          rotateX: -90 // Efek berputar sedikit 3D
        },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          stagger: 0.02, // Jeda antar huruf 0.02 detik
          duration: 1.5 
        }
      )
      // Garis dekorasi melebar
      .fromTo(".line-separator", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "expo.out" }, "-=1")
      // Deskripsi fade in
      .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8")
      // Button muncul
      .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.8");

      // ----------------------------------------------------
      // 2. ANIMASI SCROLL (Exit Animation)
      // Saat di-scroll ke bawah, huruf akan "menguap" acak
      // ----------------------------------------------------
      gsap.to(".char", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", // Mulai saat container di paling atas
          end: "bottom center", // Selesai saat container setengah jalan keluar
          scrub: 1, // Animasi mengikuti kecepatan jari/mouse scroll
        },
        y: -100, // Huruf terbang ke atas
        opacity: 0,
        stagger: {
          amount: 0.5, // Total waktu stagger
          from: "random" // Urutan acak (biar keren seperti data matrix hancur)
        },
        ease: "power1.in"
      });

      // Background Grid juga meredup saat scroll
      gsap.to(".bg-grid", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        y: -50
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ----------------------------------------------------
  // 3. ANIMASI HOVER BUTTON (Manual GSAP)
  // ----------------------------------------------------
  const handleBtnEnter = () => {
    // Tombol jadi putih penuh, teks jadi hitam
    gsap.to(btnRef.current, { backgroundColor: "#ffffff", color: "#000000", duration: 0.3 });
    // Panah bergerak
    gsap.to(".btn-arrow", { x: 5, duration: 0.3 });
  };

  const handleBtnLeave = () => {
    // Kembali ke outline
    gsap.to(btnRef.current, { backgroundColor: "transparent", color: "#ffffff", duration: 0.3 });
    gsap.to(".btn-arrow", { x: 0, duration: 0.3 });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20"
    >
      {/* Vignette hitam agar teks lebih fokus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />


      <div className="z-10 text-center max-w-5xl">
        
        {/* --- TITLE PER HURUF --- */}
        <h1 ref={titleRef} className="font-heading text-6xl md:text-9xl font-bold tracking-tighter leading-none text-white mb-6 overflow-hidden">
          <div className="overflow-hidden">
            <SplitText className="inline-block">INOVASI TANPA</SplitText>
          </div>
          <div className="overflow-hidden">
            <SplitText className="inline-block text-gray-400">BATAS HIMIKOM.</SplitText>
          </div>
        </h1>

        {/* GARIS PEMISAH ANIMASI */}
        <div className="line-separator w-24 h-px bg-white/50 mx-auto mb-8 origin-left" />

        {/* --- DESCRIPTION --- */}
        <p className="hero-desc text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Eksplorasi teknologi komputer dengan pendekatan minimalis, terstruktur, dan berorientasi masa depan.
        </p>

        {/* --- BUTTON HOVER GSAP --- */}
        <button
          ref={btnRef}
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
          className="group relative px-10 py-4 border border-white text-white rounded-full font-bold text-sm tracking-widest uppercase transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Jelajahi Program
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </button>
      </div>
    </section>
  );
}