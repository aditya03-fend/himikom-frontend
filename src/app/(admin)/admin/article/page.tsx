// src/app/admin/article/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { 
  Plus, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  MoreVertical, 
  Trash2, 
  RotateCcw,
  ExternalLink,
  FileText
} from "lucide-react";
import { Article } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  
  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // --- FETCH DATA ---
  const fetchArticles = async () => {
    const role = Cookies.get("user_role") || "";
    const token = Cookies.get("token");
    setUserRole(role);
    
    try {
      const res = await fetch(`${baseUrl}/api/article`, { 
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Gagal ambil data");
      setArticles(await res.json());

    } catch (error) { 
        console.error(error); 
    } finally { 
        setLoading(false); 
    }
  };

  // --- ACTIONS ---
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${baseUrl}/api/article/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchArticles(); // Refresh data
        setOpenMenuId(null); // Close dropdown
      } else {
        alert("Gagal update status");
      }
    } catch (e) { 
        alert("Terjadi kesalahan koneksi"); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("PERINGATAN: Yakin ingin menghapus artikel ini permanen?")) return;
    const token = Cookies.get("token");
    
    try {
        const res = await fetch(`${baseUrl}/api/article/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchArticles();
    } catch (error) {
        alert("Gagal menghapus artikel");
    }
  };

  // Logic Dropdown
  const toggleMenu = (id: string) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if(openMenuId) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => { fetchArticles(); }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Kelola Artikel</h1>
          <p className="text-gray-400 text-sm">
            Login sebagai: <span className={cn("font-bold uppercase", userRole === 'SUPER_ADMIN' ? "text-red-500" : "text-blue-500")}>{userRole.replace('_', ' ')}</span>
          </p>
        </div>
        <Link href="/admin/article/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors shadow-lg shadow-blue-900/20">
          <Plus size={18} /> TAMBAH ARTIKEL
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-visible shadow-xl">
        {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                <span className="text-sm">Memuat artikel...</span>
            </div>
        ) : articles.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
                Belum ada artikel. Klik tombol "Tambah Artikel" untuk membuat baru.
            </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b border-white/10">Status</th>
                <th className="p-4 border-b border-white/10">Judul Artikel</th>
                <th className="p-4 border-b border-white/10">Tanggal Upload</th>
                <th className="p-4 border-b border-white/10 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {articles.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  
                  {/* STATUS */}
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold border uppercase", 
                      item.status === "PUBLISHED" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      item.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}>
                      {item.status || "PENDING"}
                    </span>
                  </td>

                  {/* TITLE */}
                  <td className="p-4 font-medium text-white max-w-md truncate flex items-center gap-3">
                    <FileText size={16} className="text-gray-500 shrink-0" />
                    {item.title}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-400 text-sm">
                    <span suppressHydrationWarning>
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </span>
                  </td>

                  {/* ACTIONS (DROPDOWN) */}
                  <td className="p-4 text-right relative">
                    {userRole === "SUPER_ADMIN" ? (
                        <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                            <button 
                                onClick={() => toggleMenu(item.id)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {/* Dropdown Content */}
                            {openMenuId === item.id && (
                                <div className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="py-1">
                                        
                                        {/* 1. VIEW (For Context) */}
                                        {item.status === "PUBLISHED" && (
                                            <Link 
                                                href={`/article/${item.id}`}
                                                target="_blank"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors w-full text-left"
                                            >
                                                <ExternalLink size={16} className="text-gray-500" /> Lihat di Web
                                            </Link>
                                        )}

                                        {/* 2. SUPER ADMIN ACTIONS (NO EDIT) */}
                                        
                                        {/* Approve */}
                                        {item.status !== "PUBLISHED" && (
                                            <button 
                                                onClick={() => handleStatusChange(item.id, "PUBLISHED")}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400 transition-colors w-full text-left border-t border-white/5"
                                            >
                                                <CheckCircle size={16} /> Publish
                                            </button>
                                        )}

                                        {/* Reject */}
                                        {item.status === "PENDING" && (
                                            <button 
                                                onClick={() => handleStatusChange(item.id, "REJECTED")}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left"
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        )}

                                        {/* Unpublish */}
                                        {item.status === "PUBLISHED" && (
                                            <button 
                                                onClick={() => handleStatusChange(item.id, "PENDING")}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors w-full text-left border-t border-white/5"
                                            >
                                                <RotateCcw size={16} /> Batal Publish
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors w-full text-left border-t border-white/10"
                                        >
                                            <Trash2 size={16} /> Hapus Permanen
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // REGULAR ADMIN (NO ACTIONS)
                        <span className="text-gray-600 text-[10px] italic pr-2">
                            Akses Terbatas
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}