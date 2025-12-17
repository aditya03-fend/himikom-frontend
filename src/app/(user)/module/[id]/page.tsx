// src/app/module/[id]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";

// --- 1. TYPE DEFINITION ---
interface Chapter {
  id: string;
  title: string;
  content: string; 
}

interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  author: string;
  image: string | null;
  chapters?: Chapter[]; 
  lessons?: Chapter[];
  createdAt: string;
}

// --- 2. FETCHER FUNCTION ---
async function getModuleDetail(id: string): Promise<ModuleDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/module/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
        console.error("Fetch Error Status:", res.status);
        return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching module:", error);
    return null;
  }
}

// --- 3. PAGE COMPONENT ---
export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const modul = await getModuleDetail(id);

  if (!modul) {
    notFound();
  }

  // NORMALISASI DATA
  const chapterList = modul.chapters || modul.lessons || [];

  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* HEADER SECTION */}
      <div className="relative pt-32 pb-20 px-6 md:px-20 border-b border-white/10 overflow-hidden">
        {/* Background Blur */}
        {modul.image && (
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src={modul.image}
              alt="bg"
              fill
              className="object-cover blur-3xl"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/learning"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Modul
          </Link>

          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {modul.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-mono">
            <div className="flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span>{modul.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-500" />
              <span>{chapterList.length} BAB</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span>{new Date(modul.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT & CHAPTERS */}
      <div className="max-w-5xl mx-auto px-6 md:px-20 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR: DAFTAR ISI (Sticky) */}
        {chapterList.length > 0 && (
            <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 sticky top-32">
                <h3 className="font-bold text-lg mb-4 text-blue-400 uppercase tracking-widest text-xs">
                Daftar Isi
                </h3>
                <div className="space-y-1">
                {chapterList.map((chapter, index) => (
                    <a
                    key={chapter.id}
                    href={`#chapter-${index}`}
                    className="block p-3 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-colors truncate"
                    >
                    <span className="font-bold mr-2 text-blue-500">
                        {index + 1}.
                    </span>
                    {chapter.title}
                    </a>
                ))}
                </div>
            </div>
            </div>
        )}

        {/* MAIN: KONTEN BAB */}
        <div className={chapterList.length > 0 ? "lg:w-2/3 order-1 lg:order-2 space-y-16" : "w-full space-y-16"}>
          {/* Deskripsi Modul */}
          <div className="prose prose-invert max-w-none border-b border-white/10 pb-10">
            <h3 className="text-2xl font-bold mb-4 text-white">Tentang Modul Ini</h3>
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
              {modul.description}
            </p>
          </div>

          {/* Loop Chapters */}
          {chapterList.map((chapter, index) => (
            <div
              key={chapter.id}
              id={`chapter-${index}`}
              className="scroll-mt-32 border-b border-white/5 pb-12 last:border-0"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-bold font-heading text-white">
                  {chapter.title}
                </h2>
              </div>

              {/* RENDER HTML DARI QUILL (DENGAN CSS CLEANER) */}
              <div
                className="
                  prose prose-invert prose-lg max-w-none prose-img:rounded-xl 
                  
                  /* --- 1. RESET BACKGROUND (Wajib) --- */
                  [&_*]:!bg-transparent 
                  [&_*]:!text-gray-300

                  /* --- 2. HEADINGS --- */
                  [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-white [&_h1]:!mb-4 [&_h1]:!mt-8
                  [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!text-white [&_h2]:!mt-8 [&_h2]:!mb-4
                  [&_h3]:!text-xl [&_h3]:!font-bold [&_h3]:!text-white [&_h3]:!mt-6 [&_h3]:!mb-3

                  /* --- 3. PARAGRAPH & SPACING --- */
                  [&_p]:!mb-6 [&_p]:!leading-relaxed

                  /* --- 4. LISTS --- */
                  [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!mb-6
                  [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!mb-6
                  [&_li]:!mb-2 [&_li]:!marker:text-gray-500

                  /* --- 5. LINKS --- */
                  [&_a]:!text-blue-400 [&_a]:!underline hover:[&_a]:!text-blue-300 [&_a]:!font-medium

                  /* --- 6. BOLD / ITALIC --- */
                  [&_strong]:!text-white [&_strong]:!font-bold
                  [&_b]:!text-white [&_b]:!font-bold
                  [&_em]:!text-gray-200 [&_em]:!italic

                  /* --- 7. CODE BLOCKS --- */
                  /* Code block tetap diberi background gelap agar enak dibaca */
                  [&_pre]:!bg-zinc-900 [&_pre]:!border [&_pre]:!border-white/10 [&_pre]:!p-4 [&_pre]:!rounded-xl [&_pre]:!overflow-x-auto
                  [&_code]:!bg-transparent [&_code]:!text-green-400 [&_code]:!font-mono [&_code]:!text-sm

                  /* --- 8. BLOCKQUOTE --- */
                  [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-500 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-400
                "
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
          ))}

          {chapterList.length === 0 && (
            <div className="p-12 bg-zinc-900 border border-white/10 rounded-xl text-center flex flex-col items-center gap-4">
               <BookOpen size={48} className="text-zinc-700" />
               <p className="text-gray-400">Belum ada materi bab yang ditambahkan pada modul ini.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}