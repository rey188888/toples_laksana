import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Product } from "@/types/product";
import mongoose from "mongoose";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  await connectDB();

  let product;

  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await ProductModel.findOne({ _id: id, is_active: true }).lean();
  }

  if (!product) {
    product = await ProductModel.findOne({ sku: id, is_active: true }).lean();
  }

  if (!product) return null;

  // Serialize _id from ObjectId to string
  return JSON.parse(JSON.stringify(product));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  const volume = product.specifications.find((s) => s.key === "volume_ml")?.value;

  return {
    title: `${product.name}${volume ? ` ${volume}ml` : ""} — Toples Laksana`,
    description: `${product.name}, ${product.category}. Material: ${product.materials.body}. ${volume ? `Volume ${volume}ml. ` : ""}Tersedia untuk pembelian ecer dan grosir.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
