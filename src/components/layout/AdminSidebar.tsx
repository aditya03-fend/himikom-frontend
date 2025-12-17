// src/components/AdminSidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  LayoutDashboard, 
  FileText, 
  Code, 
  BookOpen, 
  Trophy, // <--- Import Icon Trophy
  LogOut,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Program Kerja", path: "/admin/program", icon: FileText },
  { name: "Artikel", path: "/admin/article", icon: BookOpen },
  { name: "Karya", path: "/admin/work", icon: Code },
  { name: "Prestasi", path: "/admin/achievement", icon: Trophy },
  { name: "Web Portfolio", path: "/admin/portfolio", icon: Globe }, // <--- MENU BARU
  { name: "Modul", path: "/admin/module", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_role");
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-white/10 flex flex-col">
      
      {/* HEADER */}
      <div className="h-20 flex items-center px-8 border-b border-white/10">
        <h1 className="font-heading text-2xl font-bold text-white tracking-tighter">
          ADMIN<span className="text-blue-500">.</span>
        </h1>
      </div>

      {/* MENU LIST */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path); // Update: startsWith agar aktif saat di sub-halaman (create)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}