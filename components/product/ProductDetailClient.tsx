"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types/product";
import { getSpecValue } from "@/types/product";
import { calculatePrice, getWholesaleNudge, formatPrice, formatUnitType } from "@/lib/price-calculator";
import { buildWhatsAppUrl, buildBulkInquiryUrl } from "@/lib/whatsapp-builder";
import { getUseCaseLabel } from "@/lib/use-case-config";
import { COLOR_SWATCHES } from "@/lib/use-case-config";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"dimensions" | "packaging" | "specs">("dimensions");
  const [quantity, setQuantity] = useState(1);
  const [pricingMode, setPricingMode] = useState<"retail" | "wholesale">("wholesale");
  const [mainImage, setMainImage] = useState(0);

  const selectedVariant: ProductVariant = product.variants[selectedVariantIdx];

  // Extract specs
  const volume = getSpecValue(product.specifications, "volume_ml");
  const height = getSpecValue(product.specifications, "tinggi_cm");
  const diameterBody = getSpecValue(product.specifications, "diameter_badan_cm");
  const diameterMouth = getSpecValue(product.specifications, "diameter_mulut_cm");
  const weight = getSpecValue(product.specifications, "berat_total_gr");

  // Calculate price
  const calcResult = useMemo(
    () => calculatePrice({ selectedVariant, quantity, mode: pricingMode }),
    [selectedVariant, quantity, pricingMode]
  );

  const nudge = useMemo(
    () => getWholesaleNudge(selectedVariant),
    [selectedVariant]
  );

  const waUrl = useMemo(
    () => buildWhatsAppUrl(product, selectedVariant, calcResult),
    [product, selectedVariant, calcResult]
  );

  const unitType = selectedVariant.pricing.wholesale.unit_type;
  const qtyPerUnit = selectedVariant.pricing.wholesale.qty_per_unit;

  return (
    <main className="pb-20 max-w-screen-2xl mx-auto px-4 sm:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center flex-wrap gap-1 text-sm text-text-secondary font-medium">
        <Link className="hover:text-primary-600 transition-colors" href="/">Beranda</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary-600 transition-colors" href="/catalog">Katalog</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary-600 transition-colors" href={`/catalog?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-primary font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* ══════════ LEFT: Image Gallery ══════════ */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Image */}
          <div className="relative bg-secondary-50 rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-fixed to-transparent" />
            {product.images?.[mainImage] ? (
              <img
                alt={product.name}
                className="relative z-10 w-3/4 max-h-[90%] object-contain transform transition-transform duration-500 group-hover:scale-105"
                src={product.images[mainImage]}
              />
            ) : (
              <span className="material-symbols-outlined text-8xl text-outline-variant/20 relative z-10">inventory_2</span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`aspect-square bg-secondary-50 rounded-lg p-2 overflow-hidden hover:bg-secondary-100 transition-all ${i === mainImage ? "ring-2 ring-primary-500 ring-offset-2" : ""
                    }`}
                >
                  <img alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" src={src} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════════ RIGHT: Product Info ══════════ */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Badges */}
          <div className="inline-flex items-center flex-wrap gap-2 mb-3">
            <span className="bg-primary text-on-primary text-[0.6rem] font-black px-2.5 py-1 rounded-md tracking-widest uppercase">
              {product.category}
            </span>
            <span className="text-[0.65rem] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-sm uppercase tracking-widest">
              {product.sku}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-3">
            {product.name}
          </h1>

          {/* Use-case tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="text-xs text-on-surface-variant font-medium">Cocok untuk:</span>
              {product.tags.map((tag) => (
                <span key={tag} className="text-[0.65rem] font-semibold text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-md">
                  {getUseCaseLabel(tag)}
                </span>
              ))}
            </div>
          )}

          {/* Quick Spec Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-container-low p-5 rounded-xl">
            {volume && (
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">straighten</span> Volume
                </span>
                <span className="text-lg font-bold text-on-surface">{volume}ml</span>
              </div>
            )}
            {weight && (
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">scale</span> Berat
                </span>
                <span className="text-lg font-bold text-on-surface">{weight}gr</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">science</span> Bahan
              </span>
              <span className="text-sm font-bold text-on-surface leading-snug">{product.materials.body.split("(")[0].trim()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">settings</span> Tutup
              </span>
              <span className="text-sm font-bold text-on-surface capitalize">{product.materials.lid_type}</span>
            </div>
          </div>

          {/* ── Color Variant Selector ── */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <span className="text-xs font-bold text-on-surface uppercase tracking-widest mb-3 block">
                Varian Warna: <span className="text-primary font-extrabold">{selectedVariant.color}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, i) => {
                  const hex = COLOR_SWATCHES[v.color] || "#ccc";
                  const isActive = i === selectedVariantIdx;
                  return (
                    <button
                      key={v.sku_variant}
                      onClick={() => { setSelectedVariantIdx(i); setQuantity(1); }}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${isActive
                          ? "ring-2 ring-primary ring-offset-2 border-primary scale-110"
                          : "border-outline-variant/30 hover:border-primary/50 hover:scale-105"
                        }`}
                      style={{ backgroundColor: hex }}
                      title={v.color}
                    >
                      {isActive && (
                        <span
                          className="material-symbols-outlined absolute inset-0 flex items-center justify-center"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                            fontSize: "16px",
                            color: hex === "#FFFFFF" || hex === "#F5F5F5" ? "#096447" : "#fff",
                          }}
                        >
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════ PRICE CALCULATOR ══════════ */}
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-5 mb-6 shadow-sm">
            {/* Mode Toggle */}
            <div className="flex bg-surface-container-low rounded-lg p-1 mb-5">
              <button
                onClick={() => { setPricingMode("retail"); setQuantity(1); }}
                className={`flex-1 py-2 text-[0.7rem] font-bold uppercase tracking-widest rounded-md transition-all ${pricingMode === "retail"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                Ecer /pcs
              </button>
              <button
                onClick={() => { setPricingMode("wholesale"); setQuantity(1); }}
                className={`flex-1 py-2 text-[0.7rem] font-bold uppercase tracking-widest rounded-md transition-all ${pricingMode === "wholesale"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                Per {formatUnitType(unitType)}
              </button>
            </div>

            {/* Price Display */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {formatPrice(calcResult.pricePerPcs)}
                </span>
                <span className="text-sm text-on-surface-variant font-medium">/pcs</span>
              </div>
              {pricingMode === "wholesale" && nudge && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">
                    💰 Hemat {nudge.percentage}%
                  </span>
                  <span className="text-on-surface-variant">vs harga ecer</span>
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="mb-5">
              <label className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                Jumlah ({pricingMode === "wholesale" ? formatUnitType(unitType) : "pcs"})
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-lg font-extrabold bg-white border border-outline-variant/20 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {pricingMode === "wholesale" ? formatUnitType(unitType) : "pcs"}
                </span>
              </div>
              {pricingMode === "wholesale" && (
                <p className="text-xs text-on-surface-variant mt-2">
                  1 {unitType} = {qtyPerUnit} pcs · Total: <span className="font-bold text-on-surface">{calcResult.totalPcs.toLocaleString("id-ID")} pcs</span>
                </p>
              )}
            </div>

            {/* Subtotal */}
            <div className="border-t border-outline-variant/10 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-on-surface-variant">Subtotal</span>
                <span className="text-2xl font-extrabold text-on-surface tracking-tight">
                  {formatPrice(calcResult.subtotal)}
                </span>
              </div>
              {calcResult.savingsVsRetail > 0 && (
                <p className="text-xs text-primary font-semibold mt-1 text-right">
                  💰 Anda hemat {formatPrice(calcResult.savingsVsRetail)} ({calcResult.savingsPercentage}%)
                </p>
              )}
            </div>

            {/* Wholesale Nudge (when in retail mode) */}
            {pricingMode === "retail" && nudge && (
              <div className="bg-tertiary-container/20 border border-tertiary-container/30 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-on-tertiary-container flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontSize: "14px" }}>lightbulb</span>
                  {nudge.message}
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 hover:opacity-95 transition-all shadow-lg shadow-primary/15 text-sm"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                Pesan via WhatsApp — {calcResult.totalPcs.toLocaleString("id-ID")} pcs
              </a>

              {quantity >= 5 && pricingMode === "wholesale" && (
                <a
                  href={buildBulkInquiryUrl(product, selectedVariant, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">request_quote</span>
                  Minta Harga Spesial ({quantity}+ {unitType})
                </a>
              )}
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 py-4 border-y border-outline-variant/10 mb-6 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-semibold text-on-surface-variant">Food Grade</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span className="font-semibold text-on-surface-variant">{qtyPerUnit} pcs/{unitType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <span className="font-semibold text-on-surface-variant">Kirim dari Bandung</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ TABBED CONTENT (Below the fold) ══════════ */}
      <div className="mt-16">
        {/* Tab Headers */}
        <div className="flex border-b border-outline-variant/15 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "dimensions" as const, label: "Dimensi Detail", icon: "straighten" },
            { id: "packaging" as const, label: "Info Pengemasan", icon: "inventory_2" },
            { id: "specs" as const, label: "Spesifikasi Lengkap", icon: "list_alt" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30"
                }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Dimensions */}
        {activeTab === "dimensions" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            {height && (
              <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">Tinggi Total</span>
                <span className="text-3xl font-extrabold text-on-surface tracking-tight">{height}</span>
                <span className="text-sm text-on-surface-variant font-medium ml-1">cm</span>
                <p className="text-[0.65rem] text-on-surface-variant mt-2 leading-relaxed">Dari dasar hingga bibir atas</p>
              </div>
            )}
            {diameterBody && (
              <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">Ø Badan</span>
                <span className="text-3xl font-extrabold text-on-surface tracking-tight">{diameterBody}</span>
                <span className="text-sm text-on-surface-variant font-medium ml-1">cm</span>
                <p className="text-[0.65rem] text-on-surface-variant mt-2 leading-relaxed">Bagian terlebar badan</p>
              </div>
            )}
            {diameterMouth && (
              <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">Ø Mulut</span>
                <span className="text-3xl font-extrabold text-on-surface tracking-tight">{diameterMouth}</span>
                <span className="text-sm text-on-surface-variant font-medium ml-1">cm</span>
                <p className="text-[0.65rem] text-on-surface-variant mt-2 leading-relaxed">Inner diameter opening</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Packaging */}
        {activeTab === "packaging" && product.packaging_logistics && (
          <div className="max-w-xl">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">package_2</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface mb-1">1 {formatUnitType(unitType)} berisi:</h4>
                  <p className="text-2xl font-extrabold text-primary">{qtyPerUnit} pcs</p>
                  <p className="text-xs text-on-surface-variant">Toples + tutup (set)</p>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4 grid grid-cols-2 gap-4">
                {product.packaging_logistics.dimensions && (
                  <div>
                    <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">Dimensi Kardus</span>
                    <span className="text-sm font-bold text-on-surface">
                      {product.packaging_logistics.dimensions.length_cm} × {product.packaging_logistics.dimensions.width_cm} × {product.packaging_logistics.dimensions.height_cm} cm
                    </span>
                  </div>
                )}
                {product.packaging_logistics.box_weight_kg && (
                  <div>
                    <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase tracking-widest block mb-1">Berat Total</span>
                    <span className="text-sm font-bold text-on-surface">±{product.packaging_logistics.box_weight_kg} kg/{unitType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Full Specs */}
        {activeTab === "specs" && (
          <div className="max-w-xl space-y-2">
            <div className="grid grid-cols-2 bg-surface-container-low rounded-lg overflow-hidden">
              {[
                { label: "SKU", value: product.sku },
                { label: "Kategori", value: product.category },
                { label: "Material Badan", value: product.materials.body },
                { label: "Material Tutup", value: product.materials.lid_material },
                { label: "Tipe Tutup", value: product.materials.lid_type },
                ...product.specifications.map((s) => ({
                  label: s.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                  value: `${s.value} ${s.key.includes("ml") ? "ml" : s.key.includes("cm") ? "cm" : s.key.includes("gr") ? "gr" : ""}`,
                })),
              ].map((row, i) => (
                <div key={row.label} className={`contents`}>
                  <div className={`px-5 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider ${i % 2 === 0 ? "bg-white" : "bg-surface-container-low"}`}>
                    {row.label}
                  </div>
                  <div className={`px-5 py-3.5 text-sm font-medium text-on-surface ${i % 2 === 0 ? "bg-white" : "bg-surface-container-low"}`}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
