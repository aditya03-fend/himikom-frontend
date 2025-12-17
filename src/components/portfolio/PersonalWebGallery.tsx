"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Portfolio } from "@/types";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function PersonalWebGallery({ portfolios }: { portfolios: Portfolio[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (portfolios.length === 0) return;

    const ctx = gsap.context(() => {
      const totalWidth = sliderRef.current!.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Horizontal Scroll Animation
      gsap.to(sliderRef.current, {
        x: () => -(totalWidth - viewportWidth + 100), // Scroll sampai ujung + buffer
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalWidth}`, // Durasi scroll vertikal = panjang konten horizontal
          pin: true, // Kunci layar
          scrub: 1, // Halus
          anticipatePin: 1,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [portfolios]);

  if (portfolios.length === 0) return null;

  return (
    <section ref={containerRef} className="relative h-screen bg-black overflow-hidden flex flex-col justify-center">
      
      {/* Header Statis */}
      <div className="absolute top-20 left-6 md:left-20 z-10 mix-blend-difference text-white">
        <h2 className="font-heading text-4xl md:text-6xl font-bold mb-2">WEB PORTFOLIO.</h2>
        <p className="text-sm font-mono opacity-70">DIGITAL IDENTITY SHOWCASE</p>
      </div>

      {/* Horizontal Slider */}
      <div ref={sliderRef} className="flex gap-12 px-6 md:px-20 w-max items-center h-[60vh]">
        {portfolios.map((item, index) => (
          <a 
            key={item.id} 
            href={item.link || "#"} 
            target="_blank"
            className="group relative w-[300px] md:w-[500px] aspect-[16/10] bg-zinc-900 rounded-lg overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all flex-shrink-0 grayscale hover:grayscale-0"
          >
            <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-6">
                <h3 className="font-heading text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                </h3>
                <p className="text-blue-400 font-mono text-sm mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {item.studentName}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold border border-white/20 px-4 py-2 rounded-full uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 hover:bg-white hover:text-black">
                    Visit Site <ExternalLink size={12} />
                </div>
            </div>

            {/* Index Number */}
            <div className="absolute bottom-4 left-4 text-[100px] font-bold text-white/5 leading-none pointer-events-none">
                {String(index + 1).padStart(2, '0')}
            </div>
          </a>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-6 md:left-20 flex items-center gap-4 text-white/30 animate-pulse">
         <span className="text-xs uppercase tracking-widest">Scroll Down to Explore</span>
         <div className="w-20 h-[1px] bg-white/30"></div>
      </div>
    </section>
  );
}