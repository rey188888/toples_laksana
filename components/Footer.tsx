import Link from "next/link";
import { MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer id="footer" className="relative mt-0 w-full overflow-hidden border-t border-border bg-white text-sm leading-relaxed">
      <div className="relative z-10 mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-6 py-6 md:grid-cols-12 lg:px-12 lg:py-12">
        <div className="pr-0 md:col-span-12 lg:col-span-5 lg:pr-12">
          <Link href="/" className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-primary-500">
            Toples Laksana
          </Link>
          <p className="mb-8 max-w-md text-base text-text-secondary">
            Distributor kemasan premium terpercaya di Bandung. Memberikan solusi kemasan berkualitas tinggi dan terjangkau untuk masa depan bisnis UMKM & Industri Nasional.
          </p>
          <div className="flex gap-4">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "icon-lg" }), "rounded-full text-primary-500 hover:bg-primary hover:text-primary-foreground")}
            >
              <MessageCircleIcon className="size-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-2">
          <h5 className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.15em] text-text-primary">Explore</h5>
          <ul className="space-y-4 font-semibold text-text-secondary">
            <li><Link className="transition-colors hover:text-primary-500" href="/catalog">Katalog Produk</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="/compare">Bandingkan</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="/#mengapa">Mengapa Kami?</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-2">
          <h5 className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.15em] text-text-primary">Help & Info</h5>
          <ul className="space-y-4 font-semibold text-text-secondary">
            <li><Link className="transition-colors hover:text-primary-500" href="#">Pembelian Grosir</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="#">Syarat Pengiriman</Link></li>
            <li><Link className="transition-colors hover:text-primary-500" href="#">F.A.Q</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-3">
          <h5 className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.15em] text-text-primary">Contact Us</h5>
          <div className="space-y-4 text-text-secondary">
            <div className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary-500" />
              <p className="font-medium">Jl. Raya Bandung No. 123, Bojongloa Kaler, Kota Bandung, Jawa Barat</p>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="size-5 shrink-0 text-primary-500" />
              <p className="font-mono text-base font-medium">+62 812-3456-7890</p>
            </div>
            <div className="flex items-center gap-3">
              <MailIcon className="size-5 shrink-0 text-primary-500" />
              <p className="font-medium">sales@topleslaksana.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 lg:px-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center border-t border-border py-8 text-center">
          <p className="text-xs font-bold text-text-muted sm:text-sm">
            &copy; {new Date().getFullYear()} Toples Laksana Bandung.
          </p>
        </div>
      </div>

      <a
        className={cn(buttonVariants({ size: "icon-lg" }), "fixed bottom-6 right-6 z-45 size-14 rounded-full bg-[#25D366] text-white hover:scale-105 hover:bg-[#1EBE53] border-4 border-white/20")}
        href="https://wa.me/6281234567890?text=Halo%20Admin%20Toples%20Laksana"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
      >
        <MessageCircleIcon className="size-7" />
      </a>
    </footer>
  );
}
