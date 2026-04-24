'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should NOT have the global public navbar/footer
  const isDedicatedPage = pathname === '/login' || pathname.startsWith('/admin');

  if (isDedicatedPage) {
    return <main className="grow flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className={cn("grow flex flex-col", pathname !== '/' && "pt-16 lg:pt-20")}>
        {children}
      </div>
      <Footer />
    </>
  );
}
