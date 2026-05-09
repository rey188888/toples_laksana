import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import InteractionModel from "@/models/Interaction";
import DashboardContent from "./DashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin - Toples Laksana",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [productCount, interactionCount, waLogsCount] = await Promise.all([
    ProductModel.countDocuments({ deletedAt: null }),
    InteractionModel.countDocuments(),
    InteractionModel.countDocuments({ interactionType: "whatsapp_share" }),
  ]);

  return (
    <DashboardContent
      stats={{
        products: productCount,
        interactions: interactionCount,
        waLogs: waLogsCount,
      }}
    />
  );
}
