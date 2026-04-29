import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Product } from "@/types/product";
import { getCategoryLabel, getSpecValue } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

import CategoryModel from "@/models/Category";
import LidColorModel from "@/models/LidColor";

async function getProduct(id: string): Promise<Product | null> {
  await connectDB();

  const product = await ProductModel.findOne({
    deletedAt: null,
    $or: [{ id }, { sku: id }],
  }).lean();

  if (!product) return null;

  const category = await CategoryModel.findOne({ id: product.categoryId }).select("name").lean();

  const colorIds = [...new Set((product.prices || []).map((p: { lidColorId: any; }) => p.lidColorId))];
  const lidColors = await LidColorModel.find({ id: { $in: colorIds } }).select("id color colorCode").lean();
  const colorMap = new Map(lidColors.map((lc) => [lc.id, lc]));

  const parsedProduct = JSON.parse(JSON.stringify(product));
  if (category) {
    parsedProduct.categoryName = category.name;
  }
  if (parsedProduct.prices) {
    parsedProduct.prices = parsedProduct.prices.map((p: any) => {
      const doc = colorMap.get(p.lidColorId);
      if (doc) {
        p.lidColorName = doc.color;
        p.lidColorHex = doc.colorCode;
      }
      return p;
    });
  }

  return parsedProduct;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  const volume = getSpecValue(product, "volume_ml");
  const category = product.categoryName || getCategoryLabel(product.categoryId);

  return {
    title: `${product.name}${volume ? ` ${volume}ml` : ""} - Toples Laksana`,
    description: `${product.name}, ${category}. Material: ${product.bodyMaterial}. ${volume ? `Volume ${volume}ml. ` : ""}Tersedia untuk pembelian ecer dan grosir.`,
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
