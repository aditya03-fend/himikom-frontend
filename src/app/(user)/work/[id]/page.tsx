// src/app/work/[id]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, User, Calendar, Code2 } from "lucide-react";

// --- 1. TYPE DEFINITION ---
interface WorkDetail {
  id: string;
  title: string;
  studentName: string;
  image: string | null;
  content: string; // HTML string dari Editor
  createdAt: string;
}

// --- 2. FETCHER FUNCTION ---
async function getWorkDetail(id: string): Promise<WorkDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // PENTING: Gunakan Endpoint SINGULAR (/api/work/${id})
    const res = await fetch(`${baseUrl}/api/work/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error fetching work detail:", error);
    return null;
  }
}

// --- 3. PAGE COMPONENT ---
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWorkDetail(id);

  // Jika data tidak ditemukan
  if (!work) {
    notFound();
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* BREADCRUMB / BACK BUTTON */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
            <ArrowLeft size={16} />
          </div>
          Kembali ke Gallery
        </Link>

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="lg:w-1/2">
            {/* Metadata Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Code2 size={12} />
              System Project
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {work.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-mono border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-white">{work.studentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span>
                  {new Date(work.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE & CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* MAIN IMAGE (Wide) */}
          <div className="lg:col-span-12 mb-8">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
              {work.image ? (
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600">
                  No Preview Available
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* CONTENT DETAILS */}
          <div className="lg:col-span-8 lg:col-start-3">
             <div className="bg-zinc-900/50 border border-white/5 p-8 md:p-12 rounded-2xl">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Tentang Project
                </h3>
                
                {/* RENDER HTML CONTENT (Rich Text dengan CSS Reset Lengkap) */}
                <div 
                    className="
                      prose prose-invert prose-lg max-w-none 
                      
                      /* --- 1. RESET BACKGROUND & COLOR (WAJIB) --- */
                      /* Hapus background bawaan (misal putih dari copas) & set warna teks */
                      [&_*]:!bg-transparent 
                      [&_*]:!text-gray-300

                      /* --- 2. HEADING STYLES --- */
                      [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-white [&_h1]:!mb-4 [&_h1]:!mt-8
                      [&_h2]:!text-2xl [&_h2]:!font-bold [&_h2]:!text-white [&_h2]:!mt-8 [&_h2]:!mb-4
                      [&_h3]:!text-xl [&_h3]:!font-bold [&_h3]:!text-white [&_h3]:!mt-6 [&_h3]:!mb-3

                      /* --- 3. PARAGRAPH & SPACING --- */
                      [&_p]:!mb-6 [&_p]:!leading-relaxed

                      /* --- 4. LISTS --- */
                      [&_ul]:!list-disc [&_ul]:pl-6! [&_ul]:!mb-6
                      [&_ol]:!list-decimal [&_ol]:pl-6! [&_ol]:!mb-6
                      [&_li]:!mb-2 [&_li]:!marker:text-gray-500

                      /* --- 5. LINKS --- */
                      [&_a]:text-blue-400! [&_a]:underline! hover:[&_a]:text-blue-300! [&_a]:font-medium!

                      /* --- 6. BOLD / ITALIC --- */
                      [&_strong]:text-white! [&_strong]:font-bold!
                      [&_b]:text-white! [&_b]:font-bold!
                      [&_em]:text-gray-200! [&_em]:italic!

                      /* --- 7. CODE BLOCKS --- */
                      /* Kita kembalikan background khusus untuk <pre> agar code block terlihat bagus */
                      [&_pre]:bg-zinc-900! [&_pre]:border! [&_pre]:border-white/10! [&_pre]:p-4! [&_pre]:rounded-xl! [&_pre]:overflow-x-auto!
                      [&_code]:bg-transparent! [&_code]:text-green-400! [&_code]:font-mono! [&_code]:text-sm!

                      /* --- 8. BLOCKQUOTE --- */
                      [&_blockquote]:border-l-4! [&_blockquote]:border-blue-500! [&_blockquote]:pl-4! [&_blockquote]:italic! [&_blockquote]:text-gray-400!
                    "
                    dangerouslySetInnerHTML={{ __html: work.content }}
                />
             </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}