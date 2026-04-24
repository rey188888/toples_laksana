// ============================================================
// WhatsApp Message Builder — Schema-Aware
// ============================================================

import type { Product, ProductVariant } from "@/types/product";
import type { CalculatorResult } from "@/lib/price-calculator";
import { getSpecValue } from "@/types/product";
import { formatRupiah } from "@/lib/price-calculator";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";

/**
 * Build a WhatsApp deep link URL with a pre-filled order message.
 * 
 * The message includes product details, variant, quantity, and pricing
 * — all pulled from the actual data, not hardcoded.
 */
export function buildWhatsAppUrl(
  product: Product,
  variant: ProductVariant,
  calc: CalculatorResult
): string {
  const volume = getSpecValue(product.specifications, "volume_ml");

  const lines: string[] = [
    `Halo Toples Laksana 👋`,
    ``,
    `Saya tertarik untuk memesan:`,
    `━━━━━━━━━━━━━━━━`,
    `📦 Produk: ${product.name}`,
    `📐 SKU: ${variant.sku_variant}`,
  ];

  if (volume) {
    lines.push(`📏 Volume: ${volume}ml`);
  }

  lines.push(
    `🎨 Warna: ${variant.color}`,
    `📊 Jumlah: ${calc.quantity} ${calc.unitLabel} (${calc.totalPcs.toLocaleString("id-ID")} pcs)`,
    `💰 Estimasi: ${formatRupiah(calc.subtotal)}`
  );

  if (calc.savingsVsRetail > 0) {
    lines.push(
      `💡 Hemat: ${formatRupiah(calc.savingsVsRetail)} (${calc.savingsPercentage}%)`
    );
  }

  lines.push(
    `━━━━━━━━━━━━━━━━`,
    ``,
    `Mohon konfirmasi ketersediaan stok dan ongkir ke [kota saya].`,
    `Terima kasih! 🙏`
  );

  const message = lines.join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a simple inquiry WhatsApp URL (no calculator data).
 * For use on product cards and general inquiries.
 */
export function buildInquiryUrl(product: Product): string {
  const volume = getSpecValue(product.specifications, "volume_ml");
  
  const message = [
    `Halo Toples Laksana 👋`,
    ``,
    `Saya ingin bertanya tentang produk:`,
    `📦 ${product.name}${volume ? ` (${volume}ml)` : ""}`,
    `📐 SKU: ${product.sku}`,
    ``,
    `Mohon informasi ketersediaan dan harga terbaru.`,
    `Terima kasih! 🙏`,
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a custom discount inquiry URL.
 * For when user wants to negotiate bulk pricing beyond standard tiers.
 */
export function buildBulkInquiryUrl(
  product: Product,
  variant: ProductVariant,
  desiredQty: number
): string {
  const volume = getSpecValue(product.specifications, "volume_ml");
  const unitType = variant.pricing.wholesale.unit_type;

  const message = [
    `Halo Toples Laksana 👋`,
    ``,
    `Saya tertarik order dalam jumlah besar:`,
    `━━━━━━━━━━━━━━━━`,
    `📦 Produk: ${product.name}${volume ? ` (${volume}ml)` : ""}`,
    `🎨 Warna: ${variant.color}`,
    `📊 Jumlah: ${desiredQty} ${unitType}`,
    `━━━━━━━━━━━━━━━━`,
    ``,
    `Apakah ada harga spesial untuk jumlah ini?`,
    `Terima kasih! 🙏`,
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
