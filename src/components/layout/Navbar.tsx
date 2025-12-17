// src/components/layout/Navbar.tsx
"use client";
import React, { useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Import MobileMenu (Lazy Load)
const MobileMenu = dynamic(() => import("./MobileMenu"), {
  ssr: false,
});

const navItems = [
  { name: "Home", path: "/" },
  { name: "Tentang", path: "/about" },
  { name: "Artikel", path: "/article" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Modul", path: "/module" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // 1. Inisialisasi MatchMedia
      const mm = gsap.matchMedia();

      // --- INTRO ANIMATION (Jalan di Semua Device) ---
      tl.from(containerRef.current, { y: -50, opacity: 0, duration: 1, ease: "power3.out" })
        .from(logoRef.current, { x: -20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(linksRef.current, { x: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=0.8");

      // --- SCROLL ANIMATION (HANYA DESKTOP) ---
      // Animasi scroll hanya aktif jika layar >= 768px
      mm.add("(min-width: 768px)", () => {
        const scrollTl = gsap.timeline({
          paused: true,
        });

        scrollTl.to(containerRef.current, {
          width: "auto",
          minWidth: "50%",
          marginTop: "1.5rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          borderRadius: "9999px",
          backgroundColor: "rgba(5, 5, 5, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "150px top",
          scrub: 1,
          animation: scrollTl,
        });
      });

    }, navRef); 

    return () => ctx.revert();
  }, []);

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) => {
    const line = e.currentTarget.querySelector(".hover-line");
    if (isEnter) {
      gsap.to(line, { scaleX: 1, transformOrigin: "left center", duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(line, { scaleX: 0, transformOrigin: "right center", duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div
          ref={containerRef}
          className="pointer-events-auto flex w-full items-center justify-between px-6 md:px-12 py-6 will-change-transform bg-transparent"
        >
          {/* LOGO */}
          <Link ref={logoRef} href="/" className="group flex items-center gap-1 z-20">
            <span className="font-heading text-xl font-bold tracking-tighter text-white">
              HIMIKOM
              <span className="text-gray-500 transition-colors group-hover:text-white">.</span>
            </span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <Link
                  key={item.path}
                  href={item.path}
                  ref={(el) => { if (el) linksRef.current[i] = el; }}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors py-2"
                >
                  {item.name}
                  <span className="hover-line absolute bottom-0 left-0 h-[1px] w-full bg-white scale-x-0 origin-left" />
                </Link>
              ))}
            </div>

            {/* Hamburger Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white hover:text-gray-300 pointer-events-auto p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Load Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu 
          navItems={navItems} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </>
  );
}