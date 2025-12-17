// src/components/layout/MobileMenu.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import gsap from "gsap";

interface MobileMenuProps {
  navItems: { name: string; path: string }[];
  onClose: () => void;
}

export default function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Animasi Masuk saat komponen di-mount
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      }).from(linksRef.current, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }, "-=0.1");
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Kita gunakan createPortal agar menu ini dirender di luar struktur DOM utama
  // (langsung di body), sehingga aman dari konflik animasi GSAP ScrollTrigger di parent.
  return createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      {/* Tombol Close */}
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 text-white p-4 hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
      </button>

      {/* Link Menu */}
      <div className="flex flex-col gap-8 text-center">
        {navItems.map((item, i) => (
          <Link 
            key={item.path} 
            href={item.path} 
            // @ts-ignore
            ref={(el) => { linksRef.current[i] = el }}
            onClick={onClose} 
            className="text-3xl font-heading font-bold text-gray-400 hover:text-white transition-colors tracking-tight"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>,
    document.body // Target render: <body>
  );
}