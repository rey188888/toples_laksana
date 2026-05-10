"use client";

import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";
import { Product } from "@/types/product";
import { ICategory } from "@/models/Category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MasterDataDialog, { MasterDataField } from "@/components/admin/MasterDataDialog";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface CategoriesPageContentProps {
  initialProducts: Product[];
  initialCategories: ICategory[];
}

const CATEGORY_FIELDS: MasterDataField[] = [
  { name: "id", label: "ID Kategori", type: "text", placeholder: "misal: toples-bulat", required: true },
  { name: "name", label: "Nama Kategori", type: "text", placeholder: "misal: Toples Bulat", required: true },
  { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi kategori (opsional)" },
];

export default function CategoriesPageContent({ initialProducts, initialCategories }: CategoriesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(initialCategories.map(c => ({
    ...c,
    count: initialProducts.filter(p => p.categoryId === c.id).length
  })));
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  const router = useRouter();

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: any) => {
    const isEditing = !!editingCategory;
    const url = isEditing ? `/api/categories/${editingCategory.id}` : "/api/categories";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menyimpan kategori");
      }

      toast.success(isEditing ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan");
      
      const saved = await response.json();
      const savedItem = {
        ...saved.data,
        count: isEditing ? (categories.find(c => c.id === editingCategory.id)?.count || 0) : 0
      };

      if (isEditing) {
        setCategories(categories.map(c => c.id === editingCategory.id ? savedItem : c));
      } else {
        setCategories([savedItem, ...categories]);
      }
      
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus kategori");
      }

      setCategories(categories.filter(c => c.id !== categoryToDelete));
      toast.success("Kategori berhasil dihapus");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: ICategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Kategori</h2>
        </div>
        <button 
          onClick={openAddDialog}
          className="bg-primary-500 text-white px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-600 transition-all active:scale-95 group cursor-pointer shadow-lg shadow-primary-500/20"
        >
          <AppIcon name="add" className="text-lg" />
          Tambah Kategori
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={openAddDialog}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl shadow-primary-500/30"
      >
        <AppIcon name="add" className="text-2xl" />
      </button>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 lg:gap-3">
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                <AppIcon name="tune" className="text-sm" /> Filter
              </button>
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                <AppIcon name="download" className="text-sm" /> Ekspor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Kategori</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Kategori</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Jumlah Produk</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="category" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Kategori tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{cat.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{cat.name}</p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <Badge variant="secondary" className="bg-secondary-50 text-secondary-600 border-none text-[0.65rem] font-black uppercase px-2 h-5">
                          {cat.count} Produk
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditDialog(cat)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(cat.id)}
                            className="w-9 h-9 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer border-none shadow-none"
                          >
                            <AppIcon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <MasterDataDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori"}
        fields={CATEGORY_FIELDS}
        initialData={editingCategory}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Kategori?"
        message="Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus secara permanen."
        confirmLabel="Hapus Sekarang"
        variant="danger"
      />
    </>
  );
}
