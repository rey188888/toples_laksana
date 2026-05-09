import connectDB from "@/lib/mongodb";
import LidColorModel from "@/models/LidColor";
import { Metadata } from "next";
import LidColorsPageContent from "./LidColorsPageContent";

export const metadata: Metadata = {
  title: "Warna Tutup - Admin",
};

export const dynamic = "force-dynamic";

export default async function LidColorsPage() {
  await connectDB();
  const rawColors = await LidColorModel.find().sort({ name: 1 }).lean();

  return (
    <LidColorsPageContent
      initialColors={JSON.parse(JSON.stringify(rawColors))}
    />
  );
}
