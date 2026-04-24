import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import type { Product } from "@/types/product";
import AdminPageContent from "./AdminPageContent";

export const metadata: Metadata = {
  title: "Dashboard Admin — Toples Laksana",
};

export default async function AdminDashboard() {
  await connectDB();
  
  // Fetch all products from real DB
  const rawProducts = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  const products: Product[] = JSON.parse(JSON.stringify(rawProducts));

  return <AdminPageContent initialProducts={products} />;
}
