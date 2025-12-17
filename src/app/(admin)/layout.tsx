// src/app/admin/layout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // 1. Tambah usePathname
import Cookies from "js-cookie";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // 2. Ambil URL saat ini
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 3. JIKA SEDANG DI HALAMAN LOGIN, LANGSUNG IZINKAN (Supaya form muncul)
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    // 4. SELAIN HALAMAN LOGIN, BARU CEK TOKEN
    const token = Cookies.get("token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  // Loading State
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400">Verifying Access...</span>
        </div>
      </div>
    );
  }

  // 5. LOGIKA TAMPILAN:
  // Jika di halaman login, jangan tampilkan Sidebar & Margin kiri
  if (pathname === "/admin/login") {
      return (
        <main className="min-h-screen bg-black">
            {children}
        </main>
      );
  }

  // Jika sudah login (Dashboard, dll), tampilkan Sidebar lengkap
  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 bg-black min-h-screen">
        {children}
      </main>
    </div>
  );
}