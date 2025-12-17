// src/components/aboutsection/StatsHistory.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCap, Users, School, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { 
    icon: GraduationCap, 
    label: "Total Alumni", 
    value: 850, 
    desc: "Berkarier di Unicorn & BUMN", 
    color: "text-blue-500" 
  },
  { 
    icon: Users, 
    label: "Mahasiswa Aktif", 
    value: 420, 
    desc: "Anggota penuh semangat", 
    color: "text-green-500" 
  },
  { 
    icon: School, 
    label: "Dosen & Staff", 
    value: 35, 
    desc: "Pengajar & Praktisi Ahli", 
    color: "text-purple-500" 
  }
];

const historyData = [
  { year: "2010", title: "Inisiasi", desc: "HIMIKOM didirikan oleh 5 mahasiswa visioner sebagai forum diskusi teknologi." },
  { year: "2015", title: "Transformasi", desc: "Resmi menjadi organisasi kemahasiswaan intra-kampus dengan struktur legal." },
  { year: "2019", title: "Ekspansi Digital", desc: "Meluncurkan website pertama dan sistem database alumni terintegrasi." },
  { year: "2024", title: "Era Kolaborasi", desc: "Bekerja sama dengan 15+ mitra industri untuk penyaluran magang mahasiswa." },
];

export default function StatsHistory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- 1. STATS COUNTER ANIMATION ---
      const stats = gsap.utils.toArray<HTMLElement>(".stat-card");
      stats.forEach((stat) => {
        const numEl = stat.querySelector(".stat-value");
        const target = parseInt(numEl?.getAttribute("data-target") || "0");

        ScrollTrigger.create({
          trigger: stat,
          start: "top 85%", // Mulai saat elemen masuk viewport
          once: true,       // Hanya jalan sekali
          onEnter: () => {
            gsap.to(numEl, {
              innerText: target,
              duration: 2.5,
              snap: { innerText: 1 }, // Pastikan angka bulat
              ease: "power2.out",
            });
            gsap.fromTo(stat, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
          }
        });
      });

      // --- 2. TIMELINE DRAWING ANIMATION ---
      // Garis tengah turun mengikuti scroll
      gsap.fromTo(lineRef.current, 
        { height: "0%" }, 
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: "#timeline-container",
            start: "top center",
            end: "bottom center",
            scrub: 1, // Terikat scroll mouse
          }
        }
      );

      // --- 3. HISTORY ITEMS REVEAL ---
      // Item muncul saat garis melewatinya
      const historyItems = gsap.utils.toArray<HTMLElement>(".history-item");
      historyItems.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50, // Ganjil kiri, Genap kanan
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 60%", // Muncul saat item ada di tengah layar
            toggleActions: "play none none reverse"
          }
        });
        
        // Dot menyala
        const dot = item.querySelector(".history-dot");
        gsap.to(dot, {
          backgroundColor: "#3b82f6", // Biru menyala
          boxShadow: "0 0 15px #3b82f6",
          scale: 1.5,
          scrollTrigger: {
            trigger: item,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-black text-white py-32 px-6 md:px-20 overflow-hidden">
      
      {/* === STATS SECTION === */}
      <div className="max-w-7xl mx-auto mb-40">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">EKOSISTEM KAMI.</h2>
          <p className="text-gray-400">Angka yang menggambarkan dampak komunitas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((item, i) => (
            <div key={i} className="stat-card bg-zinc-900/50 border border-white/10 p-8 rounded-2xl text-center hover:border-white/30 transition-colors opacity-0">
              <div className={`w-12 h-12 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div className="text-5xl md:text-7xl font-bold font-heading mb-2">
                <span className="stat-value" data-target={item.value}>0</span>
                <span className={item.color}>+</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>


      {/* === TIMELINE HISTORY SECTION === */}
      <div id="timeline-container" className="max-w-4xl mx-auto relative">
        <div className="text-center mb-20">
          <span className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2 block">Perjalanan</span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold">SEJARAH HIMIKOM.</h2>
        </div>

        {/* GARIS VERTIKAL (DIGAMBAR SAAT SCROLL) */}
        <div className="absolute left-4 md:left-1/2 top-26 bottom-0 w-[2px] bg-zinc-800 -translate-x-1/2">
          <div ref={lineRef} className="w-full bg-linear-to-b from-blue-500 via-purple-500 to-blue-500 shadow-[0_0_10px_blue]"></div>
        </div>

        <div className="space-y-24 relative z-10">
          {historyData.map((item, i) => (
            <div 
              key={i} 
              className={`history-item flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center relative pl-12 md:pl-0 ${
                i % 2 === 0 ? "md:flex-row-reverse text-left md:text-left" : "text-left md:text-right"
              }`}
            >
              {/* KONTEN */}
              <div className="md:w-1/2 md:px-12">
                <span className="block text-5xl font-bold text-white/10 mb-2 font-heading">{item.year}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>

              {/* DOT TENGAH */}
              <div className="absolute left-4 md:left-1/2 top-2 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 border border-white/50 rounded-full history-dot transition-all duration-500"></div>
              
              {/* SPACER KOSONG UTK SISI SEBELAHNYA */}
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Ending Circle */}
        <div className="absolute left-4 md:left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-8 h-8 bg-zinc-900 border border-blue-500 rounded-full flex items-center justify-center mt-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>

    </section>
  );
}