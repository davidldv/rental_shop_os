import { NextResponse } from "next/server";
import { z } from "zod";

import { assertAvailableOrThrow, isValidRange } from "@/lib/availability";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

type TxClient = Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => unknown ? T : never;

const CreateBookingSchema = z.object({
  productId: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  quantity: z.number().int().positive().default(1),
  customerName: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    const body = await req.json();
    parsed = CreateBookingSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const startAt = new Date(parsed.startAt);
  const endAt = new Date(parsed.endAt);

  if (!isValidRange(startAt, endAt)) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  try {
    const session = await verifySession();
    
    const booking = await prisma.$transaction(async (tx: TxClient) => {
      const business = await tx.business.findUnique({ where: { userId: session.userId } });
      if (!business) throw new Error("Business not found");

      const product = await tx.product.findFirst({
        where: { id: parsed.productId, businessId: business.id },
        select: { id: true, pricePerDay: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      await assertAvailableOrThrow(
        {
          businessId: business.id,
          productId: parsed.productId,
          startAt,
          endAt,
          quantity: parsed.quantity,
        },
        tx
      );

      // Simple customer creation for MVP (since no auth for customers yet)
      const customer = await tx.customer.create({
        data: {
            businessId: business.id,
            name: parsed.customerName || "Guest Customer",
        },
      });
      
      const newBooking = await tx.booking.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          startAt,
          endAt,
          status: "PENDING",
          notes: "Online booking",
          items: {
            create: Array.from({ length: parsed.quantity }).map(() => ({
              productId: product.id,
              pricePerDaySnapshot: product.pricePerDay,
            })),
          },
        },
      });
      
      return newBooking;
    });

    return NextResponse.json(booking);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
