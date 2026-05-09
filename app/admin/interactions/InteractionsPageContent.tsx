"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/app-icon";

interface InteractionsPageContentProps {
  initialInteractions: any[];
  products: any[];
}

export default function InteractionsPageContent({ initialInteractions, products }: InteractionsPageContentProps) {
  const [interactions] = useState(initialInteractions);
  const [searchQuery, setSearchQuery] = useState("");
  const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));

  const filteredInteractions = interactions.filter(interaction => {
    const productName = productMap[interaction.productId] || interaction.productId;
    return productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           interaction.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           interaction.interactionType.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Interaksi</h2>
        </div>
      </header>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <input
                type="text"
                placeholder="Cari interaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-secondary-50/30 border border-border rounded-lg text-sm font-bold text-text-primary focus:bg-white focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 lg:gap-3">
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                <AppIcon name="tune" className="text-sm" /> Filter
              </button>
              <button className="flex-1 sm:flex-none px-5 lg:px-6 py-3 text-[0.7rem] font-black bg-white border border-border rounded-xl text-text-secondary flex items-center justify-center gap-2 hover:bg-secondary-50 hover:text-text-primary transition-all uppercase tracking-widest cursor-pointer">
                <AppIcon name="download" className="text-sm" /> Ekspor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Waktu</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Tipe Interaksi</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Produk</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInteractions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="touch_app" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Interaksi tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInteractions.map((interaction) => (
                    <TableRow key={interaction.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary tracking-tight">
                          {new Date(interaction.createdAt).toLocaleString("id-ID", { 
                            day: "2-digit", 
                            month: "short", 
                            year: "numeric", 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <Badge variant="outline" className="font-black text-[0.6rem] uppercase tracking-widest px-2 py-1 border-border bg-secondary-50/50">
                          {interaction.interactionType === "view" && "Dilihat"}
                          {interaction.interactionType === "detail_click" && "Klik Detail"}
                          {interaction.interactionType === "whatsapp_share" && "Klik WhatsApp"}
                          {interaction.interactionType === "promo_click" && "Klik Promo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1">
                          {productMap[interaction.productId] || interaction.productId}
                        </p>
                      </TableCell>
                      <TableCell className="px-8 py-5 font-mono text-[10px] text-text-muted tracking-tighter">
                        {interaction.userId}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
}
