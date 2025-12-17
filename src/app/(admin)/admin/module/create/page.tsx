// src/app/admin/module/create/page.tsx
"use client";
import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Loader2, GripVertical, UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import "react-quill-new/dist/quill.snow.css"; 

// Import ReactQuill secara dinamis
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateModulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE IMAGE UPLOAD ---
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Data Modul Utama
  const [moduleData, setModuleData] = useState({
    title: "",
    description: "",
    author: "",
    image: "", // Base64 atau URL
  });

  // State Array Bab (Chapters)
  const [chapters, setChapters] = useState([
    { title: "", content: "" }
  ]);

  // --- LOGIC IMAGE UPLOAD ---
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar cover modul!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setModuleData(prev => ({ ...prev, image: reader.result as string }));
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };
  // --- END LOGIC IMAGE ---

  // --- HANDLERS BAB ---
  const addChapter = () => {
    setChapters([...chapters, { title: "", content: "" }]);
  };

  const removeChapter = (index: number) => {
    if (chapters.length === 1) {
      alert("Minimal harus ada 1 bab!");
      return;
    }
    const newChapters = [...chapters];
    newChapters.splice(index, 1);
    setChapters(newChapters);
  };

  const handleChapterChange = (index: number, field: "title" | "content", value: string) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setChapters(newChapters);
  };

  // Simpan ke Server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("token");

    if (!moduleData.title || !moduleData.author || !moduleData.image || chapters.some(c => !c.title || !c.content)) {
      alert("Mohon lengkapi semua field (Judul, Author, Cover, dan isi Bab).");
      setLoading(false);
      return;
    }

    const payload = {
      ...moduleData,
      chapters: chapters
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
      const res = await fetch(`${baseUrl}/api/module`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Modul & Bab berhasil dibuat!");
        router.push("/admin/module");
      } else {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // --- KONFIGURASI TOOLBAR LENGKAP ---
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': [] }], // Font Family
      [{ 'size': ['small', false, 'large', 'huge'] }], // Font Size
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers

      ['bold', 'italic', 'underline', 'strike'], // Styling dasar
      [{ 'color': [] }, { 'background': [] }], // Warna Teks & Highlight
      
      [{ 'script': 'sub'}, { 'script': 'super' }], // Subscript/Superscript
      ['blockquote', 'code-block'], // Quote & Code Block

      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // List
      [{ 'indent': '-1'}, { 'indent': '+1' }], // Indent
      [{ 'align': [] }], // Alignment

      ['link', 'image', 'video'], // Media Embeds
      ['clean'] // Clear Formatting
    ],
  }), []);

  return (
    <div className="pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-black z-20 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/admin/module" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-2xl font-bold font-heading">Buat Modul Baru</h1>
             <p className="text-gray-400 text-sm">Susun materi pembelajaran terstruktur.</p>
          </div>
        </div>
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            PUBLISH MODUL
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- KOLOM KIRI: INFO MODUL (Sidebar Sticky) --- */}
        <div className="lg:w-1/3 space-y-6">
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl sticky top-32">
              <h3 className="text-lg font-bold mb-4 text-blue-400">Informasi Modul</h3>
              
              <div className="space-y-6">
                {/* Nama Modul */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Nama Modul</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-blue-500 transition-all outline-none"
                    placeholder="Contoh: Belajar React dari Nol"
                    value={moduleData.title}
                    onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                  />
                </div>

                {/* Penulis */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Penulis</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-blue-500 transition-all outline-none"
                    placeholder="Nama Instruktur"
                    value={moduleData.author}
                    onChange={(e) => setModuleData({ ...moduleData, author: e.target.value })}
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-blue-500 transition-all outline-none"
                    placeholder="Tentang modul ini..."
                    value={moduleData.description}
                    onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                  />
                </div>

                {/* --- COVER IMAGE UPLOAD --- */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Cover Image</label>
                        <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                            <button onClick={() => setImageInputMode('file')} className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                                <ImageIcon size={12} /> Upload
                            </button>
                            <button onClick={() => setImageInputMode('url')} className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                                <LinkIcon size={12} /> URL
                            </button>
                        </div>
                    </div>

                    {moduleData.image ? (
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black h-40 mb-4">
                            <img src={moduleData.image} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => setModuleData({ ...moduleData, image: "" })} className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full transition-all">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            {imageInputMode === 'file' ? (
                                <div 
                                    className={`relative w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-black/30 hover:bg-black/50 hover:border-white/20"}`}
                                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleChangeFile} />
                                    <UploadCloud size={32} className={`mb-2 ${dragActive ? "text-blue-400" : "text-gray-500"}`} />
                                    <p className="text-sm text-gray-400 font-medium">Klik atau drop file</p>
                                    <p className="text-[10px] text-gray-600 mt-1">Maks 2MB</p>
                                </div>
                            ) : (
                                <input
                                    type="url"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 transition-all outline-none text-sm"
                                    placeholder="https://..."
                                    value={moduleData.image}
                                    onChange={(e) => setModuleData({ ...moduleData, image: e.target.value })}
                                />
                            )}
                        </>
                    )}
                </div>

              </div>
           </div>
        </div>

        {/* --- KOLOM KANAN: EDITOR BAB (Dynamic List) --- */}
        <div className="lg:w-2/3 space-y-8">
            
            {chapters.map((chapter, index) => (
              <div key={index} className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Header Bab */}
                  <div className="bg-zinc-800/50 p-4 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded cursor-grab active:cursor-grabbing">
                             <GripVertical size={16} className="text-gray-500" />
                          </div>
                          <span className="font-bold text-sm text-gray-400">BAB {index + 1}</span>
                      </div>
                      <button 
                        onClick={() => removeChapter(index)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"
                        title="Hapus Bab Ini"
                      >
                          <Trash2 size={18} />
                      </button>
                  </div>

                  {/* Form Bab */}
                  <div className="p-6 space-y-6">
                      {/* Judul Bab */}
                      <div>
                        <input
                            type="text"
                            className="w-full bg-transparent border-b border-white/10 p-2 text-xl font-bold placeholder:text-gray-600 focus:border-blue-500 outline-none transition-all"
                            placeholder={`Judul Bab ${index + 1}...`}
                            value={chapter.title}
                            onChange={(e) => handleChapterChange(index, "title", e.target.value)}
                        />
                      </div>

                      {/* EDITOR TEXT (React Quill) */}
                      <div className="text-editor-wrapper">
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Konten Materi</label>
                          <ReactQuill 
                            theme="snow"
                            value={chapter.content}
                            onChange={(content) => handleChapterChange(index, "content", content)}
                            modules={modules}
                            className="bg-black/30 text-white rounded-lg overflow-hidden border border-white/10"
                            placeholder="Tulis materi di sini... Gunakan toolbar di atas untuk format teks & gambar."
                          />
                      </div>
                  </div>
              </div>
            ))}

            {/* Tombol Tambah Bab */}
            <button
                onClick={addChapter}
                className="w-full py-6 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Plus size={18} />
                </div>
                <span className="font-bold text-sm">TAMBAH BAB BARU</span>
            </button>

        </div>

      </div>

      {/* Override CSS untuk Quill Dark Mode Lengkap */}
      <style jsx global>{`
        .ql-toolbar {
            background-color: #18181b; /* zinc-900 */
            border-color: #27272a !important;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
        }
        .ql-container {
            border-color: #27272a !important;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            font-size: 16px;
            min-height: 300px;
        }
        .ql-editor {
            min-height: 300px;
        }
        
        /* Icon & Text Colors */
        .ql-stroke { stroke: #a1a1aa !important; }
        .ql-fill { fill: #a1a1aa !important; }
        .ql-picker { color: #a1a1aa !important; }
        .ql-picker-label { color: #a1a1aa !important; }
        
        /* Dropdown Options (Penting buat Dark Mode) */
        .ql-picker-options {
            background-color: #18181b !important;
            border-color: #3f3f46 !important;
            color: #e4e4e7 !important;
        }
        .ql-picker-item {
            color: #a1a1aa !important;
        }
        .ql-picker-item:hover {
            color: #ffffff !important;
            background-color: #27272a;
        }

        /* Placeholder Color */
        .ql-editor.ql-blank::before { color: #52525b !important; font-style: normal; }
        
        /* Code Block Style */
        .ql-snow .ql-editor pre.ql-syntax {
            background-color: #09090b !important;
            color: #4ade80 !important; /* Hijau Matrix */
            border: 1px solid #27272a;
            border-radius: 0.5rem;
            padding: 1rem;
        }
      `}</style>
    </div>
  );
}