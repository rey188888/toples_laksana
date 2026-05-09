import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";
import { Metadata } from "next";
import { getInteractions } from "@/lib/actions/interaction.actions";
import InteractionsPageContent from "./InteractionsPageContent";

export const metadata: Metadata = {
  title: "Interaksi Pengguna - Admin",
};

export const dynamic = "force-dynamic";

export default async function InteractionsPage() {
  await connectDB();
  
  const [{ data: interactions, total }, rawProducts] = await Promise.all([
    getInteractions({ limit: 100 }),
    ProductModel.find({ deletedAt: null }).select("id name").lean(),
  ]);

  return (
    <InteractionsPageContent
      initialInteractions={interactions}
      products={JSON.parse(JSON.stringify(rawProducts))}
    />
  );
}
