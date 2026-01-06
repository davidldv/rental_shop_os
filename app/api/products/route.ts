import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

export async function GET() {
  const session = await verifySession();
  const business = await prisma.business.findUnique({
    where: { userId: session.userId },
  });

  if (!business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      pricePerDay: true,
      // lateFeePerDay: true,
      _count: {
        select: { assets: { where: { status: "AVAILABLE" } } }
      }
    },
  });

  return NextResponse.json({ 
    businessId: business.id, 
    products: products.map(p => ({
      ...p,
      quantity: p._count.assets,
      depositAmount: 0 // Placeholder as it was removed from schema or maybe implied logic
    }))
  });
}
