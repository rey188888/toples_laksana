// ============================================================
// GET /api/products/[id] — Fetch single product by ID or SKU
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Try to find by _id first, then by SKU
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findOne({
        _id: id,
        is_active: true,
      }).lean();
    }

    // If not found by ID, try SKU
    if (!product) {
      product = await Product.findOne({
        sku: id,
        is_active: true,
      }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[API] GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
