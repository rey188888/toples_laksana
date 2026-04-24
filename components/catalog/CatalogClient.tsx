"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductCard from "@/components/catalog/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilterBar from "@/components/catalog/ActiveFilterBar";
import type { Product, FacetCounts, PaginatedResponse } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CatalogContent() {
  const {
    filters,
    setFilters,
    toggleArrayFilter,
    setPage,
    clearAll,
    removeFilter,
    activeFilterCount,
    apiUrl,
  } = useProductFilters();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false,
  });
  const [facets, setFacets] = useState<FacetCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch facets once on mount
  useEffect(() => {
    fetch("/api/products/facets")
      .then((r) => r.json())
      .then((data) => setFacets(data))
      .catch(console.error);
  }, []);

  // Fetch products when filters/page change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loading) setLoading(true);
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data: PaginatedResponse<Product>) => {
        setProducts(data.data || []);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const handleCompareToggle = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }, []);

  return (
    <div className="bg-background text-text-primary min-h-screen pt-8">
      <main className="pb-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-text-secondary font-medium">
          <Link className="hover:text-primary-500 transition-colors" href="/">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-text-primary font-bold tracking-tight">Katalog</span>
        </nav>

        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
              Koleksi Kami
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Temukan berbagai pilihan kemasan industri premium kami, dirancang untuk keindahan estetika dan ketahanan praktis.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-border text-sm font-bold shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary-500 text-white text-[0.65rem] font-black px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-border shadow-sm">
              <span className="text-[0.65rem] uppercase font-black text-text-muted tracking-widest hidden sm:inline">
                Urutkan:
              </span>
              <Select
                value={filters.sort || "popular"}
                onValueChange={(val) => setFilters({ sort: val as any })}
              >
                <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0 font-bold text-sm h-auto p-0 bg-transparent flex items-center justify-between">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="price_asc">Harga Terendah</SelectItem>
                  <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="newest">Produk Terbaru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filter Bar */}
        <ActiveFilterBar
          filters={filters}
          totalResults={pagination.total}
          onRemove={removeFilter}
          onClearAll={clearAll}
        />

        {/* Main Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden md:block sticky top-28">
            <FilterSidebar
              filters={filters}
              facets={facets}
              onToggleArray={toggleArrayFilter}
              onSetFilters={setFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-100 md:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto p-8 pb-12 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-text-primary">Filter Produk</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-50 text-text-secondary"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  facets={facets}
                  onToggleArray={(key, value) => {
                    toggleArrayFilter(key, value);
                  }}
                  onSetFilters={(f) => {
                    setFilters(f);
                  }}
                />
                <div className="mt-10 sticky bottom-0 bg-background pt-6 border-t border-border">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-4 bg-primary-500 text-white font-bold rounded-xl text-base shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-transform"
                  >
                    Tampilkan {pagination.total} Produk
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="md:col-span-3">
            {loading ? (
              /* Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-border overflow-hidden rounded-xl animate-pulse">
                    <div className="aspect-square bg-secondary-50" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-secondary-50 w-3/4 rounded-lg" />
                      <div className="h-4 bg-secondary-50 w-1/2 rounded-lg" />
                      <div className="h-8 bg-secondary-50 w-2/3 rounded-lg" />
                      <div className="h-12 bg-secondary-50 w-full mt-2 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-border">
                <span className="material-symbols-outlined text-7xl text-text-muted/20 mb-6">
                  inventory_2
                </span>
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Produk tidak ditemukan
                </h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Coba sesuaikan filter atau kata kunci pencarian Anda untuk menemukan produk yang Anda cari.
                </p>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10"
                >
                  Hapus Semua Filter
                </button>
              </div>
            ) : (
              <>
                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onCompareToggle={handleCompareToggle}
                      isComparing={compareIds.includes(product._id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-3">
                    <button
                      disabled={!pagination.hasPrev}
                      onClick={() => setPage(pagination.page - 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        const current = pagination.page;
                        return p === 1 || p === pagination.totalPages || Math.abs(p - current) <= 1;
                      })
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <span key={p} className="flex items-center gap-2">
                            {showEllipsis && (
                              <span className="w-8 text-center text-text-muted font-bold">...</span>
                            )}
                            <button
                              onClick={() => setPage(p)}
                              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all border ${
                                p === pagination.page
                                  ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                                  : "bg-white border-border text-text-secondary hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                              }`}
                            >
                              {p}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <button
                      disabled={!pagination.hasNext}
                      onClick={() => setPage(pagination.page + 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-text-secondary hover:bg-primary-500 hover:text-white transition-all border border-border shadow-sm disabled:opacity-30 disabled:pointer-events-none active:scale-90"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Floating Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-60 w-full max-w-2xl px-6">
          <div className="bg-primary-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-primary-800/50 backdrop-blur-xl">
            <div className="flex items-center gap-4 pl-2">
              <div className="flex -space-x-3">
                {compareIds.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-primary-900 bg-primary-700 flex items-center justify-center text-white"
                  >
                    <span className="material-symbols-outlined text-base">inventory_2</span>
                  </div>
                ))}
                {compareIds.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-primary-900 bg-primary-500 flex items-center justify-center text-[0.7rem] font-black">
                    +{compareIds.length - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary-200">
                  {compareIds.length} Produk Terpilih
                </p>
                <p className="text-[0.65rem] text-primary-400 font-medium">
                  Bandingkan maks. 4 produk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCompareIds([])}
                className="text-xs font-bold text-primary-300 hover:text-white transition-colors px-2 tracking-widest"
              >
                BATAL
              </button>
              <Link
                href={`/compare?ids=${compareIds.join(",")}`}
                className="bg-accent-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent-600 transition-all flex items-center gap-2 shadow-xl shadow-accent-500/20"
              >
                Bandingkan Sekarang
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-primary-600 font-bold tracking-widest text-xs uppercase">Memuat Katalog...</p>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
