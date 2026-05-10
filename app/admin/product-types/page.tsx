import connectDB from "@/lib/mongodb";
import ProductTypeModel from "@/models/ProductType";
import ProductTypesPageContent from "./ProductTypesPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipe Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function ProductTypesPage() {
  await connectDB();
  const rawTypes = await ProductTypeModel.find().sort({ name: 1 }).lean();

  return (
    <ProductTypesPageContent
      initialProductTypes={JSON.parse(JSON.stringify(rawTypes))}
    />
  );
}
