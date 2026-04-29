import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import LidColor from "@/models/LidColor";
import { getCategoryLabel, getLidColorLabel } from "@/types/product";

export async function GET() {
  try {
    await connectDB();

    const activeFilter = { deletedAt: null };

    const [
      categories,
      categoryDocs,
      materials,
      lidTypes,
      colors,
      volumeRange,
      priceRange,
      lidColorDocs,
    ] = await Promise.all([
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Category.find().select("id name").lean(),
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$bodyMaterial", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $group: { _id: "$lidType", count: { $sum: 1 } } },
        { $project: { value: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$prices" },
        { $group: { _id: "$prices.lidColorId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: null,
            min: { $min: "$dimension.volumeMl" },
            max: { $max: "$dimension.volumeMl" },
          },
        },
        { $project: { _id: 0 } },
      ]),
      Product.aggregate([
        { $match: activeFilter },
        { $unwind: "$prices" },
        {
          $group: {
            _id: null,
            min: { $min: "$prices.price" },
            max: { $max: "$prices.price" },
          },
        },
        { $project: { _id: 0 } },
      ]),
      LidColor.find().select("id color colorCode").lean(),
    ]);

    const categoryNames = new Map(categoryDocs.map((category) => [category.id, category.name]));
    const lidColorMap = new Map(lidColorDocs.map((lc) => [lc.id, lc]));

    return NextResponse.json({
      categories: categories.map((category) => ({
        value: category._id,
        count: category.count,
        name: categoryNames.get(category._id) || category._id,
      })),
      materials: materials.filter((item) => item.value),
      lid_types: lidTypes.filter((item) => item.value),
      colors: colors.map((color) => {
        const doc = lidColorMap.get(color._id);
        return {
          value: color._id,
          count: color.count,
          name: doc?.color,
          hex: doc?.colorCode,
        };
      }),
      volume_range: volumeRange[0] || { min: 0, max: 1500 },
      price_range: priceRange[0] || { min: 0, max: 50000 },
    });
  } catch (error) {
    console.error("[API] GET /api/products/facets error:", error);
    return NextResponse.json({ error: "Failed to fetch facets" }, { status: 500 });
  }
}
