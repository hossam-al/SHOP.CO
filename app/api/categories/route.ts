import { NextResponse } from "next/server";
import { categories } from "@/lib/products";

export function GET() {
  return NextResponse.json(categories);
}
