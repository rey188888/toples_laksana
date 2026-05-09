import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";
import ProductModel from "@/models/Product";
import WaLogsPageContent from "./WaLogsPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp Log - Admin",
};

export const dynamic = "force-dynamic";

export default async function WaLogsPage() {
  await connectDB();
  
  const [rawLogs, rawProducts] = await Promise.all([
    InteractionModel.find({ interactionType: "whatsapp_share" }).sort({ createdAt: -1 }).limit(100).lean(),
    ProductModel.find({ deletedAt: null }).select("id name").lean(),
  ]);

  return (
    <WaLogsPageContent
      initialLogs={JSON.parse(JSON.stringify(rawLogs))}
      products={JSON.parse(JSON.stringify(rawProducts))}
    />
  );
}
