// src/app/admin/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { 
  BarChart3, 
  FileText, 
  Code2, 
  Trophy, 
  Calendar, 
  ArrowUpRight, 
  Loader2,
  Plus,
  AlertCircle,
  Globe,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  
  // State Statistik Lengkap (6 Entitas)
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0 },
    programs: { total: 0, pending: 0 },
    works: { total: 0, pending: 0 },       // Karya Mahasiswa
    achievements: { total: 0, pending: 0 }, // Prestasi
    portfolios: { total: 0, pending: 0 },   // Web Portfolio
    modules: { total: 0 },                  // Modul (biasanya tidak ada pending)
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const initDashboard = async () => {
      setUserRole(Cookies.get("user_role") || "ADMIN");
      const token = Cookies.get("token");
      const headers = { "Authorization": `Bearer ${token}` };

      try {
        // 1. Fetch SEMUA data secara paralel (6 Request)
        const [artRes, progRes, workRes, achRes, portRes, modRes] = await Promise.all([
          fetch(`${baseUrl}/api/article`, { headers }),
          fetch(`${baseUrl}/api/program`, { headers }),
          fetch(`${baseUrl}/api/work`, { headers }),
          fetch(`${baseUrl}/api/achievement`, { headers }),
          fetch(`${baseUrl}/api/portfolio`, { headers }),
          fetch(`${baseUrl}/api/module`, { headers }),
        ]);

        // Helper untuk parse JSON aman
        const processData = async (res: Response) => {
          if (!res.ok) return [];
          return await res.json();
        };

        const articles = await processData(artRes);
        const programs = await processData(progRes);
        const works = await processData(workRes);
        const achievements = await processData(achRes);
        const portfolios = await processData(portRes);
        const modules = await processData(modRes);

        // 2. Hitung Statistik
        setStats({
          articles: {
            total: articles.length,
            published: articles.filter((i: any) => i.status === "PUBLISHED").length
          },
          programs: {
            total: programs.length,
            pending: programs.filter((i: any) => i.status === "PENDING").length
          },
          works: {
            total: works.length,
            pending: works.filter((i: any) => i.status === "PENDING").length
          },
          achievements: {
            total: achievements.length,
            pending: achievements.filter((i: any) => i.status === "PENDING").length
          },
          portfolios: {
            total: portfolios.length,
            pending: portfolios.filter((i: any) => i.status === "PENDING").length
          },
          modules: {
            total: modules.length, // Modul biasanya langsung aktif
          }
        });

      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500 gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        <p>Menyiapkan data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* HEADER */}
      <div className="mb-10 border-b border-white/10 pb-8">
        <h1 className="text-4xl font-bold mb-2 font-heading">Dashboard Utama</h1>
        <p className="text-gray-400">
          Halo, <span className={cn("font-bold uppercase", userRole === 'SUPER_ADMIN' ? "text-red-500" : "text-blue-500")}>
            {userRole.replace('_', ' ')}
          </span>. Berikut laporan lengkap konten website HIMIKOM.
        </p>
      </div>

      {/* --- GRID STATISTIK UTAMA (6 KARTU) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* 1. ARTIKEL */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <FileText size={24} />
            </div>
            <span className="text-xs font-mono text-gray-500 bg-black/40 px-2 py-1 rounded">
              {stats.articles.published} Terbit
            </span>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Artikel & Berita</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.articles.total}</p>
        </div>

        {/* 2. PROGRAM KERJA */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <Calendar size={24} />
            </div>
            {stats.programs.pending > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded animate-pulse border border-yellow-500/20">
                <AlertCircle size={12} /> {stats.programs.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Program Kerja</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.programs.total}</p>
        </div>

        {/* 3. KARYA MAHASISWA (PROJECT) */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
              <Code2 size={24} />
            </div>
            {stats.works.pending > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded animate-pulse border border-yellow-500/20">
                <AlertCircle size={12} /> {stats.works.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Karya Mahasiswa</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.works.total}</p>
        </div>

        {/* 4. PRESTASI */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <Trophy size={24} />
            </div>
            {stats.achievements.pending > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded animate-pulse border border-yellow-500/20">
                <AlertCircle size={12} /> {stats.achievements.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Data Prestasi</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.achievements.total}</p>
        </div>

        {/* 5. WEB PORTFOLIO */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <Globe size={24} />
            </div>
            {stats.portfolios.pending > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded animate-pulse border border-yellow-500/20">
                <AlertCircle size={12} /> {stats.portfolios.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Web Portfolio</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.portfolios.total}</p>
        </div>

        {/* 6. MODUL PEMBELAJARAN */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-pink-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
              <BookOpen size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Modul Belajar</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.modules.total}</p>
        </div>

      </div>

      {/* --- QUICK ACTIONS (AKSI CEPAT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" /> 
            Menu Pintas
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Action Item 1 */}
            <Link href="/admin/article/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Tulis Artikel</h4>
                <p className="text-[10px] text-gray-500">Buat berita baru</p>
              </div>
            </Link>

            {/* Action Item 2 */}
            <Link href="/admin/program/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Buat Program</h4>
                <p className="text-[10px] text-gray-500">Agenda kegiatan</p>
              </div>
            </Link>

            {/* Action Item 3 */}
            <Link href="/admin/work/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Upload Karya</h4>
                <p className="text-[10px] text-gray-500">Project mahasiswa</p>
              </div>
            </Link>

            {/* Action Item 4 */}
            <Link href="/admin/achievement/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Catat Prestasi</h4>
                <p className="text-[10px] text-gray-500">Juara & Penghargaan</p>
              </div>
            </Link>

            {/* Action Item 5 */}
            <Link href="/admin/portfolio/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Add Portfolio</h4>
                <p className="text-[10px] text-gray-500">Personal website</p>
              </div>
            </Link>

            {/* Action Item 6 */}
            <Link href="/admin/module/create" className="group p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Plus size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Buat Modul</h4>
                <p className="text-[10px] text-gray-500">Materi pembelajaran</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Kolom Kanan: System Status */}
        <div className="lg:col-span-1">
           <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 h-full">
              <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Server Status</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-sm text-gray-400">Backend API</span>
                    <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Database</span>
                    <span className="text-xs font-bold text-white">Connected</span>
                 </div>
              </div>

              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                 <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>Note:</strong> Pastikan untuk selalu mengecek status <strong>Pending</strong> pada Karya, Prestasi, dan Program untuk segera ditindaklanjuti.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}