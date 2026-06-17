import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");

  if (!phone || phone.trim().length < 5) {
    return NextResponse.json({ error: "يرجى إدخال رقم هاتف صحيح" }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { customerPhone: phone.trim() },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: "حدث خطأ في الاستعلام" }, { status: 500 });
  }
}
