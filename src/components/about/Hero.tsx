// src/components/aboutsection/Hero.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline();

      // --- 1. OPENING ANIMATION (Load Awal) ---
      // Teks muncul per huruf dari bawah
      tl.from(".hero-char", {
        y: 200,
        skewY: 15,
        opacity: 0,
        stagger: 0.04,
        duration: 1.5,
        ease: "power4.out",
      })
      .from(".hero-line", {
        scaleX: 0,
        duration: 1.2,
        ease: "expo.out",
      }, "-=1")
      .from(".hero-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      }, "-=0.8");

      // --- 2. SCROLL INTERACTION (Saat User Scroll) ---
      // Teks TENTANG geser kiri, KAMI geser kanan
      gsap.to(".text-move-left", {
        x: -100, // Geser ke kiri 100px
        opacity: 0.2, // Memudar
        filter: "blur(5px)", // Jadi blur
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Smooth scrub
        }
      });

      gsap.to(".text-move-right", {
        x: 100, // Geser ke kanan 100px
        opacity: 0.2,
        filter: "blur(5px)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Garis pemisah melebar lalu hilang
      gsap.to(".hero-line", {
        width: "150%",
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom center",
          scrub: 1,
        }
      });

      // Indikator scroll hilang cepat
      gsap.to(".scroll-indicator", {
        opacity: 0,
        y: 50,
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "100px top",
            scrub: true
        }
      })

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper: Memecah teks jadi span per huruf untuk animasi
  const AnimatedText = ({ text }: { text: string }) => (
    <>
      {text.split("").map((char, i) => (
        <span 
            key={i} 
            className="hero-char inline-block whitespace-pre origin-bottom will-change-transform"
        >
          {char}
        </span>
      ))}
    </>
  );

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-20 overflow-hidden pt-20"
    >
      {/* Background Glow (Statis tapi memberi depth) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Title Container */}
      <div ref={titleRef} className="z-10 flex flex-col items-center">
        
        {/* BARIS 1: TENTANG (Geser Kiri saat Scroll) */}
        <div className="text-move-left">
            <h1 className="font-heading text-[12vw] md:text-[11rem] font-bold leading-[0.8] tracking-tighter uppercase text-white flex overflow-hidden">
                <AnimatedText text="TENTANG" />
            </h1>
        </div>

        {/* GARIS PEMISAH */}
        <div className="hero-line w-full max-w-2xl h-[2px] bg-white/20 my-6 md:my-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 w-full h-full animate-pulse"></div>
        </div>

        {/* BARIS 2: KAMI (Geser Kanan saat Scroll) */}
        <div className="text-move-right pl-[10vw] md:pl-20">
            <h1 className="font-heading text-[12vw] md:text-[11rem] font-bold leading-[0.8] tracking-tighter uppercase text-gray-500 flex overflow-hidden">
                <AnimatedText text="KAMI." />
            </h1>
        </div>

      </div>

      {/* Footer Info (Meta Data) */}
      <div className="absolute bottom-10 left-0 w-full px-6 md:px-20 flex justify-between items-end hero-meta">
        <div className="max-w-xs">
             <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Membangun ekosistem teknologi kolaboratif sejak tahun 2010.
             </p>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator flex flex-col items-center gap-2 animate-bounce text-gray-500">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ArrowDown size={18} />
        </div>

        <div className="text-right hidden md:block">
             <span className="block text-sm text-gray-500 uppercase tracking-widest mb-1">Lokasi</span>
             <span className="block font-bold text-white">Jakarta, ID</span>
        </div>
      </div>
    </section>
  );
}