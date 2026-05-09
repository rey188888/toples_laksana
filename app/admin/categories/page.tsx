import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import { Metadata } from "next";
import CategoriesPageContent from "./CategoriesPageContent";

export const metadata: Metadata = {
  title: "Kategori Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await connectDB();

  const [rawProducts, rawCategories] = await Promise.all([
    ProductModel.find({ deletedAt: null }).lean(),
    CategoryModel.find().sort({ name: 1 }).lean(),
  ]);

  return (
    <CategoriesPageContent
      initialProducts={JSON.parse(JSON.stringify(rawProducts))}
      initialCategories={JSON.parse(JSON.stringify(rawCategories))}
    />
  );
}
