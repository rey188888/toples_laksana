// ============================================================
// Price Calculator — Uses variants[].pricing from MongoDB
// ============================================================

import type { ProductVariant } from "@/types/product";

// ---- Types ----

export type PricingMode = "retail" | "wholesale";

export interface CalculatorState {
  selectedVariant: ProductVariant;
  quantity: number;           // Jumlah unit: pcs (retail) or bal/kardus (wholesale)
  mode: PricingMode;
}

export interface CalculatorResult {
  quantity: number;           // Input quantity (pcs or units)
  totalPcs: number;
  pricePerPcs: number;
  subtotal: number;
  savingsVsRetail: number;    // Total hemat vs beli ecer
  savingsPercentage: number;  // Persentase hemat
  unitLabel: string;          // "pcs" | "bal" | "kardus" | "shrink"
  totalPerUnit: number;       // Harga total per 1 bal/kardus
}

export interface WholesaleNudge {
  message: string;
  savings: number;
  percentage: number;
}

// ---- Core Functions ----

/**
 * Calculate total price based on selected variant, quantity, and mode.
 * 
 * NOTE: wholesale.price is the price PER PCS in wholesale context,
 * NOT the total price per kardus/bal!
 * Total per unit = wholesale.price × qty_per_unit
 */
export function calculatePrice(state: CalculatorState): CalculatorResult {
  const { selectedVariant, quantity, mode } = state;
  const { retail, wholesale } = selectedVariant.pricing;

  if (mode === "retail") {
    return {
      quantity,
      totalPcs: quantity,
      pricePerPcs: retail.price,
      subtotal: quantity * retail.price,
      savingsVsRetail: 0,
      savingsPercentage: 0,
      unitLabel: "pcs",
      totalPerUnit: retail.price,
    };
  }

  // Wholesale mode
  // wholesale.price = harga per pcs (grosir), BUKAN total per kardus
  const totalPcs = quantity * wholesale.qty_per_unit;
  const subtotal = totalPcs * wholesale.price;
  const retailEquivalent = totalPcs * retail.price;
  const savings = retailEquivalent - subtotal;

  return {
    quantity,
    totalPcs,
    pricePerPcs: wholesale.price,          // Already per-pcs!
    subtotal,
    savingsVsRetail: savings,
    savingsPercentage: retailEquivalent > 0
      ? Math.round((savings / retailEquivalent) * 100)
      : 0,
    unitLabel: wholesale.unit_type,         // Dynamic: "bal" | "kardus" | "shrink"
    totalPerUnit: wholesale.price * wholesale.qty_per_unit,
  };
}

/**
 * Generate a "nudge" message encouraging wholesale purchase.
 * Example: "Beli 1 kardus (42 pcs) — hemat Rp 42.000!"
 * 
 * Returns null if wholesale is not cheaper than retail.
 */
export function getWholesaleNudge(
  variant: ProductVariant
): WholesaleNudge | null {
  const { retail, wholesale } = variant.pricing;

  // wholesale.price is already per-pcs, direct comparison
  const savingsPerPcs = retail.price - wholesale.price;

  if (savingsPerPcs <= 0) return null;

  const percentage = Math.round((savingsPerPcs / retail.price) * 100);
  const totalSavings = savingsPerPcs * wholesale.qty_per_unit;

  return {
    message: `Beli 1 ${wholesale.unit_type} (${wholesale.qty_per_unit} pcs) — hemat Rp ${totalSavings.toLocaleString("id-ID")}!`,
    savings: totalSavings,
    percentage,
  };
}

// ---- Formatting Helpers ----

/** Format price to Indonesian Rupiah string */
export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/** Format compact price (e.g., "Rp 4.500") */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Capitalize unit type for display */
export function formatUnitType(unitType: string): string {
  return unitType.charAt(0).toUpperCase() + unitType.slice(1);
}
