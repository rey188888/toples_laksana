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
import ProductDialog from "@/components/admin/ProductDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

export default function AdminPageContent({ initialProducts }: { initialProducts: Product[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * handleSave
   * Handles creating or updating a product via the API.
   */
  const handleSave = async (productData: Partial<Product>) => {
    const isEditing = !!editingProduct;
    const url = isEditing ? `/api/products/${editingProduct._id}` : "/api/products";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Failed to save product");

    // Refresh the list (in a real app, you might just update the local state)
    router.refresh();
    setIsDialogOpen(false);

    // Manual state update for immediate feedback
    const saved = await response.json();
    if (isEditing) {
      setProducts(products.map(p => p._id === editingProduct._id ? saved.data : p));
    } else {
      setProducts([saved.data, ...products]);
    }
  };

  /**
   * handleDelete
   * Removes a product from the database.
   */
  const handleDelete = async () => {
    if (!productToDelete) return;

    const response = await fetch(`/api/products/${productToDelete}`, { method: "DELETE" });
    if (response.ok) {
      setProducts(products.filter(p => p._id !== productToDelete));
    } else {
      alert("Gagal menghapus produk");
    }
    setProductToDelete(null);
  };

  /**
   * handleEdit
   * Opens the dialog with the product's existing data.
   */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

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
    <div className="bg-background text-text-primary flex min-h-screen font-sans relative selection:bg-primary-500/10">
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Navigation ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-all duration-300 border-r border-[#E3E1DC] shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 lg:h-24 px-8 flex items-center border-b border-[#E3E1DC]">
          <Link href="/" className="text-xl font-black text-primary-500 tracking-tight flex items-center gap-2">
            Toples Laksana
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

        <div className="p-6 mt-auto border-t border-[#E3E1DC]">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[0.65rem] uppercase tracking-widest border-2 border-[#E3E1DC] hover:border-red-200"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Keluar
          </Link>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full relative">
        {/* Topbar */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-[#E3E1DC] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-text-secondary border-2 border-[#E3E1DC] hover:bg-white transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-black text-text-primary tracking-tight">Katalog Produk</h2>
            </div>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}
            className="bg-primary-500 text-white px-5 lg:px-7 py-2.5 lg:py-3 rounded-xl font-black flex items-center gap-2.5 text-xs lg:text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            <span className="hidden sm:inline">Tambah Produk Baru</span>
            <span className="sm:hidden">Produk</span>
          </button>
        </header>

        <div className="p-6 lg:p-10 space-y-8 flex-1 w-full max-w-full">
          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "inventory", label: "SKU Aktif", value: activeProducts.toString(), color: "text-primary-600", bg: "bg-primary-50", accent: "border-border" },
              { icon: "analytics", label: "Interaksi", value: "2.4k", color: "text-accent-600", bg: "bg-accent-50", accent: "border-border" },
              { icon: "workspace_premium", label: "Produk Premium", value: premiumCount.toString(), color: "text-secondary-600", bg: "bg-secondary-50", accent: "border-border" },
            ].map((stat) => (
              <Card key={stat.label} className={cn("border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300")}>
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
            <div className="px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#E3E1DC] bg-white gap-4">
              <div className="relative flex-1 sm:max-w-md group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors">search</span>
                <input
                  type="text"
                  placeholder="Cari SKU, nama, atau material..."
                  className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border-2 border-[#E3E1DC] rounded-xl text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 lg:gap-3">
                <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border-2 border-[#E3E1DC] rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">tune</span> Filter
                </button>
                <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border-2 border-[#E3E1DC] rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all shadow-sm uppercase tracking-widest">
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
                    <TableRow className="bg-transparent hover:bg-transparent border-b border-[#E3E1DC]">
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
                      <TableRow key={p._id} className="hover:bg-primary-50/20 transition-all duration-200 group border-[#E3E1DC]">
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
                            <button
                              onClick={() => handleEdit(p)}
                              className="w-9 h-9 rounded-xl hover:bg-white hover:text-primary-600 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border"
                            >
                              <span className="material-symbols-outlined text-lg">edit_note</span>
                            </button>
                            <button
                              onClick={() => {
                                setProductToDelete(p._id);
                                setIsConfirmOpen(true);
                              }}
                              className="w-9 h-9 rounded-xl hover:bg-white hover:text-red-500 hover:shadow-sm text-text-muted flex items-center justify-center transition-all border border-transparent hover:border-border"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
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
                  <button className="w-9 h-9 rounded-xl bg-white border-2 border-[#E3E1DC] flex items-center justify-center text-text-muted opacity-50 cursor-not-allowed shadow-sm transition-all">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-primary-500 text-white font-black text-[0.65rem] shadow-lg shadow-primary-500/20">1</button>
                  <button className="w-9 h-9 rounded-xl bg-white border-2 border-[#E3E1DC] hover:bg-secondary-50 flex items-center justify-center text-text-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Product Modal */}
        <ProductDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={editingProduct}
          onSave={handleSave}
        />

        {/* Delete Confirmation */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Produk?"
          message="Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari katalog."
          confirmLabel="Hapus Sekarang"
          variant="danger"
        />
      </main>
    </div>
  );
}

