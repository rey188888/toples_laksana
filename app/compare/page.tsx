import Link from "next/link";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import type { Product } from "@/types/product";
import { getLowestRetailPrice, getSpecValue } from "@/types/product";
import { formatPrice } from "@/lib/price-calculator";
import { buildInquiryUrl } from "@/lib/whatsapp-builder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bandingkan Spesifikasi Kemasan — Toples Laksana",
};

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparisonPage({ searchParams }: ComparePageProps) {
  const { ids } = await searchParams;
  let products: Product[] = [];

  if (ids) {
    const idArray = ids.split(",").slice(0, 4); // Max 4
    await connectDB();
    const fetched = await ProductModel.find({ _id: { $in: idArray }, is_active: true }).lean();
    // Serialize object IDs
    products = JSON.parse(JSON.stringify(fetched));
    
    // Sort to match the requested ID order
    products.sort((a, b) => idArray.indexOf(a._id) - idArray.indexOf(b._id));
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 lg:px-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-tertiary"></span>
            <span className="text-tertiary font-extrabold text-[0.65rem] tracking-[0.2em] uppercase">Katalog Perbandingan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface leading-tight mb-4">
            Bandingkan Produk
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-lg font-medium leading-relaxed">
            Analisis spesifikasi teknis dari koleksi kemasan kami untuk menemukan solusi paling tepat bagi kebutuhan bisnis Anda. Maksimal 4 produk.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-6xl text-outline-variant/50 mb-4">compare</span>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Belum ada produk yang dipilih</h2>
            <p className="text-on-surface-variant mb-8">
              Pilih produk dari halaman katalog dengan mencentang kotak &quot;Bandingkan&quot; pada kartu produk.
            </p>
            <Link
              href="/catalog"
              className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md shadow-primary/10 inline-flex text-white"
            >
              Kembali ke Katalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar pb-8">
            <div className="min-w-[900px] max-w-full">
              {/* Product Headers */}
              <div className="grid grid-cols-5 items-stretch gap-4 mb-6">
                <div className="flex flex-col justify-end pb-8">
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-outline-variant">Matriks Spesifikasi</span>
                </div>
                
                {products.map((product) => (
                  <div key={product._id} className="bg-surface-container-lowest p-6 flex flex-col items-center text-center shadow-sm border border-outline-variant/10 rounded-2xl relative">
                    <Link href={`/catalog?ids=${ids?.split(',').filter(id => id !== product._id).join(',')}`} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-high hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </Link>
                    <div className="relative w-full aspect-square mb-6 group">
                      <div className="absolute inset-0 bg-primary-fixed/20 opacity-0 group-hover:opacity-100 rounded-full scale-75 group-hover:scale-100 transition-all duration-500 blur-2xl"></div>
                      {product.images?.[0] ? (
                        <img
                          alt={product.name}
                          className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                          src={product.images[0]}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative z-10 text-outline-variant/40">
                          <span className="material-symbols-outlined text-6xl">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/products/${product._id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-sm font-extrabold text-on-surface mb-2 leading-tight">{product.name}</h3>
                    </Link>
                    <span className="text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant tracking-widest uppercase">
                      {product.sku}
                    </span>
                  </div>
                ))}

                {/* Empty slots for visual balance if < 4 products */}
                {Array.from({ length: 4 - products.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-transparent border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center p-6 text-outline-variant/50 min-h-[300px]">
                    <span className="material-symbols-outlined text-4xl mb-4">add_circle</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-center">Slot Kosong</span>
                  </div>
                ))}
              </div>

              {/* Matrix Table */}
              <div className="flex flex-col border border-outline-variant/15 rounded-2xl overflow-hidden shadow-sm bg-white">
                
                {/* Visual Row Renderer */}
                {[
                  { label: "Volume Kapasitas", getter: (p: Product) => `${getSpecValue(p.specifications, 'volume_ml') || '-'} ml` },
                  { label: "Tinggi Total", getter: (p: Product) => `${getSpecValue(p.specifications, 'tinggi_cm') || '-'} cm` },
                  { label: "Ø Diameter Badan", getter: (p: Product) => `${getSpecValue(p.specifications, 'diameter_badan_cm') || '-'} cm` },
                  { label: "Bahan Badan", getter: (p: Product) => p.materials.body },
                  { label: "Bahan Tutup", getter: (p: Product) => p.materials.lid_material },
                  { label: "Tipe Tutup", getter: (p: Product) => p.materials.lid_type, capitalize: true },
                  { label: "Kategori Kemasan", getter: (p: Product) => p.category },
                ].map((row, idx) => (
                  <div key={row.label} className={`grid grid-cols-5 items-stretch ${idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'} hover:bg-primary/5 transition-colors border-b border-outline-variant/10 last:border-b-0`}>
                    <div className="px-6 py-5 text-[0.65rem] font-extrabold text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/10 flex items-center">{row.label}</div>
                    {products.map((p) => (
                      <div key={`${p._id}-${row.label}`} className={`px-6 py-5 text-sm text-center text-on-surface font-semibold border-r border-outline-variant/10 last:border-r-0 flex items-center justify-center ${row.capitalize ? 'capitalize' : ''}`}>
                        {row.getter(p)}
                      </div>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <div key={`empty-cell-${i}`} className="border-r border-outline-variant/10 last:border-r-0" />
                    ))}
                  </div>
                ))}

                {/* Price Row (Highlight) */}
                <div className="grid grid-cols-5 items-stretch bg-primary/5 border-t-2 border-primary/10">
                   <div className="px-6 py-8 text-[0.65rem] font-extrabold text-primary uppercase tracking-widest border-r border-primary/10 flex items-center">
                    Harga Ecer Terendah 
                   </div>
                   {products.map((p) => (
                      <div key={`${p._id}-price`} className="px-6 py-8 text-center border-r border-primary/10 last:border-r-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold text-primary tracking-tight">
                          {formatPrice(getLowestRetailPrice(p.variants))}
                        </span>
                        <span className="text-[0.6rem] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">
                          / pcs
                        </span>
                      </div>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <div key={`empty-price-${i}`} className="border-r border-primary/10 last:border-r-0" />
                    ))}
                </div>
              </div>

              {/* Action Keys */}
              <div className="grid grid-cols-5 items-center mt-6 gap-4">
                <div></div>
                {products.map((p) => (
                  <a
                    key={`${p._id}-cta`}
                    href={buildInquiryUrl(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary text-on-primary py-3.5 px-4 rounded-xl font-bold text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md shadow-primary/15"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    Tanya Admin
                  </a>
                ))}
                 {Array.from({ length: 4 - products.length }).map((_, i) => (
                  <div key={`empty-cta-${i}`} />
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Technical Disclaimer Section */}
        <div className="mt-20 p-8 bg-surface-container-high border border-outline-variant/20 rounded-2xl">
          <h4 className="text-on-surface font-extrabold mb-3 flex items-center gap-2 tracking-tight text-sm uppercase">
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            Catatan Teknis Industrial
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            *Semua dimensi produk diukur dengan toleransi manufaktur ±0.5mm. Kapasitas volume didasarkan pada tingkat pengisian wajar produk (*fill to shoulder*). 
            Harga grosir skala besar berlaku. Silakan hubungi admin kami untuk permintaan kustomisasi warna khusus atau logo pada tutup kemasan dengan Minimum Order Quantity (MOQ) pabrik.
          </p>
        </div>
      </main>
    </div>
  );
}
