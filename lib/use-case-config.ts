// ============================================================
// Use-Case Filter Configuration
// Maps MongoDB tags[] values → user-friendly labels + icons
// ============================================================

export interface UseCaseConfig {
  tag: string;          // Must match tags[] values in MongoDB
  label: string;        // Display label in filter UI
  icon: string;         // Material Symbol icon name
  description: string;  // Tooltip text
}

/**
 * Master config for the "Cocok Untuk..." filter.
 * 
 * To add a new use-case:
 * 1. Add the tag to products in MongoDB (e.g., tags: ["sambal"])
 * 2. Add an entry here with the matching tag value
 * 
 * No database migration needed!
 */
export const USE_CASE_FILTER_CONFIG: UseCaseConfig[] = [
  {
    tag: "nastar",
    label: "Kue Kering / Nastar",
    icon: "cookie",
    description: "Toples untuk cookies, nastar, kastengel, putri salju",
  },
  {
    tag: "kue kering",
    label: "Kue Kering Lainnya",
    icon: "bakery_dining",
    description: "Kemasan untuk aneka kue kering dan snack",
  },
  {
    tag: "bubuk kopi",
    label: "Bubuk Kopi / Teh",
    icon: "coffee",
    description: "Kemasan kedap udara untuk bubuk kopi dan teh",
  },
  {
    tag: "biji kopi",
    label: "Biji Kopi / Granola",
    icon: "grain",
    description: "Container untuk biji-bijian utuh dan granola",
  },
  {
    tag: "selai",
    label: "Selai / Madu / Saus",
    icon: "humidity_percentage",
    description: "Jar untuk produk semi-liquid dan spread",
  },
  {
    tag: "bumbu",
    label: "Bumbu & Rempah",
    icon: "spa",
    description: "Kemasan kecil untuk spices dan bumbu dapur",
  },
  {
    tag: "manisan",
    label: "Manisan / Permen",
    icon: "candy",
    description: "Toples untuk manisan, permen, dan camilan manis",
  },
  {
    tag: "sambal",
    label: "Sambal / Acar",
    icon: "local_fire_department",
    description: "Jar untuk sambal, acar, dan produk fermentasi",
  },
];

/**
 * Get the UI config for a specific tag value.
 * Returns undefined if tag is not configured (will show raw tag as fallback).
 */
export function getUseCaseConfig(tag: string): UseCaseConfig | undefined {
  return USE_CASE_FILTER_CONFIG.find((c) => c.tag === tag);
}

/**
 * Get display label for a tag. Falls back to capitalized tag if not configured.
 */
export function getUseCaseLabel(tag: string): string {
  const config = getUseCaseConfig(tag);
  return config?.label ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * Color mapping for category filter chips.
 * Used in the sidebar category filter for visual distinction.
 */
export const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  "Tin Kaleng": { icon: "deployed_code", label: "Tin Kaleng" },
  "Jar Plastik": { icon: "layers", label: "Jar Plastik" },
  "Jar Kaca": { icon: "liquor", label: "Jar Kaca" },
  "Jar Cylinder": { icon: "inventory_2", label: "Jar Cylinder" },
  "Botol": { icon: "water_bottle", label: "Botol" },
  "Botol Plastik": { icon: "water_bottle", label: "Botol Plastik" },
};

/**
 * Humanized labels for technical material names.
 * Used in advanced filter and product detail page.
 */
export const MATERIAL_LABELS: Record<string, { label: string; tooltip: string }> = {
  "Polyethylene Terephthalate (PET) no.1": {
    label: "Plastik Bening (PET)",
    tooltip: "Material ringan, jernih, food-safe. Paling populer untuk cookies.",
  },
  "Polypropylene(PP) no.3": {
    label: "Plastik Kuat (PP)",
    tooltip: "Lebih kuat dari PET, tahan panas hingga 100°C. Ideal untuk produk yang di-reheat.",
  },
  "Tin kaleng": {
    label: "Tin Kaleng",
    tooltip: "Material metalik premium. Proteksi maksimal, kesan klasik dan eksklusif.",
  },
  "Soda lime glass": {
    label: "Kaca Standard",
    tooltip: "Kaca food-grade tebal. Berat, premium, reusable.",
  },
};

export const LID_TYPE_LABELS: Record<string, { label: string; tooltip: string }> = {
  "tutup ulir": {
    label: "Tutup Putar (Ulir)",
    tooltip: "Buka-tutup dengan memutar. Seal paling umum dan mudah.",
  },
  "twist off": {
    label: "Tutup Tekan-Putar",
    tooltip: "Perlu tekanan + putaran. Seal lebih kuat untuk produk liquid.",
  },
  "slide on": {
    label: "Tutup Geser (Slide On)",
    tooltip: "Tutup tinggal digeser/tekan. Praktis untuk akses cepat.",
  },
};

/**
 * Color swatch mapping for the color filter & variant selector.
 */
export const COLOR_SWATCHES: Record<string, string> = {
  "Bening": "#FFFFFF",
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Rose": "#B76E79",
  "Rose Gold": "#B76E79",
  "Hitam": "#1A1A1A",
  "Putih": "#F5F5F5",
  "Merah": "#DC2626",
};
