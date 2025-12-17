// src/app/admin/achievement/create/page.tsx
"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
// Menambahkan ikon untuk UI Upload
import { ArrowLeft, Save, Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function CreateAchievementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // --- STATE IMAGE UPLOAD ---
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "", 
    event: "", 
    image: "", // Menampung Base64 atau URL
    link: "",  
  });

  // --- LOGIC IMAGE UPLOAD ---
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar dokumentasi!");
      return;
    }
    // Limit file size to 2MB (optional validation)
    if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  // --- END LOGIC ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("token");

    // Validasi Manual
    if (!formData.title || !formData.event || !formData.image) {
        alert("Mohon lengkapi Judul, Event, dan Foto Dokumentasi!");
        setLoading(false);
        return;
    }

    // 1. Ambil URL Backend dari Environment Variable
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
      // 2. Gunakan baseUrl dinamis
      // Pastikan endpoint backend benar (pakai /api atau tidak)
      const res = await fetch(`${baseUrl}/api/achievement`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Prestasi berhasil ditambahkan!");
        router.push("/admin/achievement");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan data");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/achievement" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold font-heading">Tambah Prestasi</h1>
           <p className="text-gray-400 text-sm">Input data kejuaraan atau penghargaan.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-zinc-900 border border-white/10 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Judul Prestasi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Prestasi / Juara</label>
            <input
              type="text"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              placeholder="Contoh: Juara 1 Web Design"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Nama Event */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Event / Penyelenggara</label>
            <input
              type="text"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Contoh: Gemastik 2024"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            />
          </div>

          {/* --- IMAGE UPLOAD SECTION --- */}
          <div className="space-y-2">
             <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Foto Dokumentasi</label>
                {/* Toggle Button */}
                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                    <button 
                        type="button"
                        onClick={() => setImageInputMode('file')}
                        className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ImageIcon size={12} /> Upload
                    </button>
                    <button 
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <LinkIcon size={12} /> URL
                    </button>
                </div>
            </div>

            {/* PREVIEW IMAGE */}
            {formData.image ? (
                <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black h-48 mb-4">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                // INPUT AREA
                <>
                    {imageInputMode === 'file' ? (
                        // MODE 1: DRAG & DROP
                        <div 
                            className={`relative w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-black/30 hover:bg-black/50 hover:border-white/20"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleChangeFile}
                            />
                            <UploadCloud size={32} className={`mb-2 ${dragActive ? "text-blue-400" : "text-gray-500"}`} />
                            <p className="text-sm text-gray-400 font-medium">
                                Klik atau drop foto dokumentasi
                            </p>
                            <p className="text-[10px] text-gray-600 mt-1">Maks 2MB</p>
                        </div>
                    ) : (
                        // MODE 2: URL INPUT
                        <input
                            type="url"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    )}
                </>
            )}
          </div>

          {/* Link Opsional */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Link Sertifikat / Berita <span className="text-gray-600 lowercase font-normal">(opsional)</span>
            </label>
            <input
              type="url"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                SIMPAN PRESTASI
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}