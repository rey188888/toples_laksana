"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
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

interface LidColorsPageContentProps {
  initialColors: any[];
}

export default function LidColorsPageContent({ initialColors }: LidColorsPageContentProps) {
  const [colors] = useState(initialColors);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColors = colors.filter(color => 
    color.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
    color.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Topbar */}
      <header className="hidden lg:flex h-24 bg-white border-b border-border items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-[1.6rem] font-black text-text-primary tracking-tight">Warna Tutup</h2>
        </div>
        <button className="bg-primary-50 text-primary-600 px-7 py-3 rounded-xl font-black flex items-center gap-2.5 text-sm hover:bg-primary-100 transition-all active:scale-95 group cursor-pointer border border-primary-100">
          <AppIcon name="add" className="text-lg" />
          Tambah Warna
        </button>
      </header>

      {/* Floating Action Button for Mobile */}
      <button className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all">
        <AppIcon name="add" className="text-2xl" />
      </button>

      <div className="p-6 lg:p-10 space-y-6 flex-1 w-full max-w-full">
        <Card className="shadow-none overflow-hidden bg-white border border-border">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white gap-4">
            <div className="relative flex-1 sm:max-w-md group">
              <AppIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted transition-colors group-focus-within:text-primary-500" />
              <input
                type="text"
                placeholder="Cari warna..."
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
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent border-b border-border">
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">ID Warna</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Preview</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em]">Nama Warna</TableHead>
                  <TableHead className="px-8 py-4 text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AppIcon name="palette" className="text-6xl opacity-10 mb-4" />
                        <p className="text-lg font-black text-text-primary">Warna tidak ditemukan</p>
                        <p className="text-sm font-medium">Coba gunakan kata kunci pencarian lain.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColors.map((color) => (
                    <TableRow key={color.id} className="transition-all duration-200 group border-border">
                      <TableCell className="px-8 py-5">
                        <span className="text-xs font-black text-text-muted font-mono tracking-tighter">{color.id}</span>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <div 
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-gray-50 overflow-hidden" 
                          style={{ backgroundColor: color.colorCode || "#FFFFFF" }}
                        >
                          {(color.colorCode?.toLowerCase() === "#ffffff" || !color.colorCode) && <AppIcon name="texture" className="text-xs text-gray-200" />}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-5">
                        <p className="text-sm font-black text-text-primary group-hover:text-primary-600 transition-colors tracking-tight">{color.color}</p>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-9 h-9 rounded-xl text-text-muted hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all cursor-pointer border-none shadow-none">
                            <AppIcon name="edit" className="text-lg" />
                          </button>
                          <button className="w-9 h-9 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer border-none shadow-none">
                            <AppIcon name="delete" className="text-lg" />
                          </button>
                        </div>
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
