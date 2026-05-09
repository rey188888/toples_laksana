import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
import CategoryModel from "@/models/Category";
import ProductTypeModel from "@/models/ProductType";
import UnitModel from "@/models/Unit";
import LidColorModel from "@/models/LidColor";
import PriceTypeModel from "@/models/PriceType";
import AdminPageContent from "./AdminPageContent";
import { Product } from "@/types/product";
import { IInteraction } from "@/models/Interaction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin - Toples Laksana",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  // Fetch all data
  const [
    rawProducts,
    rawInteractions,
    rawCategories,
    rawProductTypes,
    rawUnits,
    rawLidColors,
    rawPriceTypes,
  ] = await Promise.all([
    ProductModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean(),
    InteractionModel.find().sort({ createdAt: -1 }).limit(100).lean(),
    CategoryModel.find().sort({ name: 1 }).lean(),
    ProductTypeModel.find().sort({ name: 1 }).lean(),
    UnitModel.find().sort({ name: 1 }).lean(),
    LidColorModel.find().sort({ color: 1 }).lean(),
    PriceTypeModel.find().sort({ name: 1 }).lean(),
  ]);

  return (
    <AdminPageContent
      initialProducts={JSON.parse(JSON.stringify(rawProducts))}
      initialInteractions={JSON.parse(JSON.stringify(rawInteractions))}
      masterData={{
        categories: JSON.parse(JSON.stringify(rawCategories)),
        productTypes: JSON.parse(JSON.stringify(rawProductTypes)),
        units: JSON.parse(JSON.stringify(rawUnits)),
        lidColors: JSON.parse(JSON.stringify(rawLidColors)),
        priceTypes: JSON.parse(JSON.stringify(rawPriceTypes)),
      }}
    />
  );
}
