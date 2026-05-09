import connectDB from "@/lib/mongodb";
import UnitModel from "@/models/Unit";
import UnitsPageContent from "./UnitsPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satuan Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  await connectDB();
  const rawUnits = await UnitModel.find().sort({ name: 1 }).lean();

  return (
    <UnitsPageContent
      initialUnits={JSON.parse(JSON.stringify(rawUnits))}
    />
  );
}
