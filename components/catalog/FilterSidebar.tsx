"use client";

import { useState } from "react";
import { CATEGORY_CONFIG, MATERIAL_LABELS, LID_TYPE_LABELS, COLOR_SWATCHES } from "@/lib/use-case-config";
import { CatalogFilters, FacetCounts, getCategoryLabel, getLidColorLabel } from "@/types/product";

interface FilterSidebarProps {
  filters: CatalogFilters;
  facets: FacetCounts | null;
  onToggleArray: (key: "category" | "material_body" | "lid_type" | "colors", value: string) => void;
  onSetFilters: (f: Partial<CatalogFilters>) => void;
}

export default function FilterSidebar({
  filters,
  facets,
  onToggleArray,
  onSetFilters,
}: FilterSidebarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [volumeMin, setVolumeMin] = useState(filters.volume_min || 0);
  const [volumeMax, setVolumeMax] = useState(filters.volume_max || 1500);

  const vRange = facets?.volume_range || { min: 0, max: 1500 };
  const categoryList = facets?.categories || [];

  return (
    <aside className="space-y-10">
      {/* Search Input */}
      <section>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
            defaultValue={filters.search || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSetFilters({ search: (e.target as HTMLInputElement).value || undefined });
              }
            }}
          />
        </div>
      </section>

      {/* Primary Filter: Packaging Type (Category) */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-600 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">category</span>
          Jenis Kemasan
        </h3>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-2">
          {categoryList.map((cat) => {
            const isActive = !!filters.category?.includes(cat.value);
            const config = CATEGORY_CONFIG[cat.value];
            return (
              <button
                key={cat.value}
                onClick={() => onToggleArray("category", cat.value)}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-[0.65rem] font-black transition-all border ${isActive
                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                    : "bg-white text-text-secondary border-border hover:border-primary-200 hover:text-primary-600"
                  }`}
              >
                {config && (
                  <span className="material-symbols-outlined text-lg">
                    {config.icon}
                  </span>
                )}
                <span>{cat.name || getCategoryLabel(cat.value)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Primary Filter 3: Volume Range ── */}
      <section>
        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary-600 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">straighten</span>
          Volume / Ukuran
        </h3>

        <div className="space-y-6 px-2">
          {/* Min Volume Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-text-secondary">
              <span>Min: <span className="text-primary-600">{volumeMin}ml</span></span>
            </div>
            <input
              type="range"
              min={vRange.min}
              max={volumeMax || vRange.max}
              step={10}
              value={volumeMin}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setVolumeMin(val);
              }}
              onMouseUp={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              onTouchEnd={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          {/* Max Volume Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-text-secondary">
              <span>Max: <span className="text-primary-600">{volumeMax}ml</span></span>
            </div>
            <input
              type="range"
              min={Math.max(volumeMin, vRange.min)}
              max={vRange.max}
              step={10}
              value={volumeMax}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setVolumeMax(val);
              }}
              onMouseUp={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              onTouchEnd={() => {
                onSetFilters({ volume_min: volumeMin, volume_max: volumeMax });
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-border hover:border-primary-500/30 transition-all group shadow-sm active:scale-[0.98]"
      >
        <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-primary group-hover:text-primary-600 transition-colors flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">tune</span>
          Filter Lanjutan
        </span>
        <span
          className={`material-symbols-outlined text-lg text-text-muted transition-transform duration-500 ${showAdvanced ? "rotate-180" : ""
            }`}
        >
          expand_more
        </span>
      </button>

      {/* Advanced Filters Panel */}
      <div
        className={`space-y-8 overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? "max-h-[1000px] opacity-100 mt-6 pb-6" : "max-h-0 opacity-0"
          }`}
      >
        {/* Material Body */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">science</span>
            Material Badan
          </h3>
          <div className="space-y-1">
            {(facets?.materials || []).map((mat) => {
              const isActive = !!filters.material_body?.includes(mat.value);
              return (
                <label key={mat.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <input
                    className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("material_body", mat.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {MATERIAL_LABELS[mat.value]?.label || mat.value}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{mat.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Lid Type */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">settings</span>
            Tipe Tutup
          </h3>
          <div className="space-y-1">
            {(facets?.lid_types || []).map((lid) => {
              const isActive = !!filters.lid_type?.includes(lid.value);
              const label = LID_TYPE_LABELS[lid.value];
              return (
                <label key={lid.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <input
                    className="w-4 h-4 rounded-md border-border text-primary-500 focus:ring-primary-500 cursor-pointer accent-primary-500"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("lid_type", lid.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {label?.label || lid.value}
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{lid.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Color Swatches */}
        <section>
          <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">palette</span>
            Warna Tutup
          </h3>
          <div className="space-y-1">
            {(facets?.colors || []).map((color) => {
              const isActive = !!filters.colors?.includes(color.value);
              const hex = color.hex || COLOR_SWATCHES[color.value] || "#ccc";
              const colorName = color.name || getLidColorLabel(color.value);
              return (
                <label key={color.value} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors">
                  <div
                    className={`relative w-6 h-6 rounded-full border-2 transition-all shrink-0 ${isActive
                        ? "ring-2 ring-primary-500/50 border-primary-500 scale-110"
                        : "border-border"
                      }`}
                    style={{ backgroundColor: hex }}
                  >
                    {isActive && (
                      <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: hex === "#FFFFFF" || hex === "#F5F5F5" ? "#16479D" : "#fff" }}>
                        check
                      </span>
                    )}
                  </div>
                  <input
                    className="hidden"
                    type="checkbox"
                    checked={isActive || false}
                    onChange={() => onToggleArray("colors", color.value)}
                  />
                  <span className={`text-xs font-bold flex-1 ${isActive ? "text-primary-700" : "text-text-secondary"} group-hover:text-primary-600 transition-colors`}>
                    {colorName} <span className="text-[0.6rem] text-text-muted ml-1 uppercase font-normal">{hex}</span>
                  </span>
                  <span className="text-[0.6rem] font-black text-text-muted">{color.count}</span>
                </label>
              );
            })}
          </div>
        </section>
      </div>

      {/* Trust Badge / Certification */}
      <div className="p-6 bg-primary-50 rounded-xl border border-primary-100 shadow-inner">
        <span className="material-symbols-outlined text-primary-500 mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified
        </span>
        <h4 className="text-xs font-black text-primary-700 mb-2 uppercase tracking-tight">
          Standar Food Grade
        </h4>
        <p className="text-[0.7rem] text-primary-600/80 font-bold leading-relaxed">
          Semua produk kemasan kami bersertifikat aman untuk kontak makanan dan memenuhi standar kualitas industri.
        </p>
      </div>
    </aside>
  );
}
