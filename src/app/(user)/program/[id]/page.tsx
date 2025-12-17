// src/app/program/[id]/page.tsx
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Program } from "@/types"; 
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

// 1. Fetch Data Helper
async function getProgramDetail(id: string): Promise<Program | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/program/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal fetch program:", error);
    return null;
  }
}

// 2. Component Page
export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramDetail(id);

  if (!program) {
    notFound();
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* --- TOMBOL KEMBALI --- */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali ke Beranda
          </Link>
        </div>

        {/* --- GAMBAR UTAMA --- */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-10 bg-white/5">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Gradient Halus di Bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* --- HEADER INFO --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-white/10 pb-10">
          <div className="flex-1">
            {/* Badge Kategori / Status */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Program Kerja
              </span>
              {/* Status Publish */}
              {program.status === "PUBLISHED" && (
                <span className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={14} /> Terlaksana / Aktif
                </span>
              )}
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight text-white mb-4">
              {program.title}
            </h1>
          </div>

          {/* Tanggal Pelaksanaan (Metadata) */}
          <div className="shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl">
            <Calendar className="text-gray-400" size={24} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                Dibuat Pada
              </span>
              <span
                className="text-sm font-semibold text-white"
                suppressHydrationWarning
              >
                {new Date(program.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* --- ISI DESKRIPSI --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Kolom Kiri: Konten Utama */}
          <div className="md:col-span-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Deskripsi Program
            </h3>

            <article>
              <div
                className="
                  prose prose-invert prose-lg text-gray-300 leading-relaxed max-w-none
                  
                  /* --- 1. RESET BACKGROUND & COLOR (WAJIB) --- */
                  /* Menargetkan SEMUA elemen anak (*) agar transparan & mengikuti warna tema */
                  [&_*]:!bg-transparent 
                  [&_*]:!text-gray-300

                  /* --- 2. HEADING STYLES --- */
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

                  /* --- 7. CODE BLOCKS (PENGECUALIAN) --- */
                  /* Kita kembalikan background khusus untuk <pre> agar code block terlihat bagus */
                  [&_pre]:!bg-zinc-900 [&_pre]:!border [&_pre]:!border-white/10 [&_pre]:!p-4 [&_pre]:!rounded-xl [&_pre]:!overflow-x-auto
                  [&_code]:!bg-transparent [&_code]:!text-green-400 [&_code]:!font-mono [&_code]:!text-sm

                  /* --- 8. BLOCKQUOTE --- */
                  [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-500 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-400
                "
                dangerouslySetInnerHTML={{ __html: program.content }}
              />
            </article>
          </div>

          {/* Kolom Kanan: Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Info Lainnya
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Program kerja ini merupakan bagian dari agenda HIMIKOM untuk
                meningkatkan kualitas mahasiswa di bidang teknologi dan
                organisasi.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/"
                  className="block w-full text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Lihat Program Lain
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}