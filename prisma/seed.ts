import { prisma } from "../lib/db";
import { hash } from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hash("password123", 10);

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: "demo@rental.os" },
    update: {
      password: passwordHash
    },
    create: {
      email: "demo@rental.os",
      name: "Demo Owner",
      password: passwordHash, 
    },
  });

  console.log("Created user:", user.email);

  // Create a business for the user
  const business = await prisma.business.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: "Demo Rental Business",
      country: "US",
      currency: "USD",
    },
  });

  console.log("Created business:", business.name);

  // Create a customer
  await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Walk-in Customer",
      email: "walkin@example.com",
    },
  });

  // Create products
  const camera = await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Sony A7SIII",
      description: "Professional Mirrorless Camera",
      pricePerDay: 15000,
      lateFeePerDay: 20000,
      assets: {
        create: [
            { identifier: "A7SIII-001", status: "AVAILABLE" },
            { identifier: "A7SIII-002", status: "AVAILABLE" },
        ]
      }
    },
  });

  await prisma.product.create({
    data: {
      businessId: business.id,
      name: "Heavy-Duty Tripod",
      description: "Stable tripod for video",
      pricePerDay: 2500,
      lateFeePerDay: 1000,
      assets: {
        create: [
            { identifier: "TRIPOD-001", status: "AVAILABLE" },
            { identifier: "TRIPOD-002", status: "AVAILABLE" },
            { identifier: "TRIPOD-003", status: "AVAILABLE" },
            { identifier: "TRIPOD-004", status: "AVAILABLE" },
            { identifier: "TRIPOD-005", status: "AVAILABLE" },
        ]
      }
    },
  });
  
  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
