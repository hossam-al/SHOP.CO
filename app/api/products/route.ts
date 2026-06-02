import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export function GET() {
  return NextResponse.json(getProducts());
}
