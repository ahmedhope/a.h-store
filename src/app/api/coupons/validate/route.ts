import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/actions/coupons";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || "";
  const total = parseFloat(req.nextUrl.searchParams.get("total") || "0");

  const result = await validateCoupon(code, total);
  return NextResponse.json(result);
}
