// src/app/admin/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Ambil URL dari Environment Variable
    // Jika di Vercel, dia pakai URL Render. Jika di local, dia pakai localhost.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
      // 2. Gunakan baseUrl yang dinamis
      // Perhatikan: endpointnya harus sesuai backend (/api/auth/login atau /auth/login)
      // Cek Swagger Anda, apakah '/auth/login' atau '/api/auth/login'?
      // Biasanya di NestJS global prefix 'api', jadi: `${baseUrl}/api/auth/login`
      
      const res = await fetch(`${baseUrl}/api/auth/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal, periksa email/password");
      }

      // 3. Simpan Token
      Cookies.set("token", data.access_token, { expires: 1 });
      
      // Cek struktur data user dari backend Anda, kadang data.user, kadang data.data.user
      if (data.user?.role) {
          Cookies.set("user_role", data.user.role, { expires: 1 });
      }

      router.push("/admin/dashboard");

    } catch (err: any) {
      console.error("Login Error:", err); // Cek console browser untuk detail
      setError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-xl relative z-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
             <h1 className="font-heading text-3xl font-bold text-white tracking-tighter">
                HIMIKOM<span className="text-blue-500">.</span>
             </h1>
          </Link>
          <p className="text-gray-400 text-sm">Masuk untuk mengelola konten website.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                placeholder="admin@himikom.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                MASUK DASHBOARD <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
             <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
                ← Kembali ke Website Utama
             </Link>
        </div>
      </div>
    </div>
  );
}