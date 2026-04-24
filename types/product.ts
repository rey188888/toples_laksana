// ============================================================
// Product Types — Mirroring MongoDB Schema
// ============================================================

export interface ProductSpecification {
  key: string;    // "volume_ml", "tinggi_cm", "diameter_badan_cm", "berat_total_gr"
  value: number;
  type: "number";
}

export interface VariantPricing {
  retail: {
    price: number;    // Harga per pcs (ecer)
    min_qty: number;  // Always 1
  };
  wholesale: {
    price: number;        // Harga per pcs (grosir) — BUKAN total per kardus
    unit_type: string;    // "kardus" | "bal" | "shrink"
    qty_per_unit: number; // 42, 240, 99, etc.
  };
}

export interface ProductVariant {
  sku_variant: string;
  color: string;       // "Gold", "Bening", "Rose", "Silver", etc.
  pricing: VariantPricing;
}

export interface PackagingLogistics {
  box_weight_kg: number;
  dimensions: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
}

export interface ProductMaterials {
  body: string;        // "Tin kaleng", "Polyethylene Terephthalate (PET) no.1"
  lid_type: string;    // "slide on", "twist off", "tutup ulir"
  lid_material: string; // "Alumunium", "Polypropylene(PP) no.3"
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;     // "Tin Kaleng", "Jar Plastik", "Jar Kaca", "Jar Cylinder", "Botol"
  tags: string[];       // ["nastar", "kue kering"]
  images: string[];     // Array of UploadThing URLs
  materials: ProductMaterials;
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  packaging_logistics: PackagingLogistics;
  is_active: boolean;
  description?: string;
}

// ============================================================
// Utility Types for UI State
// ============================================================

/** Serialized product from API (with string _id) */
export type SerializedProduct = Product;

/** Spec keys used in the specifications[] Attribute Pattern */
export type SpecKey = 
  | "volume_ml"
  | "tinggi_cm"
  | "diameter_badan_cm"
  | "diameter_mulut_cm"
  | "berat_total_gr";

/** Helper to extract a specific spec value from specifications[] */
export function getSpecValue(
  specs: ProductSpecification[],
  key: SpecKey
): number | undefined {
  return specs.find((s) => s.key === key)?.value;
}

/** Get the lowest retail price across all variants ("Mulai dari" price) */
export function getLowestRetailPrice(variants: ProductVariant[]): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.pricing.retail.price));
}

/** Get the lowest wholesale price across all variants */
export function getLowestWholesalePrice(variants: ProductVariant[]): number {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((v) => v.pricing.wholesale.price));
}

/** Get all unique colors from variants */
export function getVariantColors(variants: ProductVariant[]): string[] {
  return [...new Set(variants.map((v) => v.color))];
}

// ============================================================
// Filter Types
// ============================================================

export interface CatalogFilters {
  search?: string;
  category?: string[];
  tags?: string[];
  volume_min?: number;
  volume_max?: number;
  price_min?: number;
  price_max?: number;
  material_body?: string[];
  lid_type?: string[];
  colors?: string[];
  sort?: "popular" | "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FacetCounts {
  categories: { value: string; count: number }[];
  tags: { value: string; count: number }[];
  materials: { value: string; count: number }[];
  lid_types: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  volume_range: { min: number; max: number };
  price_range: { min: number; max: number };
}
