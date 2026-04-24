import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      id,
      { 
        $inc: { interaction_count: 1 },
        $set: { last_interacted_at: new Date() }
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, interaction_count: product.interaction_count });
  } catch (error: unknown) {
    console.error("Interaction Tracking Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
