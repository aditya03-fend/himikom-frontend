// src/app/portfolio/page.tsx
import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PersonalWebGallery from "@/components/portfolio/PersonalWebGallery";
import WorksGrid from "@/components/portfolio/WorksGrid";
import AchievementList from "@/components/portfolio/AchievementList";
import { Work, Achievement, Portfolio } from "@/types";
import { Loader2 } from "lucide-react";

// Cache Data selama 60 detik (ISR)
export const revalidate = 60;

// Fetch Data di Server
async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  console.log("Fetching Portfolio Data from:", baseUrl);

  try {
    const [worksRes, achievementsRes, portfoliosRes] = await Promise.all([
      fetch(`${baseUrl}/api/work`, { next: { revalidate: 60 } }),       
      fetch(`${baseUrl}/api/achievement`, { next: { revalidate: 60 } }), 
      fetch(`${baseUrl}/api/portfolio`, { next: { revalidate: 60 } }),   
    ]);

    const rawWorks: Work[] = worksRes.ok ? await worksRes.json() : [];
    const rawAchievements: Achievement[] = achievementsRes.ok ? await achievementsRes.json() : [];
    const rawPortfolios: Portfolio[] = portfoliosRes.ok ? await portfoliosRes.json() : [];

    // Filter PUBLISHED
    const works = rawWorks.filter((w) => w.status === "PUBLISHED");
    const achievements = rawAchievements.filter((a) => a.status === "PUBLISHED");
    const portfolios = rawPortfolios.filter((p) => p.status === "PUBLISHED");

    return { works, achievements, portfolios };

  } catch (error) {
    console.error("Gagal mengambil data portfolio page:", error);
    return { works: [], achievements: [], portfolios: [] };
  }
}

// Komponen Loading
const LoadingState = () => (
  <div className="w-full h-screen flex justify-center items-center bg-zinc-950">
    <Loader2 className="animate-spin text-blue-500" size={40} />
  </div>
);

export default async function PortfolioPage() {
  const { works, achievements, portfolios } = await getData();

  return (
    <main className="bg-black min-h-screen text-white selection:bg-yellow-500 selection:text-black">
      <Navbar />

      {/* Gunakan Suspense agar halaman tampil cepat, bagian berat nyusul */}
      <Suspense fallback={<LoadingState />}>
        
        {/* 1. PERSONAL WEB (Client Component) */}
        {/* Pastikan PersonalWebGallery juga pakai "use client" di dalamnya */}
        <PersonalWebGallery portfolios={portfolios} />

        <div className="relative z-10 bg-zinc-950">
          {/* 2. KARYA (Client Component yang baru kita update) */}
          <WorksGrid works={works} />

          {/* 3. PRESTASI (Client Component) */}
          {/* AchievementList juga harus pakai "use client" */}
          <AchievementList achievements={achievements} />

          <div className="h-20"></div>
        </div>

      </Suspense>

      <Footer />
    </main>
  );
}