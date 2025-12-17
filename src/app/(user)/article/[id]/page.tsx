// src/app/article/[id]/page.tsx
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Article } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link"; // Gunakan Link untuk navigasi internal

// Fetch Data
async function getArticleDetail(id: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/article/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleDetail(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* CONTAINER UTAMA */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        
        {/* 1. GAMBAR THUMBNAIL */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-10">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 2. HEADER: Metadata & Judul */}
        <div className="mb-12 border-b border-white/10 pb-10">
          <div className="flex items-center gap-4 mb-6 text-sm font-bold tracking-widest uppercase text-gray-400">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md">
              Teknologi
            </span>
            <span>•</span>
            <span suppressHydrationWarning>
              {new Date(article.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight text-white">
            {article.title}
          </h1>
        </div>

        {/* 3. ISI KONTEN (CSS LENGKAP PEMBERSIH BACKGROUND) */}
        <article>
          <div
            className="
              prose prose-invert prose-lg max-w-none 
              
              /* --- 1. RESET AGRESIF (MEMBERSIHKAN STYLE COPAS) --- */
              /* Memaksa SEMUA elemen anak (*) menjadi transparan dan warna teks abu-abu terang */
              [&_*]:!bg-transparent 
              [&_*]:!text-gray-300
              
              /* --- 2. TYPOGRAPHY HEADINGS --- */
              /* Override warna untuk Heading agar Putih & Bold */
              [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-white [&_h1]:!mb-4 [&_h1]:!mt-10
              [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!text-white [&_h2]:!mt-8 [&_h2]:!mb-4
              [&_h3]:!text-xl [&_h3]:!font-bold [&_h3]:!text-white [&_h3]:!mt-6 [&_h3]:!mb-3
              
              /* --- 3. PARAGRAPH & SPACING --- */
              [&_p]:!mb-6 [&_p]:!leading-relaxed
              
              /* --- 4. LISTS (Bulleted & Numbered) --- */
              [&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!mb-6
              [&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!mb-6
              [&_li]:!mb-2 [&_li]:!marker:text-gray-500
              
              /* --- 5. LINKS --- */
              [&_a]:!text-blue-400 [&_a]:!underline hover:[&_a]:!text-blue-300 [&_a]:!font-medium
              
              /* --- 6. BOLD / ITALIC --- */
              [&_strong]:!text-white [&_strong]:!font-bold
              [&_b]:!text-white [&_b]:!font-bold
              [&_em]:!text-gray-200 [&_em]:!italic
              
              /* --- 7. CODE BLOCKS (PENGECUALIAN) --- */
              /* Kita beri background gelap khusus untuk code block agar terlihat bagus */
              [&_pre]:!bg-zinc-900 [&_pre]:!border [&_pre]:!border-white/10 [&_pre]:!p-4 [&_pre]:!rounded-xl [&_pre]:!overflow-x-auto
              [&_code]:!bg-transparent [&_code]:!text-green-400 [&_code]:!font-mono [&_code]:!text-sm
              
              /* --- 8. BLOCKQUOTE --- */
              [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-500 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-400
            "
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Tombol Back */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <Link
            href="/article"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Kembali ke Arsip Artikel
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}