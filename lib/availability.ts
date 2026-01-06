import { prisma } from "./db";

export type AvailabilityRequest = {
  businessId: string;
  productId: string;
  startAt: Date;
  endAt: Date;
  quantity: number;
};

type TxClient = Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => unknown ? T : never;
type DbClient = TxClient | typeof prisma;

export function isValidRange(startAt: Date, endAt: Date) {
  return startAt instanceof Date && endAt instanceof Date && !Number.isNaN(startAt.valueOf()) && !Number.isNaN(endAt.valueOf()) && startAt < endAt;
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  // Half-open interval overlap: [start, end)
  return aStart < bEnd && bStart < aEnd;
}

export async function getRemainingQuantityForProduct(input: AvailabilityRequest, db: DbClient = prisma) {
  const product = await db.product.findFirst({
    where: { id: input.productId, businessId: input.businessId },
    select: { 
      _count: {
        select: { assets: { where: { status: "AVAILABLE" } } }
      }
    },
  });

  if (!product) return { exists: false as const, remaining: 0, total: 0 };
  
  const totalQuantity = product._count.assets;

  const reservedCount = await db.bookingItem.count({
    where: {
      productId: input.productId,
      booking: {
        businessId: input.businessId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt },
      },
    },
  });

  const remaining = Math.max(0, totalQuantity - reservedCount);

  return { exists: true as const, remaining, total: totalQuantity };
}

export async function assertAvailableOrThrow(input: AvailabilityRequest, db: DbClient = prisma) {
  if (!isValidRange(input.startAt, input.endAt)) {
    throw new Error("Invalid date range");
  }
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  const { exists, remaining } = await getRemainingQuantityForProduct(input, db);

  if (!exists) {
    throw new Error("Product not found");
  }

  if (remaining < input.quantity) {
    throw new Error("Not available");
  }
}
