import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InteractionModel from "@/models/Interaction";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { productId, interactionType, userId } = await req.json();

    if (!productId || !interactionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const interaction = await InteractionModel.create({
      id: crypto.randomUUID(),
      productId,
      interactionType,
      userId: userId || "anonymous",
    });

    return NextResponse.json({ success: true, data: interaction });
  } catch (error) {
    console.error("Error creating interaction:", error);
    return NextResponse.json({ error: "Failed to create interaction" }, { status: 500 });
  }
}
