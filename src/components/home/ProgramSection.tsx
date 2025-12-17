// src/components/home/ProgramSection.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Program } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProgramSection({ programs }: { programs: Program[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Ubah tipe ref array agar support anchor element (karena pakai Link)
  const cardsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (programs.length === 0) return;

    const ctx = gsap.context(() => {
      // Animasi Scale untuk efek tumpukan
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        // Jangan animasikan kartu terakhir karena dia paling atas
        if (index === programs.length - 1) return;

        gsap.to(card, {
          scale: 0.9, // Kartu belakang mengecil
          opacity: 0.4, // Kartu belakang meredup
          scrollTrigger: {
            trigger: card,
            start: "top top", // Mulai saat kartu kena atas layar
            end: "bottom top", // Selesai saat kartu lewat
            scrub: true, // Animasi terikat scroll bar
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [programs]);

  if (programs.length === 0) return null;

  return (
    <section ref={containerRef} className="bg-black py-24 px-4 md:px-10 relative">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Flagship Programs
          </span>
        </div>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
          Agenda Unggulan.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Program kerja strategis yang dirancang untuk meningkatkan kompetensi anggota.
        </p>
      </div>

      {/* STACKED CARDS CONTAINER */}
      <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-20">
        {programs.map((program, index) => {
          // Menghitung posisi 'top' agar kartu menumpuk rapi (Cascade)
          const stickyTop = 100 + index * 40; 

          return (
            // PERUBAHAN DI SINI: Ganti div jadi Link
            <Link
              href={`/program/${program.id}`} // Arahkan ke detail program
              key={program.id}
              // @ts-ignore
              ref={(el) => { cardsRef.current[index] = el; }} // Simpan ref untuk animasi
              className="sticky block group" // Tambahkan 'block' dan 'group'
              style={{ 
                top: `${stickyTop}px`, // Kunci posisi sticky
                zIndex: index + 1      // Pastikan urutan tumpukan benar
              }}
            >
              <div className="relative bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col md:flex-row transition-all duration-300 group-hover:border-blue-500/50">
                
                {/* 1. CONTENT (KIRI) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10 bg-zinc-900">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-6xl font-heading font-bold text-white/10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <h3 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-blue-400 transition-colors">
                      {program.title}
                    </h3>
                    
                    {/* Render HTML Content (Truncated) */}
                    <div
                      className="line-clamp-3 text-gray-400 [&>h1]:text-lg [&>h2]:text-base [&>p]:mb-2 [&_span]:bg-transparent! [&_span]:text-gray-400!"
                      dangerouslySetInnerHTML={{ __html: program.content }}
                    />
                  </div>

                  <div className="inline-flex items-center gap-3 text-white font-bold group-hover:text-blue-400 transition-colors mt-8">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={20} />
                    </div>
                    <span className="text-sm uppercase tracking-widest">Pelajari Program</span>
                  </div>
                </div>

                {/* 2. IMAGE (KANAN) */}
                <div className="w-full md:w-1/2 relative h-[300px] md:h-auto overflow-hidden">
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent md:bg-linear-to-r md:from-zinc-900 md:to-transparent opacity-80 md:opacity-100"></div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}