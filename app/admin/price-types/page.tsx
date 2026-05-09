import connectDB from "@/lib/mongodb";
import PriceTypeModel from "@/models/PriceType";
import { Metadata } from "next";
import PriceTypesPageContent from "./PriceTypesPageContent";

export const metadata: Metadata = {
  title: "Tipe Harga - Admin",
};

export const dynamic = "force-dynamic";

export default async function PriceTypesPage() {
  await connectDB();
  const rawPriceTypes = await PriceTypeModel.find().sort({ name: 1 }).lean();

  return (
    <PriceTypesPageContent
      initialPriceTypes={JSON.parse(JSON.stringify(rawPriceTypes))}
    />
  );
}
