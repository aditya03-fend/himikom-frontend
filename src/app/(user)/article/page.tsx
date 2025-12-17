import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleHeader from "@/components/article/ArticleHeader";
import ProgramGrid from "@/components/article/ProgramGrid";
import ArticleList from "@/components/article/ArticleList";
import InteractiveBackground from "@/components/layout/InteractiveBackground";
import { Article, Program } from "@/types"; 

export const dynamic = "force-dynamic";

// Fetch Data Helper
async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  console.log("Fetching Data from:", baseUrl);

  try {
    const [articlesRes, programsRes] = await Promise.all([
      fetch(`${baseUrl}/api/article`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/program`, { cache: "no-store" }),
    ]);

    if (!articlesRes.ok) console.error("Article Error:", articlesRes.status);
    if (!programsRes.ok) console.error("Program Error:", programsRes.status);

    // 1. Ambil semua data (Raw Data)
    const allArticles: Article[] = articlesRes.ok ? await articlesRes.json() : [];
    const allPrograms: Program[] = programsRes.ok ? await programsRes.json() : [];

    // 2. Filter data: Hanya ambil yang statusnya "PUBLISHED"
    // (Jika ingin memfilter program juga, tambahkan logika serupa untuk program)
    const publishedArticles = allArticles.filter((article) => article.status === "PUBLISHED");
    
    // Opsional: Filter program jika diperlukan
    const publishedPrograms = allPrograms.filter((program) => program.status === "PUBLISHED");

    return { 
        articles: publishedArticles, 
        programs: publishedPrograms // Mengirim program yang sudah di-filter (atau gunakan allPrograms jika program tidak butuh filter)
    };

  } catch (error) {
    console.error("Gagal mengambil data article page:", error);
    return { articles: [], programs: [] };
  }
}

export default async function ArticlePage() {
  const { articles, programs } = await getData();

  return (
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* Wrapper Konten (Z-Index) */}
      <div className="relative z-10 shadow-2xl mb-[100vh] bg-black">
        <div className="absolute inset-0 z-[-1] opacity-50">
          <InteractiveBackground />
        </div>

        {/* 1. Header Parallax */}
        <ArticleHeader />

        {/* 2. Program Kerja (Grid) */}
        <ProgramGrid programs={programs} />

        {/* 3. Artikel (List) */}
        {/* Data yang masuk ke sini sekarang hanya yang PUBLISHED */}
        <ArticleList articles={articles} />

        <div className="h-24 bg-black"></div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full h-screen z-0">
        <Footer />
      </div>
    </main>
  );
}