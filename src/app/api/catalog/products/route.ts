import { NextResponse } from "next/server";
import { getPublishedProducts } from "@/lib/catalog/queries";

export const revalidate = 60;

export async function GET() {
  try {
    const products = await getPublishedProducts();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed", products: [] },
      { status: 500 }
    );
  }
}
