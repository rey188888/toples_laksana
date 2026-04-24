"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/price-calculator";
import { getLowestRetailPrice } from "@/types/product";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPageContent({ initialProducts }: { initialProducts: Product[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products] = useState<Product[]>(initialProducts);
  const pathname = usePathname();

  // Compute Stats
  const activeProducts = products.filter(p => p.is_active).length;
  const premiumCount = products.filter(p => p.tags?.some(t => t.toLowerCase() === 'premium') || p.name.includes('Premium')).length;

  const NAV_ITEMS = [
    { label: "Dashboard", icon: "dashboard", href: "/admin", active: pathname === "/admin" },
    { label: "Katalog Produk", icon: "package_2", href: "#", active: true, count: products.length },
    { label: "Master Kategori", icon: "category", href: "#", active: false },
    { label: "Promosi & Label", icon: "campaign", href: "#", active: false },
    { label: "Analitik Interaksi", icon: "analytics", href: "#", active: false },
  ];

  return (
    <div className="bg-[#F8F9FA] text-text-primary flex min-h-screen font-sans relative selection:bg-primary-500/10">
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Navigation ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-all duration-300 border-r border-border shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-8 py-8 flex flex-col">
          <Link href="/" className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <span className="material-symbols-outlined font-black">inventory_2</span>
            </div>
            <div>
              <span className="text-xl font-black text-text-primary tracking-tighter">Laksana<span className="text-primary-500">Admin</span></span>
              <p className="text-[0.6rem] text-text-muted font-bold tracking-widest uppercase -mt-1">Internal Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm",
                item.active 
                  ? "bg-primary-50 text-primary-600 shadow-sm" 
                  : "text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-3.5">
                <span className={cn(
                  "material-symbols-outlined text-xl transition-colors",
                  item.active ? "text-primary-600" : "text-text-muted group-hover:text-text-primary"
                )} style={{ fontVariationSettings: item.active ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {item.count !== undefined && (
                <Badge variant={item.active ? "default" : "secondary"} className="rounded-lg px-1.5 py-0.5 text-[0.6rem] font-black">
                  {item.count}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border bg-secondary-50/30">
          <div className="flex items-center gap-3 mb-5 p-2 rounded-2xl bg-white border border-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center font-black text-sm shadow-md">AL</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-text-primary truncate">Admin Laksana</p>
              <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Super Admin</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[0.65rem] uppercase tracking-widest border border-transparent hover:border-red-100"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Keluar Sistem
          </Link>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
        {/* Topbar */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-text-secondary border border-border hover:bg-white transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-black text-text-primary tracking-tight">Katalog Produk</h2>
              <div className="hidden sm:flex items-center gap-2 text-[0.7rem] text-text-muted font-bold uppercase tracking-widest mt-0.5">
                <span className="text-primary-500">Admin</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span>Product Management</span>
              </div>
            </div>
          </div>
          <button className="bg-primary-500 text-white px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl font-bold flex items-center gap-2.5 text-xs lg:text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="hidden sm:inline">Tambah Produk Baru</span>
            <span className="sm:hidden">Produk</span>
          </button>
        </header>

        <div className="p-6 lg:p-10 space-y-8 flex-1 w-full max-w-full">
          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "inventory", label: "SKU Aktif", value: activeProducts.toString(), color: "text-primary-600", bg: "bg-primary-50", accent: "border-primary-100" },
              { icon: "analytics", label: "Interaksi", value: "2.4k", color: "text-accent-600", bg: "bg-accent-50", accent: "border-accent-100" },
              { icon: "workspace_premium", label: "Produk Premium", value: premiumCount.toString(), color: "text-secondary-600", bg: "bg-secondary-50", accent: "border-secondary-100" },
            ].map((stat) => (
              <Card key={stat.label} className={cn("border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300", stat.accent)}>
                <CardContent className="p-6 lg:p-8 flex items-center gap-6">
                  <div className={cn("w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300", stat.bg, stat.color)}>
                    <span className="material-symbols-outlined text-2xl lg:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-text-muted font-black tracking-[0.15em] uppercase mb-1">{stat.label}</p>
                    <h2 className="text-2xl lg:text-3xl font-black text-text-primary tracking-tighter">{stat.value}</h2>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Table Container */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border bg-white gap-4">
              <div className="relative flex-1 sm:max-w-md group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors">search</span>
                <input
                  type="text"
                  placeholder="Cari SKU, nama, atau material..."
                  className="w-full pl-12 pr-6 py-3 bg-[#F9FAFB] border border-border rounded-xl text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 lg:gap-3">
                <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-[#F9FAFB] hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">tune</span> Filter
                </button>
                <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-[#F9FAFB] hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">download</span> Ekspor
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-text-muted text-center">
                   <div className="w-24 h-24 bg-secondary-50 rounded-3xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
                   </div>
                   <p className="text-xl font-black text-text-primary tracking-tight">Katalog masih kosong</p>
                   <p className="text-sm mt-2 max-w-xs text-text-secondary font-medium">Mulai kembangkan bisnis Anda dengan menambahkan produk pertama.</p>
                </div>
              ) : (
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow className="bg-[#F9FAFB]/50 hover:bg-[#F9FAFB]/50">
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Info Produk</TableHead>
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">SKU & Material</TableHead>
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Kategori</TableHead>
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Harga Dasar</TableHead>
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Status</TableHead>
                      <TableHead className="px-8 py-5 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p._id} className="hover:bg-primary-50/20 transition-all duration-200 group border-border">
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl bg-[#F9FAFB] flex items-center justify-center p-1.5 border border-border shrink-0 overflow-hidden group-hover:scale-105 group-hover:border-primary-200 transition-all">
                              {p.images?.[0] ? (
                                <img className="w-full h-full object-cover rounded-lg" alt={p.name} src={p.images[0]} />
                              ) : (
                                <span className="material-symbols-outlined opacity-30 text-2xl">inventory_2</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1 tracking-tight">{p.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {p.tags?.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="bg-secondary-50 text-secondary-600 border-none text-[0.55rem] font-black uppercase px-1.5 h-4">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                          <p className="text-xs font-black text-text-primary font-mono tracking-tighter">{p.sku}</p>
                          <p className="text-[10px] font-bold text-text-muted mt-0.5 uppercase tracking-widest">{p.materials.lid_type}</p>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                          <Badge variant="outline" className="bg-white border-border text-text-secondary text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                          <p className="text-sm font-black text-text-primary tracking-tight">
                            {formatPrice(getLowestRetailPrice(p.variants))}
                          </p>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                          {p.is_active ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                              <span className="text-[0.6rem] font-black uppercase tracking-widest">Terbit</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                              <span className="text-[0.6rem] font-black uppercase tracking-widest">Draft</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="w-9 h-9 rounded-xl hover:bg-white hover:text-primary-600 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border">
                              <span className="material-symbols-outlined text-lg">edit_note</span>
                            </button>
                            <button className="w-9 h-9 rounded-xl hover:bg-white hover:text-red-500 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border">
                              <span className="material-symbols-outlined text-lg">more_horiz</span>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            
            {/* Pagination */}
            {products.length > 0 && (
              <div className="px-8 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-[#F9FAFB]/30 gap-4">
                <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest">
                  Showing <span className="text-text-primary font-black">1-{products.length}</span> of <span className="text-text-primary font-black">{products.length}</span> items
                </span>
                <div className="flex items-center gap-1.5">
                  <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-text-muted opacity-50 cursor-not-allowed shadow-sm transition-all">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-primary-500 text-white font-black text-[0.65rem] shadow-lg shadow-primary-500/20">1</button>
                  <button className="w-9 h-9 rounded-xl bg-white border border-border hover:bg-secondary-50 flex items-center justify-center text-text-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

