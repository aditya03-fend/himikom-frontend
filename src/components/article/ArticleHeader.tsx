"use client";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ArticleHeader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animasi Teks Judul
      gsap.from(".header-char", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
      });

      // Parallax Teks Geser
      gsap.to(".text-parallax", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const Title = ({ text }: { text: string }) => (
    <span className="inline-block whitespace-pre">
      {text.split("").map((char, i) => (
        <span key={i} className="header-char inline-block">{char}</span>
      ))}
    </span>
  );

  return (
    <section ref={containerRef} className="relative pt-40 pb-20 px-6 md:px-20 overflow-hidden border-b border-white/10">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-6xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter mb-12">
          <div className="overflow-hidden"><Title text="PUSAT" /></div>
          <div className="overflow-hidden text-gray-600"><Title text="INFORMASI." /></div>
        </h1>

        {/* Search Bar Decoration */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <p className="text-gray-400 max-w-md text-lg">
                Jelajahi wawasan teknologi, tutorial koding, dan update kegiatan terbaru dari HIMIKOM.
            </p>

            <div className="w-full md:w-auto relative group">
                <input 
                    type="text" 
                    placeholder="Cari artikel atau program..." 
                    className="w-full md:w-96 bg-zinc-900/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
        </div>
      </div>

      {/* Running Text Decor */}
      <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
         <div className="text-parallax text-[10rem] font-bold font-heading whitespace-nowrap text-white">
            NEWS UPDATE • TECH • EVENT • CODE • NEWS UPDATE • TECH • EVENT • CODE •
         </div>
      </div>
    </section>
  );
}