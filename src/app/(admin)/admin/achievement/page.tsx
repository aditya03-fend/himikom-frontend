// src/app/admin/achievement/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { 
  Plus, 
  Loader2, 
  Trophy, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  CheckCircle, 
  RotateCcw, 
  XCircle 
} from "lucide-react";
import { Achievement } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminAchievementPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  // State for dropdown menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const fetchData = async () => {
    // 1. Get Token & Role from Cookie
    const token = Cookies.get("token");
    const role = Cookies.get("user_role") || "";
    setUserRole(role);

    try {
      const res = await fetch(`${baseUrl}/api/achievement`, { 
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Gagal ambil data");
      
      setData(await res.json());
    } catch (error) { 
        console.error(error); 
    } finally { 
        setLoading(false); 
    }
  };

  // --- ACTIONS ---

  // 1. Change Status (Publish / Unpublish / Reject)
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${baseUrl}/api/achievement/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchData(); // Refresh data
        setOpenMenuId(null); // Close dropdown
      } else {
        alert("Gagal update status");
      }
    } catch (e) { 
        alert("Terjadi kesalahan koneksi"); 
    }
  };

  // 2. Delete Achievement
  const handleDelete = async (id: string) => {
    if (!confirm("PERINGATAN: Hapus prestasi ini permanen?")) return;
    const token = Cookies.get("token");
    
    try {
        const res = await fetch(`${baseUrl}/api/achievement/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchData();
    } catch (error) {
        alert("Gagal menghapus prestasi");
    }
  };

  // Logic Toggle Dropdown
  const toggleMenu = (id: string) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if(openMenuId) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Kelola Prestasi</h1>
          <p className="text-gray-400 text-sm">
            Login sebagai: <span className={cn("font-bold uppercase", userRole === 'SUPER_ADMIN' ? "text-red-500" : "text-blue-500")}>{userRole.replace('_', ' ')}</span>
          </p>
        </div>
        <Link href="/admin/achievement/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
          <Plus size={18} /> TAMBAH DATA
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-visible shadow-xl">
        {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                <span className="text-sm">Mengambil data...</span>
            </div>
        ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
                Belum ada data prestasi.
            </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b border-white/10">Status</th>
                <th className="p-4 border-b border-white/10">Judul Prestasi</th>
                <th className="p-4 border-b border-white/10">Bukti / Link</th>
                <th className="p-4 border-b border-white/10 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  
                  {/* STATUS COLUMN */}
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold border uppercase", 
                      item.status === "PUBLISHED" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      item.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}>
                      {item.status || "PENDING"}
                    </span>
                  </td>

                  {/* TITLE COLUMN */}
                  <td className="p-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/20">
                        <Trophy size={16} />
                    </div>
                    {item.title}
                  </td>

                  {/* LINK COLUMN */}
                  <td className="p-4 text-sm text-gray-400">
                    {item.link ? (
                        <a href={item.link} target="_blank" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline">
                            Lihat <ExternalLink size={12}/>
                        </a>
                    ) : "-"}
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
                                        
                                        {/* SUPER ADMIN ACTIONS ONLY (NO EDIT) */}

                                        {/* Approve / Publish */}
                                        {item.status !== "PUBLISHED" && (
                                            <button 
                                                onClick={() => handleStatusChange(item.id, "PUBLISHED")}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-green-500/10 hover:text-green-400 transition-colors w-full text-left border-t border-white/5"
                                            >
                                                <CheckCircle size={16} /> Approve (Publish)
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
                        // ADMIN BIASA (NO ACTION)
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