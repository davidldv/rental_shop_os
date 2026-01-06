import { NextResponse } from "next/server";
import { z } from "zod";

import { getRemainingQuantityForProduct, isValidRange } from "@/lib/availability";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

const QuerySchema = z.object({
  productId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  quantity: z.coerce.number().int().positive().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);

  let parsed: z.infer<typeof QuerySchema>;
  try {
    parsed = QuerySchema.parse({
      productId: url.searchParams.get("productId"),
      startAt: url.searchParams.get("startAt"),
      endAt: url.searchParams.get("endAt"),
      quantity: url.searchParams.get("quantity") ?? undefined,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const startAt = new Date(parsed.startAt);
  const endAt = new Date(parsed.endAt);

  if (!isValidRange(startAt, endAt)) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const session = await verifySession();
  const business = await prisma.business.findUnique({ where: { userId: session.userId } });
  if (!business) return NextResponse.json({ error: "No business" }, { status: 500 });

  try {
    const remaining = await getRemainingQuantityForProduct({
      businessId: business.id,
      productId: parsed.productId,
      startAt,
      endAt,
      quantity: parsed.quantity ?? 1,
    });

    return NextResponse.json(remaining);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
