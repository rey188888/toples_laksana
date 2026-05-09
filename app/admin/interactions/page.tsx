import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";
import { Metadata } from "next";
import InteractionsPageContent from "./InteractionsPageContent";

export const metadata: Metadata = {
  title: "Interaksi Pengguna - Admin",
};

export const dynamic = "force-dynamic";

export default async function InteractionsPage() {
  await connectDB();
  
  const [rawInteractions, rawProducts] = await Promise.all([
    InteractionModel.find().sort({ createdAt: -1 }).limit(100).lean(),
    ProductModel.find({ deletedAt: null }).select("id name").lean(),
  ]);

  return (
    <InteractionsPageContent
      initialInteractions={JSON.parse(JSON.stringify(rawInteractions))}
      products={JSON.parse(JSON.stringify(rawProducts))}
    />
  );
}
