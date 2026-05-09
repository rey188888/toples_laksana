"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

const emptyProduct: Partial<Product> = {
  id: "",
  name: "",
  sku: "",
  categoryId: "cat_001",
  productTypeId: "pt_003",
  unitId: "unit_005",
  bodyMaterial: "",
  lidMaterial: "",
  lidVariant: "",
  lidType: "",
  description: "",
  dimension: {
    heightCm: 0,
    diameterCm: 0,
    volumeMl: 0,
    weightGram: 0,
  },
  images: [],
  prices: [],
  packaging: [],
  deletedAt: null,
};

export default function ProductDialog({ isOpen, onClose, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(product || {
      ...emptyProduct,
      id: `prod_${Date.now()}`,
    });
  }, [product, isOpen]);

  const updateDimension = (key: keyof NonNullable<Product["dimension"]>, value: number) => {
    setFormData({
      ...formData,
      dimension: {
        heightCm: formData.dimension?.heightCm || 0,
        diameterCm: formData.dimension?.diameterCm || 0,
        volumeMl: formData.dimension?.volumeMl || 0,
        weightGram: formData.dimension?.weightGram || 0,
        [key]: value,
      },
    });
  };

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-white/90 px-8 py-6 backdrop-blur-md">
          <DialogTitle className="text-xl font-black text-text-primary">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="ID Produk" value={formData.id || ""} onChange={(value) => setFormData({ ...formData, id: value })} required />
            <Field label="SKU" value={formData.sku || ""} onChange={(value) => setFormData({ ...formData, sku: value })} required />
            <Field label="Nama Produk" value={formData.name || ""} onChange={(value) => setFormData({ ...formData, name: value })} required />
            <SelectField
              label="Kategori"
              value={formData.categoryId || ""}
              onChange={(value) => setFormData({ ...formData, categoryId: value })}
              options={[
                ["cat_jar_cylinder", "Jar Cylinder"],
                ["cat_jar_kaca", "Jar Kaca"],
                ["cat_jar_plastik", "Jar Plastik"],
                ["cat_botol_plastik", "Botol Plastik"],
                ["cat_botol", "Botol"],
                ["cat_tin", "Tin Kaleng"],
              ]}
            />
            <SelectField
              label="Tipe Produk"
              value={formData.productTypeId || ""}
              onChange={(value) => setFormData({ ...formData, productTypeId: value })}
              options={[
                ["type_premium", "Premium"],
                ["type_reguler", "Reguler"],
              ]}
            />
            <Field label="Unit ID" value={formData.unitId || ""} onChange={(value) => setFormData({ ...formData, unitId: value })} required />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Material Badan" value={formData.bodyMaterial || ""} onChange={(value) => setFormData({ ...formData, bodyMaterial: value })} required />
              <Field label="Material Tutup" value={formData.lidMaterial || ""} onChange={(value) => setFormData({ ...formData, lidMaterial: value })} required />
              <Field label="Varian Tutup" value={formData.lidVariant || ""} onChange={(value) => setFormData({ ...formData, lidVariant: value })} required />
              <Field label="Tipe Tutup" value={formData.lidType || ""} onChange={(value) => setFormData({ ...formData, lidType: value })} required />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary-600">Dimensi</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <NumberField label="Tinggi cm" value={formData.dimension?.heightCm || 0} onChange={(value) => updateDimension("heightCm", value)} />
              <NumberField label="Diameter cm" value={formData.dimension?.diameterCm || 0} onChange={(value) => updateDimension("diameterCm", value)} />
              <NumberField label="Volume ml" value={formData.dimension?.volumeMl || 0} onChange={(value) => updateDimension("volumeMl", value)} />
              <NumberField label="Berat gr" value={formData.dimension?.weightGram || 0} onChange={(value) => updateDimension("weightGram", value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-border bg-white/90 pt-6 backdrop-blur-md">
            <Button type="button" variant="secondary" size="lg" onClick={onClose} className="flex-1 font-black uppercase tracking-widest">
              Batal
            </Button>
            <Button type="submit" disabled={loading} size="lg" className="flex-2 font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
              {loading ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah Produk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(nextValue) => onChange(String(nextValue))}>
        <SelectTrigger className="h-10 w-full bg-background px-3 font-bold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(([optionValue, optionLabel]) => (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
