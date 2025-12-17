import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PersonalWebGallery from "@/components/portfolio/PersonalWebGallery";
import WorksGrid from "@/components/portfolio/WorksGrid";
import AchievementList from "@/components/portfolio/AchievementList";
import { Work, Achievement, Portfolio } from "@/types";

export const dynamic = "force-dynamic";

// Fetch Semua Data Sekaligus
async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  console.log("Fetching Portfolio Data from:", baseUrl);

  try {
    const [worksRes, achievementsRes, portfoliosRes] = await Promise.all([
      // 1. PERBAIKAN: Gunakan endpoint SINGULAR (sesuai backend sebelumnya)
      fetch(`${baseUrl}/api/work`, { cache: "no-store" }),       
      fetch(`${baseUrl}/api/achievement`, { cache: "no-store" }), 
      fetch(`${baseUrl}/api/portfolio`, { cache: "no-store" }),   
    ]);

    // Debugging status response
    if (!worksRes.ok) console.error("Work API Error:", worksRes.status);
    if (!achievementsRes.ok) console.error("Achievement API Error:", achievementsRes.status);
    if (!portfoliosRes.ok) console.error("Portfolio API Error:", portfoliosRes.status);

    // 2. Parse JSON (Handle jika array kosong/error)
    const rawWorks: Work[] = worksRes.ok ? await worksRes.json() : [];
    const rawAchievements: Achievement[] = achievementsRes.ok ? await achievementsRes.json() : [];
    const rawPortfolios: Portfolio[] = portfoliosRes.ok ? await portfoliosRes.json() : [];

    // 3. FILTER: Hanya ambil yang statusnya "PUBLISHED"
    const works = rawWorks.filter((w) => w.status === "PUBLISHED");
    const achievements = rawAchievements.filter((a) => a.status === "PUBLISHED");
    const portfolios = rawPortfolios.filter((p) => p.status === "PUBLISHED");

    return { works, achievements, portfolios };

  } catch (error) {
    console.error("Gagal mengambil data portfolio page:", error);
    return { works: [], achievements: [], portfolios: [] };
  }
}

export default async function PortfolioPage() {
  const { works, achievements, portfolios } = await getData();

  return (
    <main className="bg-black min-h-screen text-white selection:bg-yellow-500 selection:text-black">
      <Navbar />

      {/* 1. PERSONAL WEB (Horizontal Scroll Pinned) */}
      <PersonalWebGallery portfolios={portfolios} />

      <div className="relative z-10 bg-zinc-950">
        {/* 2. KARYA (Grid 3D) */}
        <WorksGrid works={works} />

        {/* 3. PRESTASI (List Reveal) */}
        <AchievementList achievements={achievements} />

        <div className="h-20"></div>
      </div>

      <Footer />
    </main>
  );
}