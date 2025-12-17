// src/components/articlesection/ArticleList.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Article } from "@/types";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ArticleList({ articles }: { articles: Article[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLAnchorElement[]>([]);

  useLayoutEffect(() => {
    if (articles.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [articles]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    const item = itemsRef.current[index];
    if (!item) return;
    
    const imgContainer = item.querySelector(".hover-img") as HTMLElement;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(imgContainer, {
      x: x,
      y: y,
      xPercent: -50,
      yPercent: -50,
      duration: 0.8,
      ease: "power3.out",
    });

    const textContent = item.querySelector(".text-content") as HTMLElement;
    gsap.to(textContent, {
      x: (x - rect.width / 2) * 0.05,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const handleMouseEnter = (index: number) => {
    const item = itemsRef.current[index];
    if (!item) return;

    const imgContainer = item.querySelector(".hover-img") as HTMLElement;
    const title = item.querySelector(".article-title") as HTMLElement;
    const icon = item.querySelector(".arrow-icon") as HTMLElement;

    gsap.to(imgContainer, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    gsap.to(title, { color: "#3b82f6", x: 10, duration: 0.3 });
    gsap.to(icon, {
      rotate: 45,
      scale: 1.2,
      color: "#3b82f6",
      duration: 0.3,
    });

    itemsRef.current.forEach((el, i) => {
      if (i !== index) gsap.to(el, { opacity: 0.3, duration: 0.4 });
    });
  };

  const handleMouseLeave = (index: number) => {
    const item = itemsRef.current[index];
    if (!item) return;

    const imgContainer = item.querySelector(".hover-img") as HTMLElement;
    const title = item.querySelector(".article-title") as HTMLElement;
    const icon = item.querySelector(".arrow-icon") as HTMLElement;
    const textContent = item.querySelector(".text-content") as HTMLElement;

    gsap.to(imgContainer, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    gsap.to(title, { color: "white", x: 0, duration: 0.3 });
    gsap.to(textContent, { x: 0, duration: 0.5 });
    gsap.to(icon, { rotate: 0, scale: 1, color: "white", duration: 0.3 });

    itemsRef.current.forEach((el) => {
      gsap.to(el, { opacity: 1, duration: 0.4 });
    });
  };

  if (articles.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-20">
          <h2 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter">
            LATEST <span className="text-gray-600">INSIGHTS.</span>
          </h2>
          <div className="hidden md:block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">
            Scroll & Hover
          </div>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {articles.map((article, index) => (
            <Link
              href={`/article/${article.id}`}
              key={article.id}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="group relative py-12 border-b border-white/10 cursor-none"
            >
              <div className="hover-img fixed z-20 w-[350px] h-[220px] rounded-lg overflow-hidden pointer-events-none opacity-0 scale-0 origin-center shadow-2xl border border-white/20">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase rounded-full text-white">
                  Read Article
                </div>
              </div>

              <div className="text-content flex items-center justify-between px-4 transition-transform will-change-transform">
                <div className="flex items-baseline gap-8 md:gap-20">
                  <span className="text-sm font-mono text-gray-600">
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className="article-title font-heading text-3xl md:text-5xl font-bold text-white transition-colors duration-300">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 uppercase tracking-widest">
                      <span>Teknologi</span>
                      <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                      
                      {/* --- FIX HYDRATION ERROR --- */}
                      <span suppressHydrationWarning>
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      {/* --------------------------- */}

                    </div>
                  </div>
                </div>

                <div className="arrow-icon transition-transform duration-300">
                  <ArrowUpRight size={32} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}