import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const CATEGORIES = [
  {
    name: "Jar Cylinder",
    icon: "inventory_2",
    desc: "Pilihan utama untuk cookies dan snack premium dengan tampilan modern transparan.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzxJdzAeDvCiiTEev_KPuhufrOsW-4weP20hY9TdXs8er6TOmLr4AvXn3K8qRC0hIwnPgMxbStj7wyzIDaNpCsFdsdo95aViXcLJAdRCqipUnLC4LegjActcaa15seUDTBk61Oe66f5bP_P3jWz4QNuEsS0FxNdCU6UFhzmuFNvhow5KXfEQCrIUXSy9GpqpAgT-3X6qeoKFsiyT-YtUeac0p6a9AmnKITQYmEOEh2kU2UdOyGpFWCNxDdoDIHxC5uyHymdk-cfN4",
    tags: ["kue kering", "nastar"],
  },
  {
    name: "Jar Kaca",
    icon: "liquor",
    desc: "Material kaca tebal grade industri, cocok untuk selai, madu, dan produk artisan.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWD0LOM87TroBp7p7bL0Gmhik6I5j0yZzU4iyEoppXP9FP7XgrCkaoCBa8eVNWA8I_4AB5BbhksOPFpUOZHJMo-LEMQ0JNXsGd_tMTrMw2CpfkXDA09rHXTp_-e79KeLxBr8-SyRSBfe8PjZ3F2HyJVjYigXdSkLe24H1BWPeHaOqnZ_wGq2k8xQKsH9xTQjF4s3Xh78FokPVdL82DmnQrZPyQHIU7cvic4_Prx1yz8C0MwQFwoKY14noYZ35ikgOTxxHYv1U6Tjc",
    tags: ["selai", "madu"],
  },
  {
    name: "Tin Kaleng",
    icon: "deployed_code",
    desc: "Proteksi maksimal dengan material metalic yang memberikan kesan klasik dan eksklusif.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFC2Ygg12kybLX9yMU5bRNrzDjx8VvZUey0ur302MkDoHkye25yEINLA2SScmPJfiwrTHAxOA46ONTQRM7EYlWKjZMMUPzxnd5hAauHNAptky5xNzBpZeIe9HUoy34PwbuAj21D28RfdDacmSWjZmCSMZDXGhbkxJ9w6XwRbIeN3bq5sbbMqvjbKw-S_yQOh_COD1W3jkhSc8EcUN-BzMnZTupiuhvNyTz_BqaS5LMMc6LwBQMEkrM9i95ILvicI8q4w1GTX8O8UI",
    tags: ["nastar", "kue kering"],
  },
  {
    name: "Jar Plastik",
    icon: "layers",
    desc: "Ringan, ekonomis, dan tahan banting. Tersedia dalam berbagai ukuran praktis.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKbnfpr0jzrRcJR179yN8q6F8d3bHp8A8tB31VCdmKcJF7o76mMI5iN_6vsxsh18xv5TqJgUBDsjftWT5X6mTgUVFe9sErpcvP5q5XWnPQl0H0BGeDvnz9H4rOmpbhtBvy0MbODM15gRWaczjbB6P9v2iD93j3-FSaPVx6UfKk_hB5X5SEmvlOYAH8_wmbcVU-s8ZcT2oRxl8Dg4njkVRbRerOxt-M-qQ3atFWa7IYFiojwiDa8f7YoZF-WRHZMWj__EdbCf9ReU8",
    tags: ["bumbu", "bubuk kopi"],
  },
];

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7">
            <span className="inline-block text-primary-600 font-bold tracking-[0.2em] text-xs mb-4 uppercase">
              Distributor Kemasan Premium
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6">
              Pilih Toples <br />Sesuai Kebutuhan
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
              Tingkatkan nilai produk ritel atau horeka Anda dengan koleksi kemasan organik pilihan kami, dirancang untuk menghadirkan keindahan taktil pada ruang sehari-hari.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary-500 text-white rounded-xl font-bold transition-all hover:bg-primary-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/20 gap-2 h-14 px-8"
                )}
              >
                Jelajahi Katalog
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/catalog?category=Jar+Cylinder"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "bg-white text-text-primary border-border rounded-xl font-bold transition-all hover:bg-secondary-50 gap-2 h-14 px-8"
                )}
              >
                Lihat Koleksi
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="aspect-4/5 w-full max-w-[450px] max-h-[75vh] rounded-3xl overflow-hidden shadow-2xl relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWD0LOM87TroBp7p7bL0Gmhik6I5j0yZzU4iyEoppXP9FP7XgrCkaoCBa8eVNWA8I_4AB5BbhksOPFpUOZHJMo-LEMQ0JNXsGd_tMTrMw2CpfkXDA09rHXTp_-e79KeLxBr8-SyRSBfe8PjZ3F2HyJVjYigXdSkLe24H1BWPeHaOqnZ_wGq2k8xQKsH9xTQjF4s3Xh78FokPVdL82DmnQrZPyQHIU7cvic4_Prx1yz8C0MwQFwoKY14noYZ35ikgOTxxHYv1U6Tjc"
                alt="Koleksi Jar Premium"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Koleksi Pilihan</h2>
            <p className="text-text-secondary mt-2">Dikurasi untuk pembeli profesional dan studio desain.</p>
          </div>
          <Link href="/catalog" className="text-primary-500 font-bold hover:underline flex items-center gap-1">
            Lihat Semua Kategori <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col"
            >
              <div className="aspect-square rounded-2xl bg-white border border-border overflow-hidden mb-4 relative transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-50 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ TRENDING / POPULAR ═══════════ */}
      <section className="py-24 bg-secondary-50 px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto text-center mb-16">
          <span className="text-accent-500 font-black tracking-widest text-xs uppercase mb-4 block">Paling Banyak Diminati</span>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Sedang Tren</h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            Produk terpopuler kami berdasarkan interaksi pelanggan dan permintaan grosir bulan ini.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
          {[
            { name: "Sage Stoneware Mug", price: "Rp 12.500", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzxJdzAeDvCiiTEev_KPuhufrOsW-4weP20hY9TdXs8er6TOmLr4AvXn3K8qRC0hIwnPgMxbStj7wyzIDaNpCsFdsdo95aViXcLJAdRCqipUnLC4LegjActcaa15seUDTBk61Oe66f5bP_P3jWz4QNuEsS0FxNdCU6UFhzmuFNvhow5KXfEQCrIUXSy9GpqpAgT-3X6qeoKFsiyT-YtUeac0p6a9AmnKITQYmEOEh2kU2UdOyGpFWCNxDdoDIHxC5uyHymdk-cfN4" },
            { name: "Oatmeal Linen Napkins", price: "Rp 45.000", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFC2Ygg12kybLX9yMU5bRNrzDjx8VvZUey0ur302MkDoHkye25yEINLA2SScmPJfiwrTHAxOA46ONTQRM7EYlWKjZMMUPzxnd5hAauHNAptky5xNzBpZeIe9HUoy34PwbuAj21D28RfdDacmSWjZmCSMZDXGhbkxJ9w6XwRbIeN3bq5sbbMqvjbKw-S_yQOh_COD1W3jkhSc8EcUN-BzMnZTupiuhvNyTz_BqaS5LMMc6LwBQMEkrM9i95ILvicI8q4w1GTX8O8UI" },
            { name: "Ribbed Ceramic Canister", price: "Rp 32.000", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKbnfpr0jzrRcJR179yN8q6F8d3bHp8A8tB31VCdmKcJF7o76mMI5iN_6vsxsh18xv5TqJgUBDsjftWT5X6mTgUVFe9sErpcvP5q5XWnPQl0H0BGeDvnz9H4rOmpbhtBvy0MbODM15gRWaczjbB6P9v2iD93j3-FSaPVx6UfKk_hB5X5SEmvlOYAH8_wmbcVU-s8ZcT2oRxl8Dg4njkVRbRerOxt-M-qQ3atFWa7IYFiojwiDa8f7YoZF-WRHZMWj__EdbCf9ReU8" },
            { name: "Olive Wood Board", price: "Rp 85.000", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWD0LOM87TroBp7p7bL0Gmhik6I5j0yZzU4iyEoppXP9FP7XgrCkaoCBa8eVNWA8I_4AB5BbhksOPFpUOZHJMo-LEMQ0JNXsGd_tMTrMw2CpfkXDA09rHXTp_-e79KeLxBr8-SyRSBfe8PjZ3F2HyJVjYigXdSkLe24H1BWPeHaOqnZ_wGq2k8xQKsH9xTQjF4s3Xh78FokPVdL82DmnQrZPyQHIU7cvic4_Prx1yz8C0MwQFwoKY14noYZ35ikgOTxxHYv1U6Tjc" },
          ].map((item) => (
            <Card key={item.name} className="overflow-hidden border-border hover:shadow-xl transition-all group rounded-2xl bg-white">
              <CardContent className="p-4">
                <div className="aspect-square rounded-xl bg-secondary-50 overflow-hidden mb-4 flex items-center justify-center">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm sm:text-base">{item.name}</h4>
                    <p className="text-primary-500 font-bold mt-1 text-sm">{item.price}</p>
                  </div>
                  <div className="bg-accent-50 text-accent-500 p-2 rounded-lg shrink-0">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-32 px-6 lg:px-12 text-center max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-6xl font-extrabold text-text-primary tracking-tight mb-8">
          Siap meningkatkan estetika <br />
          <span className="text-primary-500">bisnis Anda?</span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/catalog"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all hover:shadow-2xl hover:shadow-primary-500/30 gap-3 h-16 px-12"
            )}
          >
            Buka Katalog
            <span className="material-symbols-outlined">shopping_bag</span>
          </Link>
          <a
            href="https://wa.me/6281234567890"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "bg-white text-text-primary border-2 border-primary-500 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all gap-3 h-16 px-12"
            )}
          >
            Hubungi Kami
            <span className="material-symbols-outlined">chat</span>
          </a>
        </div>
      </section>
    </main>
  );
}
