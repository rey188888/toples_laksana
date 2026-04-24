"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { getSpecValue, getLowestRetailPrice, getLowestWholesalePrice } from "@/types/product";
import { formatPrice } from "@/lib/price-calculator";

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (productId: string) => void;
  isComparing?: boolean;
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
}: ProductCardProps) {
  const volume = getSpecValue(product.specifications, "volume_ml");
  const retailPrice = getLowestRetailPrice(product.variants);
  const wholesalePrice = getLowestWholesalePrice(product.variants);
  const firstVariant = product.variants[0];
  const primaryTag = product.tags[0];
  const heroImage = product.images?.[0];

  const handleInteraction = async () => {
    try {
      await fetch(`/api/products/${product._id}/interact`, { method: "POST" });
    } catch (error) {
      console.error("Gagal melacak interaksi:", error);
    }
  };

  const savingsPercent =
    retailPrice > 0
      ? Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100)
      : 0;

  return (
    <div className="group relative bg-white overflow-hidden transition-all duration-500 hover:translate-y-[-4px] shadow-sm border border-border rounded-xl">
      {/* Image Section */}
      <Link
        href={`/products/${product._id}`}
        onClick={handleInteraction}
        className="block aspect-square relative bg-secondary-50 overflow-hidden"
      >
        {/* Background glow on hover */}
        <div className="absolute inset-0 bg-primary-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Product Image */}
        {heroImage ? (
          <div className="relative w-full h-full p-8 transform transition-transform duration-700 group-hover:scale-110">
            <Image
              alt={product.name}
              fill
              className="object-contain p-8"
              src={heroImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <span className="material-symbols-outlined text-6xl text-text-muted/30">
              inventory_2
            </span>
          </div>
        )}

        {/* Badge: Category tag */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[0.65rem] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider bg-primary-500 text-white shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Use-case Tag / Trending Badge */}
        {primaryTag && (
          <div className="absolute top-4 right-4 z-20">
            <span className="text-[0.65rem] font-bold px-3 py-1.5 rounded-lg bg-accent-500 text-white shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-xs" style={{ fontSize: "14px" }}>
                trending_up
              </span>
              Sedang Tren
            </span>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="p-6">
        {/* Product Name */}
        <Link href={`/products/${product._id}`} onClick={handleInteraction} className="block mb-2">
          <h3 className="text-base font-bold text-text-primary leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Quick Spec */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-text-secondary px-2 py-0.5 bg-secondary-50 rounded-md">
            {product.materials.body.split("(")[0].trim()}
          </span>
          {volume && (
            <span className="text-xs font-bold text-secondary-500">
              {volume}ml
            </span>
          )}
        </div>

        {/* Price Block */}
        <div className="mb-6 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[0.7rem] text-text-muted font-bold uppercase tracking-widest">
              Eceran
            </span>
            <span className="text-xl font-extrabold text-text-primary tracking-tight">
              {formatPrice(retailPrice)}
            </span>
            <span className="text-xs text-text-muted">/pcs</span>
          </div>
          {wholesalePrice < retailPrice && firstVariant && (
            <div className="flex items-baseline gap-2">
              <span className="text-[0.7rem] text-primary-600 font-bold uppercase tracking-widest">
                Grosir
              </span>
              <span className="text-base font-bold text-primary-600 tracking-tight">
                {formatPrice(wholesalePrice)}
              </span>
              <span className="text-[0.7rem] text-primary-600">/pcs</span>
              <span className="text-[0.65rem] font-black text-white bg-primary-500 px-2 py-0.5 rounded-md">
                -{savingsPercent}%
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/products/${product._id}`}
          onClick={handleInteraction}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary-500 text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all shadow-md shadow-primary-500/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Lihat Detail
        </Link>

        {/* Compare */}
        <div className="mt-4 flex items-center justify-between border-t border-divider pt-4">
          <label
            className="flex items-center gap-2 cursor-pointer group/compare"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
              type="checkbox"
              checked={isComparing}
              onChange={() => onCompareToggle?.(product._id)}
            />
            <span className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-tight group-hover/compare:text-primary-500 transition-colors">
              Bandingkan
            </span>
          </label>
          <span className="text-[0.65rem] font-medium text-text-muted italic">Stok Tersedia</span>
        </div>
      </div>
    </div>
  );
}
