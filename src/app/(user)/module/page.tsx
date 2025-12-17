import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Module } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getModules(): Promise<Module[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // 1. PERBAIKAN: Gunakan endpoint SINGULAR (/api/module)
    // Sebelumnya /api/modules (salah) -> /api/module (benar)
    const res = await fetch(`${baseUrl}/api/module`, {
      cache: "no-store",
    });

    if (!res.ok) {
        console.error("API Error:", res.status);
        return [];
    }

    const modules: Module[] = await res.json();

    // 2. FILTER: Hanya ambil yang statusnya "PUBLISHED"
    return modules.filter((m) => m.status === "PUBLISHED");
  } catch (error) {
    console.error("Gagal mengambil modul:", error);
    return [];
  }
}

export default async function ModulePage() {
  const modules = await getModules();

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="pt-32 px-6 md:px-20 pb-20">
        <h1 className="font-heading text-6xl md:text-8xl font-bold mb-20">
          MODUL <span className="text-gray-600">BELAJAR.</span>
        </h1>

        {modules.length === 0 ? (
           <div className="text-gray-500 text-xl">Belum ada modul yang dipublish.</div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {modules.map((modul) => (
                <Link
                href={`/module/${modul.id}`}
                key={modul.id}
                className="group relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-2xl hover:bg-zinc-800 transition-all"
                >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div>
                    <span className="text-xs font-bold text-blue-500 mb-2 block">
                        COURSE
                    </span>
                    <h2 className="font-heading text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                        {modul.title}
                    </h2>
                    <p className="text-gray-400 max-w-2xl line-clamp-2">{modul.description}</p>
                    </div>

                    <div className="flex items-center">
                    <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        →
                    </span>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}