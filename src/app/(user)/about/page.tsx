// src/app/about/page.tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/Hero";
import VisiMisi from "@/components/about/VisiMisi"; // <--- Import Baru
import StatsHistory from "@/components/about/StatsHistory";
import InteractiveBackground from "@/components/layout/InteractiveBackground";

export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <div className="relative z-10 shadow-2xl mb-[100vh] bg-black">
        <div className="absolute inset-0 z-[-1] opacity-50">
          <InteractiveBackground />
        </div>

        {/* 1. HERO SECTION */}
        <AboutHero />

        {/* 2. VISI MISI SECTION */}
        <VisiMisi />

        <StatsHistory />

        <div className="h-24 bg-black"></div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full h-screen z-0">
        <Footer />
      </div>
    </main>
  );
}
