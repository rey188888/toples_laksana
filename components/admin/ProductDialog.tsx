"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

/**
 * ProductDialog
 * Modal component for creating and editing products.
 */
export default function ProductDialog({ isOpen, onClose, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    category: "",
    tags: [],
    materials: { body: "", lid_type: "", lid_material: "" },
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        sku: "",
        category: "",
        tags: [],
        materials: { body: "", lid_type: "", lid_material: "" },
        is_active: true,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Gagal menyimpan produk. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-[#E3E1DC] z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-text-primary tracking-tight">
              {product ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
              Informasi Detail Katalog
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-secondary-50 text-text-muted transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Nama Produk</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                placeholder="Misal: Jar Plastik 500ml"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">SKU (Kode Produk)</label>
              <input
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all"
                placeholder="TL-JAR-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Kategori</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none"
              >
                <option value="">Pilih Kategori</option>
                <option value="Jar Plastik">Jar Plastik</option>
                <option value="Botol Plastik">Botol Plastik</option>
                <option value="Tin Kaleng">Tin Kaleng</option>
                <option value="Kaca">Kaca</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-muted ml-1">Status Publikasi</label>
              <div className="flex items-center gap-4 h-[50px]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: true })}
                  className={cn(
                    "flex-1 h-full rounded-xl border-2 font-black text-[0.7rem] uppercase tracking-widest transition-all",
                    formData.is_active ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-[#E3E1DC] text-text-muted"
                  )}
                >
                  Terbit
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: false })}
                  className={cn(
                    "flex-1 h-full rounded-xl border-2 font-black text-[0.7rem] uppercase tracking-widest transition-all",
                    !formData.is_active ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-white border-[#E3E1DC] text-text-muted"
                  )}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-4 pt-4 border-t border-[#E3E1DC]">
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Spesifikasi Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">Bodi</label>
                <input
                  required
                  value={formData.materials?.body}
                  onChange={e => setFormData({ ...formData, materials: { ...formData.materials!, body: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold text-sm focus:bg-white focus:border-primary-500 outline-none"
                  placeholder="PET"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">Tipe Tutup</label>
                <input
                  required
                  value={formData.materials?.lid_type}
                  onChange={e => setFormData({ ...formData, materials: { ...formData.materials!, lid_type: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold text-sm focus:bg-white focus:border-primary-500 outline-none"
                  placeholder="Screw Cap"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-text-muted">Material Tutup</label>
                <input
                  required
                  value={formData.materials?.lid_material}
                  onChange={e => setFormData({ ...formData, materials: { ...formData.materials!, lid_material: e.target.value } })}
                  className="w-full px-4 py-3 bg-secondary-50 border-2 border-[#E3E1DC] rounded-xl font-bold text-sm focus:bg-white focus:border-primary-500 outline-none"
                  placeholder="PP"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 sticky bottom-0 bg-white/80 backdrop-blur-md mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-secondary-50 text-text-primary font-black uppercase tracking-widest text-xs hover:bg-secondary-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl bg-primary-500 text-white font-black uppercase tracking-widest text-xs hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : (product ? "Simpan Perubahan" : "Tambah Produk")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
